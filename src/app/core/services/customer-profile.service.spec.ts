import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_TOKEN_KEY, MOCK_JWT_TOKEN } from '../constants/auth.constants';
import { authTokenInterceptor } from '../interceptors/auth-token.interceptor';
import { MOCK_CUSTOMER_PROFILE } from '../mocks/mock-api.data';
import { CustomerProfileService } from './customer-profile.service';

describe('CustomerProfileService', () => {
  let service: CustomerProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem(AUTH_TOKEN_KEY, MOCK_JWT_TOKEN);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CustomerProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should GET customer by id with a Bearer token', () => {
    service.getById('c-501').subscribe((profile) => {
      expect(profile).toEqual(MOCK_CUSTOMER_PROFILE);
    });

    const req = httpMock.expectOne('/api/v1/customers/c-501');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_JWT_TOKEN}`);
    req.flush(MOCK_CUSTOMER_PROFILE);
  });

  it('should map user u-101 to customer c-501', () => {
    expect(service.getCustomerIdForUser('u-101')).toBe('c-501');
  });
});
