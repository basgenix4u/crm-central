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
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-register', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-logo">hub</mat-icon>
          <h1>Start Your Free Trial</h1>
          <p>Set up your company's CRM in 30 seconds</p>
        </div>
        <form (ngSubmit)="register()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Company Name</mat-label>
            <input matInput [(ngModel)]="form.company" name="company" required placeholder="e.g. Acme Corporation">
            <mat-icon matPrefix>business</mat-icon>
          </mat-form-field>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Your First Name</mat-label><input matInput [(ngModel)]="form.firstName" name="firstName" required></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Your Last Name</mat-label><input matInput [(ngModel)]="form.lastName" name="lastName" required></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Work Email</mat-label>
            <input matInput type="email" [(ngModel)]="form.email" name="email" required placeholder="you@company.com">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Create Password</mat-label>
            <input matInput type="password" [(ngModel)]="form.password" name="password" required minlength="8">
            <mat-icon matPrefix>lock</mat-icon>
            <mat-hint>Minimum 8 characters</mat-hint>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading || !form.company || !form.firstName || !form.lastName || !form.email || !form.password">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Create My Company Account</span>
          </button>
          <p class="hint-text">You'll be the admin. You can add team members after setup.</p>
        </form>
        <div class="auth-footer"><p>Already have an account? <a routerLink="/auth/login">Sign in</a></p></div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container{display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f3460 100%)}
    .auth-card{background:white;border-radius:16px;padding:40px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
    .auth-header{text-align:center;margin-bottom:28px}
    .auth-logo{font-size:48px;width:48px;height:48px;color:#3b82f6}
    .auth-header h1{font-size:22px;font-weight:700;margin-top:8px}
    .auth-header p{color:#64748b;margin-top:4px;font-size:14px}
    .full-width{width:100%}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .login-btn{height:48px;font-size:15px;border-radius:10px;margin-top:8px}
    .hint-text{text-align:center;font-size:12px;color:#94a3b8;margin-top:12px}
    .auth-footer{text-align:center;margin-top:20px;font-size:14px}
    .auth-footer a{color:#3b82f6;text-decoration:none;font-weight:600}
  `]
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '', company: '' };
  loading = false;
  constructor(private authService: AuthService, private router: Router, private notify: NotificationService) {}
  register() {
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: (res) => { this.loading = false; if (res.success) { this.notify.success('Welcome! Your CRM is ready.'); this.router.navigate(['/dashboard']); } },
      error: (err) => { this.loading = false; this.notify.error(err.error?.message || 'Registration failed. Please try again.'); }
    });
  }
}
