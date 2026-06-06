import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-document-list', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Documents</h1><button mat-raised-button color="primary"><mat-icon>upload</mat-icon> Upload Document</button></div>
      <div class="card">
        <table mat-table [dataSource]="documents" class="data-table" *ngIf="documents.length > 0">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r"><mat-icon style="vertical-align:middle;margin-right:8px;">{{ getFileIcon(r.contentType) }}</mat-icon>{{ r.originalName }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r">{{ r.type }}</td></ng-container>
          <ng-container matColumnDef="size"><th mat-header-cell *matHeaderCellDef>Size</th><td mat-cell *matCellDef="let r">{{ formatSize(r.fileSize) }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Uploaded</th><td mat-cell *matCellDef="let r">{{ r.createdAt | date:'mediumDate' }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['name','type','size','date']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name','type','size','date'];"></tr>
        </table>
        <div *ngIf="documents.length === 0" class="empty-state"><mat-icon class="empty-icon">folder_open</mat-icon><h3>No documents yet</h3><p>Upload files to get started.</p></div>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getPage('documents', 0, 50).subscribe({ next: r => this.documents = r.data?.content || [] }); }
  getFileIcon(type: string): string { if (!type) return 'insert_drive_file'; if (type.includes('pdf')) return 'picture_as_pdf'; if (type.includes('image')) return 'image'; if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart'; return 'insert_drive_file'; }
  formatSize(bytes: number): string { if (!bytes) return '0 B'; const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]; }
}
