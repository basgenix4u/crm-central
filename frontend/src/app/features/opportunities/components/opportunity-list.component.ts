import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-opportunities-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Opportunities</h1>
        <div class="actions">
          <div class="search-bar">
            <mat-icon>search</mat-icon>
            <input placeholder="Search Opportunities..." [(ngModel)]="searchQuery" (keyup.enter)="search()">
          </div>
          <button mat-raised-button color="primary"><mat-icon>add</mat-icon> New</button>
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 48px;"><mat-spinner diameter="40" style="margin: 0 auto;"></mat-spinner></div>

      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{ r.name }}</td></ng-container>
          <ng-container matColumnDef="stage"><th mat-header-cell *matHeaderCellDef>Stage</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.stage?.toLowerCase()">{{ r.stage }}</span></td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let r">\${{ r.amount | number }}</td></ng-container>
          <ng-container matColumnDef="probability"><th mat-header-cell *matHeaderCellDef>Probability</th><td mat-cell *matCellDef="let r">{{ r.probability }}%</td></ng-container>
          <ng-container matColumnDef="closeDate"><th mat-header-cell *matHeaderCellDef>Close Date</th><td mat-cell *matCellDef="let r">{{ r.expectedCloseDate }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="delete(r.id)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="pageSize" [pageSizeOptions]="[10, 20, 50]" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length === 0" class="empty-state"><mat-icon class="empty-icon">trending_up</mat-icon><h3>No Opportunities found</h3><p>Get started by creating your first record.</p></div>
      </div>
    </div>
  `,
  styles: [`.table-row { cursor: pointer; &:hover { background: #f5f7fa; } } .data-table { width: 100%; }`]
})
export class OpportunityListComponent implements OnInit {
  items: any[] = [];
  displayedColumns = ['name','stage','amount','probability','closeDate','actions'];
  loading = true;
  totalElements = 0;
  pageSize = 20;
  page = 0;
  searchQuery = '';

  constructor(private api: ApiService, private notify: NotificationService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.api.getPage('opportunities', this.page, this.pageSize).subscribe({
      next: (res) => { this.items = res.data?.content || []; this.totalElements = res.data?.totalElements || 0; this.loading = false; },
      error: () => { this.items = []; this.loading = false; }
    });
  }

  search() {
    if (!this.searchQuery) { this.loadData(); return; }
    this.api.getPage('opportunities/search', 0, this.pageSize, { q: this.searchQuery }).subscribe({
      next: (res) => { this.items = res.data?.content || []; this.totalElements = res.data?.totalElements || 0; },
      error: () => { this.items = []; }
    });
  }

  onPage(event: PageEvent) { this.page = event.pageIndex; this.pageSize = event.pageSize; this.loadData(); }

  delete(id: string) {
    if (confirm('Are you sure?')) {
      this.api.delete('opportunities/' + id).subscribe({ next: () => { this.notify.success('Deleted successfully'); this.loadData(); } });
    }
  }
}
