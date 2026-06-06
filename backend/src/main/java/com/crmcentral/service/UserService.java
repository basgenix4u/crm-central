package com.crmcentral.service;

import com.crmcentral.dto.request.*;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.User;
import com.crmcentral.enums.UserRole;
import com.crmcentral.exception.*;
import com.crmcentral.repository.UserRepository;
import com.crmcentral.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getUsers(UUID tenantId, Pageable pageable) {
        Page<User> page = userRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return toPagedResponse(page);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return AuthService.mapUserToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getJobTitle() != null) user.setJobTitle(request.getJobTitle());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        return AuthService.mapUserToResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(UUID userId, PasswordChangeRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateRole(UUID userId, UserRole role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setRole(role);
        return AuthService.mapUserToResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivateUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> searchUsers(UUID tenantId, String query, Pageable pageable) {
        Page<User> page = userRepository.searchUsers(tenantId, query, pageable);
        return toPagedResponse(page);
    }

    private PagedResponse<UserResponse> toPagedResponse(Page<User> page) {
        return PagedResponse.<UserResponse>builder()
            .content(page.getContent().stream().map(AuthService::mapUserToResponse).toList())
            .page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
            .first(page.isFirst()).last(page.isLast()).build();
    }
}
