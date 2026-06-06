package com.crmcentral.entity;

import com.crmcentral.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String avatarUrl;
    private String department;
    private String jobTitle;
    private String timezone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private boolean active = true;
    private boolean emailVerified = false;
    private String emailVerificationToken;
    private String passwordResetToken;
    private LocalDateTime passwordResetExpires;
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private int failedLoginAttempts;
    private LocalDateTime lockedUntil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "manager")
    @Builder.Default
    private Set<User> teamMembers = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "permission")
    @Builder.Default
    private Set<String> permissions = new HashSet<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
