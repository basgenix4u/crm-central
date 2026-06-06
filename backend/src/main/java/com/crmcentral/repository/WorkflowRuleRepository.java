package com.crmcentral.repository;

import com.crmcentral.entity.WorkflowRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowRuleRepository extends JpaRepository<WorkflowRule, UUID> {
    List<WorkflowRule> findByTenantIdAndActiveAndDeletedFalseOrderByExecutionOrder(UUID tenantId, boolean active);
    List<WorkflowRule> findByTenantIdAndTriggerEntityAndTriggerEventAndActiveAndDeletedFalse(UUID tenantId, String triggerEntity, String triggerEvent, boolean active);
    List<WorkflowRule> findByTenantIdAndDeletedFalse(UUID tenantId);
}
