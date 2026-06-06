package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.UUID;

@Data
public class ContactRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private String email;
    private String phone;
    private String mobilePhone;
    private String jobTitle;
    private String department;
    private String company;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String linkedinUrl;
    private String twitterUrl;
    private String notes;
    private String category;
    private boolean primary;
    private UUID customerId;
    private UUID assignedTo;
}
