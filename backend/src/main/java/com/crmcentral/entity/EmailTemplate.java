package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_templates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailTemplate extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    private String category;
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user")
    private User createdByUser;
}
