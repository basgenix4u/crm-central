package com.crmcentral.repository;

import com.crmcentral.entity.EmailTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, UUID> {
    Page<EmailTemplate> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<EmailTemplate> findByTenantIdAndActiveAndDeletedFalse(UUID tenantId, boolean active, Pageable pageable);
}
