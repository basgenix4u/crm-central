package com.crmcentral.entity;

import com.crmcentral.enums.CampaignStatus;
import com.crmcentral.enums.CampaignType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_campaign_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Campaign extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    @Column(precision = 15, scale = 2)
    private BigDecimal actualCost;

    @Column(precision = 15, scale = 2)
    private BigDecimal revenueGenerated;

    private Integer leadsGenerated;
    private Integer targetAudience;
    private Integer impressions;
    private Integer clicks;
    private Integer conversions;
    private String targetIndustry;
    private String targetRegion;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
}
