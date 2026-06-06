package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Set;

@Data
public class KnowledgeBaseRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    private String category;
    private String status;
    private Set<String> tags;
}
