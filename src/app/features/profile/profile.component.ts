import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerProfile } from '../../core/models/customer-profile.model';
import { ApiErrorBody } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CustomerProfileService } from '../../core/services/customer-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfile | null = null;
  errorMessage = '';
  loading = true;

  constructor(
    private readonly authService: AuthService,
    private readonly customerProfileService: CustomerProfileService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const customerId = user ? this.customerProfileService.getCustomerIdForUser(user.id) : null;

    if (!customerId) {
      this.loading = false;
      this.errorMessage = 'No customer profile is linked to this account.';
      return;
    }

    this.customerProfileService.getById(customerId).subscribe({
      next: (profile: CustomerProfile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const body = error.error as ApiErrorBody | undefined;
        this.errorMessage = body?.message ?? 'Unable to load profile.';
      }
    });
  }
}
