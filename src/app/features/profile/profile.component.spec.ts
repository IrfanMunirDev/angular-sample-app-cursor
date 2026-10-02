import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MOCK_CUSTOMER_PROFILE } from '../../core/mocks/mock-api.data';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CustomerProfileService } from '../../core/services/customer-profile.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let customerProfileService: jasmine.SpyObj<CustomerProfileService>;

  const currentUser: User = {
    id: 'u-101',
    email: 'user@example.com',
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z'
  };

  beforeEach(async () => {
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    authService.getCurrentUser.and.returnValue(currentUser);
    customerProfileService = jasmine.createSpyObj<CustomerProfileService>(
      'CustomerProfileService',
      ['getById', 'getCustomerIdForUser']
    );
    customerProfileService.getCustomerIdForUser.and.returnValue('c-501');
    customerProfileService.getById.and.returnValue(of(MOCK_CUSTOMER_PROFILE));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: CustomerProfileService, useValue: customerProfileService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
  });

  it('should render mock profile fields', () => {
    expect(customerProfileService.getById).toHaveBeenCalledWith('c-501');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Jane Doe');
    expect(compiled.textContent).toContain('Acme Corp');
    expect(compiled.textContent).toContain('+1-555-0199');
    expect(compiled.textContent).toContain('123 Tech Way');
    expect(compiled.textContent).toContain('Austin');
    expect(compiled.textContent).toContain('USA');
    expect(compiled.textContent).toContain('78701');
    expect(compiled.textContent).toContain('Active');
  });
});
