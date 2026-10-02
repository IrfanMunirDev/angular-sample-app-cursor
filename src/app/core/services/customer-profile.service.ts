import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_TO_CUSTOMER_ID } from '../constants/auth.constants';
import { CustomerProfile } from '../models/customer-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {
  constructor(private readonly http: HttpClient) {}

  getById(id: string): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`/api/v1/customers/${id}`);
  }

  getCustomerIdForUser(userId: string): string | null {
    return USER_TO_CUSTOMER_ID[userId] ?? null;
  }
}
