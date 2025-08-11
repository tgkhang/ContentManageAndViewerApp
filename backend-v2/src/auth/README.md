# Authentication Module

This module provides authentication and authorization functionality for the application.

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Passport.js integration for local strategy
- Input validation

## API Endpoints

### Authentication v1 (`/auth`)

- `POST /auth/login` - Authenticate user with email/password
- `GET /auth/me` - Get current user information (requires authentication)

### Authentication v2 (`/auth-v2`)

- `POST /auth-v2/login` - Authenticate using Passport.js local strategy
- `GET /auth-v2/me` - Get current user information (requires authentication)

## Guards

### AuthGuard

Validates JWT tokens and extracts user information for protected routes.

### RolesGuard

Provides role-based access control. Use with the `@Roles()` decorator.

### PassportLocalGuard

Implements Passport.js local authentication strategy.

## Usage Examples

### Protecting Routes with Authentication

```typescript
@UseGuards(AuthGuard)
@Get('protected')
getProtectedResource(@Request() request) {
  return { user: request.user };
}
```

### Role-Based Protection

```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Get('admin-only')
adminOnlyEndpoint() {
  return { message: 'Admin access granted' };
}
```

Normal Auth (/auth endpoints)
How it works:
Direct validation: Controller receives login data directly
Manual processing: Body is parsed using @Body() decorator with validation
Service call: Directly calls authService.authenticate(input)
Two-step process:
authenticate() → calls validateUser() → calls signIn()
Flow:

POST /auth/login
↓
Controller gets { email, password }
↓
authService.authenticate({ email, password })
↓
validateUser() → bcrypt.compare() → signIn()
↓
Returns JWT token

🛡️ Passport Auth (/auth-v2 endpoints)
How it works:
Strategy-based: Uses Passport.js local strategy
Guard-driven: @UseGuards(PassportLocalGuard) handles validation automatically
Pre-validated: User is already validated when controller method runs
One-step process: Directly calls signIn() with validated user

Guard activates → Calls Passport framework
Passport looks for strategy → Finds LocalStrategy with name 'my-local'
Strategy runs → LocalStrategy.validate() method executes
Validation happens → Calls authService.validateUser()
Result flows back → User object goes to request.user
