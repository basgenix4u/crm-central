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
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-settings', standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatSelectModule, MatDividerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Settings</h1></div>
      <mat-tab-group>
        <mat-tab label="Profile">
          <div class="form-container" style="margin-top:24px;">
            <div class="card">
              <h3>Personal Information</h3>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput [(ngModel)]="profile.firstName"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput [(ngModel)]="profile.lastName"></mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput [(ngModel)]="profile.phone"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Department</mat-label><input matInput [(ngModel)]="profile.department"></mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Job Title</mat-label><input matInput [(ngModel)]="profile.jobTitle"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Timezone</mat-label>
                  <mat-select [(ngModel)]="profile.timezone">
                    <mat-option value="UTC">UTC</mat-option>
                    <mat-option value="US/Eastern">US/Eastern</mat-option>
                    <mat-option value="US/Pacific">US/Pacific</mat-option>
                    <mat-option value="Europe/London">Europe/London</mat-option>
                    <mat-option value="Asia/Tokyo">Asia/Tokyo</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <div class="form-actions">
                <button mat-raised-button color="primary" (click)="saveProfile()">Save Changes</button>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Security">
          <div class="form-container" style="margin-top:24px;">
            <div class="card">
              <h3>Change Password</h3>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>Current Password</mat-label><input matInput type="password" [(ngModel)]="passwords.current"></mat-form-field>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>New Password</mat-label><input matInput type="password" [(ngModel)]="passwords.new"></mat-form-field>
              <mat-form-field appearance="outline" style="width:100%;"><mat-label>Confirm Password</mat-label><input matInput type="password" [(ngModel)]="passwords.confirm"></mat-form-field>
              <div class="form-actions"><button mat-raised-button color="warn" (click)="changePassword()">Update Password</button></div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  profile: any = {}; passwords = { current: '', new: '', confirm: '' };
  constructor(private authService: AuthService, private api: ApiService, private notify: NotificationService) {}
  ngOnInit() {
    const user = this.authService.currentUser;
    if (user) this.profile = { ...user };
  }
  saveProfile() {
    this.api.put('users/' + this.profile.id, this.profile).subscribe({
      next: () => this.notify.success('Profile updated!'),
      error: () => this.notify.error('Failed to update profile')
    });
  }
  changePassword() {
    if (this.passwords.new !== this.passwords.confirm) { this.notify.error('Passwords do not match'); return; }
    this.api.put('users/me/password', { currentPassword: this.passwords.current, newPassword: this.passwords.new }).subscribe({
      next: () => { this.notify.success('Password changed!'); this.passwords = { current: '', new: '', confirm: '' }; },
      error: () => this.notify.error('Failed to change password')
    });
  }
}
