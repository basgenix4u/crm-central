import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-opportunity-list', standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Opportunities</h1><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Opportunity</button></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{ r.name }}</td></ng-container>
          <ng-container matColumnDef="stage"><th mat-header-cell *matHeaderCellDef>Stage</th><td mat-cell *matCellDef="let r"><span class="status-badge qualified">{{ r.stage }}</span></td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let r"><span>$</span>{{ r.amount | number }}</td></ng-container>
          <ng-container matColumnDef="probability"><th mat-header-cell *matHeaderCellDef>Probability</th><td mat-cell *matCellDef="let r">{{ r.probability }}%</td></ng-container>
          <ng-container matColumnDef="closeDate"><th mat-header-cell *matHeaderCellDef>Close Date</th><td mat-cell *matCellDef="let r">{{ r.expectedCloseDate }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="deleteItem(r.id)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class OpportunityListComponent implements OnInit {
  items: any[] = []; displayedColumns = ['name','stage','amount','probability','closeDate','actions'];
  loading = true; totalElements = 0; page = 0;
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('opportunities', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.totalElements = r.data?.totalElements||0; this.loading = false; }, error: () => this.loading = false }); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
  deleteItem(id: string) { if (confirm('Sure?')) this.api.delete('opportunities/' + id).subscribe({ next: () => this.load() }); }
}
