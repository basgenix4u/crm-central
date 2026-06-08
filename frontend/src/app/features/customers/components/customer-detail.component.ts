import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { CustomerFormComponent } from './customer-form.component';

@Component({
  selector: 'app-customer-detail', standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatChipsModule, MatDividerModule, MatListModule, MatDialogModule],
  template: `
    <div class="page-container" *ngIf="customer">
      <div class="page-header">
        <h1>{{ customer.firstName }} {{ customer.lastName }}</h1>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="editCustomer()"><mat-icon>edit</mat-icon> Edit</button>
          <button mat-stroked-button routerLink="/customers"><mat-icon>arrow_back</mat-icon> Back</button>
        </div>
      </div>
      <div style="display:flex;gap:24px;">
        <div style="flex:1">
          <div class="card">
            <h3>Contact Information</h3>
            <div style="margin-top:12px;">
              <p style="margin:8px 0;"><mat-icon style="vertical-align:middle;font-size:18px;margin-right:8px;">email</mat-icon> {{ customer.email }}</p>
              <p style="margin:8px 0;"><mat-icon style="vertical-align:middle;font-size:18px;margin-right:8px;">phone</mat-icon> {{ customer.phone || 'Not provided' }}</p>
              <p style="margin:8px 0;"><mat-icon style="vertical-align:middle;font-size:18px;margin-right:8px;">business</mat-icon> {{ customer.company || 'Not provided' }}</p>
              <p style="margin:8px 0;"><mat-icon style="vertical-align:middle;font-size:18px;margin-right:8px;">work</mat-icon> {{ customer.jobTitle || 'Not provided' }}</p>
              <p style="margin:8px 0;"><mat-icon style="vertical-align:middle;font-size:18px;margin-right:8px;">language</mat-icon> {{ customer.website || 'Not provided' }}</p>
            </div>
          </div>
        </div>
        <div style="flex:1">
          <div class="card">
            <h3>Business Details</h3>
            <div style="margin-top:12px;">
              <p style="margin:8px 0;"><strong>Industry:</strong> {{ customer.industry || 'N/A' }}</p>
              <p style="margin:8px 0;"><strong>Status:</strong> <span class="status-badge" [ngClass]="customer.status?.toLowerCase()">{{ customer.status }}</span></p>
              <p style="margin:8px 0;"><strong>Revenue:</strong> <span>$</span>{{ customer.annualRevenue | number:'1.0-0' }}</p>
              <p style="margin:8px 0;"><strong>Employees:</strong> {{ customer.numberOfEmployees || 'N/A' }}</p>
              <p style="margin:8px 0;"><strong>Created:</strong> {{ customer.createdAt | date:'mediumDate' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="customer.notes" class="card" style="margin-top:24px;">
        <h3>Notes</h3>
        <p style="margin-top:8px;white-space:pre-wrap;">{{ customer.notes }}</p>
      </div>
      <div class="card" style="margin-top:24px;">
        <mat-tab-group>
          <mat-tab label="Activities ({{ activities.length }})">
            <mat-list *ngIf="activities.length > 0">
              <mat-list-item *ngFor="let a of activities">
                <mat-icon matListItemIcon>{{ a.type === 'CALL' ? 'phone' : a.type === 'MEETING' ? 'groups' : 'email' }}</mat-icon>
                <div matListItemTitle>{{ a.subject }}</div>
                <div matListItemLine>{{ a.type }} · {{ a.status }} · {{ a.startTime | date:'short' }}</div>
              </mat-list-item>
            </mat-list>
            <p *ngIf="activities.length === 0" style="padding:24px;color:#999;text-align:center;">No activities yet</p>
          </mat-tab>
          <mat-tab label="Contacts ({{ contacts.length }})">
            <mat-list *ngIf="contacts.length > 0">
              <mat-list-item *ngFor="let c of contacts">
                <mat-icon matListItemIcon>person</mat-icon>
                <div matListItemTitle>{{ c.firstName }} {{ c.lastName }}</div>
                <div matListItemLine>{{ c.email }} · {{ c.phone }}</div>
              </mat-list-item>
            </mat-list>
            <p *ngIf="contacts.length === 0" style="padding:24px;color:#999;text-align:center;">No contacts linked</p>
          </mat-tab>
          <mat-tab label="Documents ({{ documents.length }})">
            <mat-list *ngIf="documents.length > 0">
              <mat-list-item *ngFor="let d of documents">
                <mat-icon matListItemIcon>insert_drive_file</mat-icon>
                <div matListItemTitle>{{ d.originalName || d.name }}</div>
                <div matListItemLine>{{ d.createdAt | date:'mediumDate' }}</div>
              </mat-list-item>
            </mat-list>
            <p *ngIf="documents.length === 0" style="padding:24px;color:#999;text-align:center;">No documents</p>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `
})
export class CustomerDetailComponent implements OnInit {
  customer: any = null;
  activities: any[] = [];
  contacts: any[] = [];
  documents: any[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute, private dialog: MatDialog, private notify: NotificationService) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get('customers/' + id).subscribe(r => this.customer = r.data);
      this.api.get<any[]>('activities/customer/' + id).subscribe({ next: r => this.activities = (r.data as any) || [], error: () => {} });
      this.api.get<any[]>('contacts/customer/' + id).subscribe({ next: r => this.contacts = (r.data as any) || [], error: () => {} });
      this.api.get<any[]>('documents/customer/' + id).subscribe({ next: r => this.documents = (r.data as any) || [], error: () => {} });
    }
  }

  editCustomer() {
    const ref = this.dialog.open(CustomerFormComponent, { width: '95vw', maxWidth: '700px', data: this.customer });
    ref.afterClosed().subscribe(r => {
      if (r) {
        this.api.put('customers/' + this.customer.id, r).subscribe({
          next: (res) => { this.customer = (res as any).data; this.notify.success('Customer updated'); },
          error: () => this.notify.error('Failed to update')
        });
      }
    });
  }
}
