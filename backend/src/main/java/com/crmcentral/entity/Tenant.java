package com.crmcentral.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tenant extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(unique = true)
    private String domain;

    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String industry;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String timezone;
    private String currency;
    private String plan;
    private boolean active = true;
    private LocalDateTime trialEndsAt;
    private Integer maxUsers;
    private Long storageLimit;
    private Long storageUsed;
}
