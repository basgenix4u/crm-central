import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Customer' : 'New Customer' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" [(ngModel)]="form.email" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="form.phone"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Company</mat-label><input matInput [(ngModel)]="form.company"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="form.jobTitle"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Industry</mat-label>
          <mat-select [(ngModel)]="form.industry">
            <mat-option value="Technology">Technology</mat-option>
            <mat-option value="Healthcare">Healthcare</mat-option>
            <mat-option value="Finance">Finance</mat-option>
            <mat-option value="Education">Education</mat-option>
            <mat-option value="Manufacturing">Manufacturing</mat-option>
            <mat-option value="Retail">Retail</mat-option>
            <mat-option value="Real Estate">Real Estate</mat-option>
            <mat-option value="Other">Other</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label>
          <mat-select [(ngModel)]="form.status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
            <mat-option value="Prospect">Prospect</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Website</mat-label><input matInput [(ngModel)]="form.website"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Annual Revenue</mat-label><input matInput type="number" [(ngModel)]="form.annualRevenue"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><input matInput [(ngModel)]="form.addressLine1"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>City</mat-label><input matInput [(ngModel)]="form.city"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Country</mat-label><input matInput [(ngModel)]="form.country"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput rows="3" [(ngModel)]="form.notes"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.firstName || !form.lastName || !form.email">
        <mat-icon>save</mat-icon> {{ data?.id ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; } .full-width { grid-column: 1 / -1; } mat-form-field { width: 100%; } mat-dialog-content { max-height: 70vh; }`]
})
export class CustomerFormComponent implements OnInit {
  form: any = { firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', industry: '', status: 'Active', website: '', annualRevenue: null, addressLine1: '', city: '', country: '', notes: '' };

  constructor(public dialogRef: MatDialogRef<CustomerFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) { this.form = { ...this.data }; } }
  save() { this.dialogRef.close(this.form); }
}
