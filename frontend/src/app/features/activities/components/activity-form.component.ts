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
  selector: 'app-activity-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Activity' : 'New Activity' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Subject</mat-label><input matInput [(ngModel)]="form.subject" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Type</mat-label>
          <mat-select [(ngModel)]="form.type" required>
            <mat-option value="CALL">Call</mat-option><mat-option value="MEETING">Meeting</mat-option>
            <mat-option value="EMAIL">Email</mat-option><mat-option value="NOTE">Note</mat-option>
            <mat-option value="TASK">Task</mat-option><mat-option value="DEMO">Demo</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label>
          <mat-select [(ngModel)]="form.status"><mat-option value="Planned">Planned</mat-option><mat-option value="Completed">Completed</mat-option><mat-option value="Cancelled">Cancelled</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Start Time</mat-label><input matInput type="datetime-local" [(ngModel)]="form.startTime"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>End Time</mat-label><input matInput type="datetime-local" [(ngModel)]="form.endTime"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Location</mat-label><input matInput [(ngModel)]="form.location"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.subject||!form.type"><mat-icon>save</mat-icon> Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}`]
})
export class ActivityFormComponent implements OnInit {
  form: any = { subject:'',type:'CALL',status:'Planned',startTime:'',endTime:'',location:'',description:'' };
  constructor(public dialogRef: MatDialogRef<ActivityFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
