import { CustomerProfile } from '../models/customer-profile.model';
import { LoginResponse } from '../models/user.model';
import { MOCK_JWT_TOKEN } from '../constants/auth.constants';

export const MOCK_LOGIN_SUCCESS: LoginResponse = {
  token: MOCK_JWT_TOKEN,
  user: {
    id: 'u-101',
    email: 'user@example.com',
    role: 'user'
  }
};

export const MOCK_CUSTOMER_PROFILE: CustomerProfile = {
  id: 'c-501',
  userId: 'u-101',
  fullName: 'Jane Doe',
  companyName: 'Acme Corp',
  phone: '+1-555-0199',
  address: {
    street: '123 Tech Way',
    city: 'Austin',
    country: 'USA',
    zipCode: '78701'
  },
  status: 'Active'
};
