package com.crmcentral.entity;

import com.crmcentral.enums.TicketCategory;
import com.crmcentral.enums.TicketPriority;
import com.crmcentral.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_ticket_status", columnList = "status"),
    @Index(name = "idx_ticket_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket extends BaseEntity {

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    private String ticketNumber;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private Integer satisfactionRating;
    private String resolution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escalated_to")
    private User escalatedTo;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TicketComment> comments = new ArrayList<>();
}
