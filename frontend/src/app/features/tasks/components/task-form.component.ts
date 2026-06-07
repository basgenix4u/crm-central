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
  selector: 'app-task-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Task' : 'New Task' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Title</mat-label><input matInput [(ngModel)]="form.title" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="form.priority" required>
            <mat-option value="LOW">Low</mat-option><mat-option value="MEDIUM">Medium</mat-option>
            <mat-option value="HIGH">High</mat-option><mat-option value="URGENT">Urgent</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label>
          <mat-select [(ngModel)]="form.status">
            <mat-option value="TODO">To Do</mat-option><mat-option value="IN_PROGRESS">In Progress</mat-option>
            <mat-option value="ON_HOLD">On Hold</mat-option><mat-option value="COMPLETED">Completed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Due Date</mat-label><input matInput type="datetime-local" [(ngModel)]="form.dueDate"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Category</mat-label>
          <mat-select [(ngModel)]="form.category"><mat-option value="Personal">Personal</mat-option><mat-option value="Team">Team</mat-option><mat-option value="Customer">Customer</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.title||!form.priority"><mat-icon>save</mat-icon> {{ data?.id ? 'Update' : 'Create' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}`]
})
export class TaskFormComponent implements OnInit {
  form: any = { title:'',priority:'MEDIUM',status:'TODO',dueDate:'',category:'Personal',description:'' };
  constructor(public dialogRef: MatDialogRef<TaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
