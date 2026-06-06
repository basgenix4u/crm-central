package com.crmcentral.dto.request;

import com.crmcentral.enums.TaskPriority;
import com.crmcentral.enums.TaskStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskRequest {
    @NotBlank private String title;
    private String description;
    private TaskStatus status;
    @NotNull private TaskPriority priority;
    private LocalDateTime dueDate;
    private String category;
    private boolean reminder;
    private LocalDateTime reminderDate;
    private Integer estimatedMinutes;
    private UUID assignedTo;
    private UUID customerId;
    private UUID leadId;
    private UUID opportunityId;
}
