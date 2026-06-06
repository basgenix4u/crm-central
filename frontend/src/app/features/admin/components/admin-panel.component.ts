import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-admin-panel', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatTableModule, MatChipsModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Admin Control Center</h1></div>
      <mat-tab-group>
        <mat-tab label="Users">
          <div style="padding:24px;">
            <div class="page-header"><h2>User Management</h2><button mat-raised-button color="primary"><mat-icon>person_add</mat-icon> Add User</button></div>
            <div class="card">
              <table mat-table [dataSource]="users" class="data-table" *ngIf="users.length > 0">
                <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let u">{{ u.firstName }} {{ u.lastName }}</td></ng-container>
                <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let u">{{ u.email }}</td></ng-container>
                <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th><td mat-cell *matCellDef="let u"><span class="status-badge">{{ u.role }}</span></td></ng-container>
                <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let u"><span class="status-badge" [ngClass]="u.active ? 'active' : 'closed'">{{ u.active ? 'Active' : 'Inactive' }}</span></td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['name','email','role','status']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name','email','role','status'];"></tr>
              </table>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Audit Logs">
          <div style="padding:24px;">
            <div class="card">
              <table mat-table [dataSource]="auditLogs" class="data-table" *ngIf="auditLogs.length > 0">
                <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let l">{{ l.action }}</td></ng-container>
                <ng-container matColumnDef="user"><th mat-header-cell *matHeaderCellDef>User</th><td mat-cell *matCellDef="let l">{{ l.userName }}</td></ng-container>
                <ng-container matColumnDef="entity"><th mat-header-cell *matHeaderCellDef>Entity</th><td mat-cell *matCellDef="let l">{{ l.entityType }}</td></ng-container>
                <ng-container matColumnDef="timestamp"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let l">{{ l.timestamp | date:'medium' }}</td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['action','user','entity','timestamp']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['action','user','entity','timestamp'];"></tr>
              </table>
              <div *ngIf="auditLogs.length === 0" class="empty-state"><h3>No audit logs yet</h3></div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="System Health">
          <div style="padding:24px;">
            <div class="stats-grid">
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>check_circle</mat-icon></div><div class="stat-info"><div class="stat-value">Healthy</div><div class="stat-label">System Status</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>people</mat-icon></div><div class="stat-info"><div class="stat-value">{{ users.length }}</div><div class="stat-label">Total Users</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>storage</mat-icon></div><div class="stat-info"><div class="stat-value">Active</div><div class="stat-label">Database</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#9c27b0;"><mat-icon>memory</mat-icon></div><div class="stat-info"><div class="stat-value">Active</div><div class="stat-label">Redis Cache</div></div></div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class AdminPanelComponent implements OnInit {
  users: any[] = []; auditLogs: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getPage('users', 0, 50).subscribe({ next: r => this.users = r.data?.content || [] });
    this.api.getPage('audit-logs', 0, 50).subscribe({ next: r => this.auditLogs = r.data?.content || [] });
  }
}
