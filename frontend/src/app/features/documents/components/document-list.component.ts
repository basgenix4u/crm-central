import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
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
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Documents</h1>
        <button mat-raised-button color="primary" (click)="openUpload()"><mat-icon>cloud_upload</mat-icon> Upload</button>
      </div>
      <div *ngIf="uploading" class="card" style="margin-bottom:16px;"><div style="display:flex;align-items:center;gap:12px;"><mat-spinner diameter="20"></mat-spinner><span>Uploading...</span></div><mat-progress-bar mode="indeterminate" style="margin-top:8px;"></mat-progress-bar></div>
      <div class="card">
        <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
        <table mat-table [dataSource]="documents" class="data-table" *ngIf="!loading && documents.length > 0">
          <ng-container matColumnDef="icon"><th mat-header-cell *matHeaderCellDef style="width:40px;"></th><td mat-cell *matCellDef="let r"><mat-icon [style.color]="getColor(r.type)">{{ getIcon(r.type) }}</mat-icon></td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Document</th><td mat-cell *matCellDef="let r"><a (click)="viewDoc(r);$event.stopPropagation()" style="color:#3b82f6;cursor:pointer;font-weight:600;">{{ r.originalName || r.name }}</a><br><small style="color:#64748b;">{{ r.description || '' }}</small></td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.type || 'FILE' }}</span></td></ng-container>
          <ng-container matColumnDef="size"><th mat-header-cell *matHeaderCellDef>Size</th><td mat-cell *matCellDef="let r">{{ formatSize(r.fileSize) }}</td></ng-container>
          <ng-container matColumnDef="by"><th mat-header-cell *matHeaderCellDef>By</th><td mat-cell *matCellDef="let r">{{ r.uploadedBy?.firstName }} {{ r.uploadedBy?.lastName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.createdAt | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="m"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #m="matMenu">
              <button mat-menu-item (click)="viewDoc(r)"><mat-icon>visibility</mat-icon> View</button>
              <button mat-menu-item (click)="downloadDoc(r)"><mat-icon>download</mat-icon> Download</button>
              <button mat-menu-item (click)="del(r.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && documents.length === 0" class="empty-state"><mat-icon class="empty-icon">folder_open</mat-icon><h3>No documents yet</h3><p>Upload contracts, proposals, invoices.</p>
          <button mat-raised-button color="primary" (click)="openUpload()" style="margin-top:16px;"><mat-icon>cloud_upload</mat-icon> Upload</button>
        </div>
      </div>
    </div>
  `,
  styles: [`.data-table{width:100%}tr.mat-mdc-row:hover{background:#f8fafc}`]
})
export class DocumentListComponent implements OnInit {
  documents: any[] = []; cols = ['icon','name','type','size','by','date','actions'];
  loading = true; uploading = false;
  constructor(private api: ApiService, private http: HttpClient, private notify: NotificationService, private auth: AuthService, private dialog: MatDialog) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.getPage('documents', 0, 100).subscribe({ next: r => { this.documents = r.data?.content || []; this.loading = false; }, error: () => { this.documents = []; this.loading = false; }}); }

  openUpload() {
    const ref = this.dialog.open(UploadDialogComponent, { width: '500px', data: null });
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
          width: '90vw', maxWidth: '1000px', height: '85vh',
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
  getColor(type: string): string { const m: any = { CONTRACT:'#1565c0', INVOICE:'#2e7d32', PROPOSAL:'#e65100', REPORT:'#6a1b9a', IMAGE:'#00838f' }; return m[type] || '#757575'; }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i]; }
}
