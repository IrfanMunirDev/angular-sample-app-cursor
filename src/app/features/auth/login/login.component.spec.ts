import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../core/services/auth.service';
import { MOCK_LOGIN_SUCCESS } from '../../../core/mocks/mock-api.data';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should not call login when the form is invalid', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should navigate to /profile after a successful login', () => {
    component.loginForm.setValue({ email: 'user@example.com', password: 'password' });
    authService.login.and.returnValue(of(MOCK_LOGIN_SUCCESS));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should show the API error message on 401', () => {
    component.loginForm.setValue({ email: 'user@example.com', password: 'wrong' });
    authService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { message: 'Invalid credentials' }
          })
      )
    );

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Invalid credentials');
    const alert = fixture.nativeElement as HTMLElement;
    expect(alert.querySelector('.login-error')?.textContent).toContain('Invalid credentials');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
