package com.crmcentral.repository;

import com.crmcentral.entity.AuditLog;
import com.crmcentral.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    Page<AuditLog> findByTenantIdOrderByTimestampDesc(UUID tenantId, Pageable pageable);
    Page<AuditLog> findByTenantIdAndUserIdOrderByTimestampDesc(UUID tenantId, UUID userId, Pageable pageable);
    Page<AuditLog> findByTenantIdAndEntityTypeAndEntityIdOrderByTimestampDesc(UUID tenantId, String entityType, String entityId, Pageable pageable);
    Page<AuditLog> findByTenantIdAndActionOrderByTimestampDesc(UUID tenantId, AuditAction action, Pageable pageable);
    List<AuditLog> findByTenantIdAndTimestampBetweenOrderByTimestampDesc(UUID tenantId, LocalDateTime start, LocalDateTime end);
}
