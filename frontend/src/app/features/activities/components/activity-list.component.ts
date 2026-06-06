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
  selector: 'app-activity-list', standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Activities</h1><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Activity</button></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="subject"><th mat-header-cell *matHeaderCellDef>Subject</th><td mat-cell *matCellDef="let r">{{ r.subject }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.type }}</span></td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{ r.status }}</td></ng-container>
          <ng-container matColumnDef="startTime"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.startTime | date:'short' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="del(r.id)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class ActivityListComponent implements OnInit {
  items: any[] = []; cols = ['subject','type','status','startTime','actions'];
  loading = true; total = 0; page = 0;
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('activities', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.total = r.data?.totalElements||0; this.loading = false; }, error: () => this.loading = false }); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
  del(id: string) { if (confirm('Sure?')) this.api.delete('activities/' + id).subscribe({ next: () => this.load() }); }
}
