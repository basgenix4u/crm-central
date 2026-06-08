import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page">
      <!-- Left: Hero section -->
      <div class="auth-hero">
        <div class="hero-content">
          <div class="hero-logo"><mat-icon>hub</mat-icon><span>CRM Central</span></div>
          <h1>Manage your entire business<br>from one place</h1>
          <p>Track customers, close deals, automate workflows, and grow your revenue with our all-in-one CRM platform.</p>
          <div class="hero-features">
            <div class="feature-item"><mat-icon>people</mat-icon><span>Customer Management</span></div>
            <div class="feature-item"><mat-icon>trending_up</mat-icon><span>Sales Pipeline</span></div>
            <div class="feature-item"><mat-icon>support_agent</mat-icon><span>Support Tickets</span></div>
            <div class="feature-item"><mat-icon>campaign</mat-icon><span>Marketing Campaigns</span></div>
            <div class="feature-item"><mat-icon>assessment</mat-icon><span>Analytics & Reports</span></div>
            <div class="feature-item"><mat-icon>task_alt</mat-icon><span>Task Management</span></div>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>10K+</strong><span>Businesses</span></div>
            <div class="stat"><strong>99.9%</strong><span>Uptime</span></div>
            <div class="stat"><strong>24/7</strong><span>Support</span></div>
          </div>
        </div>
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="auth-form-section">
        <div class="form-container">
          <div class="form-header">
            <div class="mobile-logo"><mat-icon>hub</mat-icon><span>CRM Central</span></div>
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          <form (ngSubmit)="login()">
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required placeholder="you@company.com">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePass ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePass=!hidePass"><mat-icon>{{hidePass?'visibility_off':'visibility'}}</mat-icon></button>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox [(ngModel)]="remember" name="remember" color="primary">Remember me</mat-checkbox>
            </div>

            <button mat-raised-button color="primary" type="submit" class="full-w submit-btn" [disabled]="loading||!email||!password">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Start free trial</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page{display:flex;min-height:100vh}
    .auth-hero{flex:1;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%);color:white;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:48px}
    .hero-content{position:relative;z-index:2;max-width:520px}
    .hero-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px}
    .hero-logo mat-icon{font-size:32px;width:32px;height:32px;color:#60a5fa}
    .hero-logo span{font-size:20px;font-weight:700;letter-spacing:-.5px}
    .hero-content h1{font-size:36px;font-weight:800;line-height:1.2;margin-bottom:16px;letter-spacing:-.5px}
    .hero-content>p{font-size:16px;color:#94a3b8;line-height:1.6;margin-bottom:32px}
    .hero-features{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px}
    .feature-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.06);border-radius:10px;border:1px solid rgba(255,255,255,.08);font-size:13px;color:#cbd5e1}
    .feature-item mat-icon{font-size:18px;width:18px;height:18px;color:#60a5fa}
    .hero-stats{display:flex;gap:32px}
    .hero-stats .stat{text-align:center}
    .hero-stats .stat strong{display:block;font-size:24px;font-weight:800;color:#60a5fa}
    .hero-stats .stat span{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px}
    .hero-bg-shapes{position:absolute;inset:0;z-index:1}
    .shape{position:absolute;border-radius:50%;background:rgba(59,130,246,.08)}
    .shape-1{width:400px;height:400px;top:-100px;right:-100px}
    .shape-2{width:300px;height:300px;bottom:-80px;left:-60px}
    .shape-3{width:200px;height:200px;top:50%;left:60%;background:rgba(96,165,250,.05)}

    .auth-form-section{width:480px;max-width:100%;display:flex;align-items:center;justify-content:center;background:#fff;padding:48px}
    .form-container{width:100%;max-width:380px}
    .form-header{margin-bottom:28px}
    .mobile-logo{display:none;align-items:center;gap:8px;margin-bottom:24px}
    .mobile-logo mat-icon{font-size:28px;width:28px;height:28px;color:#3b82f6}
    .mobile-logo span{font-size:18px;font-weight:700}
    .form-header h2{font-size:24px;font-weight:700;color:#0f172a}
    .form-header p{color:#64748b;margin-top:4px;font-size:14px}
    .full-w{width:100%}
    .form-options{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .submit-btn{height:48px;font-size:15px;border-radius:10px;margin-top:4px}
    .form-footer{text-align:center;margin-top:24px;font-size:14px;color:#64748b}
    .form-footer a{color:#3b82f6;font-weight:600;text-decoration:none}

    @media(max-width:900px){
      .auth-page{flex-direction:column}
      .auth-hero{min-height:auto;padding:32px 24px}
      .hero-content h1{font-size:24px}
      .hero-features{display:none}
      .hero-stats{gap:24px}
      .auth-form-section{width:100%;min-width:unset;padding:32px 24px}
      .mobile-logo{display:flex}
    }
    @media(max-width:480px){
      .auth-hero{padding:24px 16px}
      .auth-form-section{padding:24px 16px}
      .hero-stats .stat strong{font-size:20px}
    }
  `]
})
export class LoginComponent {
  email=''; password=''; remember=false; hidePass=true; loading=false;
  constructor(private auth:AuthService,private router:Router,private notify:NotificationService){}
  login(){
    if(!this.email||!this.password){this.notify.error('Please fill in all fields');return;}
    this.loading=true;
    this.auth.login({email:this.email,password:this.password,rememberMe:this.remember}).subscribe({
      next:r=>{this.loading=false;if(r.success){this.notify.success('Welcome back, '+r.data.user.firstName+'!');this.router.navigate(['/dashboard']);}},
      error:e=>{this.loading=false;this.notify.error(e.error?.message||'Invalid email or password');}
    });
  }
}
