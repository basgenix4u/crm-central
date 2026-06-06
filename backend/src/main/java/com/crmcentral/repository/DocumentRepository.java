package com.crmcentral.repository;

import com.crmcentral.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Page<Document> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    List<Document> findByCustomerIdAndDeletedFalse(UUID customerId);
    List<Document> findByOpportunityIdAndDeletedFalse(UUID opportunityId);
}
