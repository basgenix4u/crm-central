package com.crmcentral.service;

import com.crmcentral.dto.request.*;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.*;
import com.crmcentral.enums.UserRole;
import com.crmcentral.exception.*;
import com.crmcentral.repository.*;
import com.crmcentral.security.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = createRefreshToken(principal.getId()).getToken();

        User user = userRepository.findById(principal.getId()).orElseThrow();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        auditService.log(principal.getTenantId(), principal.getId(), principal.getEmail(),
            com.crmcentral.enums.AuditAction.LOGIN, "User", principal.getId().toString(), null, null, "User logged in");

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(accessTokenExpiration)
            .user(mapUserToResponse(user))
            .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Tenant tenant = Tenant.builder()
            .name(request.getCompany() != null ? request.getCompany() : request.getFirstName() + "'s Organization")
            .active(true)
            .maxUsers(50)
            .plan("FREE_TRIAL")
            .build();
        tenant = tenantRepository.save(tenant);

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .role(UserRole.ADMIN)
            .active(true)
            .emailVerified(false)
            .emailVerificationToken(UUID.randomUUID().toString())
            .build();
        user.setTenantId(tenant.getId());
        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = createRefreshToken(user.getId()).getToken();

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(accessTokenExpiration)
            .user(mapUserToResponse(user))
            .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
            .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token expired or revoked");
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateAccessTokenFromUserId(
            user.getId(), user.getEmail(), user.getRole().name(), user.getTenantId()
        );

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        RefreshToken newRefreshToken = createRefreshToken(user.getId());

        return AuthResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken.getToken())
            .tokenType("Bearer")
            .expiresIn(accessTokenExpiration)
            .user(mapUserToResponse(user))
            .build();
    }

    @Transactional
    public void logout(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
        auditService.log(null, userId, null,
            com.crmcentral.enums.AuditAction.LOGOUT, "User", userId.toString(), null, null, "User logged out");
    }

    private RefreshToken createRefreshToken(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow();
        RefreshToken refreshToken = RefreshToken.builder()
            .user(user)
            .token(UUID.randomUUID().toString())
            .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
            .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public static UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .avatarUrl(user.getAvatarUrl())
            .department(user.getDepartment())
            .jobTitle(user.getJobTitle())
            .timezone(user.getTimezone())
            .role(user.getRole())
            .active(user.isActive())
            .emailVerified(user.isEmailVerified())
            .lastLoginAt(user.getLastLoginAt())
            .permissions(user.getPermissions())
            .tenantId(user.getTenantId())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
