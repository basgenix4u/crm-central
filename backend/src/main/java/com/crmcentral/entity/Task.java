package com.crmcentral.entity;

import com.crmcentral.enums.TaskPriority;
import com.crmcentral.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_task_status", columnList = "status"),
    @Index(name = "idx_task_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private String category; // Personal, Team, Customer
    private boolean reminder;
    private LocalDateTime reminderDate;
    private Integer estimatedMinutes;
    private Integer actualMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;
}
