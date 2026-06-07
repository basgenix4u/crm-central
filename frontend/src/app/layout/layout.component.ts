import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  template: `
    <div class="app-container">
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo" *ngIf="!sidebarCollapsed">
            <mat-icon class="logo-icon">hub</mat-icon>
            <span class="logo-text">CRM Central</span>
          </div>
          <button mat-icon-button (click)="sidebarCollapsed = !sidebarCollapsed" class="menu-btn">
            <mat-icon>{{ sidebarCollapsed ? 'menu' : 'menu_open' }}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">OVERVIEW</span></div>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item"><mat-icon>dashboard</mat-icon><span *ngIf="!sidebarCollapsed">Dashboard</span></a>

          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">SALES</span></div>
          <a routerLink="/customers" routerLinkActive="active" class="nav-item"><mat-icon>people</mat-icon><span *ngIf="!sidebarCollapsed">Customers</span></a>
          <a routerLink="/leads" routerLinkActive="active" class="nav-item"><mat-icon>person_add</mat-icon><span *ngIf="!sidebarCollapsed">Leads</span></a>
          <a routerLink="/opportunities" routerLinkActive="active" class="nav-item"><mat-icon>trending_up</mat-icon><span *ngIf="!sidebarCollapsed">Deals</span></a>
          <a routerLink="/pipeline" routerLinkActive="active" class="nav-item"><mat-icon>view_kanban</mat-icon><span *ngIf="!sidebarCollapsed">Pipeline</span></a>
          <a routerLink="/contacts" routerLinkActive="active" class="nav-item"><mat-icon>contacts</mat-icon><span *ngIf="!sidebarCollapsed">Contacts</span></a>

          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">PRODUCTIVITY</span></div>
          <a routerLink="/activities" routerLinkActive="active" class="nav-item"><mat-icon>event_note</mat-icon><span *ngIf="!sidebarCollapsed">Activities</span></a>
          <a routerLink="/tasks" routerLinkActive="active" class="nav-item"><mat-icon>task_alt</mat-icon><span *ngIf="!sidebarCollapsed">Tasks</span></a>
          <a routerLink="/calendar" routerLinkActive="active" class="nav-item"><mat-icon>calendar_today</mat-icon><span *ngIf="!sidebarCollapsed">Calendar</span></a>
          <a routerLink="/emails" routerLinkActive="active" class="nav-item"><mat-icon>email</mat-icon><span *ngIf="!sidebarCollapsed">Email</span></a>
          <a routerLink="/documents" routerLinkActive="active" class="nav-item"><mat-icon>folder</mat-icon><span *ngIf="!sidebarCollapsed">Documents</span></a>

          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">SUPPORT</span></div>
          <a routerLink="/tickets" routerLinkActive="active" class="nav-item"><mat-icon>confirmation_number</mat-icon><span *ngIf="!sidebarCollapsed">Tickets</span></a>
          <a routerLink="/knowledge-base" routerLinkActive="active" class="nav-item"><mat-icon>menu_book</mat-icon><span *ngIf="!sidebarCollapsed">Help Center</span></a>

          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">MARKETING</span></div>
          <a routerLink="/campaigns" routerLinkActive="active" class="nav-item"><mat-icon>campaign</mat-icon><span *ngIf="!sidebarCollapsed">Campaigns</span></a>

          <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">INSIGHTS</span></div>
          <a routerLink="/reports" routerLinkActive="active" class="nav-item"><mat-icon>assessment</mat-icon><span *ngIf="!sidebarCollapsed">Reports</span></a>

          <!-- Admin only visible to ADMIN and SUPER_ADMIN -->
          <ng-container *ngIf="isAdmin">
            <div class="nav-section" *ngIf="!sidebarCollapsed"><span class="nav-section-label">ADMIN</span></div>
            <a routerLink="/admin" routerLinkActive="active" class="nav-item"><mat-icon>admin_panel_settings</mat-icon><span *ngIf="!sidebarCollapsed">Admin Center</span></a>
          </ng-container>
        </nav>

        <div class="sidebar-footer">
          <mat-divider></mat-divider>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item"><mat-icon>settings</mat-icon><span *ngIf="!sidebarCollapsed">Settings</span></a>
        </div>
      </aside>

      <div class="main-wrapper" [class.sidebar-collapsed]="sidebarCollapsed">
        <header class="header">
          <div class="header-left">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input placeholder="Search customers, leads, deals..." (keyup.enter)="doSearch($event)" />
            </div>
          </div>
          <div class="header-right">
            <button mat-icon-button routerLink="/notifications" matTooltip="Notifications">
              <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
            </button>
            <div class="user-avatar" [matMenuTriggerFor]="userMenu">
              <span class="avatar-initials">{{ getInitials() }}</span>
            </div>
            <mat-menu #userMenu="matMenu">
              <div style="padding:12px 16px;border-bottom:1px solid #eee;">
                <strong>{{ user?.firstName }} {{ user?.lastName }}</strong>
                <div style="font-size:12px;color:#666;">{{ user?.email }}</div>
                <div style="font-size:11px;color:#1976d2;font-weight:600;margin-top:2px;">{{ formatRole(user?.role) }}</div>
              </div>
              <button mat-menu-item routerLink="/settings"><mat-icon>person</mat-icon>My Account</button>
              <button mat-menu-item routerLink="/admin" *ngIf="isAdmin"><mat-icon>admin_panel_settings</mat-icon>Admin Center</button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="authService.logout()"><mat-icon>logout</mat-icon>Sign Out</button>
            </mat-menu>
          </div>
        </header>
        <main class="page-content"><router-outlet></router-outlet></main>
      </div>
    </div>
  `,
  styles: [`
    .app-container{display:flex;min-height:100vh}
    .sidebar{width:260px;height:100vh;position:fixed;left:0;top:0;background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);color:white;display:flex;flex-direction:column;z-index:1000;transition:width .3s ease;overflow-x:hidden;overflow-y:auto}
    .sidebar.collapsed{width:64px}
    .sidebar-header{padding:16px;display:flex;align-items:center;justify-content:space-between;height:64px;border-bottom:1px solid rgba(255,255,255,.08)}
    .logo{display:flex;align-items:center;gap:10px}
    .logo-icon{color:#3b82f6;font-size:28px;width:28px;height:28px}
    .logo-text{font-size:17px;font-weight:700;white-space:nowrap;letter-spacing:-.3px}
    .menu-btn{color:rgba(255,255,255,.6)}
    .sidebar-nav{flex:1;padding:8px}
    .nav-section{padding:16px 12px 4px}
    .nav-section-label{font-size:10px;font-weight:700;letter-spacing:1.2px;color:rgba(255,255,255,.35);text-transform:uppercase}
    .nav-item{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:8px;color:rgba(255,255,255,.6);text-decoration:none;transition:all .15s;margin-bottom:1px;white-space:nowrap;font-size:13.5px}
    .nav-item:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.9)}
    .nav-item.active{background:rgba(59,130,246,.15);color:#60a5fa}
    .nav-item mat-icon{font-size:20px;width:20px;height:20px}
    .sidebar-footer{padding:8px}
    .sidebar-footer mat-divider{border-color:rgba(255,255,255,.08);margin:4px 0}
    .main-wrapper{flex:1;margin-left:260px;transition:margin-left .3s;background:#f8fafc}
    .main-wrapper.sidebar-collapsed{margin-left:64px}
    .header{height:64px;background:white;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:100}
    .header-left .search-bar{display:flex;align-items:center;background:#f1f5f9;border-radius:10px;padding:0 14px;width:380px;border:1px solid transparent;transition:all .2s}
    .header-left .search-bar:focus-within{border-color:#3b82f6;background:white;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
    .header-left .search-bar input{border:none;outline:none;padding:10px;background:transparent;width:100%;font-size:14px}
    .header-left .search-bar mat-icon{color:#94a3b8;font-size:20px}
    .header-right{display:flex;align-items:center;gap:12px}
    .user-avatar{width:36px;height:36px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s}
    .user-avatar:hover{transform:scale(1.05)}
    .avatar-initials{color:white;font-size:13px;font-weight:700}
    .page-content{padding:24px}
    @media(max-width:768px){.sidebar{width:64px}.sidebar .nav-section,.sidebar .logo-text,.sidebar .nav-item span{display:none}.main-wrapper{margin-left:64px !important}.header-left .search-bar{width:200px}}
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  user: any;

  constructor(public authService: AuthService, private router: Router) {
    this.user = authService.currentUser;
    authService.currentUser$.subscribe(u => this.user = u);
  }

  get isAdmin(): boolean {
    return this.user?.role === 'SUPER_ADMIN' || this.user?.role === 'ADMIN';
  }

  getInitials(): string {
    if (!this.user) return '?';
    return (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
  }

  formatRole(role: string): string {
    return (role || '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  doSearch(event: any) {
    const q = event.target?.value;
    if (q) this.router.navigate(['/search'], { queryParams: { q } });
  }
}
