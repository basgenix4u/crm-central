package com.crmcentral.dto.request;

import com.crmcentral.enums.TicketCategory;
import com.crmcentral.enums.TicketPriority;
import com.crmcentral.enums.TicketStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.UUID;

@Data
public class TicketRequest {
    @NotBlank private String subject;
    @NotBlank private String description;
    private TicketStatus status;
    @NotNull private TicketPriority priority;
    @NotNull private TicketCategory category;
    private UUID customerId;
    private UUID assignedTo;
}
