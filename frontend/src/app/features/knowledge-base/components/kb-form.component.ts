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
  selector: 'app-kb-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Article' : 'New Article' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Title</mat-label><input matInput [(ngModel)]="form.title" required></mat-form-field>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Category</mat-label>
        <mat-select [(ngModel)]="form.category"><mat-option value="Guide">Guide</mat-option><mat-option value="FAQ">FAQ</mat-option><mat-option value="Tutorial">Tutorial</mat-option><mat-option value="Article">Article</mat-option></mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Status</mat-label>
        <mat-select [(ngModel)]="form.status"><mat-option value="Draft">Draft</mat-option><mat-option value="Published">Published</mat-option><mat-option value="Archived">Archived</mat-option></mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Content</mat-label><textarea matInput rows="10" [(ngModel)]="form.content" required></textarea></mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.title||!form.content"><mat-icon>save</mat-icon> Save</button>
    </mat-dialog-actions>
  `, styles: [`mat-dialog-content{max-height:70vh}`]
})
export class KBFormComponent implements OnInit {
  form: any = { title:'',content:'',category:'Guide',status:'Draft' };
  constructor(public dialogRef: MatDialogRef<KBFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
