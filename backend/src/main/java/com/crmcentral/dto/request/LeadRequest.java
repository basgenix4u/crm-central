package com.crmcentral.dto.request;

import com.crmcentral.enums.LeadSource;
import com.crmcentral.enums.LeadStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class LeadRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank @Email private String email;
    private String phone;
    private String company;
    private String jobTitle;
    private String industry;
    private String website;
    private LeadStatus status;
    private LeadSource source;
    private Integer score;
    private BigDecimal estimatedValue;
    private String rating;
    private String addressLine1;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String notes;
    private String description;
    private UUID assignedTo;
    private UUID campaignId;
}
