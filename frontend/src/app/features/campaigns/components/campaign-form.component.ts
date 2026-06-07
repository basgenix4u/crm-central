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
  selector: 'app-campaign-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Campaign' : 'New Campaign' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Campaign Name</mat-label><input matInput [(ngModel)]="form.name" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Type</mat-label>
          <mat-select [(ngModel)]="form.type" required>
            <mat-option value="EMAIL">Email</mat-option><mat-option value="SMS">SMS</mat-option>
            <mat-option value="SOCIAL_MEDIA">Social Media</mat-option><mat-option value="WEBINAR">Webinar</mat-option>
            <mat-option value="EVENT">Event</mat-option><mat-option value="PAID_ADS">Paid Ads</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label>
          <mat-select [(ngModel)]="form.status"><mat-option value="DRAFT">Draft</mat-option><mat-option value="SCHEDULED">Scheduled</mat-option><mat-option value="ACTIVE">Active</mat-option><mat-option value="COMPLETED">Completed</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Budget</mat-label><input matInput type="number" [(ngModel)]="form.budget"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Start Date</mat-label><input matInput type="date" [(ngModel)]="form.startDate"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>End Date</mat-label><input matInput type="date" [(ngModel)]="form.endDate"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.name||!form.type"><mat-icon>save</mat-icon> Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}`]
})
export class CampaignFormComponent implements OnInit {
  form: any = { name:'',type:'EMAIL',status:'DRAFT',budget:null,startDate:'',endDate:'',description:'' };
  constructor(public dialogRef: MatDialogRef<CampaignFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
