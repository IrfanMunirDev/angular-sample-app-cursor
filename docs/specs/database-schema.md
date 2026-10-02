# Spec: Data Models & Mock Data Schema

## 1. User Entity (Authentication)

```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string; // ISO Date string
}
```

## 2. Customer Profile Entity
```json
interface CustomerProfile {
  id: string;
  userId: string;         // References User.id
  fullName: string;
  companyName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  status: 'Active' | 'Inactive' | 'Pending';
  avatarUrl?: string;
}
```
## 3. Mock Data / Local API Endpoints
POST /api/v1/auth/login
Request Body: { email: string, password: string }

Response Success (200):

```JSON
{
  "token": "mock-jwt-token-12345",
  "user": {
    "id": "u-101",
    "email": "user@example.com",
    "role": "user"
  }
}
```JSON
Response Error (401): { "message": "Invalid credentials" }

GET /api/v1/customers/:id
Headers: Authorization: Bearer <token>

Response Success (200):

```
{
  "id": "c-501",
  "userId": "u-101",
  "fullName": "Jane Doe",
  "companyName": "Acme Corp",
  "phone": "+1-555-0199",
  "address": {
    "street": "123 Tech Way",
    "city": "Austin",
    "country": "USA",
    "zipCode": "78701"
  },
  "status": "Active"
}
```