import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { UploadDialogComponent } from './upload-dialog.component';

@Component({
  selector: 'app-document-list', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatProgressBarModule, MatChipsModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Documents</h1>
        <button mat-raised-button color="primary" (click)="openUpload()"><mat-icon>cloud_upload</mat-icon> Upload Document</button>
      </div>

      <div *ngIf="uploading" class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;"><mat-spinner diameter="20"></mat-spinner><span>Uploading...</span></div>
        <mat-progress-bar mode="indeterminate" style="margin-top:8px;"></mat-progress-bar>
      </div>

      <div class="card">
        <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
        <table mat-table [dataSource]="documents" class="data-table" *ngIf="!loading && documents.length > 0">
          <ng-container matColumnDef="icon"><th mat-header-cell *matHeaderCellDef style="width:40px;"></th>
            <td mat-cell *matCellDef="let r"><mat-icon [style.color]="getColor(r.type)">{{ getIcon(r.type) }}</mat-icon></td>
          </ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Document</th>
            <td mat-cell *matCellDef="let r"><strong>{{ r.originalName || r.name }}</strong><br><small style="color:#64748b;">{{ r.description || 'No description' }}</small></td>
          </ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r"><span class="status-badge">{{ r.type || 'FILE' }}</span></td>
          </ng-container>
          <ng-container matColumnDef="size"><th mat-header-cell *matHeaderCellDef>Size</th>
            <td mat-cell *matCellDef="let r">{{ formatSize(r.fileSize) }}</td>
          </ng-container>
          <ng-container matColumnDef="uploadedBy"><th mat-header-cell *matHeaderCellDef>Uploaded By</th>
            <td mat-cell *matCellDef="let r">{{ r.uploadedBy?.firstName }} {{ r.uploadedBy?.lastName }}</td>
          </ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{ r.createdAt | date:'mediumDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r"><button mat-icon-button color="warn" (click)="del(r.id)"><mat-icon>delete</mat-icon></button></td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && documents.length === 0" class="empty-state">
          <mat-icon class="empty-icon">folder_open</mat-icon>
          <h3>No documents uploaded yet</h3>
          <p>Upload contracts, proposals, invoices, and other business files.</p>
          <button mat-raised-button color="primary" (click)="openUpload()" style="margin-top:16px;"><mat-icon>cloud_upload</mat-icon> Upload First Document</button>
        </div>
      </div>
    </div>
  `,
  styles: [`.data-table{width:100%}tr.mat-mdc-row:hover{background:#f8fafc}`]
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  cols = ['icon','name','type','size','uploadedBy','date','actions'];
  loading = true; uploading = false;
  constructor(private api: ApiService, private http: HttpClient, private notify: NotificationService, private auth: AuthService, private dialog: MatDialog) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.getPage('documents', 0, 100).subscribe({ next: r => { this.documents = r.data?.content || []; this.loading = false; }, error: () => { this.documents = []; this.loading = false; }}); }

  openUpload() {
    const ref = this.dialog.open(UploadDialogComponent, { width: '500px', data: null });
    ref.afterClosed().subscribe(result => {
      if (result?.file) {
        this.uploading = true;
        const formData = new FormData();
        formData.append('file', result.file);
        if (result.type) formData.append('type', result.type);
        if (result.description) formData.append('description', result.description);
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.auth.getToken() });
        this.http.post<any>(environment.apiUrl + '/documents', formData, { headers }).subscribe({
          next: () => { this.uploading = false; this.notify.success('Document uploaded!'); this.load(); },
          error: (e) => { this.uploading = false; this.notify.error('Upload failed: ' + (e.error?.message || e.message)); }
        });
      }
    });
  }

  del(id: string) { if (confirm('Delete this document?')) this.api.delete('documents/' + id).subscribe({ next: () => { this.notify.success('Deleted'); this.load(); }}); }
  getIcon(type: string): string { const m: any = { CONTRACT:'gavel', INVOICE:'receipt', PROPOSAL:'description', REPORT:'assessment', PRESENTATION:'slideshow', SPREADSHEET:'table_chart', IMAGE:'image' }; return m[type] || 'insert_drive_file'; }
  getColor(type: string): string { const m: any = { CONTRACT:'#1565c0', INVOICE:'#2e7d32', PROPOSAL:'#e65100', REPORT:'#6a1b9a', PRESENTATION:'#c62828', SPREADSHEET:'#1b5e20', IMAGE:'#00838f' }; return m[type] || '#757575'; }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i]; }
}
