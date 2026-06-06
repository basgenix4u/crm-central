package com.crmcentral.dto.request;

import com.crmcentral.enums.ActivityType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ActivityRequest {
    @NotBlank private String subject;
    private String description;
    @NotNull private ActivityType type;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String location;
    private String outcome;
    private boolean followUpRequired;
    private LocalDateTime followUpDate;
    private UUID customerId;
    private UUID leadId;
    private UUID opportunityId;
    private UUID contactId;
    private UUID assignedTo;
}
