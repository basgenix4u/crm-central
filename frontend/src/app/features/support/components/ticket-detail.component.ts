import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-ticket-detail', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="page-container" *ngIf="ticket">
      <div class="page-header"><h1>{{ ticket.ticketNumber }} - {{ ticket.subject }}</h1></div>
      <div class="card">
        <div style="display:flex;gap:24px;">
          <div style="flex:2">
            <h3>Description</h3>
            <p>{{ ticket.description }}</p>
            <mat-divider style="margin:24px 0;"></mat-divider>
            <h3>Comments</h3>
            <div *ngFor="let c of ticket.comments" style="padding:12px;background:#f8f9fa;border-radius:8px;margin-bottom:12px;">
              <div style="font-weight:600;">{{ c.author?.firstName }} {{ c.author?.lastName }}</div>
              <p>{{ c.content }}</p>
              <small style="color:#999;">{{ c.createdAt | date:'medium' }}</small>
            </div>
            <mat-form-field appearance="outline" style="width:100%;margin-top:16px;">
              <mat-label>Add Comment</mat-label>
              <textarea matInput rows="3" [(ngModel)]="newComment"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="addComment()">Add Comment</button>
          </div>
          <div style="flex:1">
            <div class="card" style="background:#f8f9fa;">
              <h4>Details</h4>
              <p><strong>Status:</strong> <span class="status-badge" [ngClass]="ticket.status?.toLowerCase()">{{ ticket.status }}</span></p>
              <p><strong>Priority:</strong> {{ ticket.priority }}</p>
              <p><strong>Category:</strong> {{ ticket.category }}</p>
              <p><strong>Created:</strong> {{ ticket.createdAt | date:'medium' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TicketDetailComponent implements OnInit {
  ticket: any = null; newComment = '';
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() { const id = this.route.snapshot.paramMap.get('id'); if (id) this.api.get('tickets/' + id).subscribe(r => this.ticket = r.data); }
  addComment() {
    if (!this.newComment) return;
    this.api.post('tickets/' + this.ticket.id + '/comments?content=' + encodeURIComponent(this.newComment) + '&internal=false', {}).subscribe(r => { this.ticket = r.data; this.newComment = ''; });
  }
}
