import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-settings', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatSelectModule, MatDividerModule, MatChipsModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Account Settings</h1></div>
      
      <mat-tab-group>
        <mat-tab label="My Profile">
          <div class="settings-section">
            <div class="card">
              <div class="profile-header">
                <div class="avatar-large">{{ getInitials() }}</div>
                <div>
                  <h2>{{ profile.firstName }} {{ profile.lastName }}</h2>
                  <p style="color:#64748b;">{{ profile.email }}</p>
                  <span class="status-badge active">{{ formatRole(profile.role) }}</span>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h3>Personal Information</h3>
              <p style="color:#64748b;margin-bottom:16px;">Update your name and contact details.</p>
              <div class="form-grid">
                <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="profile.firstName"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="profile.lastName"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="profile.phone"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="profile.jobTitle"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Department</mat-label>
                  <mat-select [(ngModel)]="profile.department">
                    <mat-option value="Sales">Sales</mat-option>
                    <mat-option value="Support">Support</mat-option>
                    <mat-option value="Marketing">Marketing</mat-option>
                    <mat-option value="Engineering">Engineering</mat-option>
                    <mat-option value="Management">Management</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Timezone</mat-label>
                  <mat-select [(ngModel)]="profile.timezone">
                    <mat-option value="UTC">UTC</mat-option>
                    <mat-option value="US/Eastern">US Eastern</mat-option>
                    <mat-option value="US/Pacific">US Pacific</mat-option>
                    <mat-option value="Europe/London">London</mat-option>
                    <mat-option value="Africa/Lagos">Lagos (WAT)</mat-option>
                    <mat-option value="Asia/Tokyo">Tokyo</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <div style="display:flex;justify-content:flex-end;margin-top:16px;">
                <button mat-raised-button color="primary" (click)="saveProfile()"><mat-icon>save</mat-icon> Save Changes</button>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="Security">
          <div class="settings-section">
            <div class="card">
              <h3>Change Password</h3>
              <p style="color:#64748b;margin-bottom:16px;">Ensure your account stays secure by updating your password regularly.</p>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>Current Password</mat-label><input matInput type="password" [(ngModel)]="passwords.current"></mat-form-field>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>New Password</mat-label><input matInput type="password" [(ngModel)]="passwords.newPw"></mat-form-field>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>Confirm New Password</mat-label><input matInput type="password" [(ngModel)]="passwords.confirm"></mat-form-field>
              <div style="display:flex;justify-content:flex-end;">
                <button mat-raised-button color="warn" (click)="changePassword()" [disabled]="!passwords.current || !passwords.newPw || !passwords.confirm"><mat-icon>lock</mat-icon> Update Password</button>
              </div>
            </div>
            
            <div class="card">
              <h3>Account Information</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
                <div><strong>Email:</strong><br>{{ profile.email }}</div>
                <div><strong>Role:</strong><br>{{ formatRole(profile.role) }}</div>
                <div><strong>Account Status:</strong><br><span class="status-badge active">Active</span></div>
                <div><strong>Member Since:</strong><br>{{ profile.createdAt | date:'mediumDate' }}</div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .settings-section{max-width:700px;margin-top:24px}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}
    mat-form-field{width:100%}
    .profile-header{display:flex;align-items:center;gap:20px}
    .avatar-large{width:72px;height:72px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700}
  `]
})
export class SettingsComponent implements OnInit {
  profile: any = {};
  passwords = { current: '', newPw: '', confirm: '' };
  constructor(private authService: AuthService, private api: ApiService, private notify: NotificationService) {}
  ngOnInit() { const u = this.authService.currentUser; if (u) this.profile = { ...u }; }
  getInitials(): string { return (this.profile.firstName?.[0] || '') + (this.profile.lastName?.[0] || ''); }
  formatRole(r: string): string { return (r || '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()); }
  saveProfile() {
    this.api.put('users/' + this.profile.id, { firstName: this.profile.firstName, lastName: this.profile.lastName, phone: this.profile.phone, department: this.profile.department, jobTitle: this.profile.jobTitle, timezone: this.profile.timezone }).subscribe({
      next: () => { this.notify.success('Profile updated!'); localStorage.setItem('crm_user', JSON.stringify(this.profile)); },
      error: () => this.notify.error('Failed to update profile')
    });
  }
  changePassword() {
    if (this.passwords.newPw !== this.passwords.confirm) { this.notify.error('New passwords do not match'); return; }
    if (this.passwords.newPw.length < 8) { this.notify.error('Password must be at least 8 characters'); return; }
    this.api.put('users/me/password', { currentPassword: this.passwords.current, newPassword: this.passwords.newPw }).subscribe({
      next: () => { this.notify.success('Password changed successfully!'); this.passwords = { current: '', newPw: '', confirm: '' }; },
      error: () => this.notify.error('Failed to change password. Check your current password.')
    });
  }
}
