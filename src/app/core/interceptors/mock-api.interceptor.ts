import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import {
  MOCK_JWT_TOKEN,
  MOCK_LOGIN_EMAIL,
  MOCK_LOGIN_PASSWORD
} from '../constants/auth.constants';
import { MOCK_CUSTOMER_PROFILE, MOCK_LOGIN_SUCCESS } from '../mocks/mock-api.data';
import { LoginRequest } from '../models/user.model';

function unauthorized(message: string): ReturnType<HttpInterceptorFn> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: { message }
      })
  );
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.split('?')[0];

  if (!url.includes('/api/v1/')) {
    return next(req);
  }

  if (req.method === 'POST' && url.endsWith('/api/v1/auth/login')) {
    const body = req.body as LoginRequest;
    if (body?.email === MOCK_LOGIN_EMAIL && body?.password === MOCK_LOGIN_PASSWORD) {
      return of(
        new HttpResponse({
          status: 200,
          body: MOCK_LOGIN_SUCCESS
        })
      );
    }

    return unauthorized('Invalid credentials');
  }

  const customerMatch = url.match(/\/api\/v1\/customers\/([^/]+)$/);
  if (req.method === 'GET' && customerMatch) {
    const authorization = req.headers.get('Authorization');
    if (authorization !== `Bearer ${MOCK_JWT_TOKEN}`) {
      return unauthorized('Unauthorized');
    }

    const customerId = customerMatch[1];
    if (customerId === MOCK_CUSTOMER_PROFILE.id) {
      return of(
        new HttpResponse({
          status: 200,
          body: MOCK_CUSTOMER_PROFILE
        })
      );
    }

    return throwError(
      () =>
        new HttpErrorResponse({
          status: 404,
          statusText: 'Not Found',
          error: { message: 'Customer not found' }
        })
    );
  }

  return throwError(
    () =>
      new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: { message: 'Not found' }
      })
  );
};
