package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class NoteRequest {
    @NotBlank private String content;
    private String entityType;
    private String entityId;
    private boolean pinned;
}
