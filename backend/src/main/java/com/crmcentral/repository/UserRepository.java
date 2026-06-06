package com.crmcentral.repository;

import com.crmcentral.entity.User;
import com.crmcentral.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    List<User> findByTenantIdAndRoleAndDeletedFalse(UUID tenantId, UserRole role);
    Optional<User> findByEmailVerificationToken(String token);
    Optional<User> findByPasswordResetToken(String token);
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.deleted = false AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<User> searchUsers(@Param("tenantId") UUID tenantId, @Param("q") String query, Pageable pageable);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    long countByTenantIdAndActiveAndDeletedFalse(UUID tenantId, boolean active);
}
