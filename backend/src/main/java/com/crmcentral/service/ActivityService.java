package com.crmcentral.service;

import com.crmcentral.dto.request.ActivityRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Activity;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public PagedResponse<Activity> getActivities(UUID tenantId, Pageable pageable) {
        Page<Activity> page = activityRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Activity>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Activity getById(UUID id) { return activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity","id",id)); }
    public List<Activity> getByCustomer(UUID customerId) { return activityRepository.findByCustomerIdAndDeletedFalse(customerId); }
    public List<Activity> getByLead(UUID leadId) { return activityRepository.findByLeadIdAndDeletedFalse(leadId); }

    @Transactional
    public Activity create(UUID tenantId, ActivityRequest req) {
        Activity a = Activity.builder().subject(req.getSubject()).description(req.getDescription())
            .type(req.getType()).status(req.getStatus() != null ? req.getStatus() : "Planned")
            .startTime(req.getStartTime()).endTime(req.getEndTime()).durationMinutes(req.getDurationMinutes())
            .location(req.getLocation()).outcome(req.getOutcome())
            .followUpRequired(req.isFollowUpRequired()).followUpDate(req.getFollowUpDate()).build();
        a.setTenantId(tenantId);
        if (req.getCustomerId() != null) a.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        if (req.getLeadId() != null) a.setLead(leadRepository.findById(req.getLeadId()).orElse(null));
        if (req.getOpportunityId() != null) a.setOpportunity(opportunityRepository.findById(req.getOpportunityId()).orElse(null));
        if (req.getContactId() != null) a.setContact(contactRepository.findById(req.getContactId()).orElse(null));
        if (req.getAssignedTo() != null) a.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        return activityRepository.save(a);
    }

    @Transactional
    public Activity update(UUID id, ActivityRequest req) {
        Activity a = getById(id);
        a.setSubject(req.getSubject()); a.setDescription(req.getDescription()); a.setType(req.getType());
        if (req.getStatus() != null) a.setStatus(req.getStatus());
        a.setStartTime(req.getStartTime()); a.setEndTime(req.getEndTime());
        a.setOutcome(req.getOutcome()); a.setFollowUpRequired(req.isFollowUpRequired());
        a.setFollowUpDate(req.getFollowUpDate());
        return activityRepository.save(a);
    }

    @Transactional
    public void delete(UUID id) { Activity a = getById(id); a.setDeleted(true); activityRepository.save(a); }
}
