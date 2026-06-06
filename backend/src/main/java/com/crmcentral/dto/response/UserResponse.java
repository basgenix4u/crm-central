package com.crmcentral.dto.response;

import com.crmcentral.enums.UserRole;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String department;
    private String jobTitle;
    private String timezone;
    private UserRole role;
    private boolean active;
    private boolean emailVerified;
    private LocalDateTime lastLoginAt;
    private Set<String> permissions;
    private UUID tenantId;
    private LocalDateTime createdAt;
}
