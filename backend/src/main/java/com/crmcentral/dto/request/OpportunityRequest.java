package com.crmcentral.dto.request;

import com.crmcentral.enums.OpportunityStage;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class OpportunityRequest {
    @NotBlank private String name;
    private String description;
    @NotNull private OpportunityStage stage;
    private BigDecimal amount;
    private Integer probability;
    private LocalDate expectedCloseDate;
    private String type;
    private String source;
    private String nextStep;
    private UUID customerId;
    private UUID contactId;
    private UUID assignedTo;
    private UUID leadId;
}
