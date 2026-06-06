import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '@core/models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('crm_user');
    if (user) this.currentUserSubject.next(JSON.parse(user));
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('crm_token', res.data.accessToken);
          localStorage.setItem('crm_refresh', res.data.refreshToken);
          localStorage.setItem('crm_user', JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('crm_token', res.data.accessToken);
          localStorage.setItem('crm_refresh', res.data.refreshToken);
          localStorage.setItem('crm_user', JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_refresh');
    localStorage.removeItem('crm_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('crm_refresh');
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('crm_token', res.data.accessToken);
          localStorage.setItem('crm_refresh', res.data.refreshToken);
        }
      })
    );
  }

  getToken(): string | null { return localStorage.getItem('crm_token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  get currentUser(): User | null { return this.currentUserSubject.value; }
}
