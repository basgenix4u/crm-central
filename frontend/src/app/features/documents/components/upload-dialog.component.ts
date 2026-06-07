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
  selector: 'app-upload-dialog', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Upload Document</h2>
    <mat-dialog-content>
      <div style="border:2px dashed #cbd5e1;border-radius:12px;padding:32px;text-align:center;margin-bottom:16px;cursor:pointer;background:#f8fafc;" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
        <mat-icon style="font-size:48px;color:#94a3b8;">cloud_upload</mat-icon>
        <p style="margin-top:8px;color:#64748b;font-weight:500;">{{ selectedFile ? selectedFile.name + ' (' + formatSize(selectedFile.size) + ')' : 'Click or drag file here' }}</p>
        <input type="file" #fileInput hidden (change)="onFileSelect($event)">
      </div>
      <mat-form-field appearance="outline" style="width:100%;"><mat-label>Document Type</mat-label>
        <mat-select [(ngModel)]="form.type" required>
          <mat-option value="CONTRACT">Contract</mat-option>
          <mat-option value="INVOICE">Invoice</mat-option>
          <mat-option value="PROPOSAL">Proposal</mat-option>
          <mat-option value="REPORT">Report</mat-option>
          <mat-option value="PRESENTATION">Presentation</mat-option>
          <mat-option value="SPREADSHEET">Spreadsheet</mat-option>
          <mat-option value="IMAGE">Image</mat-option>
          <mat-option value="OTHER">Other</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%;"><mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="form.description" rows="2" placeholder="What is this document for?"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="upload()" [disabled]="!selectedFile || !form.type">
        <mat-icon>cloud_upload</mat-icon> Upload
      </button>
    </mat-dialog-actions>
  `
})
export class UploadDialogComponent {
  selectedFile: File | null = null;
  form = { type: '', description: '' };
  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onFileSelect(event: any) { this.selectedFile = event.target.files?.[0] || null; }
  onDrop(event: DragEvent) { event.preventDefault(); this.selectedFile = event.dataTransfer?.files?.[0] || null; }
  upload() { if (this.selectedFile) this.dialogRef.close({ file: this.selectedFile, ...this.form }); }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i]; }
}
