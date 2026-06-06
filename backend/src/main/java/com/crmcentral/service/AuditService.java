package com.crmcentral.service;

import com.crmcentral.entity.AuditLog;
import com.crmcentral.enums.AuditAction;
import com.crmcentral.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(UUID tenantId, UUID userId, String userName, AuditAction action,
                    String entityType, String entityId, String oldValue, String newValue, String description) {
        AuditLog log = AuditLog.builder()
            .tenantId(tenantId).userId(userId).userName(userName)
            .action(action).entityType(entityType).entityId(entityId)
            .oldValue(oldValue).newValue(newValue).description(description)
            .timestamp(LocalDateTime.now())
            .build();
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(UUID tenantId, Pageable pageable) {
        return auditLogRepository.findByTenantIdOrderByTimestampDesc(tenantId, pageable);
    }

    public Page<AuditLog> getAuditLogsByUser(UUID tenantId, UUID userId, Pageable pageable) {
        return auditLogRepository.findByTenantIdAndUserIdOrderByTimestampDesc(tenantId, userId, pageable);
    }

    public Page<AuditLog> getAuditLogsByEntity(UUID tenantId, String entityType, String entityId, Pageable pageable) {
        return auditLogRepository.findByTenantIdAndEntityTypeAndEntityIdOrderByTimestampDesc(tenantId, entityType, entityId, pageable);
    }
}
