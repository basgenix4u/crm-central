import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-pipeline-board', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, DragDropModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sales Pipeline</h1>
        <div class="actions"><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Opportunity</button></div>
      </div>

      <!-- Pipeline Metrics -->
      <div class="stats-grid" style="margin-bottom:24px;">
        <div class="stat-card">
          <div class="stat-icon" style="background:#4caf50;"><mat-icon>attach_money</mat-icon></div>
          <div class="stat-info"><div class="stat-value">\${{ totalRevenue | number }}</div><div class="stat-label">Total Pipeline Value</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#1976d2;"><mat-icon>trending_up</mat-icon></div>
          <div class="stat-info"><div class="stat-value">{{ totalDeals }}</div><div class="stat-label">Active Deals</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#ff9800;"><mat-icon>speed</mat-icon></div>
          <div class="stat-info"><div class="stat-value">\${{ avgDealSize | number:'1.0-0' }}</div><div class="stat-label">Avg Deal Size</div></div>
        </div>
      </div>

      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>

      <div class="pipeline-board" *ngIf="!loading">
        <div class="pipeline-column" *ngFor="let stage of stages">
          <div class="column-header">
            <span>{{ stage.label }}</span>
            <span class="count">{{ getStageItems(stage.value).length }}</span>
          </div>
          <div cdkDropList [cdkDropListData]="stage.value" (cdkDropListDropped)="drop($event)">
            <div class="pipeline-card" *ngFor="let opp of getStageItems(stage.value)" cdkDrag>
              <div class="deal-name">{{ opp.name }}</div>
              <div class="deal-company">{{ opp.customer?.company || 'No company' }}</div>
              <div class="deal-amount">\${{ opp.amount | number }}</div>
              <div style="display:flex;justify-content:space-between;margin-top:8px;">
                <small style="color:#999;">{{ opp.probability }}% likely</small>
                <small style="color:#999;">{{ opp.expectedCloseDate }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.pipeline-board { display:flex; gap:16px; overflow-x:auto; padding-bottom:16px; } .pipeline-column { min-width:280px; background:#f8f9fa; border-radius:12px; padding:16px; flex-shrink:0; }
    .column-header { font-weight:600; font-size:14px; margin-bottom:12px; display:flex; justify-content:space-between; .count { background:var(--primary); color:white; border-radius:12px; padding:2px 10px; font-size:12px; } }
    .pipeline-card { background:white; border-radius:8px; padding:14px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:grab; .deal-name { font-weight:600; } .deal-company { font-size:13px; color:#666; } .deal-amount { font-size:18px; font-weight:700; color:var(--primary); margin-top:8px; } }
    .cdk-drag-preview { box-shadow: 0 4px 20px rgba(0,0,0,0.2); border-radius: 8px; } .cdk-drag-placeholder { opacity: 0.3; }`]
})
export class PipelineBoardComponent implements OnInit {
  stages = [
    { label: 'Prospect', value: 'PROSPECT' },
    { label: 'Qualified', value: 'QUALIFIED' },
    { label: 'Proposal Sent', value: 'PROPOSAL_SENT' },
    { label: 'Negotiation', value: 'NEGOTIATION' },
    { label: 'Won', value: 'WON' },
    { label: 'Lost', value: 'LOST' }
  ];
  opportunities: any[] = [];
  loading = true;
  totalRevenue = 0; totalDeals = 0; avgDealSize = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPage('opportunities', 0, 100).subscribe({
      next: (res) => {
        this.opportunities = res.data?.content || [];
        this.totalDeals = this.opportunities.length;
        this.totalRevenue = this.opportunities.reduce((sum, o) => sum + (o.amount || 0), 0);
        this.avgDealSize = this.totalDeals > 0 ? this.totalRevenue / this.totalDeals : 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getStageItems(stage: string) { return this.opportunities.filter(o => o.stage === stage); }

  drop(event: CdkDragDrop<string>) {
    if (event.previousContainer !== event.container) {
      const item = event.item.data;
      if (item) {
        this.api.patch(`opportunities/${item.id}/stage?stage=${event.container.data}`).subscribe();
      }
    }
  }
}
