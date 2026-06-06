package com.crmcentral.service;

import com.crmcentral.dto.response.DashboardResponse;
import com.crmcentral.enums.*;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final TicketRepository ticketRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;
    private final ContactRepository contactRepository;
    private final CampaignRepository campaignRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(UUID tenantId) {
        Map<String, Long> leadsByStatus = leadRepository.countByStatus(tenantId).stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));
        Map<String, Long> leadsBySource = leadRepository.countBySource(tenantId).stream()
            .collect(Collectors.toMap(r -> r[0] != null ? r[0].toString() : "Unknown", r -> (Long) r[1]));
        Map<String, Long> ticketsByStatus = ticketRepository.countByStatus(tenantId).stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));
        Map<String, Long> tasksByStatus = taskRepository.countByStatus(tenantId).stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));
        Map<String, Long> customersByIndustry = customerRepository.countByIndustry(tenantId).stream()
            .collect(Collectors.toMap(r -> r[0] != null ? r[0].toString() : "Unknown", r -> (Long) r[1]));

        Map<String, Object> pipelineMetrics = new HashMap<>();
        List<Object[]> pipeline = opportunityRepository.getPipelineMetrics(tenantId);
        for (Object[] row : pipeline) {
            Map<String, Object> stage = new HashMap<>();
            stage.put("count", row[1]);
            stage.put("amount", row[2]);
            pipelineMetrics.put(row[0].toString(), stage);
        }

        return DashboardResponse.builder()
            .totalCustomers(customerRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalLeads(leadRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalOpportunities(opportunityRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalTickets(ticketRepository.countByTenantIdAndDeletedFalse(tenantId))
            .openTickets(ticketRepository.countByTenantIdAndStatusAndDeletedFalse(tenantId, TicketStatus.OPEN))
            .totalTasks(taskRepository.countByTenantIdAndDeletedFalse(tenantId))
            .completedTasks(taskRepository.countByTenantIdAndStatusAndDeletedFalse(tenantId, TaskStatus.COMPLETED))
            .totalActivities(activityRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalContacts(contactRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalCampaigns(campaignRepository.countByTenantIdAndDeletedFalse(tenantId))
            .totalRevenue(opportunityRepository.getTotalWonRevenue(tenantId))
            .avgDealSize(opportunityRepository.getAverageDealSize(tenantId))
            .leadsByStatus(leadsByStatus)
            .leadsBySource(leadsBySource)
            .ticketsByStatus(ticketsByStatus)
            .tasksByStatus(tasksByStatus)
            .pipelineMetrics(pipelineMetrics)
            .customersByIndustry(customersByIndustry)
            .build();
    }
}
