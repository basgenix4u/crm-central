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
import { OpportunityFormComponent } from './opportunity-form.component';

@Component({
  selector: 'app-opportunity-list', standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Opportunities</h1>
        <button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Opportunity</button>
      </div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="card" *ngIf="!loading">
        <table mat-table [dataSource]="items" class="data-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Deal Name</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
          <ng-container matColumnDef="stage"><th mat-header-cell *matHeaderCellDef>Stage</th><td mat-cell *matCellDef="let r"><span class="status-badge" [ngClass]="r.stage?.toLowerCase()">{{r.stage}}</span></td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let r"><strong><span>$</span>{{r.amount | number}}</strong></td></ng-container>
          <ng-container matColumnDef="probability"><th mat-header-cell *matHeaderCellDef>Prob.</th><td mat-cell *matCellDef="let r">{{r.probability}}%</td></ng-container>
          <ng-container matColumnDef="closeDate"><th mat-header-cell *matHeaderCellDef>Close Date</th><td mat-cell *matCellDef="let r">{{r.expectedCloseDate}}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
            <button mat-icon-button [matMenuTriggerFor]="m"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #m="matMenu">
              <button mat-menu-item (click)="openForm(r)"><mat-icon>edit</mat-icon> Edit</button>
              <button mat-menu-item (click)="del(r.id)"><mat-icon>delete</mat-icon> Delete</button>
            </mat-menu>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `, styles: [`.data-table{width:100%}`]
})
export class OpportunityListComponent implements OnInit {
  items:any[]=[]; cols=['name','stage','amount','probability','closeDate','actions'];
  loading=true; total=0; page=0;
  constructor(private api:ApiService,private notify:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.api.getPage('opportunities',this.page,20).subscribe({next:r=>{this.items=r.data?.content||[];this.total=r.data?.totalElements||0;this.loading=false;},error:()=>this.loading=false});}
  onPage(e:PageEvent){this.page=e.pageIndex;this.load();}
  openForm(data?:any){
    const ref=this.dialog.open(OpportunityFormComponent,{width:'700px',data:data||null});
    ref.afterClosed().subscribe(r=>{if(r){const c=data?.id?this.api.put('opportunities/'+data.id,r):this.api.post('opportunities',r);c.subscribe({next:()=>{this.notify.success(data?.id?'Updated':'Created');this.load();},error:()=>this.notify.error('Failed')});}});
  }
  del(id:string){if(confirm('Delete?'))this.api.delete('opportunities/'+id).subscribe({next:()=>{this.notify.success('Deleted');this.load();}});}
}
