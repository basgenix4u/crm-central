import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>New Event</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Title</mat-label><input matInput [(ngModel)]="form.title" required></mat-form-field>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <mat-form-field appearance="outline"><mat-label>Start</mat-label><input matInput type="datetime-local" [(ngModel)]="form.startDateTime" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>End</mat-label><input matInput type="datetime-local" [(ngModel)]="form.endDateTime" required></mat-form-field>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <mat-form-field appearance="outline"><mat-label>Type</mat-label>
          <mat-select [(ngModel)]="form.type"><mat-option value="Meeting">Meeting</mat-option><mat-option value="Call">Call</mat-option><mat-option value="Follow-Up">Follow-Up</mat-option><mat-option value="Event">Event</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Location</mat-label><input matInput [(ngModel)]="form.location"></mat-form-field>
      </div>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Color</mat-label>
        <mat-select [(ngModel)]="form.color"><mat-option value="#1976d2">Blue</mat-option><mat-option value="#4caf50">Green</mat-option><mat-option value="#ff9800">Orange</mat-option><mat-option value="#e91e63">Pink</mat-option><mat-option value="#9c27b0">Purple</mat-option></mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.title||!form.startDateTime||!form.endDateTime"><mat-icon>event</mat-icon> Create Event</button>
    </mat-dialog-actions>
  `
})
export class EventFormComponent {
  form: any = { title:'',startDateTime:'',endDateTime:'',type:'Meeting',location:'',description:'',color:'#1976d2' };
  constructor(public dialogRef: MatDialogRef<EventFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  save() { this.dialogRef.close(this.form); }
}
