import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-lead-list', standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Leads</h1>
        <div class="actions">
          <div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search Leads..." [(ngModel)]="searchQuery" (keyup.enter)="search()"></div>
          <button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Lead</button>
        </div>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{ r.firstName }} {{ r.lastName }}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let r">{{ r.email }}</td></ng-container>
          <ng-container matColumnDef="company"><th mat-header-cell *matHeaderCellDef>Company</th><td mat-cell *matCellDef="let r">{{ r.company }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge new">{{ r.status }}</span></td></ng-container>
          <ng-container matColumnDef="score"><th mat-header-cell *matHeaderCellDef>Score</th><td mat-cell *matCellDef="let r">{{ r.score }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="rowMenu"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #rowMenu="matMenu">
              <button mat-menu-item><mat-icon>visibility</mat-icon> View</button>
              <button mat-menu-item (click)="deleteItem(r.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length === 0" class="empty-state"><mat-icon class="empty-icon">person_add</mat-icon><h3>No Leads found</h3></div>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class LeadListComponent implements OnInit {
  items: any[] = []; displayedColumns = ['name','email','company','status','score','actions'];
  loading = true; totalElements = 0; page = 0; searchQuery = '';
  constructor(private api: ApiService, private notify: NotificationService) {}
  ngOnInit() { this.loadData(); }
  loadData() { this.loading = true; this.api.getPage('leads', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.totalElements = r.data?.totalElements||0; this.loading = false; }, error: () => { this.items = []; this.loading = false; }}); }
  search() { if (!this.searchQuery) { this.loadData(); return; } this.api.getPage('leads/search', 0, 20, { q: this.searchQuery }).subscribe({ next: r => { this.items = r.data?.content||[]; this.totalElements = r.data?.totalElements||0; }}); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.loadData(); }
  deleteItem(id: string) { if (confirm('Are you sure?')) { this.api.delete('leads/' + id).subscribe({ next: () => { this.notify.success('Deleted'); this.loadData(); }}); }}
}
