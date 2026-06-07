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
  selector: 'app-lead-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Lead' : 'New Lead' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" [(ngModel)]="form.email" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="form.phone"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Company</mat-label><input matInput [(ngModel)]="form.company"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="form.jobTitle"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label>
          <mat-select [(ngModel)]="form.status">
            <mat-option value="NEW">New</mat-option><mat-option value="CONTACTED">Contacted</mat-option>
            <mat-option value="QUALIFIED">Qualified</mat-option><mat-option value="UNQUALIFIED">Unqualified</mat-option>
            <mat-option value="NURTURING">Nurturing</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Source</mat-label>
          <mat-select [(ngModel)]="form.source">
            <mat-option value="WEBSITE_FORM">Website</mat-option><mat-option value="REFERRAL">Referral</mat-option>
            <mat-option value="COLD_CALL">Cold Call</mat-option><mat-option value="SOCIAL_MEDIA">Social Media</mat-option>
            <mat-option value="EVENT">Event</mat-option><mat-option value="CAMPAIGN">Campaign</mat-option>
            <mat-option value="PARTNER">Partner</mat-option><mat-option value="OTHER">Other</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Score (0-100)</mat-label><input matInput type="number" [(ngModel)]="form.score" min="0" max="100"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Estimated Value</mat-label><input matInput type="number" [(ngModel)]="form.estimatedValue"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Rating</mat-label>
          <mat-select [(ngModel)]="form.rating"><mat-option value="Hot">Hot</mat-option><mat-option value="Warm">Warm</mat-option><mat-option value="Cold">Cold</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Industry</mat-label><input matInput [(ngModel)]="form.industry"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.firstName||!form.lastName||!form.email"><mat-icon>save</mat-icon> {{ data?.id ? 'Update' : 'Create' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}mat-dialog-content{max-height:70vh}`]
})
export class LeadFormComponent implements OnInit {
  form: any = { firstName:'',lastName:'',email:'',phone:'',company:'',jobTitle:'',status:'NEW',source:'MANUAL_ENTRY',score:0,estimatedValue:null,rating:'Warm',industry:'',description:'' };
  constructor(public dialogRef: MatDialogRef<LeadFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
