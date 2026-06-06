import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@core/services/api.service';
import { DashboardData } from '@core/models';

@Component({
  selector: 'app-reports', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Reports & Analytics</h1><button mat-raised-button><mat-icon>download</mat-icon> Export</button></div>
      <mat-tab-group>
        <mat-tab label="Sales Reports">
          <div class="stats-grid" style="margin-top:24px;">
            <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>attach_money</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data?.totalRevenue | number:'1.0-0' }}</div><div class="stat-label">Total Revenue</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>trending_up</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data?.totalOpportunities }}</div><div class="stat-label">Total Deals</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>speed</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data?.avgDealSize | number:'1.0-0' }}</div><div class="stat-label">Avg Deal Size</div></div></div>
          </div>
          <div class="card"><h3>Pipeline Distribution</h3>
            <div style="margin-top:16px;" *ngFor="let entry of getPipelineEntries()">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>{{ entry[0] }}</span><span>{{ entry[1]?.count }} deals · <span>$</span>{{ entry[1]?.amount | number:'1.0-0' }}</span></div>
              <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;background:#1976d2;border-radius:4px;" [style.width.%]="getBarWidth(entry[1]?.amount)"></div></div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Customer Reports">
          <div class="stats-grid" style="margin-top:24px;">
            <div class="stat-card"><div class="stat-icon" style="background:#9c27b0;"><mat-icon>people</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data?.totalCustomers }}</div><div class="stat-label">Total Customers</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#e91e63;"><mat-icon>contacts</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data?.totalContacts }}</div><div class="stat-label">Total Contacts</div></div></div>
          </div>
          <div class="card"><h3>Customers by Industry</h3>
            <div style="margin-top:16px;" *ngFor="let entry of getIndustryEntries()">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>{{ entry[0] }}</span><span>{{ entry[1] }}</span></div>
              <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;background:#9c27b0;border-radius:4px;" [style.width.%]="getIndustryBarWidth(entry[1])"></div></div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Support Reports">
          <div class="stats-grid" style="margin-top:24px;">
            <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>confirmation_number</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data?.totalTickets }}</div><div class="stat-label">Total Tickets</div></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#f44336;"><mat-icon>error_outline</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data?.openTickets }}</div><div class="stat-label">Open Tickets</div></div></div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  data: DashboardData | null = null; maxPipeline = 1;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<DashboardData>('dashboard').subscribe({ next: r => { this.data = r.data; if (this.data?.pipelineMetrics) { this.maxPipeline = Math.max(...Object.values(this.data.pipelineMetrics).map((v:any) => v.amount || 0), 1); }}, error: () => {} }); }
  getPipelineEntries(): [string, any][] { return this.data?.pipelineMetrics ? Object.entries(this.data.pipelineMetrics) : []; }
  getBarWidth(amount: number): number { return (amount / this.maxPipeline) * 100; }
  getIndustryEntries(): [string, number][] { return this.data?.customersByIndustry ? Object.entries(this.data.customersByIndustry) : []; }
  getIndustryBarWidth(val: number): number { const max = Math.max(...Object.values(this.data?.customersByIndustry || {}), 1); return (val / max) * 100; }
}
