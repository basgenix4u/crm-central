import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-logo">hub</mat-icon>
          <h1>CRM Central</h1>
          <p>Sign in to your account</p>
        </div>
        <form (ngSubmit)="login()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" name="email" required>
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          <div class="form-options">
            <mat-checkbox [(ngModel)]="rememberMe" name="rememberMe">Remember me</mat-checkbox>
            <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
          </div>
          <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
    .auth-card { background: white; border-radius: 16px; padding: 40px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .auth-header { text-align: center; margin-bottom: 32px;
      .auth-logo { font-size: 48px; width: 48px; height: 48px; color: #1976d2; }
      h1 { font-size: 24px; font-weight: 700; margin-top: 8px; }
      p { color: #666; margin-top: 4px; }
    }
    .full-width { width: 100%; }
    .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .forgot-link { color: #1976d2; text-decoration: none; font-size: 14px; }
    }
    .login-btn { height: 48px; font-size: 16px; border-radius: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; a { color: #1976d2; text-decoration: none; font-weight: 600; } }
  `]
})
export class LoginComponent {
  email = ''; password = ''; rememberMe = false;
  hidePassword = true; loading = false;

  constructor(private authService: AuthService, private router: Router, private notify: NotificationService) {}

  login() {
    if (!this.email || !this.password) { this.notify.error('Please fill in all fields'); return; }
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password, rememberMe: this.rememberMe }).subscribe({
      next: (res) => { this.loading = false; if (res.success) { this.notify.success('Welcome back!'); this.router.navigate(['/dashboard']); } },
      error: (err) => { this.loading = false; this.notify.error(err.error?.message || 'Login failed'); }
    });
  }
}
