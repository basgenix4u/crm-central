import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-customer-detail', standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="page-container" *ngIf="customer">
      <div class="page-header">
        <h1>{{ customer.firstName }} {{ customer.lastName }}</h1>
        <div class="actions"><button mat-raised-button color="primary"><mat-icon>edit</mat-icon> Edit</button></div>
      </div>
      <div style="display:flex;gap:24px;">
        <div style="flex:1">
          <div class="card">
            <h3>Contact Information</h3>
            <p><mat-icon style="vertical-align:middle;font-size:18px;">email</mat-icon> {{ customer.email }}</p>
            <p><mat-icon style="vertical-align:middle;font-size:18px;">phone</mat-icon> {{ customer.phone || 'N/A' }}</p>
            <p><mat-icon style="vertical-align:middle;font-size:18px;">business</mat-icon> {{ customer.company || 'N/A' }}</p>
            <p><mat-icon style="vertical-align:middle;font-size:18px;">work</mat-icon> {{ customer.jobTitle || 'N/A' }}</p>
          </div>
        </div>
        <div style="flex:1">
          <div class="card">
            <h3>Business Details</h3>
            <p><strong>Industry:</strong> {{ customer.industry || 'N/A' }}</p>
            <p><strong>Status:</strong> <span class="status-badge" [ngClass]="customer.status?.toLowerCase()">{{ customer.status }}</span></p>
            <p><strong>Revenue:</strong> <span>$</span>{{ customer.annualRevenue | number }}</p>
            <p><strong>Employees:</strong> {{ customer.numberOfEmployees || 'N/A' }}</p>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:24px;">
        <mat-tab-group>
          <mat-tab label="Activities"><p style="padding:24px;">Activity timeline will appear here.</p></mat-tab>
          <mat-tab label="Contacts"><p style="padding:24px;">Related contacts will appear here.</p></mat-tab>
          <mat-tab label="Documents"><p style="padding:24px;">Related documents will appear here.</p></mat-tab>
          <mat-tab label="Notes"><p style="padding:24px;">Notes will appear here.</p></mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `
})
export class CustomerDetailComponent implements OnInit {
  customer: any = null;
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() { const id = this.route.snapshot.paramMap.get('id'); if (id) this.api.get('customers/' + id).subscribe(r => this.customer = r.data); }
}
