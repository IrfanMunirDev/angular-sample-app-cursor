import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, MOCK_USER_CREATED_AT } from '../constants/auth.constants';
import { MOCK_LOGIN_SUCCESS } from '../mocks/mock-api.data';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should POST login credentials and store the token and user on success', () => {
    service.login('user@example.com', 'password').subscribe((response) => {
      expect(response).toEqual(MOCK_LOGIN_SUCCESS);
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com', password: 'password' });
    req.flush(MOCK_LOGIN_SUCCESS);

    expect(service.getToken()).toBe(MOCK_LOGIN_SUCCESS.token);
    expect(service.getCurrentUser()).toEqual({
      id: MOCK_LOGIN_SUCCESS.user.id,
      email: MOCK_LOGIN_SUCCESS.user.email,
      role: MOCK_LOGIN_SUCCESS.user.role,
      createdAt: MOCK_USER_CREATED_AT
    });
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should not store credentials when login returns 401', () => {
    service.login('user@example.com', 'wrong').subscribe({
      next: () => fail('expected error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_USER_KEY)).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
