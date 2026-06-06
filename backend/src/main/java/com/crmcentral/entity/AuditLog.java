package com.crmcentral.entity;

import com.crmcentral.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user", columnList = "user_id"),
    @Index(name = "idx_audit_tenant", columnList = "tenant_id"),
    @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = false)
    private String entityType;

    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String ipAddress;
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "user_id")
    private UUID userId;

    private String userName;

    @Column(name = "tenant_id")
    private UUID tenantId;
}
