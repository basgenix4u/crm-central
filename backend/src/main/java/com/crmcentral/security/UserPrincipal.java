package com.crmcentral.security;

import com.crmcentral.entity.User;
import com.crmcentral.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private UUID tenantId;
    private UserRole role;
    private boolean active;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        user.getPermissions().forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
        return new UserPrincipal(
            user.getId(), user.getFirstName(), user.getLastName(),
            user.getEmail(), user.getPassword(), user.getTenantId(),
            user.getRole(), user.isActive(), authorities
        );
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active; }
}
