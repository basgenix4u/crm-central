import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';
import { DashboardData } from '@core/models';

@Component({
  selector: 'app-reports', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Reports & Analytics</h1>
        <button mat-raised-button color="primary" (click)="exportReport()"><mat-icon>download</mat-icon> Download Report</button>
      </div>

      <div *ngIf="!data" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>

      <div *ngIf="data">
        <mat-tab-group>
          <mat-tab label="Sales">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>attach_money</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data.totalRevenue | number:'1.0-0' }}</div><div class="stat-label">Total Revenue</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>trending_up</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalOpportunities }}</div><div class="stat-label">Total Deals</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>speed</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data.avgDealSize | number:'1.0-0' }}</div><div class="stat-label">Avg Deal Size</div></div></div>
            </div>
            <div class="card"><h3>Pipeline Distribution</h3>
              <div style="margin-top:16px;" *ngFor="let entry of getPipelineEntries()">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>{{ entry[0] }}</span><span style="font-weight:600;">{{ entry[1]?.count }} deals</span></div>
                <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;background:#3b82f6;border-radius:4px;" [style.width.%]="getBarWidth(entry[1]?.amount)"></div></div>
              </div>
            </div>
          </mat-tab>
          <mat-tab label="Customers">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#9c27b0;"><mat-icon>people</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalCustomers }}</div><div class="stat-label">Total Customers</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#e91e63;"><mat-icon>contacts</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalContacts }}</div><div class="stat-label">Total Contacts</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#00bcd4;"><mat-icon>person_add</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalLeads }}</div><div class="stat-label">Total Leads</div></div></div>
            </div>
            <div class="card"><h3>Customers by Industry</h3>
              <div style="margin-top:16px;" *ngFor="let entry of getIndustryEntries()">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>{{ entry[0] }}</span><span style="font-weight:600;">{{ entry[1] }}</span></div>
                <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;background:#9c27b0;border-radius:4px;" [style.width.%]="getIndustryBarWidth(entry[1])"></div></div>
              </div>
            </div>
          </mat-tab>
          <mat-tab label="Support">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>confirmation_number</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalTickets }}</div><div class="stat-label">Total Tickets</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#f44336;"><mat-icon>error_outline</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.openTickets }}</div><div class="stat-label">Open Tickets</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>task_alt</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.completedTasks }}</div><div class="stat-label">Completed Tasks</div></div></div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  data: DashboardData | null = null;
  maxPipeline = 1;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<DashboardData>('dashboard').subscribe({
      next: r => {
        this.data = r.data;
        if (this.data?.pipelineMetrics) {
          this.maxPipeline = Math.max(...Object.values(this.data.pipelineMetrics).map((v: any) => v.amount || 0), 1);
        }
      },
      error: () => {}
    });
  }

  getPipelineEntries(): [string, any][] { return this.data?.pipelineMetrics ? Object.entries(this.data.pipelineMetrics) : []; }
  getBarWidth(amount: number): number { return (amount / this.maxPipeline) * 100; }
  getIndustryEntries(): [string, number][] { return this.data?.customersByIndustry ? Object.entries(this.data.customersByIndustry) : []; }
  getIndustryBarWidth(val: number): number { const max = Math.max(...Object.values(this.data?.customersByIndustry || {}), 1); return (val / max) * 100; }

  exportReport() {
    if (!this.data) return;
    const d = this.data;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
      <html><head><title>CRM Central Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif}
        body{padding:40px;color:#1e293b}
        .header{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;border-bottom:3px solid #3b82f6;margin-bottom:30px}
        .logo{display:flex;align-items:center;gap:12px}
        .logo-icon{width:40px;height:40px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:bold}
        .logo-text{font-size:22px;font-weight:700;color:#0f172a}
        .logo-sub{font-size:11px;color:#64748b}
        .date{text-align:right;font-size:12px;color:#64748b}
        .date strong{display:block;font-size:16px;color:#0f172a}
        h2{font-size:20px;font-weight:700;color:#0f172a;margin:24px 0 12px}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
        .stat-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center}
        .stat-box .value{font-size:28px;font-weight:700;color:#3b82f6}
        .stat-box .label{font-size:12px;color:#64748b;margin-top:4px}
        table{width:100%;border-collapse:collapse;margin:12px 0}
        th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0}
        td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8}
        @media print{body{padding:20px}.footer{position:fixed;bottom:20px;left:0;right:0}}
      </style></head><body>
      <div class="header">
        <div class="logo">
          <div class="logo-icon">C</div>
          <div><div class="logo-text">CRM Central</div><div class="logo-sub">Business Intelligence Report</div></div>
        </div>
        <div class="date"><strong>Business Report</strong>${today}</div>
      </div>

      <h2>Sales Overview</h2>
      <div class="stats">
        <div class="stat-box"><div class="value">$${(d.totalRevenue || 0).toLocaleString()}</div><div class="label">Total Revenue</div></div>
        <div class="stat-box"><div class="value">${d.totalOpportunities}</div><div class="label">Total Deals</div></div>
        <div class="stat-box"><div class="value">$${(d.avgDealSize || 0).toLocaleString()}</div><div class="label">Avg Deal Size</div></div>
      </div>

      <h2>Customer Overview</h2>
      <div class="stats">
        <div class="stat-box"><div class="value">${d.totalCustomers}</div><div class="label">Customers</div></div>
        <div class="stat-box"><div class="value">${d.totalLeads}</div><div class="label">Leads</div></div>
        <div class="stat-box"><div class="value">${d.totalContacts}</div><div class="label">Contacts</div></div>
      </div>

      <h2>Support & Productivity</h2>
      <div class="stats">
        <div class="stat-box"><div class="value">${d.totalTickets}</div><div class="label">Total Tickets</div></div>
        <div class="stat-box"><div class="value">${d.openTickets}</div><div class="label">Open Tickets</div></div>
        <div class="stat-box"><div class="value">${d.totalTasks}</div><div class="label">Tasks</div></div>
      </div>

      <h2>Pipeline Breakdown</h2>
      <table>
        <tr><th>Stage</th><th>Deals</th><th>Value</th></tr>
        ${Object.entries(d.pipelineMetrics || {}).map(([stage, data]: [string, any]) =>
          `<tr><td>${stage}</td><td>${data.count || 0}</td><td>$${(data.amount || 0).toLocaleString()}</td></tr>`
        ).join('')}
      </table>

      <h2>Marketing</h2>
      <div class="stats">
        <div class="stat-box"><div class="value">${d.totalCampaigns}</div><div class="label">Active Campaigns</div></div>
        <div class="stat-box"><div class="value">${d.totalActivities}</div><div class="label">Activities Logged</div></div>
        <div class="stat-box"><div class="value">${d.completedTasks}</div><div class="label">Tasks Completed</div></div>
      </div>

      <div class="footer">
        <p>Generated by CRM Central on ${today} &bull; Confidential Business Report</p>
        <p>www.crmcentral.com</p>
      </div>
      </body></html>
    `;

    // Create downloadable HTML report
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CRM-Central-Report-' + new Date().toISOString().slice(0, 10) + '.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
