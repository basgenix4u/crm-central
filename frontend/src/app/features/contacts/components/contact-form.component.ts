import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Contact' : 'New Contact' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput [(ngModel)]="form.email"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="form.phone"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Mobile</mat-label><input matInput [(ngModel)]="form.mobilePhone"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="form.jobTitle"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Company</mat-label><input matInput [(ngModel)]="form.company"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Department</mat-label><input matInput [(ngModel)]="form.department"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput rows="2" [(ngModel)]="form.notes"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.firstName||!form.lastName"><mat-icon>save</mat-icon> Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}`]
})
export class ContactFormComponent implements OnInit {
  form: any = { firstName:'',lastName:'',email:'',phone:'',mobilePhone:'',jobTitle:'',company:'',department:'',notes:'' };
  constructor(public dialogRef: MatDialogRef<ContactFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
