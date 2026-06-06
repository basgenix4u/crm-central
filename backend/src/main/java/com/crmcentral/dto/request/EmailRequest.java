package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.UUID;

@Data
public class EmailRequest {
    @NotBlank private String subject;
    @NotBlank private String body;
    @NotBlank @Email private String toEmail;
    private String ccEmail;
    private String bccEmail;
    private UUID customerId;
    private UUID leadId;
    private String templateId;
}
