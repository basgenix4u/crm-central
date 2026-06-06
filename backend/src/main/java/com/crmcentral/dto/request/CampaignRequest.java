package com.crmcentral.dto.request;

import com.crmcentral.enums.CampaignStatus;
import com.crmcentral.enums.CampaignType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CampaignRequest {
    @NotBlank private String name;
    private String description;
    @NotNull private CampaignType type;
    private CampaignStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private Integer targetAudience;
    private String targetIndustry;
    private String targetRegion;
}
