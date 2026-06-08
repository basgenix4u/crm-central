import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { EventFormComponent } from './event-form.component';

@Component({
  selector: 'app-calendar-view', standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Calendar</h1>
        <div class="actions">
          <button mat-icon-button (click)="prevMonth()"><mat-icon>chevron_left</mat-icon></button>
          <span style="font-size:18px;font-weight:600;min-width:200px;text-align:center;">{{ currentMonth }}</span>
          <button mat-icon-button (click)="nextMonth()"><mat-icon>chevron_right</mat-icon></button>
          <button mat-raised-button color="primary" style="margin-left:16px;" (click)="newEvent()"><mat-icon>add</mat-icon> New Event</button>
        </div>
      </div>
      <div class="card">
        <div class="calendar-grid">
          <div class="cal-header" *ngFor="let day of weekDays">{{ day }}</div>
          <div class="cal-cell" *ngFor="let day of calendarDays" [class.other-month]="!day.currentMonth" [class.today]="day.isToday">
            <span class="cal-date">{{ day.date }}</span>
            <div *ngFor="let event of day.events" [style.background]="event.color || '#1976d2'" style="color:white;padding:2px 6px;border-radius:4px;font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;" (click)="viewEvent(event)">
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:#e0e0e0;border-radius:8px;overflow:hidden}
    .cal-header{background:#f5f7fa;padding:12px;text-align:center;font-weight:600;font-size:13px;color:#666}
    .cal-cell{background:white;padding:8px;min-height:100px}.cal-cell.other-month{background:#fafafa}.cal-cell.other-month .cal-date{color:#ccc}.cal-cell.today{background:#e3f2fd}
    .cal-date{font-size:14px;font-weight:500}
  `]
})
export class CalendarViewComponent implements OnInit {
  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  calendarDays: any[] = [];
  currentDate = new Date();
  currentMonth = '';

  constructor(private api: ApiService, private notify: NotificationService, private dialog: MatDialog) {}
  ngOnInit() { this.buildCalendar(); this.loadEvents(); }

  buildCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    this.calendarDays = [];
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) this.calendarDays.push({ date: prevDays - i, currentMonth: false, events: [], isToday: false });
    for (let i = 1; i <= daysInMonth; i++) this.calendarDays.push({ date: i, currentMonth: true, events: [], isToday: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year });
    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) this.calendarDays.push({ date: i, currentMonth: false, events: [], isToday: false });
  }

  loadEvents() {
    this.api.getPage<any>('calendar', 0, 100).subscribe({
      next: (res) => {
        const events = res.data?.content || [];
        events.forEach((event: any) => {
          if (event.startDateTime) {
            const d = new Date(event.startDateTime);
            if (d.getMonth() === this.currentDate.getMonth() && d.getFullYear() === this.currentDate.getFullYear()) {
              const cell = this.calendarDays.find(c => c.date === d.getDate() && c.currentMonth);
              if (cell) cell.events.push(event);
            }
          }
        });
      }
    });
  }

  newEvent() {
    const ref = this.dialog.open(EventFormComponent, { width: '95vw', maxWidth: '600px', data: null });
    ref.afterClosed().subscribe(r => {
      if (r) {
        this.api.post('calendar', r).subscribe({
          next: () => { this.notify.success('Event created'); this.calendarDays.forEach(d => d.events = []); this.loadEvents(); },
          error: () => this.notify.error('Failed to create event')
        });
      }
    });
  }

  viewEvent(event: any) { alert(`${event.title}\n${event.type || ''}\n${event.location || ''}\n${event.description || ''}`); }
  prevMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1); this.calendarDays = []; this.buildCalendar(); this.loadEvents(); }
  nextMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1); this.calendarDays = []; this.buildCalendar(); this.loadEvents(); }
}
