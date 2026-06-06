package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workflow_rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkflowRule extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String triggerEntity; // Lead, Opportunity, Ticket, Task
    private String triggerEvent; // Created, Updated, StatusChanged
    private String conditionField;
    private String conditionOperator; // Equals, NotEquals, Contains, GreaterThan
    private String conditionValue;
    private String actionType; // AssignTo, SendEmail, CreateTask, ChangeStatus, Notify
    private String actionConfig; // JSON config for action

    private boolean active = true;
    private Integer executionOrder;
    private Integer executionCount;
}
