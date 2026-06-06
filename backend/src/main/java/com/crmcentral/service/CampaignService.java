package com.crmcentral.service;

import com.crmcentral.dto.request.CampaignRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Campaign;
import com.crmcentral.enums.CampaignStatus;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.CampaignRepository;
import com.crmcentral.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private final CampaignRepository campaignRepository;

    public PagedResponse<Campaign> getCampaigns(UUID tenantId, Pageable pageable) {
        Page<Campaign> page = campaignRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Campaign>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Campaign getById(UUID id) { return campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign","id",id)); }

    @Transactional
    public Campaign create(UUID tenantId, CampaignRequest req) {
        Campaign c = Campaign.builder().name(req.getName()).description(req.getDescription())
            .type(req.getType()).status(req.getStatus() != null ? req.getStatus() : CampaignStatus.DRAFT)
            .startDate(req.getStartDate()).endDate(req.getEndDate())
            .budget(req.getBudget()).targetAudience(req.getTargetAudience())
            .targetIndustry(req.getTargetIndustry()).targetRegion(req.getTargetRegion())
            .leadsGenerated(0).impressions(0).clicks(0).conversions(0).build();
        c.setTenantId(tenantId);
        return campaignRepository.save(c);
    }

    @Transactional
    public Campaign update(UUID id, CampaignRequest req) {
        Campaign c = getById(id);
        c.setName(req.getName()); c.setDescription(req.getDescription());
        c.setType(req.getType()); if (req.getStatus() != null) c.setStatus(req.getStatus());
        c.setStartDate(req.getStartDate()); c.setEndDate(req.getEndDate());
        c.setBudget(req.getBudget());
        return campaignRepository.save(c);
    }

    @Transactional
    public void delete(UUID id) { Campaign c = getById(id); c.setDeleted(true); campaignRepository.save(c); }
}
