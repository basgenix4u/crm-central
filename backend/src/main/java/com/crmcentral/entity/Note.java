package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Note extends BaseEntity {

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String entityType; // Customer, Lead, Opportunity, Contact
    private String entityId;
    private boolean pinned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
}
