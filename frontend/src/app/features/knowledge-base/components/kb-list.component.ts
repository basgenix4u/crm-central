import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { KBFormComponent } from './kb-form.component';

@Component({
  selector: 'app-kb-list', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatProgressSpinnerModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Knowledge Base</h1><div class="actions">
        <div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search articles..." [(ngModel)]="sq" (keyup.enter)="search()"></div>
        <button mat-raised-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> New Article</button>
      </div></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="articles-grid" *ngIf="!loading">
        <div class="card article-card" *ngFor="let a of articles">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <h3>{{a.title}}</h3>
            <div>
              <span class="status-badge" [ngClass]="a.status?.toLowerCase()">{{a.status}}</span>
              <button mat-icon-button [matMenuTriggerFor]="m" style="margin-left:4px;"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #m="matMenu">
                <button mat-menu-item (click)="openForm(a)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="del(a.id)"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
          </div>
          <p style="color:#666;margin:8px 0;">{{a.category}}</p>
          <p style="font-size:14px;color:#555;">{{a.content?.substring(0, 150)}}...</p>
          <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:12px;color:#999;">
            <span><mat-icon style="font-size:14px;vertical-align:middle;">visibility</mat-icon> {{a.viewCount||0}} views</span>
            <span><mat-icon style="font-size:14px;vertical-align:middle;">thumb_up</mat-icon> {{a.helpfulCount||0}}</span>
          </div>
        </div>
      </div>
      <div *ngIf="!loading && articles.length===0" class="empty-state"><mat-icon class="empty-icon">menu_book</mat-icon><h3>No articles yet</h3><p>Click "New Article" to create your first knowledge base article.</p></div>
    </div>
  `,
  styles: [`.articles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px}.article-card{cursor:pointer;transition:transform .2s,box-shadow .2s}.article-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}`]
})
export class KBListComponent implements OnInit {
  articles:any[]=[]; loading=true; sq='';
  constructor(private api:ApiService,private notify:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.api.getPage('knowledge-base',0,50).subscribe({next:r=>{this.articles=r.data?.content||[];this.loading=false;},error:()=>this.loading=false});}
  search(){if(!this.sq){this.load();return;}this.api.getPage('knowledge-base/search',0,50,{q:this.sq}).subscribe({next:r=>this.articles=r.data?.content||[]});}
  openForm(data?:any){const ref=this.dialog.open(KBFormComponent,{width:'700px',data:data||null});ref.afterClosed().subscribe(r=>{if(r){(data?.id?this.api.put('knowledge-base/'+data.id,r):this.api.post('knowledge-base',r)).subscribe({next:()=>{this.notify.success(data?.id?'Article updated':'Article created');this.load();},error:()=>this.notify.error('Failed')});}});}
  del(id:string){if(confirm('Delete this article?'))this.api.delete('knowledge-base/'+id).subscribe({next:()=>{this.notify.success('Deleted');this.load();}});}
}
