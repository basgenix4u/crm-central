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
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo" *ngIf="!sidebarCollapsed">
            <mat-icon class="logo-icon">hub</mat-icon>
            <span class="logo-text">CRM Central</span>
          </div>
          <button mat-icon-button (click)="sidebarCollapsed = !sidebarCollapsed">
            <mat-icon>{{ sidebarCollapsed ? 'menu' : 'menu_open' }}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a *ngFor="let item of menuItems" [routerLink]="item.route" routerLinkActive="active" class="nav-item">
            <mat-icon>{{ item.icon }}</mat-icon>
            <span *ngIf="!sidebarCollapsed">{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <mat-divider></mat-divider>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <mat-icon>settings</mat-icon>
            <span *ngIf="!sidebarCollapsed">Settings</span>
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-wrapper" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input placeholder="Search customers, leads, deals..." />
            </div>
          </div>
          <div class="header-right">
            <button mat-icon-button routerLink="/notifications">
              <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
            </button>
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <div class="user-menu-header" style="padding: 12px 16px; border-bottom: 1px solid #eee;">
                <strong>{{ authService.currentUser?.firstName }} {{ authService.currentUser?.lastName }}</strong>
                <div style="font-size: 12px; color: #666;">{{ authService.currentUser?.email }}</div>
                <div style="font-size: 11px; color: #999;">{{ authService.currentUser?.role }}</div>
              </div>
              <button mat-menu-item routerLink="/settings"><mat-icon>person</mat-icon>My Profile</button>
              <button mat-menu-item routerLink="/admin"><mat-icon>admin_panel_settings</mat-icon>Admin Panel</button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="authService.logout()"><mat-icon>logout</mat-icon>Logout</button>
            </mat-menu>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container { display: flex; min-height: 100vh; }

    .sidebar {
      width: 260px; height: 100vh; position: fixed; left: 0; top: 0;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      color: white; display: flex; flex-direction: column; z-index: 1000;
      transition: width 0.3s ease; overflow: hidden;
      &.collapsed { width: 64px; }
    }

    .sidebar-header {
      padding: 16px; display: flex; align-items: center; justify-content: space-between; height: 64px;
      .logo { display: flex; align-items: center; gap: 10px;
        .logo-icon { color: #42a5f5; font-size: 28px; width: 28px; height: 28px; }
        .logo-text { font-size: 18px; font-weight: 700; white-space: nowrap; }
      }
    }

    .sidebar-nav {
      flex: 1; padding: 8px; overflow-y: auto;
      .nav-item {
        display: flex; align-items: center; gap: 12px; padding: 10px 12px;
        border-radius: 8px; color: rgba(255,255,255,0.7); text-decoration: none;
        transition: all 0.2s; margin-bottom: 2px; white-space: nowrap;
        &:hover { background: rgba(255,255,255,0.1); color: white; }
        &.active { background: rgba(66,165,245,0.2); color: #42a5f5; }
        mat-icon { font-size: 20px; width: 20px; height: 20px; }
        span { font-size: 14px; }
      }
    }

    .sidebar-footer { padding: 8px; mat-divider { border-color: rgba(255,255,255,0.1); margin: 8px 0; } }

    .main-wrapper {
      flex: 1; margin-left: 260px; transition: margin-left 0.3s;
      &.sidebar-collapsed { margin-left: 64px; }
    }

    .header {
      height: 64px; background: white; border-bottom: 1px solid #e0e0e0;
      display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
      position: sticky; top: 0; z-index: 100;
    }

    .header-left {
      .search-bar {
        display: flex; align-items: center; background: #f5f7fa; border-radius: 8px; padding: 0 12px; width: 400px;
        input { border: none; outline: none; padding: 10px; background: transparent; width: 100%; font-size: 14px; }
        mat-icon { color: #999; }
      }
    }

    .header-right { display: flex; align-items: center; gap: 8px; }
    .page-content { padding: 24px; }

    @media (max-width: 768px) {
      .sidebar { width: 64px; .nav-item span, .logo-text { display: none; } }
      .main-wrapper { margin-left: 64px !important; }
      .header-left .search-bar { width: 200px; }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    { label: 'Leads', icon: 'person_add', route: '/leads' },
    { label: 'Opportunities', icon: 'trending_up', route: '/opportunities' },
    { label: 'Pipeline', icon: 'view_kanban', route: '/pipeline' },
    { label: 'Contacts', icon: 'contacts', route: '/contacts' },
    { label: 'Activities', icon: 'event_note', route: '/activities' },
    { label: 'Tasks', icon: 'task_alt', route: '/tasks' },
    { label: 'Calendar', icon: 'calendar_today', route: '/calendar' },
    { label: 'Emails', icon: 'email', route: '/emails' },
    { label: 'Tickets', icon: 'confirmation_number', route: '/tickets' },
    { label: 'Knowledge Base', icon: 'menu_book', route: '/knowledge-base' },
    { label: 'Campaigns', icon: 'campaign', route: '/campaigns' },
    { label: 'Reports', icon: 'assessment', route: '/reports' },
    { label: 'Documents', icon: 'folder', route: '/documents' },
    { label: 'Admin', icon: 'admin_panel_settings', route: '/admin' },
  ];

  constructor(public authService: AuthService) {}
}
