import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { DashboardData } from '@core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/leads"><mat-icon>person_add</mat-icon> New Lead</button>
          <button mat-stroked-button routerLink="/customers"><mat-icon>people</mat-icon> View Customers</button>
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 48px;">
        <mat-spinner diameter="48" style="margin: 0 auto;"></mat-spinner>
        <p style="margin-top: 16px; color: #666;">Loading dashboard...</p>
      </div>

      <div *ngIf="!loading">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card" *ngFor="let stat of stats">
            <div class="stat-icon" [style.background]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value | number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Revenue & Pipeline Row -->
        <div class="dashboard-row">
          <div class="card flex-2">
            <h3 style="margin-bottom: 16px;">Revenue Overview</h3>
            <div class="revenue-stats">
              <div class="revenue-item">
                <span class="revenue-label">Total Revenue</span>
                <span class="revenue-value">\${{ data?.totalRevenue | number:'1.0-0' }}</span>
              </div>
              <div class="revenue-item">
                <span class="revenue-label">Avg Deal Size</span>
                <span class="revenue-value">\${{ data?.avgDealSize | number:'1.0-0' }}</span>
              </div>
              <div class="revenue-item">
                <span class="revenue-label">Win Rate</span>
                <span class="revenue-value">{{ getWinRate() }}%</span>
              </div>
            </div>
          </div>
          <div class="card flex-1">
            <h3 style="margin-bottom: 16px;">Quick Actions</h3>
            <div class="quick-actions">
              <button mat-stroked-button routerLink="/leads" class="action-btn"><mat-icon>person_add</mat-icon>Add Lead</button>
              <button mat-stroked-button routerLink="/tickets" class="action-btn"><mat-icon>confirmation_number</mat-icon>Create Ticket</button>
              <button mat-stroked-button routerLink="/tasks" class="action-btn"><mat-icon>task_alt</mat-icon>New Task</button>
              <button mat-stroked-button routerLink="/reports" class="action-btn"><mat-icon>assessment</mat-icon>View Reports</button>
            </div>
          </div>
        </div>

        <!-- Pipeline & Leads Row -->
        <div class="dashboard-row">
          <div class="card flex-1">
            <h3 style="margin-bottom: 16px;">Leads by Status</h3>
            <div class="chart-bars">
              <div *ngFor="let item of getLeadStatusData()" class="bar-item">
                <div class="bar-label">{{ item.label }}</div>
                <div class="bar-track"><div class="bar-fill" [style.width.%]="item.percent" [style.background]="item.color"></div></div>
                <div class="bar-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div class="card flex-1">
            <h3 style="margin-bottom: 16px;">Tickets Overview</h3>
            <div class="chart-bars">
              <div *ngFor="let item of getTicketStatusData()" class="bar-item">
                <div class="bar-label">{{ item.label }}</div>
                <div class="bar-track"><div class="bar-fill" [style.width.%]="item.percent" [style.background]="item.color"></div></div>
                <div class="bar-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-row { display: flex; gap: 20px; margin-bottom: 24px; }
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }
    .revenue-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .revenue-item { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px;
      .revenue-label { display: block; font-size: 13px; color: #666; margin-bottom: 4px; }
      .revenue-value { display: block; font-size: 22px; font-weight: 700; color: #1976d2; }
    }
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
      .action-btn { justify-content: flex-start; gap: 8px; }
    }
    .chart-bars { display: flex; flex-direction: column; gap: 12px;
      .bar-item { display: flex; align-items: center; gap: 12px;
        .bar-label { width: 100px; font-size: 13px; color: #666; }
        .bar-track { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .bar-value { width: 40px; text-align: right; font-weight: 600; font-size: 14px; }
      }
    }
    @media (max-width: 768px) { .dashboard-row { flex-direction: column; } .revenue-stats { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  stats: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<DashboardData>('dashboard').subscribe({
      next: (res) => {
        this.data = res.data;
        this.buildStats();
        this.loading = false;
      },
      error: () => {
        this.data = { totalCustomers: 0, totalLeads: 0, totalOpportunities: 0, totalTickets: 0, openTickets: 0, totalTasks: 0, completedTasks: 0, totalActivities: 0, totalContacts: 0, totalCampaigns: 0, totalRevenue: 0, avgDealSize: 0, leadsByStatus: {}, leadsBySource: {}, ticketsByStatus: {}, tasksByStatus: {}, pipelineMetrics: {}, customersByIndustry: {} };
        this.buildStats();
        this.loading = false;
      }
    });
  }

  buildStats() {
    const d = this.data!;
    this.stats = [
      { label: 'Customers', value: d.totalCustomers, icon: 'people', color: '#1976d2' },
      { label: 'Leads', value: d.totalLeads, icon: 'person_add', color: '#e91e63' },
      { label: 'Opportunities', value: d.totalOpportunities, icon: 'trending_up', color: '#9c27b0' },
      { label: 'Revenue', value: d.totalRevenue, icon: 'attach_money', color: '#4caf50' },
      { label: 'Open Tickets', value: d.openTickets, icon: 'confirmation_number', color: '#ff9800' },
      { label: 'Tasks', value: d.totalTasks, icon: 'task_alt', color: '#00bcd4' },
      { label: 'Activities', value: d.totalActivities, icon: 'event_note', color: '#607d8b' },
      { label: 'Campaigns', value: d.totalCampaigns, icon: 'campaign', color: '#795548' },
    ];
  }

  getWinRate(): number {
    if (!this.data?.pipelineMetrics) return 0;
    const won = (this.data.pipelineMetrics['WON'] as any)?.count || 0;
    const lost = (this.data.pipelineMetrics['LOST'] as any)?.count || 0;
    const total = won + lost;
    return total > 0 ? Math.round((won / total) * 100) : 0;
  }

  getLeadStatusData() {
    if (!this.data?.leadsByStatus) return [];
    const max = Math.max(...Object.values(this.data.leadsByStatus), 1);
    const colors: any = { NEW: '#2196f3', CONTACTED: '#ff9800', QUALIFIED: '#4caf50', UNQUALIFIED: '#f44336', NURTURING: '#9c27b0', CONVERTED: '#00bcd4', LOST: '#757575' };
    return Object.entries(this.data.leadsByStatus).map(([key, value]) => ({
      label: key.replace('_', ' '), value, percent: (value / max) * 100, color: colors[key] || '#999'
    }));
  }

  getTicketStatusData() {
    if (!this.data?.ticketsByStatus) return [];
    const max = Math.max(...Object.values(this.data.ticketsByStatus), 1);
    const colors: any = { OPEN: '#2196f3', PENDING: '#ff9800', IN_PROGRESS: '#9c27b0', RESOLVED: '#4caf50', CLOSED: '#757575' };
    return Object.entries(this.data.ticketsByStatus).map(([key, value]) => ({
      label: key.replace('_', ' '), value, percent: (value / max) * 100, color: colors[key] || '#999'
    }));
  }
}
