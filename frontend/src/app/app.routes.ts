import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/components/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/components/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/components/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'customers', loadComponent: () => import('./features/customers/components/customer-list.component').then(m => m.CustomerListComponent) },
      { path: 'customers/:id', loadComponent: () => import('./features/customers/components/customer-detail.component').then(m => m.CustomerDetailComponent) },
      { path: 'leads', loadComponent: () => import('./features/leads/components/lead-list.component').then(m => m.LeadListComponent) },
      { path: 'opportunities', loadComponent: () => import('./features/opportunities/components/opportunity-list.component').then(m => m.OpportunityListComponent) },
      { path: 'pipeline', loadComponent: () => import('./features/pipeline/components/pipeline-board.component').then(m => m.PipelineBoardComponent) },
      { path: 'contacts', loadComponent: () => import('./features/contacts/components/contact-list.component').then(m => m.ContactListComponent) },
      { path: 'activities', loadComponent: () => import('./features/activities/components/activity-list.component').then(m => m.ActivityListComponent) },
      { path: 'tasks', loadComponent: () => import('./features/tasks/components/task-list.component').then(m => m.TaskListComponent) },
      { path: 'calendar', loadComponent: () => import('./features/calendar/components/calendar.component').then(m => m.CalendarViewComponent) },
      { path: 'emails', loadComponent: () => import('./features/email/components/email-list.component').then(m => m.EmailListComponent) },
      { path: 'tickets', loadComponent: () => import('./features/support/components/ticket-list.component').then(m => m.TicketListComponent) },
      { path: 'tickets/:id', loadComponent: () => import('./features/support/components/ticket-detail.component').then(m => m.TicketDetailComponent) },
      { path: 'knowledge-base', loadComponent: () => import('./features/knowledge-base/components/kb-list.component').then(m => m.KBListComponent) },
      { path: 'campaigns', loadComponent: () => import('./features/campaigns/components/campaign-list.component').then(m => m.CampaignListComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/components/reports.component').then(m => m.ReportsComponent) },
      { path: 'notifications', loadComponent: () => import('./features/notifications/components/notification-list.component').then(m => m.NotificationListComponent) },
      { path: 'documents', loadComponent: () => import('./features/documents/components/document-list.component').then(m => m.DocumentListComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/components/admin-panel.component').then(m => m.AdminPanelComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/components/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
