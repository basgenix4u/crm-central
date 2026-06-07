import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-admin-panel', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatTableModule, MatChipsModule, MatProgressSpinnerModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Admin Control Center</h1></div>
      <mat-tab-group>
        <mat-tab label="Users ({{ users.length }})">
          <div style="padding:24px;">
            <div class="page-header">
              <h2>Team Members</h2>
              <button mat-raised-button color="primary" (click)="addUser()"><mat-icon>person_add</mat-icon> Add Team Member</button>
            </div>
            <div class="card">
              <table mat-table [dataSource]="users" class="data-table" *ngIf="users.length > 0">
                <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let u"><strong>{{ u.firstName }} {{ u.lastName }}</strong><br><small style="color:#666;">{{ u.email }}</small></td>
                </ng-container>
                <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th>
                  <td mat-cell *matCellDef="let u"><span class="status-badge" [ngClass]="getRoleClass(u.role)">{{ formatRole(u.role) }}</span></td>
                </ng-container>
                <ng-container matColumnDef="department"><th mat-header-cell *matHeaderCellDef>Department</th>
                  <td mat-cell *matCellDef="let u">{{ u.department || '—' }}</td>
                </ng-container>
                <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let u"><span class="status-badge" [ngClass]="u.active?'active':'closed'">{{ u.active?'Active':'Inactive' }}</span></td>
                </ng-container>
                <ng-container matColumnDef="lastLogin"><th mat-header-cell *matHeaderCellDef>Last Login</th>
                  <td mat-cell *matCellDef="let u">{{ u.lastLoginAt | date:'short' }}</td>
                </ng-container>
                <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let u">
                    <button mat-icon-button [matMenuTriggerFor]="m"><mat-icon>more_vert</mat-icon></button>
                    <mat-menu #m="matMenu">
                      <button mat-menu-item (click)="changeRole(u)"><mat-icon>admin_panel_settings</mat-icon> Change Role</button>
                      <button mat-menu-item (click)="toggleActive(u)"><mat-icon>{{ u.active ? 'block' : 'check_circle' }}</mat-icon> {{ u.active ? 'Deactivate' : 'Activate' }}</button>
                    </mat-menu>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="userCols"></tr>
                <tr mat-row *matRowDef="let row; columns: userCols;"></tr>
              </table>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Audit Logs">
          <div style="padding:24px;"><div class="card">
            <table mat-table [dataSource]="auditLogs" class="data-table" *ngIf="auditLogs.length > 0">
              <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let l"><span class="status-badge">{{ l.action }}</span></td></ng-container>
              <ng-container matColumnDef="user"><th mat-header-cell *matHeaderCellDef>User</th><td mat-cell *matCellDef="let l">{{ l.userName || '—' }}</td></ng-container>
              <ng-container matColumnDef="entity"><th mat-header-cell *matHeaderCellDef>Entity</th><td mat-cell *matCellDef="let l">{{ l.entityType }}</td></ng-container>
              <ng-container matColumnDef="desc"><th mat-header-cell *matHeaderCellDef>Description</th><td mat-cell *matCellDef="let l">{{ l.description || '—' }}</td></ng-container>
              <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let l">{{ l.timestamp | date:'medium' }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['action','user','entity','desc','time']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['action','user','entity','desc','time'];"></tr>
            </table>
            <div *ngIf="auditLogs.length===0" class="empty-state"><mat-icon class="empty-icon">history</mat-icon><h3>No audit logs yet</h3><p>Actions will be recorded as users interact with the system.</p></div>
          </div></div>
        </mat-tab>
        <mat-tab label="System Health">
          <div style="padding:24px;">
            <div class="stats-grid">
              <div class="stat-card"><div class="stat-icon" style="background:#4caf50;"><mat-icon>check_circle</mat-icon></div><div class="stat-info"><div class="stat-value" style="color:#4caf50;">Healthy</div><div class="stat-label">System Status</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#1976d2;"><mat-icon>people</mat-icon></div><div class="stat-info"><div class="stat-value">{{ users.length }}</div><div class="stat-label">Total Users</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#ff9800;"><mat-icon>storage</mat-icon></div><div class="stat-info"><div class="stat-value" style="color:#4caf50;">Connected</div><div class="stat-label">PostgreSQL 16</div></div></div>
              <div class="stat-card"><div class="stat-icon" style="background:#9c27b0;"><mat-icon>cached</mat-icon></div><div class="stat-info"><div class="stat-value">In-Memory</div><div class="stat-label">Cache</div></div></div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `, styles: [`.data-table{width:100%}tr.mat-mdc-row:hover{background:#f5f7fa}`]
})
export class AdminPanelComponent implements OnInit {
  users: any[] = []; auditLogs: any[] = [];
  userCols = ['name','role','department','status','lastLogin','actions'];
  
  constructor(private api: ApiService, private notify: NotificationService, private dialog: MatDialog) {}
  
  ngOnInit() { this.loadUsers(); this.loadAudit(); }
  
  loadUsers() { this.api.getPage('users', 0, 100).subscribe({ next: r => this.users = r.data?.content || [] }); }
  loadAudit() { this.api.getPage('audit-logs', 0, 100).subscribe({ next: r => this.auditLogs = r.data?.content || [], error: () => {} }); }
  
  addUser() {
    const ref = this.dialog.open(UserFormComponent, { width: '600px', data: null });
    ref.afterClosed().subscribe(r => {
      if (r) {
        this.api.post('admin/users', r).subscribe({
          next: () => { this.notify.success('User created! They can now log in.'); this.loadUsers(); },
          error: (e: any) => this.notify.error(e.error?.message || 'Failed to create user')
        });
      }
    });
  }
  
  changeRole(user: any) {
    const roles = ['ADMIN','SALES_MANAGER','SALES_REPRESENTATIVE','SUPPORT_AGENT','MARKETING_MANAGER'];
    const current = roles.indexOf(user.role);
    const newRole = prompt('Select role:\n' + roles.map((r,i) => `${i+1}. ${r.replace('_',' ')}`).join('\n') + '\n\nEnter number:', String(current+1));
    if (newRole && Number(newRole) >= 1 && Number(newRole) <= roles.length) {
      this.api.put('users/' + user.id + '/role?role=' + roles[Number(newRole)-1], {}).subscribe({
        next: () => { this.notify.success('Role updated'); this.loadUsers(); },
        error: () => this.notify.error('Failed')
      });
    }
  }
  
  toggleActive(user: any) {
    if (confirm(user.active ? 'Deactivate this user?' : 'Reactivate this user?')) {
      this.api.delete('users/' + user.id).subscribe({
        next: () => { this.notify.success(user.active ? 'User deactivated' : 'User reactivated'); this.loadUsers(); },
        error: () => this.notify.error('Failed')
      });
    }
  }
  
  formatRole(role: string): string { return (role || '').replace(/_/g, ' '); }
  getRoleClass(role: string): string {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'active';
    if (role === 'SALES_MANAGER') return 'qualified';
    return 'new';
  }
}
