package com.crmcentral.repository;

import com.crmcentral.entity.EmailMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface EmailMessageRepository extends JpaRepository<EmailMessage, UUID> {
    Page<EmailMessage> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<EmailMessage> findByUserIdAndDeletedFalse(UUID userId, Pageable pageable);
    Page<EmailMessage> findByCustomerIdAndDeletedFalse(UUID customerId, Pageable pageable);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
}
