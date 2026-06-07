package com.crmcentral.service;

import com.crmcentral.dto.response.DashboardResponse;
import com.crmcentral.enums.*;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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
        DashboardResponse.DashboardResponseBuilder builder = DashboardResponse.builder();
        
        try { builder.totalCustomers(customerRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { log.warn("Dashboard: customers query failed"); builder.totalCustomers(0); }
        try { builder.totalLeads(leadRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalLeads(0); }
        try { builder.totalOpportunities(opportunityRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalOpportunities(0); }
        try { builder.totalTickets(ticketRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalTickets(0); }
        try { builder.openTickets(ticketRepository.countByTenantIdAndStatusAndDeletedFalse(tenantId, TicketStatus.OPEN)); } catch (Exception e) { builder.openTickets(0); }
        try { builder.totalTasks(taskRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalTasks(0); }
        try { builder.completedTasks(taskRepository.countByTenantIdAndStatusAndDeletedFalse(tenantId, TaskStatus.COMPLETED)); } catch (Exception e) { builder.completedTasks(0); }
        try { builder.totalActivities(activityRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalActivities(0); }
        try { builder.totalContacts(contactRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalContacts(0); }
        try { builder.totalCampaigns(campaignRepository.countByTenantIdAndDeletedFalse(tenantId)); } catch (Exception e) { builder.totalCampaigns(0); }
        try { builder.totalRevenue(opportunityRepository.getTotalWonRevenue(tenantId)); } catch (Exception e) { builder.totalRevenue(BigDecimal.ZERO); }
        try { builder.avgDealSize(opportunityRepository.getAverageDealSize(tenantId)); } catch (Exception e) { builder.avgDealSize(BigDecimal.ZERO); }
        
        try {
            builder.leadsByStatus(leadRepository.countByStatus(tenantId).stream()
                .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1])));
        } catch (Exception e) { builder.leadsByStatus(new HashMap<>()); }
        
        try {
            builder.leadsBySource(leadRepository.countBySource(tenantId).stream()
                .collect(Collectors.toMap(r -> r[0] != null ? r[0].toString() : "Unknown", r -> (Long) r[1])));
        } catch (Exception e) { builder.leadsBySource(new HashMap<>()); }
        
        try {
            builder.ticketsByStatus(ticketRepository.countByStatus(tenantId).stream()
                .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1])));
        } catch (Exception e) { builder.ticketsByStatus(new HashMap<>()); }
        
        try {
            builder.tasksByStatus(taskRepository.countByStatus(tenantId).stream()
                .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1])));
        } catch (Exception e) { builder.tasksByStatus(new HashMap<>()); }
        
        try {
            builder.customersByIndustry(customerRepository.countByIndustry(tenantId).stream()
                .collect(Collectors.toMap(r -> r[0] != null ? r[0].toString() : "Unknown", r -> (Long) r[1])));
        } catch (Exception e) { builder.customersByIndustry(new HashMap<>()); }
        
        Map<String, Object> pipelineMetrics = new HashMap<>();
        try {
            List<Object[]> pipeline = opportunityRepository.getPipelineMetrics(tenantId);
            for (Object[] row : pipeline) {
                Map<String, Object> stage = new HashMap<>();
                stage.put("count", row[1]);
                stage.put("amount", row[2]);
                pipelineMetrics.put(row[0].toString(), stage);
            }
        } catch (Exception e) { /* ignore */ }
        builder.pipelineMetrics(pipelineMetrics);

        return builder.build();
    }
}
