export interface DashboardData {
  totalCustomers: number;
  totalLeads: number;
  totalOpportunities: number;
  totalTickets: number;
  openTickets: number;
  totalTasks: number;
  completedTasks: number;
  totalActivities: number;
  totalContacts: number;
  totalCampaigns: number;
  totalRevenue: number;
  avgDealSize: number;
  leadsByStatus: { [key: string]: number };
  leadsBySource: { [key: string]: number };
  ticketsByStatus: { [key: string]: number };
  tasksByStatus: { [key: string]: number };
  pipelineMetrics: { [key: string]: any };
  customersByIndustry: { [key: string]: number };
}
