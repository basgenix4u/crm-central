import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-register', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page">
      <div class="auth-hero">
        <div class="hero-content">
          <div class="hero-logo"><mat-icon>hub</mat-icon><span>CRM Central</span></div>
          <h1>Start growing your business today</h1>
          <p>Join thousands of companies using CRM Central to manage customers, close deals, and scale operations.</p>
          <div class="testimonial">
            <p>"CRM Central transformed how we manage our sales pipeline. We closed 40% more deals in the first quarter."</p>
            <div class="author"><strong>Alex Morgan</strong><span>VP Sales, TechVentures</span></div>
          </div>
          <div class="hero-badges">
            <div class="badge"><mat-icon>verified</mat-icon> Free 14-day trial</div>
            <div class="badge"><mat-icon>credit_card_off</mat-icon> No credit card required</div>
            <div class="badge"><mat-icon>speed</mat-icon> Setup in 2 minutes</div>
          </div>
        </div>
        <div class="hero-bg-shapes"><div class="shape shape-1"></div><div class="shape shape-2"></div></div>
      </div>

      <div class="auth-form-section">
        <div class="form-container">
          <div class="form-header">
            <div class="mobile-logo"><mat-icon>hub</mat-icon><span>CRM Central</span></div>
            <h2>Create your account</h2>
            <p>Get your CRM up and running in seconds</p>
          </div>

          <form (ngSubmit)="register()">
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Company Name</mat-label>
              <input matInput [(ngModel)]="form.company" name="company" required placeholder="Acme Corporation">
              <mat-icon matPrefix>business</mat-icon>
            </mat-form-field>
            <div class="row">
              <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="form.firstName" name="fn" required></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="form.lastName" name="ln" required></mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Work Email</mat-label>
              <input matInput type="email" [(ngModel)]="form.email" name="email" required placeholder="you@company.com">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="form.password" name="pw" required minlength="8">
              <mat-icon matPrefix>lock</mat-icon>
              <mat-hint>Minimum 8 characters</mat-hint>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-w submit-btn" [disabled]="loading||!form.company||!form.firstName||!form.lastName||!form.email||!form.password">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Create Account & Start Free Trial</span>
            </button>
            <p class="hint">You'll be the admin. Add team members after setup.</p>
          </form>

          <div class="form-footer"><p>Already have an account? <a routerLink="/auth/login">Sign in</a></p></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page{display:flex;min-height:100vh}
    .auth-hero{flex:1;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%);color:white;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:48px}
    .hero-content{position:relative;z-index:2;max-width:480px}
    .hero-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px}
    .hero-logo mat-icon{font-size:32px;width:32px;height:32px;color:#60a5fa}
    .hero-logo span{font-size:20px;font-weight:700}
    .hero-content h1{font-size:34px;font-weight:800;line-height:1.2;margin-bottom:16px}
    .hero-content>p{font-size:16px;color:#94a3b8;line-height:1.6;margin-bottom:32px}
    .testimonial{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:24px;margin-bottom:28px}
    .testimonial p{font-style:italic;font-size:15px;color:#e2e8f0;line-height:1.6;margin-bottom:12px}
    .testimonial .author strong{display:block;font-size:14px}
    .testimonial .author span{font-size:12px;color:#64748b}
    .hero-badges{display:flex;flex-wrap:wrap;gap:12px}
    .badge{display:flex;align-items:center;gap:6px;font-size:12px;color:#94a3b8;background:rgba(255,255,255,.05);padding:6px 12px;border-radius:20px}
    .badge mat-icon{font-size:16px;width:16px;height:16px;color:#34d399}
    .hero-bg-shapes{position:absolute;inset:0;z-index:1}
    .shape{position:absolute;border-radius:50%;background:rgba(59,130,246,.08)}
    .shape-1{width:400px;height:400px;top:-100px;right:-100px}
    .shape-2{width:300px;height:300px;bottom:-80px;left:-60px}

    .auth-form-section{width:500px;min-width:420px;display:flex;align-items:center;justify-content:center;background:#fff;padding:48px}
    .form-container{width:100%;max-width:400px}
    .form-header{margin-bottom:24px}
    .mobile-logo{display:none;align-items:center;gap:8px;margin-bottom:20px}
    .mobile-logo mat-icon{font-size:28px;width:28px;height:28px;color:#3b82f6}
    .mobile-logo span{font-size:18px;font-weight:700}
    .form-header h2{font-size:22px;font-weight:700;color:#0f172a}
    .form-header p{color:#64748b;margin-top:4px;font-size:14px}
    .full-w{width:100%}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .submit-btn{height:48px;font-size:14px;border-radius:10px;margin-top:8px}
    .hint{text-align:center;font-size:12px;color:#94a3b8;margin-top:10px}
    .form-footer{text-align:center;margin-top:20px;font-size:14px;color:#64748b}
    .form-footer a{color:#3b82f6;font-weight:600;text-decoration:none}

    @media(max-width:900px){
      .auth-page{flex-direction:column}
      .auth-hero{min-height:auto;padding:32px 24px}
      .hero-content h1{font-size:22px}
      .testimonial{display:none}
      .auth-form-section{width:100%;min-width:unset;padding:32px 24px}
      .mobile-logo{display:flex}
    }
  `]
})
export class RegisterComponent {
  form={firstName:'',lastName:'',email:'',password:'',company:''};
  loading=false;
  constructor(private auth:AuthService,private router:Router,private notify:NotificationService){}
  register(){
    this.loading=true;
    this.auth.register(this.form).subscribe({
      next:r=>{this.loading=false;if(r.success){this.notify.success('Welcome! Your CRM is ready.');this.router.navigate(['/dashboard']);}},
      error:e=>{this.loading=false;this.notify.error(e.error?.message||'Registration failed');}
    });
  }
}
