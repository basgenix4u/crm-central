import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-logo">hub</mat-icon>
          <h1>Create Account</h1>
          <p>Start managing your business</p>
        </div>
        <form (ngSubmit)="register()" class="auth-form">
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" name="firstName" required></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" name="lastName" required></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Email</mat-label><input matInput type="email" [(ngModel)]="form.email" name="email" required><mat-icon matPrefix>email</mat-icon></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Company</mat-label><input matInput [(ngModel)]="form.company" name="company"><mat-icon matPrefix>business</mat-icon></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Password</mat-label><input matInput type="password" [(ngModel)]="form.password" name="password" required><mat-icon matPrefix>lock</mat-icon></mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Create Account</span>
          </button>
        </form>
        <div class="auth-footer"><p>Already have an account? <a routerLink="/auth/login">Sign in</a></p></div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
    .auth-card { background: white; border-radius: 16px; padding: 40px; width: 100%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .auth-header { text-align: center; margin-bottom: 32px; .auth-logo { font-size: 48px; width: 48px; height: 48px; color: #1976d2; } h1 { font-size: 24px; font-weight: 700; margin-top: 8px; } p { color: #666; } }
    .full-width { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .login-btn { height: 48px; font-size: 16px; border-radius: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; a { color: #1976d2; text-decoration: none; font-weight: 600; } }
  `]
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '', company: '' };
  loading = false;
  constructor(private authService: AuthService, private router: Router, private notify: NotificationService) {}
  register() {
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: (res) => { this.loading = false; if (res.success) { this.notify.success('Account created!'); this.router.navigate(['/dashboard']); } },
      error: (err) => { this.loading = false; this.notify.error(err.error?.message || 'Registration failed'); }
    });
  }
}
