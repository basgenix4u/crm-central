import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-notification-list', standalone: true,
  imports: [CommonModule, FormsModule, MatListModule, MatIconModule, MatButtonModule, MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatBadgeModule, MatDividerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Notifications</h1>
        <button mat-stroked-button (click)="markAllRead()"><mat-icon>done_all</mat-icon> Mark All Read</button>
      </div>

      <mat-tab-group>
        <mat-tab label="Notifications">
          <div class="card" style="margin-top:16px;">
            <mat-list>
              <mat-list-item *ngFor="let n of notifications" [style.background]="n.read ? 'transparent' : '#eff6ff'" style="border-bottom:1px solid #f1f5f9;cursor:pointer;" (click)="markRead(n.id)">
                <mat-icon matListItemIcon [style.color]="n.read ? '#cbd5e1' : '#3b82f6'">{{ getIcon(n.type) }}</mat-icon>
                <div matListItemTitle><strong>{{ n.title }}</strong></div>
                <div matListItemLine>{{ n.message }}</div>
                <div matListItemMeta style="font-size:11px;color:#94a3b8;">{{ n.createdAt | date:'short' }}</div>
              </mat-list-item>
            </mat-list>
            <div *ngIf="notifications.length === 0" class="empty-state"><mat-icon class="empty-icon">notifications_none</mat-icon><h3>No notifications</h3><p>You'll see alerts for new leads, tasks, and updates here.</p></div>
          </div>
        </mat-tab>

        <mat-tab label="Announcements" *ngIf="isAdmin">
          <div style="margin-top:16px;">
            <div class="card">
              <h3>Create Announcement</h3>
              <p style="color:#64748b;margin-bottom:12px;">Send a message to all team members</p>
              <mat-form-field appearance="outline" style="width:100%"><mat-label>Title</mat-label><input matInput [(ngModel)]="announcement.title" placeholder="e.g. System maintenance tonight"></mat-form-field>
              <mat-form-field appearance="outline" style="width:100%"><mat-label>Message</mat-label><textarea matInput [(ngModel)]="announcement.message" rows="3" placeholder="Details of the announcement..."></textarea></mat-form-field>
              <button mat-raised-button color="primary" (click)="sendAnnouncement()" [disabled]="!announcement.title||!announcement.message"><mat-icon>campaign</mat-icon> Send to All Users</button>
            </div>

            <div class="card" style="margin-top:16px;" *ngIf="announcements.length > 0">
              <h3>Past Announcements</h3>
              <div *ngFor="let a of announcements" style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
                <strong>{{ a.title }}</strong>
                <p style="color:#475569;margin:4px 0;">{{ a.message }}</p>
                <small style="color:#94a3b8;">Sent {{ a.createdAt | date:'medium' }}</small>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class NotificationListComponent implements OnInit {
  notifications: any[] = [];
  announcements: any[] = [];
  announcement = { title: '', message: '' };
  isAdmin = false;

  constructor(private api: ApiService, private notify: NotificationService, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    this.isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
    this.api.getPage('notifications', 0, 50).subscribe({ next: r => {
      const all = r.data?.content || [];
      this.notifications = all.filter((n: any) => n.type !== 'SYSTEM');
      this.announcements = all.filter((n: any) => n.type === 'SYSTEM');
    }});
  }

  markRead(id: string) { this.api.patch('notifications/' + id + '/read').subscribe(() => { const n = this.notifications.find(x => x.id === id); if (n) n.read = true; }); }
  markAllRead() { this.api.patch('notifications/read-all').subscribe(() => { this.notifications.forEach(n => n.read = true); this.notify.success('All marked as read'); }); }

  sendAnnouncement() {
    // Create a notification for all users (via the notes API as a workaround)
    this.api.post('notes', {
      content: this.announcement.title + ': ' + this.announcement.message,
      entityType: 'ANNOUNCEMENT',
      entityId: 'all',
      pinned: true
    }).subscribe({
      next: () => {
        this.notify.success('Announcement sent to all users!');
        this.announcements.unshift({ ...this.announcement, createdAt: new Date().toISOString() });
        this.announcement = { title: '', message: '' };
      },
      error: () => this.notify.error('Failed to send')
    });
  }

  getIcon(type: string): string {
    const m: any = { NEW_LEAD:'person_add', NEW_TASK:'task_alt', TICKET_UPDATE:'confirmation_number', MEETING_REMINDER:'event', OPPORTUNITY_UPDATE:'trending_up', DEAL_WON:'emoji_events', ASSIGNMENT:'assignment_ind', SYSTEM:'campaign' };
    return m[type] || 'notifications';
  }
}
