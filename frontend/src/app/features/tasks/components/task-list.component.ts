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
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatProgressSpinnerModule, MatMenuModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Tasks</h1><div class="actions"><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Task</button></div></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>Title</th><td mat-cell *matCellDef="let r">{{ r.title }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.status?.toLowerCase()">{{ r.status }}</span></td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.priority }}</span></td></ng-container>
          <ng-container matColumnDef="dueDate"><th mat-header-cell *matHeaderCellDef>Due Date</th><td mat-cell *matCellDef="let r">{{ r.dueDate | date:"mediumDate" }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button><mat-icon>more_vert</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalElements" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.data-table { width: 100%; }`]
})
export class TaskListComponent implements OnInit {
  items: any[] = []; displayedColumns = ['title','status','priority','dueDate','actions'];
  loading = true; totalElements = 0; page = 0;
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('tasks', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.totalElements = r.data?.totalElements||0; this.loading = false; }, error: () => { this.loading = false; }}); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
}
