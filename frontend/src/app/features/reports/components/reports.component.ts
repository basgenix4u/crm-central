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

    // Create report in a hidden div, render to canvas, then save as PDF
    const reportDiv = document.createElement('div');
    reportDiv.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:white;padding:40px;font-family:Arial,sans-serif;color:#1e293b;font-size:12px;';
    reportDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:3px solid #3b82f6;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:44px;height:44px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:bold;">C</div>
          <div><div style="font-size:20px;font-weight:800;color:#0f172a;">CRM Central</div><div style="font-size:9px;color:#3b82f6;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Business Intelligence Report</div></div>
        </div>
        <div style="text-align:right;"><div style="font-size:15px;font-weight:700;color:#0f172a;">Performance Report</div><div style="font-size:10px;color:#64748b;">${today}</div><div style="font-size:9px;color:#94a3b8;">Prepared by ${user.firstName || ''} ${user.lastName || ''}</div></div>
      </div>

      <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">📊 Revenue & Sales</div>
      <div style="display:flex;gap:10px;margin-bottom:20px;">
        <div style="flex:1;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#3b82f6;">$${(d.totalRevenue||0).toLocaleString()}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Total Revenue</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#16a34a;">${d.totalOpportunities}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Active Deals</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#ea580c;">$${Math.round(d.avgDealSize||0).toLocaleString()}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Avg Deal Size</div></div>
      </div>

      <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">👥 Customers & Leads</div>
      <div style="display:flex;gap:10px;margin-bottom:20px;">
        <div style="flex:1;background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1px solid #e9d5ff;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#9333ea;">${d.totalCustomers}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Customers</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#3b82f6;">${d.totalContacts}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Contacts</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#16a34a;">${d.totalLeads}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Leads</div></div>
      </div>

      <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">🎯 Pipeline Breakdown</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><th style="background:#f1f5f9;padding:8px 10px;text-align:left;font-size:10px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;">Stage</th><th style="background:#f1f5f9;padding:8px 10px;text-align:right;font-size:10px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;">Deals</th><th style="background:#f1f5f9;padding:8px 10px;text-align:right;font-size:10px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;">Value</th></tr>
        ${Object.entries(d.pipelineMetrics||{}).map(([s,v]) => '<tr><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;">'+s.replace('_',' ')+'</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;text-align:right;">'+((v as any).count||0)+'</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;text-align:right;font-weight:600;">$'+((v as any).amount||0).toLocaleString()+'</td></tr>').join('')}
      </table>

      <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">🎫 Support & Tasks</div>
      <div style="display:flex;gap:10px;margin-bottom:20px;">
        <div style="flex:1;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#ea580c;">${d.totalTickets}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Tickets</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#fef2f2,#fecaca);border:1px solid #fca5a5;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#dc2626;">${d.openTickets}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Open</div></div>
        <div style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#16a34a;">${d.completedTasks}/${d.totalTasks}</div><div style="font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;">Tasks Done</div></div>
      </div>

      <div style="margin-top:30px;padding-top:14px;border-top:2px solid #0f172a;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:8px;color:#94a3b8;">CRM Central &bull; Enterprise CRM Platform</div>
        <div style="font-size:8px;color:#94a3b8;">CONFIDENTIAL &bull; ${today}</div>
        <div style="font-size:8px;color:#94a3b8;">Page 1 of 1</div>
      </div>
    `;

    document.body.appendChild(reportDiv);

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(reportDiv, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
          pdf.save('CRM-Report-' + new Date().toISOString().slice(0, 10) + '.pdf');
          document.body.removeChild(reportDiv);
        });
      });
    });
  }
}
