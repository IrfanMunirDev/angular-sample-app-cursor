# Spec: Angular Login Component

## Objective
Build an Angular login form using Angular Material.

## Requirements
1. Form Fields: Email and Password with validation (Required, Valid Email format).
2. Submit Action: Call an AuthService `login(email, password)` method.
3. Behavior: Store mock JWT token in `sessionStorage` and navigate to `/profile` on success.
4. UI: Angular Material card layout with error messages.