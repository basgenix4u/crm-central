package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CalendarEventRequest {
    @NotBlank private String title;
    private String description;
    @NotNull private LocalDateTime startDateTime;
    @NotNull private LocalDateTime endDateTime;
    private String type;
    private String location;
    private boolean allDay;
    private String recurrence;
    private String color;
    private boolean reminder;
    private Integer reminderMinutes;
    private UUID customerId;
    private UUID opportunityId;
}
