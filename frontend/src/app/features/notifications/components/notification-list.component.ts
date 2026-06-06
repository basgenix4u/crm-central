import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-notification-list', standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatCardModule, MatBadgeModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Notifications</h1><button mat-stroked-button (click)="markAllRead()"><mat-icon>done_all</mat-icon> Mark All Read</button></div>
      <div class="card">
        <mat-list>
          <mat-list-item *ngFor="let n of notifications" [style.background]="n.read ? 'transparent' : '#f0f7ff'" style="border-bottom:1px solid #f0f0f0;cursor:pointer;" (click)="markRead(n.id)">
            <mat-icon matListItemIcon [style.color]="n.read ? '#ccc' : '#1976d2'">{{ getIcon(n.type) }}</mat-icon>
            <div matListItemTitle><strong>{{ n.title }}</strong></div>
            <div matListItemLine>{{ n.message }}</div>
            <div matListItemMeta>{{ n.createdAt | date:'short' }}</div>
          </mat-list-item>
        </mat-list>
        <div *ngIf="notifications.length === 0" class="empty-state"><mat-icon class="empty-icon">notifications_none</mat-icon><h3>No notifications</h3></div>
      </div>
    </div>
  `
})
export class NotificationListComponent implements OnInit {
  notifications: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getPage('notifications', 0, 50).subscribe({ next: r => this.notifications = r.data?.content || [] }); }
  markRead(id: string) { this.api.patch('notifications/' + id + '/read').subscribe(() => { const n = this.notifications.find(x => x.id === id); if (n) n.read = true; }); }
  markAllRead() { this.api.patch('notifications/read-all').subscribe(() => this.notifications.forEach(n => n.read = true)); }
  getIcon(type: string): string {
    const map: any = { NEW_LEAD: 'person_add', NEW_TASK: 'task_alt', TICKET_UPDATE: 'confirmation_number', MEETING_REMINDER: 'event', OPPORTUNITY_UPDATE: 'trending_up', DEAL_WON: 'emoji_events', ASSIGNMENT: 'assignment_ind' };
    return map[type] || 'notifications';
  }
}
