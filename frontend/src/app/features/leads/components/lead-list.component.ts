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
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { LeadFormComponent } from './lead-form.component';

@Component({
  selector: 'app-lead-list', standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Leads</h1><div class="actions">
        <div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search..." [(ngModel)]="sq" (keyup.enter)="search()"></div>
        <button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Lead</button>
      </div></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{r.firstName}} {{r.lastName}}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let r">{{r.email}}</td></ng-container>
          <ng-container matColumnDef="company"><th mat-header-cell *matHeaderCellDef>Company</th><td mat-cell *matCellDef="let r">{{r.company}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.status?.toLowerCase()">{{r.status}}</span></td></ng-container>
          <ng-container matColumnDef="score"><th mat-header-cell *matHeaderCellDef>Score</th><td mat-cell *matCellDef="let r"><strong>{{r.score}}</strong>/100</td></ng-container>
          <ng-container matColumnDef="rating"><th mat-header-cell *matHeaderCellDef>Rating</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.rating?.toLowerCase()">{{r.rating}}</span></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="m"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #m="matMenu">
              <button mat-menu-item (click)="openForm(r)"><mat-icon>edit</mat-icon> Edit</button>
              <button mat-menu-item (click)="convert(r.id)" [disabled]="r.status==='CONVERTED'"><mat-icon>swap_horiz</mat-icon> Convert to Customer</button>
              <button mat-menu-item (click)="del(r.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
        <div *ngIf="items.length===0" class="empty-state"><mat-icon class="empty-icon">person_add</mat-icon><h3>No leads yet</h3></div>
      </div>
    </div>
  `, styles: [`.data-table{width:100%}tr.mat-mdc-row:hover{background:#f5f7fa}`]
})
export class LeadListComponent implements OnInit {
  items: any[]=[]; cols=['name','email','company','status','score','rating','actions'];
  loading=true; total=0; page=0; sq='';
  constructor(private api: ApiService, private notify: NotificationService, private dialog: MatDialog) {}
  ngOnInit() { this.load(); }
  load() { this.loading=true; this.api.getPage('leads',this.page,20).subscribe({next:r=>{this.items=r.data?.content||[];this.total=r.data?.totalElements||0;this.loading=false;},error:()=>{this.items=[];this.loading=false;}}); }
  search() { if(!this.sq){this.load();return;} this.api.getPage('leads/search',0,20,{q:this.sq}).subscribe({next:r=>{this.items=r.data?.content||[];}}); }
  onPage(e: PageEvent) { this.page=e.pageIndex; this.load(); }
  openForm(data?:any) {
    const ref=this.dialog.open(LeadFormComponent,{width:'700px',data:data||null});
    ref.afterClosed().subscribe(r=>{if(r){const c=data?.id?this.api.put('leads/'+data.id,r):this.api.post('leads',r);c.subscribe({next:()=>{this.notify.success(data?.id?'Lead updated':'Lead created');this.load();},error:()=>this.notify.error('Failed')});}});
  }
  convert(id:string) { if(confirm('Convert this lead to a customer?')) { this.api.post('leads/'+id+'/convert',{}).subscribe({next:()=>{this.notify.success('Lead converted to customer!');this.load();},error:()=>this.notify.error('Conversion failed')}); }}
  del(id:string) { if(confirm('Delete?')) this.api.delete('leads/'+id).subscribe({next:()=>{this.notify.success('Deleted');this.load();}}); }
}
