package com.crmcentral.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private long totalCustomers;
    private long totalLeads;
    private long totalOpportunities;
    private long totalTickets;
    private long openTickets;
    private long totalTasks;
    private long completedTasks;
    private long totalActivities;
    private long totalContacts;
    private long totalCampaigns;
    private BigDecimal totalRevenue;
    private BigDecimal avgDealSize;
    private Map<String, Long> leadsByStatus;
    private Map<String, Long> leadsBySource;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> tasksByStatus;
    private Map<String, Object> pipelineMetrics;
    private Map<String, Long> customersByIndustry;
}
