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
        <button mat-raised-button color="primary" (click)="exportReport()" [disabled]="!data || exporting">
          <mat-icon>{{ exporting ? 'hourglass_empty' : 'picture_as_pdf' }}</mat-icon> {{ exporting ? 'Generating...' : 'Export PDF Report' }}
        </button>
      </div>
      <div *ngIf="!data" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div *ngIf="data">
        <mat-tab-group>
          <mat-tab label="Sales">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>attach_money</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data.totalRevenue | number:'1.0-0' }}</div><div class="stat-label">Total Revenue</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>trending_up</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalOpportunities }}</div><div class="stat-label">Active Deals</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>speed</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ data.avgDealSize | number:'1.0-0' }}</div><div class="stat-label">Avg Deal Size</div></div></div>
            </div>
            <div class="card"><h3>Pipeline Distribution</h3>
              <div style="margin-top:16px;" *ngFor="let entry of getPipelineEntries()">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>{{ entry[0].replace('_',' ') }}</span><span style="font-weight:600;">{{ entry[1]?.count }} deals</span></div>
                <div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;background:#3b82f6;border-radius:4px;" [style.width.%]="getBarWidth(entry[1]?.amount)"></div></div>
              </div>
            </div>
          </mat-tab>
          <mat-tab label="Customers">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#9c27b0;"><mat-icon>people</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalCustomers }}</div><div class="stat-label">Customers</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#e91e63;"><mat-icon>contacts</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalContacts }}</div><div class="stat-label">Contacts</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#00bcd4;"><mat-icon>person_add</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalLeads }}</div><div class="stat-label">Leads</div></div></div>
            </div>
          </mat-tab>
          <mat-tab label="Support">
            <div class="stats-grid" style="margin-top:24px;">
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>confirmation_number</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.totalTickets }}</div><div class="stat-label">Tickets</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#f44336;"><mat-icon>error_outline</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.openTickets }}</div><div class="stat-label">Open</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>task_alt</mat-icon></div><div class="stat-info"><div class="stat-value">{{ data.completedTasks }}</div><div class="stat-label">Tasks Done</div></div></div>
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
  exporting = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<DashboardData>('dashboard').subscribe({
      next: r => {
        this.data = r.data;
        if (this.data?.pipelineMetrics) {
          this.maxPipeline = Math.max(...Object.values(this.data.pipelineMetrics).map((v: any) => v.amount || 0), 1);
        }
      }
    });
  }

  getPipelineEntries(): [string, any][] { return this.data?.pipelineMetrics ? Object.entries(this.data.pipelineMetrics) : []; }
  getBarWidth(amount: number): number { return (amount / this.maxPipeline) * 100; }

  exportReport() {
    if (!this.data) return;
    this.exporting = true;
    const d = this.data;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const user = JSON.parse(localStorage.getItem('crm_user') || '{}');

    // The actual CRM Central SVG logo (hub/network design)
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><circle cx="16" cy="16" r="4" fill="white"/><circle cx="16" cy="7" r="2.5" fill="white" opacity=".9"/><circle cx="16" cy="25" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="20" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="20" r="2.5" fill="white" opacity=".9"/><line x1="16" y1="12" x2="16" y2="9.5" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="16" y1="20" x2="16" y2="22.5" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="12.5" y1="14" x2="9.2" y2="12.8" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="19.5" y1="14" x2="22.8" y2="12.8" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="12.5" y1="18" x2="9.2" y2="19.2" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="19.5" y1="18" x2="22.8" y2="19.2" stroke="white" stroke-width="1.2" opacity=".7"/></svg>`;

    // Watermark: same logo in very light gray, repeated
    const watermarkLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24"><rect width="32" height="32" rx="8" fill="none" stroke="#e8e8e8" stroke-width="1.5"/><circle cx="16" cy="16" r="3.5" fill="none" stroke="#e8e8e8" stroke-width="1"/><circle cx="16" cy="7" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/><circle cx="16" cy="25" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/><circle cx="7" cy="12" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/><circle cx="25" cy="12" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/><circle cx="7" cy="20" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/><circle cx="25" cy="20" r="2" fill="none" stroke="#e8e8e8" stroke-width="0.8"/></svg>`;

    // Build pipeline chart bars as HTML
    const pipelineEntries = Object.entries(d.pipelineMetrics || {});
    const maxAmount = Math.max(...pipelineEntries.map(([,v]: [string, any]) => v.amount || 0), 1);
    const stageColors: any = { PROSPECT:'#94a3b8', QUALIFIED:'#3b82f6', PROPOSAL_SENT:'#8b5cf6', NEGOTIATION:'#f59e0b', WON:'#22c55e', LOST:'#ef4444' };
    const pipelineChartHtml = pipelineEntries.map(([stage, val]: [string, any]) => {
      const pct = Math.round(((val.amount || 0) / maxAmount) * 100);
      const color = stageColors[stage] || '#64748b';
      return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
        <div style="width:85px;font-size:8.5px;color:#475569;text-align:right;">${stage.replace('_',' ')}</div>
        <div style="flex:1;height:14px;background:#f1f5f9;border-radius:3px;overflow:hidden;position:relative;">
          <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;"></div>
        </div>
        <div style="width:50px;font-size:8px;color:#475569;">${val.count} / $${(val.amount||0).toLocaleString()}</div>
      </div>`;
    }).join('');

    // Lead source donut simulation
    const leadEntries = Object.entries(d.leadsBySource || {});
    const totalLeadSrc = leadEntries.reduce((s, [,v]) => s + (v as number), 0) || 1;
    const srcColors = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#64748b'];
    const leadSourceHtml = leadEntries.map(([src, count], i) => {
      const pct = Math.round(((count as number) / totalLeadSrc) * 100);
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <div style="width:8px;height:8px;border-radius:50%;background:${srcColors[i % srcColors.length]};"></div>
        <div style="flex:1;font-size:8.5px;color:#475569;">${src.replace('_',' ')}</div>
        <div style="font-size:8.5px;font-weight:600;color:#1e293b;">${count} (${pct}%)</div>
      </div>`;
    }).join('');

    // Watermark grid
    let watermarkHtml = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        watermarkHtml += `<div style="position:absolute;top:${120 + row * 110}px;left:${60 + col * 120}px;opacity:0.35;">${watermarkLogo}</div>`;
      }
    }

    const reportDiv = document.createElement('div');
    reportDiv.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;min-height:1123px;background:white;font-family:"Times New Roman",Times,Georgia,serif;color:#1e293b;font-size:10px;';
    reportDiv.innerHTML = `
      <!-- Watermark layer -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;">${watermarkHtml}</div>

      <div style="position:relative;z-index:1;padding:36px 40px 50px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #1e3a5f;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:10px;">
            ${logoSvg}
            <div>
              <div style="font-size:18px;font-weight:700;color:#0f172a;letter-spacing:0.5px;">CRM Central</div>
              <div style="font-size:7.5px;color:#1e3a5f;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-top:1px;">Business Performance Report</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:9px;color:#64748b;">Report Date</div>
            <div style="font-size:11px;font-weight:700;color:#0f172a;">${today}</div>
            <div style="font-size:8px;color:#94a3b8;margin-top:2px;">Prepared by ${user.firstName || ''} ${user.lastName || ''}</div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="background:linear-gradient(135deg,#f0f4ff,#e8f0fe);border:1px solid #c7d9f5;border-radius:6px;padding:14px 16px;margin-bottom:18px;">
          <div style="font-size:10px;font-weight:700;color:#1e3a5f;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Executive Summary</div>
          <div style="font-size:9px;color:#374151;line-height:1.6;">
            This report presents a comprehensive overview of business performance metrics. Total revenue stands at <strong>$${(d.totalRevenue||0).toLocaleString()}</strong> across <strong>${d.totalOpportunities}</strong> active deals with an average deal size of <strong>$${Math.round(d.avgDealSize||0).toLocaleString()}</strong>. The customer base includes <strong>${d.totalCustomers}</strong> accounts and <strong>${d.totalLeads}</strong> leads in the pipeline. Support operations are managing <strong>${d.totalTickets}</strong> tickets with <strong>${d.openTickets}</strong> currently open.
          </div>
        </div>

        <!-- KPI Row -->
        <div style="display:flex;gap:8px;margin-bottom:18px;">
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;text-align:center;border-top:3px solid #3b82f6;">
            <div style="font-size:18px;font-weight:700;color:#3b82f6;">$${(d.totalRevenue||0).toLocaleString()}</div>
            <div style="font-size:7.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;">Revenue</div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;text-align:center;border-top:3px solid #22c55e;">
            <div style="font-size:18px;font-weight:700;color:#22c55e;">${d.totalCustomers}</div>
            <div style="font-size:7.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;">Customers</div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;text-align:center;border-top:3px solid #f59e0b;">
            <div style="font-size:18px;font-weight:700;color:#f59e0b;">${d.totalOpportunities}</div>
            <div style="font-size:7.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;">Deals</div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;text-align:center;border-top:3px solid #8b5cf6;">
            <div style="font-size:18px;font-weight:700;color:#8b5cf6;">${d.totalLeads}</div>
            <div style="font-size:7.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;">Leads</div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;text-align:center;border-top:3px solid #ef4444;">
            <div style="font-size:18px;font-weight:700;color:#ef4444;">${d.openTickets}/${d.totalTickets}</div>
            <div style="font-size:7.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;">Open Tickets</div>
          </div>
        </div>

        <!-- Two column section -->
        <div style="display:flex;gap:16px;margin-bottom:18px;">
          <!-- Pipeline Chart -->
          <div style="flex:1.2;border:1px solid #e2e8f0;border-radius:6px;padding:14px;">
            <div style="font-size:10px;font-weight:700;color:#0f172a;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.8px;">Sales Pipeline</div>
            ${pipelineChartHtml}
          </div>
          <!-- Lead Sources -->
          <div style="flex:0.8;border:1px solid #e2e8f0;border-radius:6px;padding:14px;">
            <div style="font-size:10px;font-weight:700;color:#0f172a;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.8px;">Lead Sources</div>
            ${leadSourceHtml || '<div style="font-size:9px;color:#94a3b8;">No lead source data</div>'}
          </div>
        </div>

        <!-- Pipeline Table -->
        <div style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;margin-bottom:18px;">
          <div style="font-size:10px;font-weight:700;color:#0f172a;padding:10px 14px;background:#f8fafc;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #e2e8f0;">Pipeline Detail</div>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f8fafc;">
              <th style="padding:7px 14px;text-align:left;font-size:8px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Stage</th>
              <th style="padding:7px 14px;text-align:right;font-size:8px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Deals</th>
              <th style="padding:7px 14px;text-align:right;font-size:8px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Total Value</th>
              <th style="padding:7px 14px;text-align:right;font-size:8px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Avg Deal</th>
              <th style="padding:7px 14px;text-align:right;font-size:8px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Share</th>
            </tr>
            ${pipelineEntries.map(([s, v]: [string, any], i: number) => `
              <tr style="background:${i % 2 === 0 ? 'white' : '#fafbfc'};">
                <td style="padding:7px 14px;font-size:9px;border-bottom:1px solid #f1f5f9;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${stageColors[s]||'#64748b'};margin-right:6px;vertical-align:middle;"></span>
                  ${s.replace('_',' ')}
                </td>
                <td style="padding:7px 14px;font-size:9px;text-align:right;border-bottom:1px solid #f1f5f9;">${v.count||0}</td>
                <td style="padding:7px 14px;font-size:9px;text-align:right;font-weight:600;border-bottom:1px solid #f1f5f9;">$${(v.amount||0).toLocaleString()}</td>
                <td style="padding:7px 14px;font-size:9px;text-align:right;border-bottom:1px solid #f1f5f9;">$${v.count ? Math.round(v.amount/v.count).toLocaleString() : '0'}</td>
                <td style="padding:7px 14px;font-size:9px;text-align:right;border-bottom:1px solid #f1f5f9;">${Math.round(((v.amount||0)/maxAmount)*100)}%</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Operations Row -->
        <div style="display:flex;gap:8px;margin-bottom:18px;">
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;">
            <div style="font-size:9px;font-weight:700;color:#0f172a;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;">Support</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Total Tickets</span><span style="font-size:9px;font-weight:600;">${d.totalTickets}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Open</span><span style="font-size:9px;font-weight:600;color:#ef4444;">${d.openTickets}</span></div>
            <div style="display:flex;justify-content:space-between;"><span style="font-size:8.5px;color:#64748b;">Resolution Rate</span><span style="font-size:9px;font-weight:600;color:#22c55e;">${d.totalTickets ? Math.round(((d.totalTickets - d.openTickets) / d.totalTickets) * 100) : 0}%</span></div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;">
            <div style="font-size:9px;font-weight:700;color:#0f172a;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;">Productivity</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Total Tasks</span><span style="font-size:9px;font-weight:600;">${d.totalTasks}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Completed</span><span style="font-size:9px;font-weight:600;color:#22c55e;">${d.completedTasks}</span></div>
            <div style="display:flex;justify-content:space-between;"><span style="font-size:8.5px;color:#64748b;">Completion Rate</span><span style="font-size:9px;font-weight:600;color:#3b82f6;">${d.totalTasks ? Math.round((d.completedTasks / d.totalTasks) * 100) : 0}%</span></div>
          </div>
          <div style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:12px;">
            <div style="font-size:9px;font-weight:700;color:#0f172a;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.8px;">Marketing</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Campaigns</span><span style="font-size:9px;font-weight:600;">${d.totalCampaigns}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:8.5px;color:#64748b;">Activities</span><span style="font-size:9px;font-weight:600;">${d.totalActivities}</span></div>
            <div style="display:flex;justify-content:space-between;"><span style="font-size:8.5px;color:#64748b;">Contacts</span><span style="font-size:9px;font-weight:600;">${d.totalContacts}</span></div>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top:2px solid #1e3a5f;padding-top:10px;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="8" fill="#1e3a5f"/><circle cx="16" cy="16" r="3" fill="white"/><circle cx="16" cy="8" r="2" fill="white" opacity=".7"/><circle cx="16" cy="24" r="2" fill="white" opacity=".7"/><circle cx="8" cy="12" r="2" fill="white" opacity=".7"/><circle cx="24" cy="12" r="2" fill="white" opacity=".7"/></svg>
            <span style="font-size:8px;color:#475569;font-weight:600;">CRM Central</span>
            <span style="font-size:7px;color:#94a3b8;">Enterprise CRM Platform</span>
          </div>
          <div style="font-size:7px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Confidential</div>
          <div style="font-size:7px;color:#94a3b8;">${today} &mdash; Page 1 of 1</div>
        </div>
      </div>
    `;

    document.body.appendChild(reportDiv);

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(reportDiv, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff', logging: false }).then(canvas => {
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const imgData = canvas.toDataURL('image/jpeg', 0.85);
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, 297));
          pdf.save('CRM-Central-Report-' + new Date().toISOString().slice(0, 10) + '.pdf');
          document.body.removeChild(reportDiv);
          this.exporting = false;
        });
      });
    });
  }
}
