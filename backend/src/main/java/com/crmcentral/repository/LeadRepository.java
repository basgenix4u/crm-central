package com.crmcentral.repository;

import com.crmcentral.entity.Lead;
import com.crmcentral.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {
    Page<Lead> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<Lead> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, LeadStatus status, Pageable pageable);
    Page<Lead> findByTenantIdAndAssignedToIdAndDeletedFalse(UUID tenantId, UUID userId, Pageable pageable);
    @Query("SELECT l FROM Lead l WHERE l.tenantId = :tenantId AND l.deleted = false AND (LOWER(l.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(l.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(l.email) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(l.company) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Lead> searchLeads(@Param("tenantId") UUID tenantId, @Param("q") String query, Pageable pageable);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    @Query("SELECT l.status, COUNT(l) FROM Lead l WHERE l.tenantId = :tenantId AND l.deleted = false GROUP BY l.status")
    List<Object[]> countByStatus(@Param("tenantId") UUID tenantId);
    @Query("SELECT l.source, COUNT(l) FROM Lead l WHERE l.tenantId = :tenantId AND l.deleted = false GROUP BY l.source")
    List<Object[]> countBySource(@Param("tenantId") UUID tenantId);
}
