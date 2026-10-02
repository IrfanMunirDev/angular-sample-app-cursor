import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  MOCK_USER_CREATED_AT
} from '../constants/auth.constants';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = '/api/v1/auth/login';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(this.loginUrl, body).pipe(
      tap((response: LoginResponse) => {
        sessionStorage.setItem(AUTH_TOKEN_KEY, response.token);
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          createdAt: MOCK_USER_CREATED_AT
        };
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  }
}
