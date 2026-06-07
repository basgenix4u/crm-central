import { Component, Inject } from '@angular/core';
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
  selector: 'app-upload-dialog', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>Upload Document</h2>
    <mat-dialog-content>
      <div class="drop-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
        <mat-icon style="font-size:48px;color:#94a3b8;">cloud_upload</mat-icon>
        <p *ngIf="!selectedFile">Drag and drop a file here, or <strong>click to browse</strong></p>
        <p *ngIf="selectedFile" style="color:#3b82f6;font-weight:600;">{{ selectedFile.name }} ({{ formatSize(selectedFile.size) }})</p>
        <input type="file" #fileInput hidden (change)="onFileSelect($event)">
      </div>

      <mat-form-field appearance="outline" style="width:100%"><mat-label>Document Type</mat-label>
        <mat-select [(ngModel)]="form.type" required>
          <mat-option value="CONTRACT">Contract</mat-option>
          <mat-option value="INVOICE">Invoice</mat-option>
          <mat-option value="PROPOSAL">Proposal</mat-option>
          <mat-option value="REPORT">Report</mat-option>
          <mat-option value="PRESENTATION">Presentation</mat-option>
          <mat-option value="SPREADSHEET">Spreadsheet</mat-option>
          <mat-option value="IMAGE">Image / Screenshot</mat-option>
          <mat-option value="OTHER">Other</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%"><mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="form.description" rows="2" placeholder="What is this document about?"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%"><mat-label>Visibility</mat-label>
        <mat-select [(ngModel)]="form.visibility">
          <mat-option value="ALL">Everyone in the organization</mat-option>
          <mat-option value="ADMIN">Admins only</mat-option>
          <mat-option value="SALES">Sales team only</mat-option>
          <mat-option value="SUPPORT">Support team only</mat-option>
          <mat-option value="PRIVATE">Only me</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="upload()" [disabled]="!selectedFile||!form.type"><mat-icon>cloud_upload</mat-icon> Upload</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .drop-zone{border:2px dashed #cbd5e1;border-radius:12px;padding:32px;text-align:center;margin-bottom:16px;cursor:pointer;background:#f8fafc;transition:all .2s}
    .drop-zone:hover{border-color:#3b82f6;background:#eff6ff}
  `]
})
export class UploadDialogComponent {
  selectedFile: File | null = null;
  form = { type: '', description: '', visibility: 'ALL' };
  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onFileSelect(event: any) { this.selectedFile = event.target.files?.[0] || null; }
  onDrop(event: DragEvent) { event.preventDefault(); this.selectedFile = event.dataTransfer?.files?.[0] || null; }
  upload() { if (this.selectedFile) this.dialogRef.close({ file: this.selectedFile, ...this.form }); }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i]; }
}
