package com.crmcentral.service;

import com.crmcentral.dto.request.OpportunityRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Opportunity;
import com.crmcentral.enums.OpportunityStage;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public PagedResponse<Opportunity> getOpportunities(UUID tenantId, Pageable pageable) {
        Page<Opportunity> page = opportunityRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return toPagedResponse(page);
    }

    @Transactional(readOnly = true)
    public Opportunity getById(UUID id) {
        return opportunityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Opportunity", "id", id));
    }

    @Transactional
    public Opportunity create(UUID tenantId, OpportunityRequest req) {
        Opportunity opp = Opportunity.builder()
            .name(req.getName()).description(req.getDescription())
            .stage(req.getStage()).amount(req.getAmount())
            .probability(req.getProbability()).expectedCloseDate(req.getExpectedCloseDate())
            .type(req.getType()).source(req.getSource()).nextStep(req.getNextStep())
            .build();
        opp.setTenantId(tenantId);
        if (req.getCustomerId() != null) opp.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        if (req.getContactId() != null) opp.setPrimaryContact(contactRepository.findById(req.getContactId()).orElse(null));
        if (req.getAssignedTo() != null) opp.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        if (req.getLeadId() != null) opp.setLead(leadRepository.findById(req.getLeadId()).orElse(null));
        return opportunityRepository.save(opp);
    }

    @Transactional
    public Opportunity update(UUID id, OpportunityRequest req) {
        Opportunity opp = getById(id);
        opp.setName(req.getName());
        opp.setDescription(req.getDescription());
        opp.setStage(req.getStage());
        opp.setAmount(req.getAmount());
        opp.setProbability(req.getProbability());
        opp.setExpectedCloseDate(req.getExpectedCloseDate());
        opp.setType(req.getType());
        opp.setSource(req.getSource());
        opp.setNextStep(req.getNextStep());
        if (req.getStage() == OpportunityStage.WON || req.getStage() == OpportunityStage.LOST) {
            opp.setActualCloseDate(LocalDate.now());
        }
        if (req.getAssignedTo() != null) opp.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        return opportunityRepository.save(opp);
    }

    @Transactional
    public Opportunity updateStage(UUID id, OpportunityStage stage) {
        Opportunity opp = getById(id);
        opp.setStage(stage);
        if (stage == OpportunityStage.WON || stage == OpportunityStage.LOST) {
            opp.setActualCloseDate(LocalDate.now());
        }
        return opportunityRepository.save(opp);
    }

    @Transactional
    public void delete(UUID id) {
        Opportunity opp = getById(id);
        opp.setDeleted(true);
        opportunityRepository.save(opp);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPipelineMetrics(UUID tenantId) {
        Map<String, Object> metrics = new HashMap<>();
        List<Object[]> data = opportunityRepository.getPipelineMetrics(tenantId);
        Map<String, Map<String, Object>> stages = new LinkedHashMap<>();
        for (Object[] row : data) {
            Map<String, Object> stageData = new HashMap<>();
            stageData.put("count", row[1]);
            stageData.put("totalAmount", row[2]);
            stages.put(row[0].toString(), stageData);
        }
        metrics.put("stages", stages);
        metrics.put("totalWonRevenue", opportunityRepository.getTotalWonRevenue(tenantId));
        metrics.put("averageDealSize", opportunityRepository.getAverageDealSize(tenantId));
        return metrics;
    }

    @Transactional(readOnly = true)
    public PagedResponse<Opportunity> getByStage(UUID tenantId, OpportunityStage stage, Pageable pageable) {
        return toPagedResponse(opportunityRepository.findByTenantIdAndStageAndDeletedFalse(tenantId, stage, pageable));
    }

    private PagedResponse<Opportunity> toPagedResponse(Page<Opportunity> page) {
        return PagedResponse.<Opportunity>builder()
            .content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
            .first(page.isFirst()).last(page.isLast()).build();
    }
}
