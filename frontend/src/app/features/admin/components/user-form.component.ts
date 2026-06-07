import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Add New Team Member</h2>
    <mat-dialog-content>
      <p style="color:#666;margin-bottom:16px;">This user will be added to your organization and can log in immediately.</p>
      <div class="form-grid">
        <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" [(ngModel)]="form.email" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Password</mat-label><input matInput type="password" [(ngModel)]="form.password" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Role</mat-label>
          <mat-select [(ngModel)]="form.role" required>
            <mat-option value="ADMIN">Admin</mat-option>
            <mat-option value="SALES_MANAGER">Sales Manager</mat-option>
            <mat-option value="SALES_REPRESENTATIVE">Sales Representative</mat-option>
            <mat-option value="SUPPORT_AGENT">Support Agent</mat-option>
            <mat-option value="MARKETING_MANAGER">Marketing Manager</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Department</mat-label>
          <mat-select [(ngModel)]="form.department">
            <mat-option value="Sales">Sales</mat-option>
            <mat-option value="Support">Support</mat-option>
            <mat-option value="Marketing">Marketing</mat-option>
            <mat-option value="Engineering">Engineering</mat-option>
            <mat-option value="Management">Management</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="form.jobTitle"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="form.phone"></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.firstName||!form.lastName||!form.email||!form.password||!form.role">
        <mat-icon>person_add</mat-icon> Create User
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}mat-form-field{width:100%}mat-dialog-content{max-height:70vh}`]
})
export class UserFormComponent {
  form: any = { firstName:'',lastName:'',email:'',password:'',role:'SALES_REPRESENTATIVE',department:'Sales',jobTitle:'',phone:'' };
  constructor(public dialogRef: MatDialogRef<UserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  save() { this.dialogRef.close(this.form); }
}
