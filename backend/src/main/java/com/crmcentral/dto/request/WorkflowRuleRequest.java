package com.crmcentral.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WorkflowRuleRequest {
    @NotBlank private String name;
    private String description;
    @NotBlank private String triggerEntity;
    @NotBlank private String triggerEvent;
    private String conditionField;
    private String conditionOperator;
    private String conditionValue;
    @NotBlank private String actionType;
    private String actionConfig;
    private boolean active;
    private Integer executionOrder;
}
