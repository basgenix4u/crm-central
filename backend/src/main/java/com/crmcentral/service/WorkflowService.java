package com.crmcentral.service;

import com.crmcentral.dto.request.WorkflowRuleRequest;
import com.crmcentral.entity.WorkflowRule;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.WorkflowRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowService {
    private final WorkflowRuleRepository workflowRuleRepository;

    public List<WorkflowRule> getRules(UUID tenantId) { return workflowRuleRepository.findByTenantIdAndDeletedFalse(tenantId); }

    public WorkflowRule getById(UUID id) { return workflowRuleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WorkflowRule","id",id)); }

    @Transactional
    public WorkflowRule create(UUID tenantId, WorkflowRuleRequest req) {
        WorkflowRule r = WorkflowRule.builder().name(req.getName()).description(req.getDescription())
            .triggerEntity(req.getTriggerEntity()).triggerEvent(req.getTriggerEvent())
            .conditionField(req.getConditionField()).conditionOperator(req.getConditionOperator())
            .conditionValue(req.getConditionValue()).actionType(req.getActionType())
            .actionConfig(req.getActionConfig()).active(req.isActive())
            .executionOrder(req.getExecutionOrder()).executionCount(0).build();
        r.setTenantId(tenantId);
        return workflowRuleRepository.save(r);
    }

    @Transactional
    public WorkflowRule update(UUID id, WorkflowRuleRequest req) {
        WorkflowRule r = getById(id);
        r.setName(req.getName()); r.setDescription(req.getDescription());
        r.setTriggerEntity(req.getTriggerEntity()); r.setTriggerEvent(req.getTriggerEvent());
        r.setConditionField(req.getConditionField()); r.setConditionOperator(req.getConditionOperator());
        r.setConditionValue(req.getConditionValue()); r.setActionType(req.getActionType());
        r.setActionConfig(req.getActionConfig()); r.setActive(req.isActive());
        return workflowRuleRepository.save(r);
    }

    @Transactional
    public void delete(UUID id) { WorkflowRule r = getById(id); r.setDeleted(true); workflowRuleRepository.save(r); }

    public void executeRules(UUID tenantId, String entity, String event) {
        List<WorkflowRule> rules = workflowRuleRepository.findByTenantIdAndTriggerEntityAndTriggerEventAndActiveAndDeletedFalse(tenantId, entity, event, true);
        for (WorkflowRule rule : rules) {
            rule.setExecutionCount(rule.getExecutionCount() + 1);
            workflowRuleRepository.save(rule);
        }
    }
}
