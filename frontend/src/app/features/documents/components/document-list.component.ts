import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { UploadDialogComponent } from './upload-dialog.component';
import { DocViewerComponent } from './doc-viewer.component';

@Component({
  selector: 'app-document-list', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Documents</h1>
        <button mat-raised-button color="primary" (click)="openUpload()"><mat-icon>cloud_upload</mat-icon> Upload</button>
      </div>
      <div *ngIf="uploading" class="card" style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:10px;"><mat-spinner diameter="18"></mat-spinner><span style="font-size:13px;">Uploading...</span></div>
        <mat-progress-bar mode="indeterminate" style="margin-top:6px;"></mat-progress-bar>
      </div>
      <div class="card" style="padding:0;">
        <div *ngIf="loading" style="text-align:center;padding:40px;"><mat-spinner diameter="36" style="margin:0 auto;"></mat-spinner></div>

        <!-- Document list - card style for mobile friendliness -->
        <div *ngIf="!loading && documents.length > 0">
          <div class="doc-header">
            <div style="width:24px;"></div>
            <div style="flex:1;">Name</div>
            <div class="doc-header-col">Type</div>
            <div class="doc-header-col">Size</div>
            <div class="doc-header-col">Date</div>
            <div style="width:40px;"></div>
          </div>
          <div *ngFor="let doc of documents" class="doc-row" (click)="viewDoc(doc)">
            <mat-icon class="doc-icon" [style.color]="getColor(doc.type)">{{ getIcon(doc.type) }}</mat-icon>
            <div class="doc-info">
              <div class="doc-name">{{ doc.originalName || doc.name }}</div>
              <div class="doc-meta">
                <span class="doc-badge">{{ doc.type || 'FILE' }}</span>
                <span>{{ formatSize(doc.fileSize) }}</span>
                <span class="doc-date">{{ doc.createdAt | date:'shortDate' }}</span>
              </div>
            </div>
            <button mat-icon-button [matMenuTriggerFor]="docMenu" (click)="$event.stopPropagation()">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #docMenu="matMenu">
              <button mat-menu-item (click)="viewDoc(doc)"><mat-icon>visibility</mat-icon> View</button>
              <button mat-menu-item (click)="downloadDoc(doc)"><mat-icon>download</mat-icon> Download</button>
              <button mat-menu-item (click)="del(doc.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </div>
        </div>

        <div *ngIf="!loading && documents.length === 0" class="empty-state">
          <mat-icon class="empty-icon">folder_open</mat-icon><h3>No documents yet</h3>
          <p>Upload contracts, proposals, invoices.</p>
          <button mat-raised-button color="primary" (click)="openUpload()" style="margin-top:12px;"><mat-icon>cloud_upload</mat-icon> Upload</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doc-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .15s}
    .doc-row:hover{background:#f8fafc}
    .doc-row:last-child{border-bottom:none}
    .doc-icon{font-size:24px;width:24px;height:24px;flex-shrink:0}
    .doc-info{flex:1;min-width:0}
    .doc-name{font-size:13px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .doc-meta{display:flex;align-items:center;gap:8px;margin-top:3px;font-size:11px;color:#64748b;flex-wrap:wrap}
    .doc-badge{background:#f1f5f9;color:#475569;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase}
    .doc-date{color:#94a3b8}
    .doc-header{display:flex;align-items:center;gap:12px;padding:8px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px}
    .doc-header-col{width:70px;text-align:left}
    @media(max-width:640px){
      .doc-header{display:none}
      .doc-row{padding:10px 12px;gap:10px}
      .doc-name{font-size:12px}
      .doc-meta{font-size:10px;gap:6px}
    }
  `]
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  loading = true; uploading = false;
  constructor(private api: ApiService, private http: HttpClient, private notify: NotificationService, private auth: AuthService, private dialog: MatDialog) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.getPage('documents', 0, 100).subscribe({ next: r => { this.documents = r.data?.content || []; this.loading = false; }, error: () => { this.documents = []; this.loading = false; }}); }

  openUpload() {
    const ref = this.dialog.open(UploadDialogComponent, { width: '95vw', maxWidth: '500px', data: null });
    ref.afterClosed().subscribe(result => {
      if (result?.file) {
        this.uploading = true;
        const fd = new FormData(); fd.append('file', result.file);
        if (result.type) fd.append('type', result.type);
        if (result.description) fd.append('description', result.description);
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.auth.getToken() });
        this.http.post<any>(environment.apiUrl + '/documents', fd, { headers }).subscribe({
          next: () => { this.uploading = false; this.notify.success('Uploaded!'); this.load(); },
          error: () => { this.uploading = false; this.notify.error('Upload failed'); }
        });
      }
    });
  }

  viewDoc(doc: any) {
    const url = environment.apiUrl.replace('/v1', '') + '/v1/files/' + doc.id;
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.dialog.open(DocViewerComponent, {
          width: '95vw', maxWidth: '1000px', maxHeight: '90vh',
          data: { name: doc.originalName || doc.name, contentType: doc.contentType, size: this.formatSize(doc.fileSize), blob }
        });
      },
      error: () => this.notify.error('Could not load file')
    });
  }

  downloadDoc(doc: any) {
    const url = environment.apiUrl.replace('/v1', '') + '/v1/files/' + doc.id + '/download';
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = doc.originalName || doc.name; a.click(); },
      error: () => this.notify.error('Download failed')
    });
  }

  del(id: string) { if (confirm('Delete?')) this.api.delete('documents/' + id).subscribe({ next: () => { this.notify.success('Deleted'); this.load(); }}); }
  getIcon(type: string): string { const m: any = { CONTRACT:'gavel', INVOICE:'receipt', PROPOSAL:'description', REPORT:'assessment', IMAGE:'image' }; return m[type] || 'insert_drive_file'; }
  getColor(type: string): string { const m: any = { CONTRACT:'#1565c0', INVOICE:'#2e7d32', PROPOSAL:'#e65100', REPORT:'#6a1b9a', IMAGE:'#00838f' }; return m[type] || '#64748b'; }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i]; }
}
