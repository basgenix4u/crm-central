import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse, PagedResponse } from '@core/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) Object.keys(params).forEach(key => { if (params[key] !== null && params[key] !== undefined) httpParams = httpParams.set(key, params[key]); });
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  getPage<T>(path: string, page = 0, size = 20, params?: any): Observable<ApiResponse<PagedResponse<T>>> {
    let httpParams = new HttpParams().set('page', page).set('size', size);
    if (params) Object.keys(params).forEach(key => { if (params[key] !== null && params[key] !== undefined) httpParams = httpParams.set(key, params[key]); });
    return this.http.get<ApiResponse<PagedResponse<T>>>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${path}`, body);
  }

  put<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${path}`, body);
  }

  patch<T>(path: string, body?: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${path}`);
  }

  upload<T>(path: string, file: File, params?: any): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    if (params) Object.keys(params).forEach(key => { if (params[key]) formData.append(key, params[key]); });
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${path}`, formData);
  }
}
