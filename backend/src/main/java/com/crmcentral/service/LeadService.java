package com.crmcentral.service;

import com.crmcentral.dto.request.LeadRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.*;
import com.crmcentral.enums.LeadStatus;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public PagedResponse<Lead> getLeads(UUID tenantId, Pageable pageable) {
        Page<Lead> page = leadRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return toPagedResponse(page);
    }

    @Transactional(readOnly = true)
    public Lead getLeadById(UUID id) {
        return leadRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
    }

    @Transactional
    public Lead createLead(UUID tenantId, LeadRequest request) {
        Lead lead = Lead.builder()
            .firstName(request.getFirstName()).lastName(request.getLastName())
            .email(request.getEmail()).phone(request.getPhone())
            .company(request.getCompany()).jobTitle(request.getJobTitle())
            .industry(request.getIndustry()).website(request.getWebsite())
            .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
            .source(request.getSource()).score(request.getScore() != null ? request.getScore() : 0)
            .estimatedValue(request.getEstimatedValue()).rating(request.getRating())
            .addressLine1(request.getAddressLine1()).city(request.getCity())
            .state(request.getState()).country(request.getCountry())
            .postalCode(request.getPostalCode()).notes(request.getNotes())
            .description(request.getDescription())
            .build();
        lead.setTenantId(tenantId);
        if (request.getAssignedTo() != null) lead.setAssignedTo(userRepository.findById(request.getAssignedTo()).orElse(null));
        if (request.getCampaignId() != null) lead.setCampaign(campaignRepository.findById(request.getCampaignId()).orElse(null));
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead updateLead(UUID id, LeadRequest request) {
        Lead lead = getLeadById(id);
        lead.setFirstName(request.getFirstName());
        lead.setLastName(request.getLastName());
        lead.setEmail(request.getEmail());
        lead.setPhone(request.getPhone());
        lead.setCompany(request.getCompany());
        lead.setJobTitle(request.getJobTitle());
        lead.setIndustry(request.getIndustry());
        if (request.getStatus() != null) lead.setStatus(request.getStatus());
        if (request.getSource() != null) lead.setSource(request.getSource());
        if (request.getScore() != null) lead.setScore(request.getScore());
        lead.setEstimatedValue(request.getEstimatedValue());
        lead.setRating(request.getRating());
        lead.setNotes(request.getNotes());
        lead.setDescription(request.getDescription());
        if (request.getAssignedTo() != null) lead.setAssignedTo(userRepository.findById(request.getAssignedTo()).orElse(null));
        return leadRepository.save(lead);
    }

    @Transactional
    public Customer convertLeadToCustomer(UUID leadId) {
        Lead lead = getLeadById(leadId);
        Customer customer = Customer.builder()
            .firstName(lead.getFirstName()).lastName(lead.getLastName())
            .email(lead.getEmail()).phone(lead.getPhone())
            .company(lead.getCompany()).jobTitle(lead.getJobTitle())
            .industry(lead.getIndustry()).website(lead.getWebsite())
            .status("Active").source(lead.getSource() != null ? lead.getSource().name() : null)
            .build();
        customer.setTenantId(lead.getTenantId());
        customer.setAssignedTo(lead.getAssignedTo());
        customer = customerRepository.save(customer);
        lead.setStatus(LeadStatus.CONVERTED);
        lead.setConvertedCustomer(customer);
        leadRepository.save(lead);
        return customer;
    }

    @Transactional
    public void deleteLead(UUID id) {
        Lead lead = getLeadById(id);
        lead.setDeleted(true);
        leadRepository.save(lead);
    }

    @Transactional(readOnly = true)
    public PagedResponse<Lead> getLeadsByStatus(UUID tenantId, LeadStatus status, Pageable pageable) {
        return toPagedResponse(leadRepository.findByTenantIdAndStatusAndDeletedFalse(tenantId, status, pageable));
    }

    @Transactional(readOnly = true)
    public PagedResponse<Lead> searchLeads(UUID tenantId, String query, Pageable pageable) {
        return toPagedResponse(leadRepository.searchLeads(tenantId, query, pageable));
    }

    private PagedResponse<Lead> toPagedResponse(Page<Lead> page) {
        return PagedResponse.<Lead>builder()
            .content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
            .first(page.isFirst()).last(page.isLast()).build();
    }
}
