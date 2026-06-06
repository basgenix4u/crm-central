package com.crmcentral.repository;

import com.crmcentral.entity.Activity;
import com.crmcentral.enums.ActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    Page<Activity> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    List<Activity> findByCustomerIdAndDeletedFalse(UUID customerId);
    List<Activity> findByLeadIdAndDeletedFalse(UUID leadId);
    List<Activity> findByOpportunityIdAndDeletedFalse(UUID opportunityId);
    Page<Activity> findByTenantIdAndAssignedToIdAndDeletedFalse(UUID tenantId, UUID userId, Pageable pageable);
    List<Activity> findByTenantIdAndFollowUpRequiredAndFollowUpDateBeforeAndDeletedFalse(UUID tenantId, boolean followUpRequired, LocalDateTime date);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    long countByTenantIdAndTypeAndDeletedFalse(UUID tenantId, ActivityType type);
}
