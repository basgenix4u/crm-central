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
    const user = JSON.parse(localStorage.getItem('crm_user') || '{}');
    const companyName = 'CRM Central';

    const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><circle cx="16" cy="16" r="4" fill="white"/><circle cx="16" cy="7" r="2.5" fill="white" opacity=".9"/><circle cx="16" cy="25" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="20" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="20" r="2.5" fill="white" opacity=".9"/></svg>`;

    const html = `<!DOCTYPE html><html><head><title>Business Report - ${companyName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',system-ui,sans-serif}
body{width:210mm;min-height:297mm;margin:0 auto;background:white;color:#1e293b;font-size:11px}
.page{padding:24mm 20mm 30mm;position:relative;min-height:297mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #3b82f6}
.logo-area{display:flex;align-items:center;gap:12px}
.logo-area h1{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.5px}
.logo-area .subtitle{font-size:9px;color:#3b82f6;font-weight:600;text-transform:uppercase;letter-spacing:1.5px}
.report-meta{text-align:right}
.report-meta .report-title{font-size:16px;font-weight:700;color:#0f172a}
.report-meta .report-date{font-size:10px;color:#64748b;margin-top:2px}
.report-meta .report-by{font-size:9px;color:#94a3b8;margin-top:2px}
.section{margin-bottom:20px}
.section h2{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:6px}
.section h2::before{content:'';width:4px;height:16px;background:#3b82f6;border-radius:2px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.stat{background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:8px;padding:14px;text-align:center}
.stat .val{font-size:22px;font-weight:800;color:#3b82f6}
.stat .lbl{font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px}
.stat.green .val{color:#16a34a}
.stat.purple .val{color:#9333ea}
.stat.orange .val{color:#ea580c}
table{width:100%;border-collapse:collapse;margin:8px 0}
th{background:#f1f5f9;padding:8px 10px;text-align:left;font-size:10px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0}
td{padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:10px}
tr:nth-child(even) td{background:#fafbfc}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.bar-label{width:80px;font-size:10px;color:#475569}
.bar-track{flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden}
.bar-fill{height:100%;border-radius:3px}
.bar-val{width:40px;text-align:right;font-size:10px;font-weight:600}
.footer{position:fixed;bottom:0;left:0;right:0;padding:10mm 20mm;background:linear-gradient(135deg,#0f172a,#1e293b);color:white;display:flex;justify-content:space-between;align-items:center}
.footer-left{font-size:9px;opacity:0.8}
.footer-center{font-size:8px;opacity:0.5;text-align:center}
.footer-right{font-size:9px;opacity:0.8}
.watermark{position:fixed;bottom:40mm;right:20mm;font-size:72px;color:rgba(59,130,246,0.03);font-weight:900;transform:rotate(-30deg)}
</style></head><body>
<div class="page">
<div class="header">
  <div class="logo-area">
    ${svgLogo}
    <div><h1>CRM Central</h1><div class="subtitle">Business Intelligence Report</div></div>
  </div>
  <div class="report-meta">
    <div class="report-title">Performance Report</div>
    <div class="report-date">${today}</div>
    <div class="report-by">Prepared by ${user.firstName || ''} ${user.lastName || ''}</div>
  </div>
</div>

<div class="section"><h2>Revenue & Sales</h2>
<div class="stats-row">
  <div class="stat"><div class="val">\$${(d.totalRevenue||0).toLocaleString()}</div><div class="lbl">Total Revenue</div></div>
  <div class="stat green"><div class="val">${d.totalOpportunities}</div><div class="lbl">Active Deals</div></div>
  <div class="stat orange"><div class="val">\$${Math.round(d.avgDealSize||0).toLocaleString()}</div><div class="lbl">Avg Deal Size</div></div>
</div></div>

<div class="section"><h2>Pipeline Breakdown</h2>
<table><tr><th>Stage</th><th>Deals</th><th>Total Value</th><th>Avg Value</th></tr>
${Object.entries(d.pipelineMetrics||{}).map(([s,v])=>`<tr><td>${s.replace('_',' ')}</td><td>${(v as any).count||0}</td><td>\$${((v as any).amount||0).toLocaleString()}</td><td>\$${(v as any).count?Math.round((v as any).amount/(v as any).count).toLocaleString():'0'}</td></tr>`).join('')}
</table></div>

<div class="section"><h2>Customer & Contacts</h2>
<div class="stats-row">
  <div class="stat purple"><div class="val">${d.totalCustomers}</div><div class="lbl">Customers</div></div>
  <div class="stat"><div class="val">${d.totalContacts}</div><div class="lbl">Contacts</div></div>
  <div class="stat green"><div class="val">${d.totalLeads}</div><div class="lbl">Leads</div></div>
</div></div>

<div class="section"><h2>Support & Operations</h2>
<div class="stats-row">
  <div class="stat orange"><div class="val">${d.totalTickets}</div><div class="lbl">Total Tickets</div></div>
  <div class="stat"><div class="val">${d.openTickets}</div><div class="lbl">Open Tickets</div></div>
  <div class="stat green"><div class="val">${d.completedTasks}/${d.totalTasks}</div><div class="lbl">Tasks Done</div></div>
</div></div>

<div class="section"><h2>Marketing</h2>
<div class="stats-row">
  <div class="stat"><div class="val">${d.totalCampaigns}</div><div class="lbl">Campaigns</div></div>
  <div class="stat purple"><div class="val">${d.totalActivities}</div><div class="lbl">Activities</div></div>
  <div class="stat"><div class="val">${d.totalContacts}</div><div class="lbl">Reach</div></div>
</div></div>

<div class="watermark">CRM</div>
</div>

<div class="footer">
  <div class="footer-left">CRM Central &bull; Enterprise CRM Platform</div>
  <div class="footer-center">CONFIDENTIAL &bull; ${today}</div>
  <div class="footer-right">Page 1 of 1</div>
</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CRM-Report-' + new Date().toISOString().slice(0,10) + '.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
