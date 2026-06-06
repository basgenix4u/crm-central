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
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-kb-list', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Knowledge Base</h1><div class="actions">
        <div class="search-bar"><mat-icon>search</mat-icon><input placeholder="Search articles..." [(ngModel)]="searchQuery" (keyup.enter)="search()"></div>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> New Article</button>
      </div></div>
      <div *ngIf="loading" style="text-align:center;padding:48px;"><mat-spinner diameter="40" style="margin:0 auto;"></mat-spinner></div>
      <div class="articles-grid" *ngIf="!loading">
        <div class="card article-card" *ngFor="let article of articles">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <h3>{{ article.title }}</h3>
            <span class="status-badge" [ngClass]="article.status?.toLowerCase()">{{ article.status }}</span>
          </div>
          <p style="color:#666;margin:8px 0;">{{ article.category }}</p>
          <p style="font-size:14px;color:#555;">{{ article.content?.substring(0, 150) }}...</p>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <mat-chip *ngFor="let tag of article.tags">{{ tag }}</mat-chip>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:12px;color:#999;">
            <span><mat-icon style="font-size:14px;vertical-align:middle;">visibility</mat-icon> {{ article.viewCount }} views</span>
            <span><mat-icon style="font-size:14px;vertical-align:middle;">thumb_up</mat-icon> {{ article.helpfulCount }}</span>
          </div>
        </div>
      </div>
      <div *ngIf="!loading && articles.length === 0" class="empty-state"><mat-icon class="empty-icon">menu_book</mat-icon><h3>No articles yet</h3></div>
    </div>
  `,
  styles: [`.articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .article-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); } }`]
})
export class KBListComponent implements OnInit {
  articles: any[] = []; loading = true; searchQuery = '';
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getPage('knowledge-base', 0, 50).subscribe({ next: r => { this.articles = r.data?.content||[]; this.loading = false; }, error: () => this.loading = false }); }
  search() { this.api.getPage('knowledge-base/search', 0, 50, { q: this.searchQuery }).subscribe({ next: r => this.articles = r.data?.content||[] }); }
}
