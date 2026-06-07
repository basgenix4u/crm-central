import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { CampaignFormComponent } from './campaign-form.component';

@Component({
  selector: 'app-campaign-list', standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Campaigns</h1><button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Campaign</button></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r">{{r.type}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.status?.toLowerCase()">{{r.status}}</span></td></ng-container>
          <ng-container matColumnDef="budget"><th mat-header-cell *matHeaderCellDef>Budget</th><td mat-cell *matCellDef="let r"><span>$</span>{{r.budget | number}}</td></ng-container>
          <ng-container matColumnDef="leads"><th mat-header-cell *matHeaderCellDef>Leads</th><td mat-cell *matCellDef="let r">{{r.leadsGenerated || 0}}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="m"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #m="matMenu"><button mat-menu-item (click)="openForm(r)"><mat-icon>edit</mat-icon> Edit</button><button mat-menu-item (click)="del(r.id)"><mat-icon>delete</mat-icon> Delete</button></mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `, styles: [`.data-table{width:100%}`]
})
export class CampaignListComponent implements OnInit {
  items:any[]=[]; cols=['name','type','status','budget','leads','actions']; loading=true; total=0; page=0;
  constructor(private api:ApiService,private notify:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.api.getPage('campaigns',this.page,20).subscribe({next:r=>{this.items=r.data?.content||[];this.total=r.data?.totalElements||0;this.loading=false;},error:()=>this.loading=false});}
  onPage(e:PageEvent){this.page=e.pageIndex;this.load();}
  openForm(data?:any){const ref=this.dialog.open(CampaignFormComponent,{width:'600px',data:data||null});ref.afterClosed().subscribe(r=>{if(r){(data?.id?this.api.put('campaigns/'+data.id,r):this.api.post('campaigns',r)).subscribe({next:()=>{this.notify.success('Saved');this.load();},error:()=>this.notify.error('Failed')});}});}
  del(id:string){if(confirm('Delete?'))this.api.delete('campaigns/'+id).subscribe({next:()=>{this.notify.success('Deleted');this.load();}});}
}
