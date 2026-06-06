import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-contact-list', standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Contacts</h1>
        <div class="actions"><div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search..." [(ngModel)]="sq" (keyup.enter)="search()"></div><button mat-raised-button color="primary"><mat-icon>add</mat-icon> New</button></div>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{ r.firstName }} {{ r.lastName }}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let r">{{ r.email }}</td></ng-container>
          <ng-container matColumnDef="phone"><th mat-header-cell *matHeaderCellDef>Phone</th><td mat-cell *matCellDef="let r">{{ r.phone }}</td></ng-container>
          <ng-container matColumnDef="company"><th mat-header-cell *matHeaderCellDef>Company</th><td mat-cell *matCellDef="let r">{{ r.company }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="del(r.id)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `, styles: [`.data-table { width: 100%; }`]
})
export class ContactListComponent implements OnInit {
  items: any[] = []; cols = ['name','email','phone','company','actions'];
  loading = true; total = 0; page = 0; sq = '';
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('contacts', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.total = r.data?.totalElements||0; this.loading = false; }, error: () => this.loading = false }); }
  search() { if (!this.sq) { this.load(); return; } this.api.getPage('contacts/search', 0, 20, { q: this.sq }).subscribe({ next: r => this.items = r.data?.content||[] }); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
  del(id: string) { if (confirm('Sure?')) this.api.delete('contacts/' + id).subscribe({ next: () => this.load() }); }
}
