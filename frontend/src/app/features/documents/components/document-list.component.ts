import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-document-list', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatMenuModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Documents</h1>
        <button mat-raised-button color="primary" (click)="fileInput.click()"><mat-icon>upload</mat-icon> Upload Document</button>
        <input type="file" #fileInput hidden (change)="onFileSelected($event)" multiple>
      </div>
      <div *ngIf="uploading" style="text-align:center;padding:24px;"><mat-spinner diameter="30" style="margin:0 auto;"></mat-spinner><p>Uploading...</p></div>
      <div class="card">
        <table mat-table [dataSource]="documents" class="data-table" *ngIf="documents.length > 0">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r"><mat-icon style="vertical-align:middle;margin-right:8px;">{{ getFileIcon(r.contentType) }}</mat-icon>{{ r.originalName || r.name }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r">{{ r.type || r.contentType }}</td></ng-container>
          <ng-container matColumnDef="size"><th mat-header-cell *matHeaderCellDef>Size</th><td mat-cell *matCellDef="let r">{{ formatSize(r.fileSize) }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Uploaded</th><td mat-cell *matCellDef="let r">{{ r.createdAt | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button (click)="del(r.id)"><mat-icon>delete</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['name','type','size','date','actions']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name','type','size','date','actions'];"></tr>
        </table>
        <div *ngIf="documents.length === 0" class="empty-state"><mat-icon class="empty-icon">folder_open</mat-icon><h3>No documents yet</h3><p>Click "Upload Document" to add files.</p></div>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class DocumentListComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  documents: any[] = [];
  uploading = false;
  constructor(private api: ApiService, private notify: NotificationService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('documents', 0, 50).subscribe({ next: r => this.documents = r.data?.content || [] }); }
  
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    this.uploading = true;
    let completed = 0;
    for (let i = 0; i < files.length; i++) {
      this.api.upload('documents', files[i]).subscribe({
        next: () => { completed++; if (completed === files.length) { this.uploading = false; this.notify.success(files.length + ' file(s) uploaded'); this.load(); this.fileInput.nativeElement.value = ''; } },
        error: () => { completed++; if (completed === files.length) { this.uploading = false; this.notify.error('Some uploads failed'); this.load(); } }
      });
    }
  }
  
  del(id: string) { if (confirm('Delete?')) this.api.delete('documents/' + id).subscribe({ next: () => { this.notify.success('Deleted'); this.load(); } }); }
  getFileIcon(type: string): string { if (!type) return 'insert_drive_file'; if (type.includes('pdf')) return 'picture_as_pdf'; if (type.includes('image')) return 'image'; if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart'; return 'insert_drive_file'; }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]; }
}
