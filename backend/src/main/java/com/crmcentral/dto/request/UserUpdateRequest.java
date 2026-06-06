package com.crmcentral.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String department;
    private String jobTitle;
    private String timezone;
}
