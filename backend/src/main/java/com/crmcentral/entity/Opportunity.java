package com.crmcentral.entity;

import com.crmcentral.enums.OpportunityStage;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "opportunities", indexes = {
    @Index(name = "idx_opp_stage", columnList = "stage"),
    @Index(name = "idx_opp_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Opportunity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityStage stage;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    private Integer probability;
    private LocalDate expectedCloseDate;
    private LocalDate actualCloseDate;

    private String type; // New Business, Existing Business, Renewal
    private String source;
    private String lostReason;
    private String nextStep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact primaryContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;
}
