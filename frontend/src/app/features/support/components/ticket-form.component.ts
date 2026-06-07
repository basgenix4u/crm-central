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
  selector: 'app-ticket-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Ticket' : 'New Ticket' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Subject</mat-label><input matInput [(ngModel)]="form.subject" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="form.priority" required>
            <mat-option value="LOW">Low</mat-option><mat-option value="MEDIUM">Medium</mat-option>
            <mat-option value="HIGH">High</mat-option><mat-option value="URGENT">Urgent</mat-option><mat-option value="CRITICAL">Critical</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Category</mat-label>
          <mat-select [(ngModel)]="form.category" required>
            <mat-option value="TECHNICAL_ISSUE">Technical Issue</mat-option><mat-option value="BILLING_ISSUE">Billing Issue</mat-option>
            <mat-option value="GENERAL_QUESTION">General Question</mat-option><mat-option value="COMPLAINT">Complaint</mat-option>
            <mat-option value="FEATURE_REQUEST">Feature Request</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="5" [(ngModel)]="form.description" required></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.subject||!form.description||!form.priority||!form.category"><mat-icon>save</mat-icon> {{ data?.id ? 'Update' : 'Create' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}`]
})
export class TicketFormComponent implements OnInit {
  form: any = { subject:'',priority:'MEDIUM',category:'GENERAL_QUESTION',description:'' };
  constructor(public dialogRef: MatDialogRef<TicketFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
