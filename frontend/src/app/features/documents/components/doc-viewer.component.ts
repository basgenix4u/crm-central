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
      <div class="viewer-title">
        <mat-icon [style.color]="getColor()">{{ getIcon() }}</mat-icon>
        <div>
          <h2>{{ data.name }}</h2>
          <small>{{ data.size }}</small>
        </div>
      </div>
      <div class="viewer-actions">
        <button mat-raised-button color="primary" (click)="download()"><mat-icon>download</mat-icon><span class="btn-text"> Save</span></button>
        <button mat-icon-button (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      </div>
    </div>

    <div class="viewer-body">
      <div *ngIf="loading" class="viewer-loading">
        <mat-spinner diameter="36"></mat-spinner>
        <p>Loading file...</p>
      </div>

      <!-- Image -->
      <div *ngIf="!loading && isImage" class="viewer-content">
        <img [src]="objectUrl" alt="Preview">
      </div>

      <!-- PDF: open in new tab on mobile since iframe blob is blocked -->
      <div *ngIf="!loading && isPdf" class="viewer-content viewer-pdf">
        <iframe [src]="safeUrl" class="pdf-frame desktop-pdf"></iframe>
        <div class="mobile-pdf">
          <mat-icon style="font-size:56px;width:56px;height:56px;color:#ef4444;">picture_as_pdf</mat-icon>
          <h3>{{ data.name }}</h3>
          <p>PDF files open best in your device's viewer</p>
          <button mat-raised-button color="primary" (click)="openInNewTab()"><mat-icon>open_in_new</mat-icon> Open PDF</button>
          <button mat-stroked-button (click)="download()" style="margin-top:8px;"><mat-icon>download</mat-icon> Download</button>
        </div>
      </div>

      <!-- Other files -->
      <div *ngIf="!loading && !isImage && !isPdf" class="viewer-content viewer-other">
        <mat-icon style="font-size:56px;width:56px;height:56px;color:#94a3b8;">insert_drive_file</mat-icon>
        <h3>{{ data.name }}</h3>
        <p>{{ data.contentType }}</p>
        <p style="color:#94a3b8;">Preview not available for this file type</p>
        <button mat-raised-button color="primary" (click)="download()" style="margin-top:12px;"><mat-icon>download</mat-icon> Download File</button>
      </div>
    </div>
  `,
  styles: [`
    :host{display:block;width:100%}
    .viewer-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #e2e8f0;gap:8px}
    .viewer-title{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
    .viewer-title h2{font-size:14px;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .viewer-title small{font-size:11px;color:#64748b}
    .viewer-actions{display:flex;align-items:center;gap:4px;flex-shrink:0}
    .viewer-body{background:#f8fafc;min-height:200px}
    .viewer-loading{text-align:center;padding:40px}
    .viewer-loading p{margin-top:10px;color:#64748b;font-size:13px}
    .viewer-content{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px}
    .viewer-content img{max-width:100%;max-height:65vh;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .pdf-frame{width:100%;height:65vh;border:none;border-radius:8px}
    .viewer-other,.mobile-pdf{text-align:center;padding:32px 16px}
    .viewer-other h3,.mobile-pdf h3{margin:12px 0 4px;font-size:16px}
    .viewer-other p,.mobile-pdf p{color:#64748b;font-size:13px;margin-bottom:8px}
    .desktop-pdf{display:block}
    .mobile-pdf{display:none}
    @media(max-width:640px){
      .viewer-header{padding:10px 12px}
      .viewer-title h2{font-size:13px}
      .btn-text{display:none}
      .viewer-content img{max-height:50vh}
      .desktop-pdf{display:none}
      .mobile-pdf{display:block}
      .viewer-content{padding:12px}
    }
  `]
})
export class DocViewerComponent {
  loading = true;
  objectUrl = '';
  safeUrl: SafeResourceUrl = '';
  isImage = false;
  isPdf = false;
  private blob: Blob | null = null;

  constructor(
    public dialogRef: MatDialogRef<DocViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) { this.loadFile(); }

  loadFile() {
    const ct = this.data.contentType || '';
    this.isImage = ct.startsWith('image/');
    this.isPdf = ct === 'application/pdf';
    if (this.data.blob) {
      this.blob = this.data.blob;
      this.objectUrl = URL.createObjectURL(this.data.blob);
      if (this.isPdf) this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
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

  openInNewTab() {
    if (this.blob) {
      const url = URL.createObjectURL(this.blob);
      window.open(url, '_blank');
    }
  }

  getIcon(): string {
    if (this.isPdf) return 'picture_as_pdf';
    if (this.isImage) return 'image';
    return 'insert_drive_file';
  }

  getColor(): string {
    if (this.isPdf) return '#ef4444';
    if (this.isImage) return '#22c55e';
    return '#64748b';
  }
}
