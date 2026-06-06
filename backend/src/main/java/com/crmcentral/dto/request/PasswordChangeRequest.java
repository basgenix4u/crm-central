package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    @NotBlank private String currentPassword;
    @NotBlank @Size(min = 8) private String newPassword;
}
