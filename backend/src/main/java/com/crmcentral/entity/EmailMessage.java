package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_messages", indexes = {
    @Index(name = "idx_email_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailMessage extends BaseEntity {

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private String fromEmail;
    private String toEmail;
    private String ccEmail;
    private String bccEmail;

    private String status; // Draft, Sent, Failed, Received
    private String direction; // Inbound, Outbound

    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private boolean read;

    private Integer openCount;
    private Integer clickCount;

    private String templateId;
    private boolean isTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
}
