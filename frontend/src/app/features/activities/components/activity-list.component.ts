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
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Activities</h1>
        <div class="actions">
          <div class="search-bar">
            <mat-icon>search</mat-icon>
            <input placeholder="Search Activities..." [(ngModel)]="searchQuery" (keyup.enter)="search()">
          </div>
          <button mat-raised-button color="primary"><mat-icon>add</mat-icon> New</button>
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 48px;"><mat-spinner diameter="40" style="margin: 0 auto;"></mat-spinner></div>

      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="subject"><th mat-header-cell *matHeaderCellDef>Subject</th><td mat-cell *matCellDef="let r">{{ r.subject }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.type }}</span></td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{ r.status }}</td></ng-container>
          <ng-container matColumnDef="startTime"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.startTime | date:"short" }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="delete(r.id)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="pageSize" [pageSizeOptions]="[10, 20, 50]" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length === 0" class="empty-state"><mat-icon class="empty-icon">event_note</mat-icon><h3>No Activities found</h3><p>Get started by creating your first record.</p></div>
      </div>
    </div>
  `,
  styles: [`.table-row { cursor: pointer; &:hover { background: #f5f7fa; } } .data-table { width: 100%; }`]
})
export class ActivityListComponent implements OnInit {
  items: any[] = [];
  displayedColumns = ['subject','type','status','startTime','actions'];
  loading = true;
  totalElements = 0;
  pageSize = 20;
  page = 0;
  searchQuery = '';

  constructor(private api: ApiService, private notify: NotificationService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.api.getPage('activities', this.page, this.pageSize).subscribe({
      next: (res) => { this.items = res.data?.content || []; this.totalElements = res.data?.totalElements || 0; this.loading = false; },
      error: () => { this.items = []; this.loading = false; }
    });
  }

  search() {
    if (!this.searchQuery) { this.loadData(); return; }
    this.api.getPage('activities/search', 0, this.pageSize, { q: this.searchQuery }).subscribe({
      next: (res) => { this.items = res.data?.content || []; this.totalElements = res.data?.totalElements || 0; },
      error: () => { this.items = []; }
    });
  }

  onPage(event: PageEvent) { this.page = event.pageIndex; this.pageSize = event.pageSize; this.loadData(); }

  delete(id: string) {
    if (confirm('Are you sure?')) {
      this.api.delete('activities/' + id).subscribe({ next: () => { this.notify.success('Deleted successfully'); this.loadData(); } });
    }
  }
}
