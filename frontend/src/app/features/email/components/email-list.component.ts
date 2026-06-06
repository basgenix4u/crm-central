import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-email-list', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatDividerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Email</h1><button mat-raised-button color="primary" (click)="showCompose = !showCompose"><mat-icon>edit</mat-icon> Compose</button></div>

      <div class="card" *ngIf="showCompose" style="margin-bottom:24px;">
        <h3>New Email</h3>
        <mat-form-field appearance="outline" style="width:100%;"><mat-label>To</mat-label><input matInput [(ngModel)]="compose.toEmail"></mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;"><mat-label>Subject</mat-label><input matInput [(ngModel)]="compose.subject"></mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;"><mat-label>Body</mat-label><textarea matInput rows="6" [(ngModel)]="compose.body"></textarea></mat-form-field>
        <button mat-raised-button color="primary" (click)="sendEmail()"><mat-icon>send</mat-icon> Send</button>
      </div>

      <div class="card">
        <mat-list>
          <mat-list-item *ngFor="let email of emails" style="cursor:pointer;border-bottom:1px solid #f0f0f0;">
            <mat-icon matListItemIcon>{{ email.direction === 'Outbound' ? 'send' : 'inbox' }}</mat-icon>
            <div matListItemTitle><strong>{{ email.subject }}</strong></div>
            <div matListItemLine>{{ email.toEmail }} · {{ email.sentAt | date:'short' }}</div>
          </mat-list-item>
        </mat-list>
        <div *ngIf="emails.length === 0" class="empty-state"><mat-icon class="empty-icon">email</mat-icon><h3>No emails yet</h3></div>
      </div>
    </div>
  `
})
export class EmailListComponent implements OnInit {
  emails: any[] = []; showCompose = false;
  compose = { toEmail: '', subject: '', body: '' };
  constructor(private api: ApiService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('emails', 0, 50).subscribe({ next: r => this.emails = r.data?.content || [] }); }
  sendEmail() {
    this.api.post('emails/send', this.compose).subscribe({
      next: () => { this.notify.success('Email sent!'); this.showCompose = false; this.compose = { toEmail: '', subject: '', body: '' }; this.load(); },
      error: () => this.notify.error('Failed to send email')
    });
  }
}
