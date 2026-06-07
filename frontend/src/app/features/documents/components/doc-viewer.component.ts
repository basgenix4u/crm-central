import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-doc-viewer', standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="viewer-header">
      <h2>{{ data.name }}</h2>
      <div>
        <button mat-button (click)="download()"><mat-icon>download</mat-icon> Download</button>
        <button mat-icon-button (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      </div>
    </div>
    <div class="viewer-body">
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner><p style="margin-top:12px;color:#64748b;">Loading file...</p></div>
      
      <!-- Image preview -->
      <img *ngIf="!loading && isImage" [src]="objectUrl" style="max-width:100%;max-height:70vh;display:block;margin:0 auto;border-radius:8px;">
      
      <!-- PDF preview -->
      <iframe *ngIf="!loading && isPdf" [src]="safeUrl" style="width:100%;height:75vh;border:none;border-radius:8px;"></iframe>
      
      <!-- Other files - show info and download -->
      <div *ngIf="!loading && !isImage && !isPdf" style="text-align:center;padding:48px;">
        <mat-icon style="font-size:64px;color:#94a3b8;">insert_drive_file</mat-icon>
        <h3 style="margin-top:16px;">{{ data.name }}</h3>
        <p style="color:#64748b;margin:8px 0;">{{ data.contentType }} &bull; {{ data.size }}</p>
        <p style="color:#64748b;">This file type cannot be previewed in the browser.</p>
        <button mat-raised-button color="primary" (click)="download()" style="margin-top:16px;"><mat-icon>download</mat-icon> Download File</button>
      </div>
    </div>
  `,
  styles: [`
    .viewer-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #e2e8f0}
    .viewer-header h2{font-size:16px;font-weight:600;margin:0}
    .viewer-body{padding:16px;background:#f8fafc;min-height:300px}
    :host{display:block;width:100%}
  `]
})
export class DocViewerComponent {
  loading = true;
  objectUrl: string = '';
  safeUrl: SafeResourceUrl = '';
  isImage = false;
  isPdf = false;
  private blob: Blob | null = null;

  constructor(
    public dialogRef: MatDialogRef<DocViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.loadFile();
  }

  loadFile() {
    const ct = this.data.contentType || '';
    this.isImage = ct.startsWith('image/');
    this.isPdf = ct === 'application/pdf';

    if (this.data.blob) {
      this.blob = this.data.blob;
      this.objectUrl = URL.createObjectURL(this.data.blob);
      if (this.isPdf) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
      }
      this.loading = false;
    }
  }

  download() {
    if (this.blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(this.blob);
      a.download = this.data.name;
      a.click();
    }
  }
}
