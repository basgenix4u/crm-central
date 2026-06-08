import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatDividerModule, MatTooltipModule],
  template: `
    <div class="layout">
      <!-- Desktop Sidebar -->
      <aside class="sidebar" [class.collapsed]="collapsed">
        <div class="sidebar-top">
          <div class="logo-area" *ngIf="!collapsed"><mat-icon class="logo-icon">hub</mat-icon><span>CRM Central</span></div>
          <button mat-icon-button (click)="collapsed=!collapsed" class="toggle-btn"><mat-icon>{{collapsed?'menu':'menu_open'}}</mat-icon></button>
        </div>
        <nav class="nav">
          <div class="nav-label" *ngIf="!collapsed">OVERVIEW</div>
          <a routerLink="/dashboard" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Dashboard':''"><mat-icon>dashboard</mat-icon><span *ngIf="!collapsed">Dashboard</span></a>
          <div class="nav-label" *ngIf="!collapsed">SALES</div>
          <a routerLink="/customers" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Customers':''"><mat-icon>people</mat-icon><span *ngIf="!collapsed">Customers</span></a>
          <a routerLink="/leads" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Leads':''"><mat-icon>person_add</mat-icon><span *ngIf="!collapsed">Leads</span></a>
          <a routerLink="/opportunities" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Deals':''"><mat-icon>trending_up</mat-icon><span *ngIf="!collapsed">Deals</span></a>
          <a routerLink="/pipeline" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Pipeline':''"><mat-icon>view_kanban</mat-icon><span *ngIf="!collapsed">Pipeline</span></a>
          <a routerLink="/contacts" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Contacts':''"><mat-icon>contacts</mat-icon><span *ngIf="!collapsed">Contacts</span></a>
          <div class="nav-label" *ngIf="!collapsed">WORK</div>
          <a routerLink="/activities" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Activities':''"><mat-icon>event_note</mat-icon><span *ngIf="!collapsed">Activities</span></a>
          <a routerLink="/tasks" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Tasks':''"><mat-icon>task_alt</mat-icon><span *ngIf="!collapsed">Tasks</span></a>
          <a routerLink="/calendar" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Calendar':''"><mat-icon>calendar_today</mat-icon><span *ngIf="!collapsed">Calendar</span></a>
          <a routerLink="/emails" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Email':''"><mat-icon>email</mat-icon><span *ngIf="!collapsed">Email</span></a>
          <a routerLink="/documents" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Docs':''"><mat-icon>folder</mat-icon><span *ngIf="!collapsed">Documents</span></a>
          <div class="nav-label" *ngIf="!collapsed">SUPPORT</div>
          <a routerLink="/tickets" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Tickets':''"><mat-icon>confirmation_number</mat-icon><span *ngIf="!collapsed">Tickets</span></a>
          <a routerLink="/knowledge-base" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Help':''"><mat-icon>menu_book</mat-icon><span *ngIf="!collapsed">Help Center</span></a>
          <div class="nav-label" *ngIf="!collapsed">MORE</div>
          <a routerLink="/campaigns" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Campaigns':''"><mat-icon>campaign</mat-icon><span *ngIf="!collapsed">Campaigns</span></a>
          <a routerLink="/reports" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Reports':''"><mat-icon>assessment</mat-icon><span *ngIf="!collapsed">Reports</span></a>
          <ng-container *ngIf="isAdmin">
            <div class="nav-label" *ngIf="!collapsed">ADMIN</div>
            <a routerLink="/admin" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Admin':''"><mat-icon>admin_panel_settings</mat-icon><span *ngIf="!collapsed">Admin</span></a>
          </ng-container>
        </nav>
        <div class="sidebar-bottom">
          <a routerLink="/settings" routerLinkActive="on" class="nav-link" [matTooltip]="collapsed?'Settings':''"><mat-icon>settings</mat-icon><span *ngIf="!collapsed">Settings</span></a>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="main" [class.sidebar-collapsed]="collapsed">
        <!-- Top Bar -->
        <header class="topbar">
          <div class="topbar-left">
            <button mat-icon-button class="mobile-menu" (click)="mobileMenu=!mobileMenu"><mat-icon>menu</mat-icon></button>
            <div class="search-bar desktop-only">
              <mat-icon>search</mat-icon>
              <input placeholder="Search..." (keyup.enter)="doSearch($event)">
            </div>
          </div>
          <div class="topbar-right">
            <button mat-icon-button routerLink="/notifications" class="notif-btn"><mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon></button>
            <div class="avatar" [matMenuTriggerFor]="userMenu">{{ initials }}</div>
            <mat-menu #userMenu="matMenu">
              <div class="user-info"><strong>{{user?.firstName}} {{user?.lastName}}</strong><br><small>{{user?.email}}</small><br><span class="role-tag">{{formatRole(user?.role)}}</span></div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/settings"><mat-icon>person</mat-icon>My Account</button>
              <button mat-menu-item routerLink="/admin" *ngIf="isAdmin"><mat-icon>admin_panel_settings</mat-icon>Admin</button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="authService.logout()"><mat-icon>logout</mat-icon>Sign Out</button>
            </mat-menu>
          </div>
        </header>

        <!-- Content -->
        <main class="content"><router-outlet></router-outlet></main>

        <!-- Mobile Bottom Nav -->
        <nav class="mobile-nav">
          <a routerLink="/dashboard" routerLinkActive="on"><mat-icon>dashboard</mat-icon><span>Home</span></a>
          <a routerLink="/customers" routerLinkActive="on"><mat-icon>people</mat-icon><span>Clients</span></a>
          <a routerLink="/pipeline" routerLinkActive="on"><mat-icon>view_kanban</mat-icon><span>Pipeline</span></a>
          <a routerLink="/tasks" routerLinkActive="on"><mat-icon>task_alt</mat-icon><span>Tasks</span></a>
          <a [matMenuTriggerFor]="moreMenu"><mat-icon>more_horiz</mat-icon><span>More</span></a>
          <mat-menu #moreMenu="matMenu">
            <button mat-menu-item routerLink="/leads"><mat-icon>person_add</mat-icon>Leads</button>
            <button mat-menu-item routerLink="/opportunities"><mat-icon>trending_up</mat-icon>Deals</button>
            <button mat-menu-item routerLink="/contacts"><mat-icon>contacts</mat-icon>Contacts</button>
            <button mat-menu-item routerLink="/activities"><mat-icon>event_note</mat-icon>Activities</button>
            <button mat-menu-item routerLink="/calendar"><mat-icon>calendar_today</mat-icon>Calendar</button>
            <button mat-menu-item routerLink="/emails"><mat-icon>email</mat-icon>Email</button>
            <button mat-menu-item routerLink="/documents"><mat-icon>folder</mat-icon>Documents</button>
            <button mat-menu-item routerLink="/tickets"><mat-icon>confirmation_number</mat-icon>Tickets</button>
            <button mat-menu-item routerLink="/campaigns"><mat-icon>campaign</mat-icon>Campaigns</button>
            <button mat-menu-item routerLink="/reports"><mat-icon>assessment</mat-icon>Reports</button>
            <button mat-menu-item routerLink="/knowledge-base"><mat-icon>menu_book</mat-icon>Help Center</button>
            <button mat-menu-item routerLink="/notifications"><mat-icon>notifications</mat-icon>Notifications</button>
            <button mat-menu-item routerLink="/settings"><mat-icon>settings</mat-icon>Settings</button>
            <button mat-menu-item routerLink="/admin" *ngIf="isAdmin"><mat-icon>admin_panel_settings</mat-icon>Admin</button>
          </mat-menu>
        </nav>
      </div>

      <!-- Mobile slide-out drawer -->
      <div class="mobile-overlay" *ngIf="mobileMenu" (click)="mobileMenu=false"></div>
      <div class="mobile-drawer" [class.open]="mobileMenu">
        <div class="drawer-header">
          <mat-icon class="logo-icon">hub</mat-icon>
          <span style="font-size:16px;font-weight:700;color:#0f172a;">CRM Central</span>
          <button mat-icon-button (click)="mobileMenu=false" style="margin-left:auto;"><mat-icon>close</mat-icon></button>
        </div>
        <div class="drawer-user" *ngIf="user">
          <div class="avatar" style="width:36px;height:36px;font-size:14px;">{{ initials }}</div>
          <div><strong>{{ user.firstName }} {{ user.lastName }}</strong><br><small style="color:#64748b;">{{ formatRole(user.role) }}</small></div>
        </div>
        <nav class="drawer-nav">
          <a routerLink="/dashboard" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>dashboard</mat-icon>Dashboard</a>
          <a routerLink="/customers" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>people</mat-icon>Customers</a>
          <a routerLink="/leads" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>person_add</mat-icon>Leads</a>
          <a routerLink="/opportunities" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>trending_up</mat-icon>Deals</a>
          <a routerLink="/pipeline" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>view_kanban</mat-icon>Pipeline</a>
          <a routerLink="/contacts" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>contacts</mat-icon>Contacts</a>
          <div class="drawer-divider"></div>
          <a routerLink="/activities" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>event_note</mat-icon>Activities</a>
          <a routerLink="/tasks" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>task_alt</mat-icon>Tasks</a>
          <a routerLink="/calendar" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>calendar_today</mat-icon>Calendar</a>
          <a routerLink="/emails" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>email</mat-icon>Email</a>
          <a routerLink="/documents" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>folder</mat-icon>Documents</a>
          <div class="drawer-divider"></div>
          <a routerLink="/tickets" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>confirmation_number</mat-icon>Tickets</a>
          <a routerLink="/knowledge-base" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>menu_book</mat-icon>Help Center</a>
          <a routerLink="/campaigns" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>campaign</mat-icon>Campaigns</a>
          <a routerLink="/reports" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>assessment</mat-icon>Reports</a>
          <a routerLink="/notifications" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>notifications</mat-icon>Notifications</a>
          <div class="drawer-divider"></div>
          <a routerLink="/settings" routerLinkActive="on" (click)="mobileMenu=false"><mat-icon>settings</mat-icon>Settings</a>
          <a routerLink="/admin" routerLinkActive="on" (click)="mobileMenu=false" *ngIf="isAdmin"><mat-icon>admin_panel_settings</mat-icon>Admin</a>
        </nav>
        <div class="drawer-footer">
          <a (click)="authService.logout();mobileMenu=false" style="color:#ef4444;"><mat-icon>logout</mat-icon>Sign Out</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout{display:flex;min-height:100vh}

    /* ─── Sidebar (desktop) ─── */
    .sidebar{width:240px;height:100vh;position:fixed;left:0;top:0;background:linear-gradient(180deg,#0f172a,#1e293b);color:white;display:flex;flex-direction:column;z-index:100;transition:width .25s;overflow-x:hidden;overflow-y:auto}
    .sidebar.collapsed{width:60px}
    .sidebar-top{padding:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid rgba(255,255,255,.06)}
    .logo-area{display:flex;align-items:center;gap:8px;white-space:nowrap}
    .logo-icon{color:#60a5fa;font-size:24px;width:24px;height:24px}
    .logo-area span{font-size:15px;font-weight:700}
    .toggle-btn{color:rgba(255,255,255,.5)}
    .nav{flex:1;padding:6px;overflow-y:auto}
    .nav-label{padding:12px 10px 4px;font-size:9px;font-weight:700;letter-spacing:1.2px;color:rgba(255,255,255,.25);text-transform:uppercase}
    .nav-link{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;color:rgba(255,255,255,.55);text-decoration:none;font-size:13px;transition:all .15s;white-space:nowrap;margin-bottom:1px}
    .nav-link:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
    .nav-link.on{background:rgba(59,130,246,.12);color:#60a5fa}
    .nav-link mat-icon{font-size:18px;width:18px;height:18px;flex-shrink:0}
    .sidebar-bottom{padding:6px;border-top:1px solid rgba(255,255,255,.06)}

    /* ─── Main ─── */
    .main{flex:1;margin-left:240px;transition:margin-left .25s;display:flex;flex-direction:column;min-height:100vh}
    .main.sidebar-collapsed{margin-left:60px}

    /* ─── Top bar ─── */
    .topbar{height:52px;background:white;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:50;flex-shrink:0}
    .topbar-left{display:flex;align-items:center;gap:8px}
    .topbar-right{display:flex;align-items:center;gap:8px}
    .mobile-menu{display:none}
    .search-bar{display:flex;align-items:center;background:#f1f5f9;border-radius:10px;padding:0 10px;width:300px;border:1px solid transparent;transition:all .2s}
    .search-bar:focus-within{border-color:#3b82f6;background:white}
    .search-bar input{border:none;outline:none;padding:7px;width:100%;font-size:13px;background:transparent}
    .search-bar mat-icon{color:#94a3b8;font-size:18px;width:18px;height:18px}
    .avatar{width:32px;height:32px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer}
    .user-info{padding:12px 16px;line-height:1.5}
    .user-info small{color:#64748b;font-size:12px}
    .role-tag{display:inline-block;background:#eff6ff;color:#3b82f6;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;margin-top:4px}

    /* ─── Content ─── */
    .content{flex:1;padding:0}

    /* ─── Mobile Bottom Nav ─── */
    .mobile-nav{display:none}
    .mobile-overlay{display:none}

    /* ═══ TABLET ═══ */
    @media(max-width:900px){
      .sidebar{width:60px}
      .sidebar .nav-label,.sidebar .logo-area span,.sidebar .nav-link span{display:none}
      .main{margin-left:60px}
      .main.sidebar-collapsed{margin-left:60px}
      .search-bar{width:200px}
    }

    /* ═══ MOBILE ═══ */
    @media(max-width:640px){
      .sidebar{display:none}
      .main{margin-left:0 !important;padding-bottom:56px}
      .mobile-menu{display:inline-flex !important}
      .desktop-only{display:none !important}
      .topbar{height:48px;padding:0 12px}
      .content{padding:0}

      /* Bottom navigation */
      .mobile-nav{
        display:flex;position:fixed;bottom:0;left:0;right:0;height:56px;
        background:white;border-top:1px solid #e2e8f0;z-index:100;
        justify-content:space-around;align-items:center;
        box-shadow:0 -2px 10px rgba(0,0,0,.05);
      }
      .mobile-nav a{
        display:flex;flex-direction:column;align-items:center;gap:2px;
        text-decoration:none;color:#94a3b8;font-size:10px;padding:4px 8px;
        border-radius:8px;transition:all .15s;
      }
      .mobile-nav a.on{color:#3b82f6}
      .mobile-nav a mat-icon{font-size:20px;width:20px;height:20px}

      /* Mobile slide overlay + drawer */
      .mobile-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;backdrop-filter:blur(2px)}
      .mobile-drawer{position:fixed;top:0;left:-280px;width:280px;height:100vh;background:white;z-index:210;transition:left .25s ease;display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,.15);overflow-y:auto}
      .mobile-drawer.open{left:0}
      .drawer-header{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #e2e8f0}
      .drawer-user{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0}
      .drawer-nav{flex:1;padding:8px}
      .drawer-nav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;color:#334155;text-decoration:none;font-size:14px;font-weight:500;transition:all .15s}
      .drawer-nav a:hover{background:#f1f5f9}
      .drawer-nav a.on{background:#eff6ff;color:#3b82f6}
      .drawer-nav a mat-icon{font-size:20px;width:20px;height:20px;color:#64748b}
      .drawer-nav a.on mat-icon{color:#3b82f6}
      .drawer-divider{height:1px;background:#e2e8f0;margin:6px 12px}
      .drawer-footer{padding:8px 8px 16px;border-top:1px solid #e2e8f0}
      .drawer-footer a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none}

      .notif-btn{transform:scale(.9)}
      .avatar{width:28px;height:28px;font-size:11px}
    }
  `]
})
export class LayoutComponent {
  collapsed = false;
  mobileMenu = false;
  user: any;

  constructor(public authService: AuthService, private router: Router) {
    this.user = authService.currentUser;
    authService.currentUser$.subscribe(u => this.user = u);
  }

  get isAdmin(): boolean { return this.user?.role === 'SUPER_ADMIN' || this.user?.role === 'ADMIN'; }
  get initials(): string { return (this.user?.firstName?.[0] || '') + (this.user?.lastName?.[0] || ''); }
  formatRole(r: string): string { return (r || '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()); }
  doSearch(e: any) { const q = e.target?.value; if (q) this.router.navigate(['/search'], { queryParams: { q } }); }
}
