import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { OpportunityFormComponent } from '../../../features/opportunities/components/opportunity-form.component';

@Component({
  selector: 'app-pipeline-board', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatMenuModule, MatDialogModule, DragDropModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sales Pipeline</h1>
        <button mat-raised-button color="primary" (click)="newOpp()"><mat-icon>add</mat-icon> New Opportunity</button>
      </div>
      <div class="stats-grid" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>attach_money</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ totalRevenue | number }}</div><div class="stat-label">Pipeline Value</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>trending_up</mat-icon></div><div class="stat-info"><div class="stat-value">{{ totalDeals }}</div><div class="stat-label">Active Deals</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>speed</mat-icon></div><div class="stat-info"><div class="stat-value"><span>$</span>{{ avgDealSize | number:'1.0-0' }}</div><div class="stat-label">Avg Deal Size</div></div></div>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="pipeline-board" *ngIf="!loading">
        <div class="pipeline-column" *ngFor="let stage of stages" cdkDropList [cdkDropListData]="stage.value" (cdkDropListDropped)="drop($event, stage.value)" [id]="stage.value" [cdkDropListConnectedTo]="stageIds">
          <div class="column-header"><span>{{ stage.label }}</span><span class="count">{{ getStageItems(stage.value).length }}</span></div>
          <div class="pipeline-card" *ngFor="let opp of getStageItems(stage.value)" cdkDrag [cdkDragData]="opp">
            <div style="display:flex;justify-content:space-between;align-items:start;">
              <div class="deal-name">{{ opp.name }}</div>
              <button mat-icon-button style="margin:-8px -8px 0 0;" [matMenuTriggerFor]="m"><mat-icon style="font-size:18px;">more_vert</mat-icon></button>
              <mat-menu #m="matMenu">
                <button mat-menu-item (click)="editOpp(opp)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="delOpp(opp.id)"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <div class="deal-amount"><span>$</span>{{ opp.amount | number }}</div>
            <div style="display:flex;justify-content:space-between;margin-top:8px;">
              <small style="color:#999;">{{ opp.probability }}% likely</small>
              <small style="color:#999;">{{ opp.expectedCloseDate }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pipeline-board{display:flex;gap:16px;overflow-x:auto;padding-bottom:16px}
    .pipeline-column{min-width:260px;background:#f8f9fa;border-radius:12px;padding:16px;flex-shrink:0}
    .column-header{font-weight:600;font-size:14px;margin-bottom:12px;display:flex;justify-content:space-between}
    .count{background:#1976d2;color:white;border-radius:12px;padding:2px 10px;font-size:12px}
    .pipeline-card{background:white;border-radius:8px;padding:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.1);cursor:grab}
    .deal-name{font-weight:600;font-size:14px}
    .deal-amount{font-size:18px;font-weight:700;color:#1976d2;margin-top:8px}
    .cdk-drag-preview{box-shadow:0 4px 20px rgba(0,0,0,.2);border-radius:8px}
    .cdk-drag-placeholder{opacity:.3}
    .cdk-drop-list-dragging .pipeline-card:not(.cdk-drag-placeholder){transition:transform 250ms}
  `]
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
  stageIds = ['PROSPECT','QUALIFIED','PROPOSAL_SENT','NEGOTIATION','WON','LOST'];
  opportunities: any[] = [];
  loading = true; totalRevenue = 0; totalDeals = 0; avgDealSize = 0;

  constructor(private api: ApiService, private notify: NotificationService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getPage('opportunities', 0, 200).subscribe({
      next: (res) => {
        this.opportunities = res.data?.content || [];
        this.totalDeals = this.opportunities.length;
        this.totalRevenue = this.opportunities.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
        this.avgDealSize = this.totalDeals > 0 ? this.totalRevenue / this.totalDeals : 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getStageItems(stage: string) { return this.opportunities.filter(o => o.stage === stage); }

  drop(event: CdkDragDrop<string>, targetStage: string) {
    const opp = event.item.data;
    if (opp && opp.stage !== targetStage) {
      this.api.patch(`opportunities/${opp.id}/stage?stage=${targetStage}`).subscribe({
        next: () => { opp.stage = targetStage; this.notify.success(`Moved to ${targetStage.replace('_',' ')}`); },
        error: () => this.notify.error('Failed to update stage')
      });
    }
  }

  newOpp() {
    const ref = this.dialog.open(OpportunityFormComponent, { width: '700px', data: null });
    ref.afterClosed().subscribe(r => {
      if (r) { this.api.post('opportunities', r).subscribe({ next: () => { this.notify.success('Opportunity created'); this.load(); }, error: () => this.notify.error('Failed') }); }
    });
  }

  editOpp(opp: any) {
    const ref = this.dialog.open(OpportunityFormComponent, { width: '700px', data: opp });
    ref.afterClosed().subscribe(r => {
      if (r) { this.api.put('opportunities/' + opp.id, r).subscribe({ next: () => { this.notify.success('Updated'); this.load(); }, error: () => this.notify.error('Failed') }); }
    });
  }

  delOpp(id: string) { if (confirm('Delete?')) this.api.delete('opportunities/' + id).subscribe({ next: () => { this.notify.success('Deleted'); this.load(); } }); }
}
