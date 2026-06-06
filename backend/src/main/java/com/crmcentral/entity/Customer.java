package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_email", columnList = "email"),
    @Index(name = "idx_customer_company", columnList = "company"),
    @Index(name = "idx_customer_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String company;
    private String jobTitle;
    private String industry;
    private String website;

    // Address fields
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    // Business info
    private BigDecimal annualRevenue;
    private Integer numberOfEmployees;
    private String status; // Active, Inactive, Prospect
    private String type; // Individual, Business
    private String source;
    private String rating;

    // Social
    private String linkedinUrl;
    private String twitterUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection
    @CollectionTable(name = "customer_tags", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Contact> contacts = new HashSet<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
