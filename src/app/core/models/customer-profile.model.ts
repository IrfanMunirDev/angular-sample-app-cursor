export type CustomerStatus = 'Active' | 'Inactive' | 'Pending';

export interface CustomerAddress {
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  companyName: string;
  phone: string;
  address: CustomerAddress;
  status: CustomerStatus;
  avatarUrl?: string;
}
