import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { TicketFormComponent } from './ticket-form.component';

@Component({
  selector: 'app-ticket-list', standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Support Tickets</h1><button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Ticket</button></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="ticketNumber"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r"><a [routerLink]="['/tickets',r.id]" style="color:#1976d2;font-weight:600;">{{r.ticketNumber}}</a></td></ng-container>
          <ng-container matColumnDef="subject"><th mat-header-cell *matHeaderCellDef>Subject</th><td mat-cell *matCellDef="let r">{{r.subject}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.status?.toLowerCase().replace('_','-')">{{r.status?.replace('_',' ')}}</span></td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let r"><span class="status-badge">{{r.priority}}</span></td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let r">{{r.category?.replace('_',' ')}}</td></ng-container>
          <ng-container matColumnDef="created"><th mat-header-cell *matHeaderCellDef>Created</th><td mat-cell *matCellDef="let r">{{r.createdAt | date:'mediumDate'}}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length===0" class="empty-state"><mat-icon class="empty-icon">confirmation_number</mat-icon><h3>No tickets</h3></div>
      </div>
    </div>
  `, styles: [`.data-table{width:100%}a{text-decoration:none}`]
})
export class TicketListComponent implements OnInit {
  items:any[]=[]; cols=['ticketNumber','subject','status','priority','category','created']; loading=true; total=0; page=0;
  constructor(private api:ApiService,private notify:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.api.getPage('tickets',this.page,20).subscribe({next:r=>{this.items=r.data?.content||[];this.total=r.data?.totalElements||0;this.loading=false;},error:()=>this.loading=false});}
  onPage(e:PageEvent){this.page=e.pageIndex;this.load();}
  openForm(){const ref=this.dialog.open(TicketFormComponent,{width:'95vw',maxWidth:'600px',data:null});ref.afterClosed().subscribe(r=>{if(r){this.api.post('tickets',r).subscribe({next:()=>{this.notify.success('Ticket created');this.load();},error:()=>this.notify.error('Failed')});}});}
}
