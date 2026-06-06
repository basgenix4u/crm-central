import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-ticket-list', standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Support Tickets</h1><div class="actions"><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Ticket</button></div></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="ticketNumber"><th mat-header-cell *matHeaderCellDef>Ticket #</th><td mat-cell *matCellDef="let r"><a [routerLink]="['/tickets', r.id]">{{ r.ticketNumber }}</a></td></ng-container>
          <ng-container matColumnDef="subject"><th mat-header-cell *matHeaderCellDef>Subject</th><td mat-cell *matCellDef="let r">{{ r.subject }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.status?.toLowerCase().replace('_','-')">{{ r.status }}</span></td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.priority }}</span></td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let r">{{ r.category }}</td></ng-container>
          <ng-container matColumnDef="createdAt"><th mat-header-cell *matHeaderCellDef>Created</th><td mat-cell *matCellDef="let r">{{ r.createdAt | date:"mediumDate" }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.data-table { width: 100%; } a { color: #1976d2; text-decoration: none; font-weight: 600; }`]
})
export class TicketListComponent implements OnInit {
  items: any[] = []; displayedColumns = ['ticketNumber','subject','status','priority','category','createdAt'];
  loading = true; totalElements = 0; page = 0;
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('tickets', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.totalElements = r.data?.totalElements||0; this.loading = false; }, error: () => { this.loading = false; }}); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
}
