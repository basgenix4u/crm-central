package com.crmcentral.controller;

import com.crmcentral.dto.request.RegisterRequest;
import com.crmcentral.dto.response.ApiResponse;
import com.crmcentral.dto.response.UserResponse;
import com.crmcentral.entity.User;
import com.crmcentral.enums.UserRole;
import com.crmcentral.exception.DuplicateResourceException;
import com.crmcentral.repository.UserRepository;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email)) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = User.builder()
                .firstName(request.firstName)
                .lastName(request.lastName)
                .email(request.email)
                .password(passwordEncoder.encode(request.password))
                .phone(request.phone)
                .role(request.role != null ? request.role : UserRole.SALES_REPRESENTATIVE)
                .department(request.department)
                .jobTitle(request.jobTitle)
                .active(true)
                .emailVerified(true)
                .build();
        user.setTenantId(principal.getTenantId());

        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User created", AuthService.mapUserToResponse(user)));
    }

    public record CreateUserRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String phone,
        UserRole role,
        String department,
        String jobTitle
    ) {}
}
