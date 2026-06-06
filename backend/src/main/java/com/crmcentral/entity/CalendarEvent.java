package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_events", indexes = {
    @Index(name = "idx_cal_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CalendarEvent extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime;

    private String type; // Meeting, Call, Follow-Up, Event, Task
    private String location;
    private boolean allDay;
    private String recurrence; // None, Daily, Weekly, Monthly
    private String color;
    private boolean reminder;
    private Integer reminderMinutes;
    private String status; // Scheduled, Completed, Cancelled

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;
}
