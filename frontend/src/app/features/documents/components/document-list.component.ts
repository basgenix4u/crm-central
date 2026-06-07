import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-document-list', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Documents</h1>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="triggerUpload()">
            <mat-icon>cloud_upload</mat-icon> Upload Document
          </button>
        </div>
      </div>

      <input type="file" id="docFileInput" style="display:none" (change)="handleFile($event)" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg,.gif">

      <div *ngIf="uploading" class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <mat-spinner diameter="24"></mat-spinner>
          <span>Uploading {{ uploadFileName }}...</span>
        </div>
        <mat-progress-bar mode="indeterminate" style="margin-top:8px;"></mat-progress-bar>
      </div>

      <div *ngIf="uploadError" class="card" style="margin-bottom:16px;background:#fce4ec;color:#c62828;">
        <div style="display:flex;align-items:center;gap:8px;">
          <mat-icon>error</mat-icon>
          <span>Upload failed: {{ uploadError }}</span>
          <button mat-button (click)="uploadError=''">Dismiss</button>
        </div>
      </div>

      <div class="card">
        <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
        <table mat-table [dataSource]="documents" class="data-table" *ngIf="!loading && documents.length > 0">
          <ng-container matColumnDef="icon"><th mat-header-cell *matHeaderCellDef style="width:40px;"></th><td mat-cell *matCellDef="let r"><mat-icon [style.color]="getFileColor(r.contentType)">{{ getFileIcon(r.contentType) }}</mat-icon></td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>File Name</th><td mat-cell *matCellDef="let r"><strong>{{ r.originalName || r.name }}</strong><br><small style="color:#999;">{{ r.description || 'No description' }}</small></td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{ getTypeLabel(r.contentType) }}</span></td></ng-container>
          <ng-container matColumnDef="size"><th mat-header-cell *matHeaderCellDef>Size</th><td mat-cell *matCellDef="let r">{{ formatSize(r.fileSize) }}</td></ng-container>
          <ng-container matColumnDef="uploaded"><th mat-header-cell *matHeaderCellDef>Uploaded</th><td mat-cell *matCellDef="let r">{{ r.createdAt | date:'medium' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button color="warn" (click)="deleteDoc(r.id)"><mat-icon>delete</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && documents.length === 0" class="empty-state">
          <mat-icon class="empty-icon">folder_open</mat-icon>
          <h3>No documents yet</h3>
          <p>Upload contracts, proposals, invoices, or any files related to your business.</p>
          <button mat-raised-button color="primary" (click)="triggerUpload()" style="margin-top:16px;"><mat-icon>cloud_upload</mat-icon> Upload Your First Document</button>
        </div>
      </div>
    </div>
  `,
  styles: [`.data-table{width:100%} tr.mat-mdc-row:hover{background:#f5f7fa}`]
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  cols = ['icon', 'name', 'type', 'size', 'uploaded', 'actions'];
  loading = true;
  uploading = false;
  uploadFileName = '';
  uploadError = '';

  constructor(private api: ApiService, private http: HttpClient, private notify: NotificationService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getPage('documents', 0, 100).subscribe({
      next: r => { this.documents = r.data?.content || []; this.loading = false; },
      error: () => { this.documents = []; this.loading = false; }
    });
  }

  triggerUpload() {
    const input = document.getElementById('docFileInput') as HTMLInputElement;
    if (input) input.click();
  }

  handleFile(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    
    this.uploadError = '';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploading = true;
      this.uploadFileName = file.name;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', file.name);

      const token = this.auth.getToken();
      const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

      this.http.post<any>(`${environment.apiUrl}/documents`, formData, { headers }).subscribe({
        next: (res) => {
          this.uploading = false;
          this.notify.success(file.name + ' uploaded successfully!');
          this.load();
          (event.target as HTMLInputElement).value = '';
        },
        error: (err) => {
          this.uploading = false;
          this.uploadError = err.error?.message || err.message || 'Unknown error';
          this.notify.error('Failed to upload ' + file.name);
          (event.target as HTMLInputElement).value = '';
        }
      });
    }
  }

  deleteDoc(id: string) {
    if (confirm('Delete this document?')) {
      this.api.delete('documents/' + id).subscribe({
        next: () => { this.notify.success('Document deleted'); this.load(); },
        error: () => this.notify.error('Failed to delete')
      });
    }
  }

  getFileIcon(type: string): string {
    if (!type) return 'insert_drive_file';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('text')) return 'article';
    return 'insert_drive_file';
  }

  getFileColor(type: string): string {
    if (!type) return '#999';
    if (type.includes('pdf')) return '#e53935';
    if (type.includes('image')) return '#43a047';
    if (type.includes('spreadsheet') || type.includes('excel')) return '#1e88e5';
    if (type.includes('word')) return '#1565c0';
    return '#757575';
  }

  getTypeLabel(type: string): string {
    if (!type) return 'File';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('image')) return 'Image';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('word')) return 'Word';
    if (type.includes('text')) return 'Text';
    if (type.includes('csv')) return 'CSV';
    return type.split('/').pop() || 'File';
  }

  formatSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
