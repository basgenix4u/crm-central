package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ticket_comments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketComment extends BaseEntity {

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private boolean internal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
}
