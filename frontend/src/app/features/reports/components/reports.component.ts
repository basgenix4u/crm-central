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
          <mat-icon>{{ exporting ? 'hourglass_empty' : 'picture_as_pdf' }}</mat-icon> {{ exporting ? 'Generating PDF...' : 'Export PDF Report' }}
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
      next: r => { this.data = r.data; if (this.data?.pipelineMetrics) { this.maxPipeline = Math.max(...Object.values(this.data.pipelineMetrics).map((v: any) => v.amount || 0), 1); } }
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

    const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="56" height="56"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg1)"/><circle cx="16" cy="16" r="4" fill="white"/><circle cx="16" cy="7" r="2.5" fill="white" opacity=".9"/><circle cx="16" cy="25" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="12" r="2.5" fill="white" opacity=".9"/><circle cx="7" cy="20" r="2.5" fill="white" opacity=".9"/><circle cx="25" cy="20" r="2.5" fill="white" opacity=".9"/><line x1="16" y1="12" x2="16" y2="9.5" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="16" y1="20" x2="16" y2="22.5" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="12.5" y1="14" x2="9.2" y2="12.8" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="19.5" y1="14" x2="22.8" y2="12.8" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="12.5" y1="18" x2="9.2" y2="19.2" stroke="white" stroke-width="1.2" opacity=".7"/><line x1="19.5" y1="18" x2="22.8" y2="19.2" stroke="white" stroke-width="1.2" opacity=".7"/></svg>`;
    const logoSmall = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16"><defs><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg2)"/><circle cx="16" cy="16" r="4" fill="white"/><circle cx="16" cy="7" r="2.5" fill="white" opacity=".8"/><circle cx="16" cy="25" r="2.5" fill="white" opacity=".8"/><circle cx="7" cy="12" r="2.5" fill="white" opacity=".8"/><circle cx="25" cy="12" r="2.5" fill="white" opacity=".8"/></svg>`;
    const wmLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" opacity="0.04"><rect width="32" height="32" rx="8" fill="#1e3a5f"/><circle cx="16" cy="16" r="4" fill="white"/><circle cx="16" cy="7" r="2.5" fill="white"/><circle cx="16" cy="25" r="2.5" fill="white"/><circle cx="7" cy="12" r="2.5" fill="white"/><circle cx="25" cy="12" r="2.5" fill="white"/><circle cx="7" cy="20" r="2.5" fill="white"/><circle cx="25" cy="20" r="2.5" fill="white"/></svg>`;

    // Watermark grid
    let wm = '';
    for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) wm += `<div style="position:absolute;top:${80+r*88}px;left:${30+c*74}px;">${wmLogo}</div>`;

    // Pipeline bars
    const pipes = Object.entries(d.pipelineMetrics || {});
    const mx = Math.max(...pipes.map(([,v]: [string,any]) => v.amount||0), 1);
    const sc: any = {PROSPECT:'#94a3b8',QUALIFIED:'#3b82f6',PROPOSAL_SENT:'#8b5cf6',NEGOTIATION:'#f59e0b',WON:'#22c55e',LOST:'#ef4444'};
    const pipeHtml = pipes.map(([s,v]: [string,any]) => {
      const p = Math.max(Math.round(((v.amount||0)/mx)*100), 3);
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <div style="width:80px;font-size:8px;color:#475569;text-align:right;font-weight:500;">${s.replace(/_/g,' ')}</div>
        <div style="flex:1;height:18px;background:#f1f5f9;border-radius:12px;overflow:hidden;">
          <div style="height:100%;width:${p}%;background:linear-gradient(90deg,${sc[s]||'#64748b'},${sc[s]||'#64748b'}dd);border-radius:12px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;">
            <span style="font-size:7px;color:white;font-weight:700;">${v.count}</span>
          </div>
        </div>
        <div style="width:60px;font-size:7.5px;color:#334155;font-weight:600;">$${(v.amount||0).toLocaleString()}</div>
      </div>`;
    }).join('');

    // Lead source mini bars
    const leads = Object.entries(d.leadsBySource || {});
    const tl = leads.reduce((s,[,v]) => s + (v as number), 0) || 1;
    const lc = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#64748b'];
    const leadHtml = leads.slice(0,6).map(([s,v],i) => {
      const p = Math.round(((v as number)/tl)*100);
      return `<div style="margin-bottom:5px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="font-size:7.5px;color:#475569;font-weight:500;">${s.replace(/_/g,' ')}</span><span style="font-size:7.5px;font-weight:700;color:#1e293b;">${p}%</span></div>
        <div style="height:6px;background:#f1f5f9;border-radius:6px;overflow:hidden;"><div style="height:100%;width:${p}%;background:${lc[i%lc.length]};border-radius:6px;"></div></div>
      </div>`;
    }).join('');

    // Ticket donut segments (CSS only)
    const resolved = d.totalTickets ? d.totalTickets - d.openTickets : 0;
    const resolvePct = d.totalTickets ? Math.round((resolved/d.totalTickets)*100) : 0;
    const taskPct = d.totalTasks ? Math.round((d.completedTasks/d.totalTasks)*100) : 0;

    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;background:white;font-family:Inter,Segoe UI,system-ui,sans-serif;color:#1e293b;font-size:10px;overflow:hidden;';
    el.innerHTML = `
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;">${wm}</div>
      <div style="position:relative;z-index:1;display:flex;flex-direction:column;height:1123px;">

        <!-- HEADER with curved colored edge -->
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#2563eb 100%);padding:34px 40px 30px;position:relative;overflow:hidden;">
          <div style="position:absolute;bottom:-30px;right:-20px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.03);"></div>
          <div style="position:absolute;top:-40px;right:100px;width:150px;height:150px;border-radius:50%;background:rgba(59,130,246,0.1);"></div>
          <div style="position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#22c55e);"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:14px;">
              ${logo}
              <div>
                <div style="font-size:28px;font-weight:800;color:white;letter-spacing:-0.5px;">CRM Central</div>
                <div style="font-size:10px;color:rgba(255,255,255,0.6);font-weight:500;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">Business Performance Report</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:9px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">Report Date</div>
              <div style="font-size:16px;font-weight:700;color:white;margin-top:2px;">${today}</div>
              <div style="font-size:8px;color:rgba(255,255,255,0.4);margin-top:3px;">Prepared by ${user.firstName || ''} ${user.lastName || ''}</div>
            </div>
          </div>
        </div>

        <div style="padding:16px 40px 16px;flex:1;">

          <!-- Executive Summary -->
          <div style="background:linear-gradient(135deg,#f8fafc,#eef2ff);border-left:4px solid #3b82f6;border-radius:0 10px 10px 0;padding:14px 18px;margin-bottom:14px;">
            <div style="font-size:9px;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Executive Summary</div>
            <div style="font-size:9px;color:#374151;line-height:1.7;">
              This report provides a snapshot of organizational performance across all business functions. Total revenue is <b>$${(d.totalRevenue||0).toLocaleString()}</b> from <b>${d.totalOpportunities}</b> active opportunities averaging <b>$${Math.round(d.avgDealSize||0).toLocaleString()}</b> per deal. The customer portfolio comprises <b>${d.totalCustomers}</b> accounts with <b>${d.totalLeads}</b> leads under management. Support operations maintain a <b>${resolvePct}%</b> resolution rate across <b>${d.totalTickets}</b> tickets.
            </div>
          </div>

          <!-- KPI Cards with rounded corners and gradient borders -->
          <div style="display:flex;gap:8px;margin-bottom:14px;">
            ${[
              {v:'$'+(d.totalRevenue||0).toLocaleString(), l:'Total Revenue', c:'#3b82f6', g:'#dbeafe'},
              {v:String(d.totalCustomers), l:'Customers', c:'#22c55e', g:'#dcfce7'},
              {v:String(d.totalOpportunities), l:'Active Deals', c:'#f59e0b', g:'#fef3c7'},
              {v:String(d.totalLeads), l:'Pipeline Leads', c:'#8b5cf6', g:'#ede9fe'},
              {v:d.openTickets+'/'+d.totalTickets, l:'Open Tickets', c:'#ef4444', g:'#fee2e2'},
            ].map(k => `<div style="flex:1;border-radius:10px;overflow:hidden;border:1px solid ${k.c}22;background:linear-gradient(180deg,${k.g},white);">
              <div style="height:3px;background:${k.c};"></div>
              <div style="padding:12px 10px;text-align:center;">
                <div style="font-size:18px;font-weight:800;color:${k.c};letter-spacing:-0.5px;">${k.v}</div>
                <div style="font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:3px;font-weight:600;">${k.l}</div>
              </div>
            </div>`).join('')}
          </div>

          <!-- Charts Row -->
          <div style="display:flex;gap:14px;margin-bottom:12px;">
            <div style="flex:1.3;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;">
              <div style="font-size:9px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <div style="width:3px;height:12px;background:#3b82f6;border-radius:2px;"></div> Sales Pipeline
              </div>
              ${pipeHtml || '<div style="font-size:9px;color:#94a3b8;">No pipeline data</div>'}
            </div>
            <div style="flex:0.7;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;">
              <div style="font-size:9px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <div style="width:3px;height:12px;background:#8b5cf6;border-radius:2px;"></div> Lead Sources
              </div>
              ${leadHtml || '<div style="font-size:9px;color:#94a3b8;">No data</div>'}
            </div>
          </div>

          <!-- Pipeline Detail Table with rounded corners -->
          <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:12px;">
            <div style="background:linear-gradient(90deg,#f8fafc,#eef2ff);padding:10px 16px;border-bottom:1px solid #e2e8f0;">
              <div style="font-size:9px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:6px;">
                <div style="width:3px;height:12px;background:#f59e0b;border-radius:2px;"></div> Detailed Pipeline Analysis
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><th style="padding:8px 16px;text-align:left;font-size:7.5px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;background:#fafbfc;">Stage</th><th style="padding:8px 12px;text-align:center;font-size:7.5px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;background:#fafbfc;">Deals</th><th style="padding:8px 12px;text-align:right;font-size:7.5px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;background:#fafbfc;">Value</th><th style="padding:8px 12px;text-align:right;font-size:7.5px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;background:#fafbfc;">Avg</th><th style="padding:8px 12px;text-align:right;font-size:7.5px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;background:#fafbfc;">Share</th></tr>
              ${pipes.map(([s,v]: [string,any], i: number) => `<tr style="background:${i%2===0?'white':'#fafbfc'};">
                <td style="padding:8px 16px;font-size:8.5px;border-bottom:1px solid #f1f5f9;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:10px;height:10px;border-radius:3px;background:${sc[s]||'#64748b'};"></div>${s.replace(/_/g,' ')}</div></td>
                <td style="padding:8px 12px;font-size:9px;text-align:center;border-bottom:1px solid #f1f5f9;font-weight:600;">${v.count||0}</td>
                <td style="padding:8px 12px;font-size:9px;text-align:right;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a;">$${(v.amount||0).toLocaleString()}</td>
                <td style="padding:8px 12px;font-size:8.5px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;">$${v.count?Math.round(v.amount/v.count).toLocaleString():'0'}</td>
                <td style="padding:8px 12px;font-size:8.5px;text-align:right;border-bottom:1px solid #f1f5f9;"><div style="display:inline-block;background:${sc[s]||'#64748b'}18;color:${sc[s]||'#64748b'};padding:2px 8px;border-radius:10px;font-weight:600;">${Math.round(((v.amount||0)/mx)*100)}%</div></td>
              </tr>`).join('')}
            </table>
          </div>

          <!-- Metrics Ring Cards -->
          <div style="display:flex;gap:10px;margin-bottom:12px;">
            <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:14px;text-align:center;">
              <div style="width:60px;height:60px;border-radius:50%;border:4px solid #f1f5f9;margin:0 auto 8px;position:relative;display:flex;align-items:center;justify-content:center;">
                <div style="position:absolute;inset:0;border-radius:50%;border:4px solid transparent;border-top-color:#22c55e;border-right-color:${resolvePct>50?'#22c55e':'transparent'};transform:rotate(-45deg);"></div>
                <span style="font-size:14px;font-weight:800;color:#22c55e;">${resolvePct}%</span>
              </div>
              <div style="font-size:8px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.8px;">Ticket Resolution</div>
              <div style="font-size:7.5px;color:#64748b;margin-top:2px;">${resolved} of ${d.totalTickets} resolved</div>
            </div>
            <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:14px;text-align:center;">
              <div style="width:60px;height:60px;border-radius:50%;border:4px solid #f1f5f9;margin:0 auto 8px;position:relative;display:flex;align-items:center;justify-content:center;">
                <div style="position:absolute;inset:0;border-radius:50%;border:4px solid transparent;border-top-color:#3b82f6;border-right-color:${taskPct>50?'#3b82f6':'transparent'};transform:rotate(-45deg);"></div>
                <span style="font-size:14px;font-weight:800;color:#3b82f6;">${taskPct}%</span>
              </div>
              <div style="font-size:8px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.8px;">Task Completion</div>
              <div style="font-size:7.5px;color:#64748b;margin-top:2px;">${d.completedTasks} of ${d.totalTasks} done</div>
            </div>
            <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:14px;text-align:center;">
              <div style="width:60px;height:60px;border-radius:50%;border:4px solid #f1f5f9;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:14px;font-weight:800;color:#f59e0b;">${d.totalCampaigns}</span>
              </div>
              <div style="font-size:8px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.8px;">Active Campaigns</div>
              <div style="font-size:7.5px;color:#64748b;margin-top:2px;">${d.totalActivities} activities logged</div>
            </div>
          </div>
        </div>

        <!-- FOOTER with curved colored edge -->
        <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:14px 40px;position:relative;">
          <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#22c55e,#3b82f6,#8b5cf6,#f59e0b);"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              ${logoSmall}
              <div><span style="font-size:9px;color:white;font-weight:700;">CRM Central</span><span style="font-size:7.5px;color:rgba(255,255,255,0.4);margin-left:8px;">Enterprise CRM Platform</span></div>
            </div>
            <div style="font-size:7px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:2px;font-weight:600;">Confidential Document</div>
            <div style="font-size:7.5px;color:rgba(255,255,255,0.4);">${today}</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(el);
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(el, { scale: 1.8, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 794, windowHeight: 1123, imageTimeout: 0 }).then(canvas => {
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
          const w = 210, h = (canvas.height * w) / canvas.width;
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
          pdf.save('CRM-Central-Report-' + new Date().toISOString().slice(0,10) + '.pdf');
          document.body.removeChild(el);
          this.exporting = false;
        });
      });
    });
  }
}
