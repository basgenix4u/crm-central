package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Data
public class CustomerRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank @Email private String email;
    private String phone;
    private String company;
    private String jobTitle;
    private String industry;
    private String website;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private BigDecimal annualRevenue;
    private Integer numberOfEmployees;
    private String status;
    private String type;
    private String source;
    private String rating;
    private String linkedinUrl;
    private String twitterUrl;
    private String notes;
    private Set<String> tags;
    private UUID assignedTo;
}
