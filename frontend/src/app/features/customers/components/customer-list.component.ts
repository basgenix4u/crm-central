import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { CustomerFormComponent } from './customer-form.component';

@Component({
  selector: 'app-customer-list', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customers</h1>
        <div class="actions">
          <div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search..." [(ngModel)]="searchQuery" (keyup.enter)="search()"></div>
          <button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Customer</button>
        </div>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let r"><a [routerLink]="['/customers',r.id]" style="color:#1976d2;text-decoration:none;font-weight:600;">{{r.firstName}} {{r.lastName}}</a></td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let r">{{r.email}}</td></ng-container>
          <ng-container matColumnDef="company"><th mat-header-cell *matHeaderCellDef>Company</th><td mat-cell *matCellDef="let r">{{r.company}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge active">{{r.status}}</span></td></ng-container>
          <ng-container matColumnDef="industry"><th mat-header-cell *matHeaderCellDef>Industry</th><td mat-cell *matCellDef="let r">{{r.industry}}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="rowMenu"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #rowMenu="matMenu">
              <button mat-menu-item [routerLink]="['/customers',r.id]"><mat-icon>visibility</mat-icon> View</button>
              <button mat-menu-item (click)="openForm(r)"><mat-icon>edit</mat-icon> Edit</button>
              <button mat-menu-item (click)="deleteItem(r.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length===0" class="empty-state"><mat-icon class="empty-icon">people</mat-icon><h3>No customers yet</h3><p>Click "New Customer" to add your first customer.</p></div>
      </div>
    </div>
  `, styles: [`.data-table{width:100%}tr.mat-mdc-row:hover{background:#f5f7fa;cursor:pointer}`]
})
export class CustomerListComponent implements OnInit {
  items: any[] = []; cols = ['name','email','company','status','industry','actions'];
  loading = true; total = 0; page = 0; searchQuery = '';
  constructor(private api: ApiService, private notify: NotificationService, private dialog: MatDialog) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.getPage('customers', this.page, 20).subscribe({ next: r => { this.items = r.data?.content||[]; this.total = r.data?.totalElements||0; this.loading = false; }, error: () => { this.items=[]; this.loading=false; }}); }
  search() { if (!this.searchQuery) { this.load(); return; } this.api.getPage('customers/search', 0, 20, { q: this.searchQuery }).subscribe({ next: r => { this.items = r.data?.content||[]; this.total = r.data?.totalElements||0; }}); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.load(); }
  openForm(data?: any) {
    const ref = this.dialog.open(CustomerFormComponent, { width: '700px', data: data || null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const call = data?.id ? this.api.put('customers/' + data.id, result) : this.api.post('customers', result);
        call.subscribe({ next: () => { this.notify.success(data?.id ? 'Customer updated' : 'Customer created'); this.load(); }, error: () => this.notify.error('Failed to save customer') });
      }
    });
  }
  deleteItem(id: string) { if (confirm('Delete this customer?')) { this.api.delete('customers/' + id).subscribe({ next: () => { this.notify.success('Customer deleted'); this.load(); }}); }}
}
