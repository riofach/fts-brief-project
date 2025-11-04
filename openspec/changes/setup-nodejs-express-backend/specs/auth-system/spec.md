# Auth System - Backend API Specification

## ADDED Requirements

### Requirement: JWT Authentication
The system SHALL provide JSON Web Token-based authentication for stateless, scalable user verification across all protected endpoints.

#### Scenario: User login with valid credentials
- **WHEN** a client sends `POST /auth/login` with valid email and password
- **THEN** the system returns status 200 with `{accessToken, refreshToken, user}`
- **AND** accessToken expires in 15 minutes
- **AND** refreshToken expires in 7 days and stored in httpOnly cookie

#### Scenario: User login with invalid credentials
- **WHEN** a client sends `POST /auth/login` with invalid email or password
- **THEN** the system returns status 401 with error code `AUTH_FAILED`
- **AND** no tokens are issued

#### Scenario: Protected endpoint with valid token
- **WHEN** a client sends request to protected endpoint with valid JWT in Authorization header
- **THEN** the middleware verifies token and passes request to controller
- **AND** request includes `req.user` with decoded token payload (userId, email, role)

#### Scenario: Protected endpoint with expired token
- **WHEN** a client sends request with expired accessToken
- **THEN** the system returns status 401 with error code `TOKEN_EXPIRED`
- **AND** client can refresh using refreshToken endpoint

#### Scenario: Refresh access token
- **WHEN** a client sends `POST /auth/refresh` with valid refreshToken
- **THEN** the system returns new accessToken with same 15-minute expiry
- **AND** user session continues without re-login

---

### Requirement: User Password Security
The system SHALL hash passwords using bcryptjs before storage and never return passwords in API responses.

#### Scenario: Password hashing on user creation
- **WHEN** a user is created or password is updated
- **THEN** the system hashes password with bcryptjs (rounds: 10)
- **AND** only hashed password is stored in database

#### Scenario: Login password comparison
- **WHEN** login request is processed
- **THEN** the system uses bcryptjs to compare provided password with stored hash
- **AND** never compares plaintext passwords

#### Scenario: Password never exposed in API
- **WHEN** user data is returned in any API response
- **THEN** the password field is excluded from response
- **AND** no hashed or plaintext passwords are ever transmitted

---

### Requirement: User Logout
The system SHALL invalidate sessions and clear authentication tokens.

#### Scenario: Client requests logout
- **WHEN** a client sends `POST /auth/logout`
- **THEN** the system clears refreshToken cookie
- **AND** returns status 200 with success message
- **AND** client removes accessToken from memory

#### Scenario: Concurrent device logout behavior
- **WHEN** user logs out from one device
- **THEN** other devices' accessTokens remain valid until expiry (refresh will fail)
- **AND** this is acceptable for phase 1 (immediate multi-device logout in future)

---

### Requirement: User Role Management
The system SHALL include role-based access control (RBAC) with client and admin roles.

#### Scenario: Admin user authentication
- **WHEN** admin@fts.com logs in with valid password
- **THEN** the system sets `role: 'admin'` in JWT payload
- **AND** admin has access to all admin endpoints

#### Scenario: Client user authentication
- **WHEN** client@demo.com logs in
- **THEN** the system sets `role: 'client'` in JWT payload
- **AND** client can only access own briefs and data

#### Scenario: Protect admin-only endpoint
- **WHEN** a non-admin sends request to admin endpoint
- **THEN** the system returns status 403 with error code `FORBIDDEN`
- **AND** message indicates admin access required

---

## MODIFIED Requirements

### Requirement: User Authentication API Integration
The system SHALL transition from mock authentication to real API-driven authentication with backend validation.

**Previous behavior**: AuthContext.login() simulated API call with 1-second timeout and checked mockUsers array
**New behavior**: AuthContext.login() calls `POST /auth/login` endpoint; backend validates against MongoDB

#### Scenario: Frontend integrates with backend authentication
- **WHEN** frontend calls authService.login(email, password)
- **THEN** the request goes to backend `POST /auth/login`
- **AND** backend validates credentials against user collection
- **AND** frontend receives JWT tokens instead of mock user object
- **AND** frontend stores tokens in localStorage/memory as before
- Old behavior: 1-second fake delay, check mockUsers array
- New behavior: HTTP POST to backend; backend validates against MongoDB

---

## REMOVED Requirements

### Requirement: Hardcoded Mock Users
**Reason**: Mock users were for prototype testing only. Real authentication via API enables multi-user collaboration.

**Migration**: 
- Seed script populates MongoDB with demo users (admin@fts.com, client@demo.com)
- Passwords no longer in code; hashed in database
- Future user registration endpoint (out of scope for Phase 1)
