package com.crmcentral.entity;

import com.crmcentral.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_doc_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Document extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String originalName;
    private String filePath;
    private String contentType;
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    private DocumentType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer versionNumber;
    private String checksum;
    private boolean shared;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
}
