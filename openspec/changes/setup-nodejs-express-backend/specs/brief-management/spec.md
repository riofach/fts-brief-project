# Brief Management - Backend API Specification

## ADDED Requirements

### Requirement: Create Brief
The system SHALL allow authenticated clients to create new project briefs with validated input.

#### Scenario: Client creates brief with valid data
- **WHEN** authenticated client sends `POST /briefs` with projectName, projectDescription, websiteType, brandName, mainColor, fontPreference, moodTheme, referenceLinks
- **THEN** the system validates all required fields using Zod schema
- **AND** creates brief document with clientId from JWT
- **AND** sets status to 'pending' and createdAt/updatedAt timestamps
- **AND** returns 201 with created brief object including auto-generated id

#### Scenario: Client creates brief with missing required fields
- **WHEN** client sends `POST /briefs` missing required fields
- **THEN** the system returns 400 with validation error listing missing fields
- **AND** brief is NOT created

#### Scenario: Client creates brief with invalid color format
- **WHEN** client sends mainColor not in hex format (#RRGGBB)
- **THEN** the system returns 400 with error code `VALIDATION_ERROR`
- **AND** message indicates color format requirement

---

### Requirement: List Briefs
The system SHALL return briefs filtered by user role and access permissions.

#### Scenario: Admin lists all briefs
- **WHEN** authenticated admin sends `GET /briefs`
- **THEN** the system returns 200 with array of ALL briefs in database
- **AND** each brief includes: id, clientId, projectName, status, createdAt

#### Scenario: Client lists own briefs
- **WHEN** authenticated client sends `GET /briefs`
- **THEN** the system returns 200 with only briefs where clientId matches user ID
- **AND** client cannot see other clients' briefs

#### Scenario: Unauthenticated request to list briefs
- **WHEN** unauthenticated user sends `GET /briefs` without Authorization header
- **THEN** the system returns 401 with error code `UNAUTHORIZED`

---

### Requirement: Get Brief Details
The system SHALL return full brief details with deliverables and discussions.

#### Scenario: Authorized user retrieves brief details
- **WHEN** authenticated user sends `GET /briefs/:id`
- **THEN** the system returns 200 with complete brief object including deliverables array and discussion count
- **AND** user is authorized if: admin OR clientId matches JWT userId

#### Scenario: User attempts to access unauthorized brief
- **WHEN** authenticated client sends `GET /briefs/:id` for brief belonging to different client
- **THEN** the system returns 403 with error code `FORBIDDEN`

#### Scenario: Brief not found
- **WHEN** user requests `GET /briefs/:id` with non-existent id
- **THEN** the system returns 404 with error code `BRIEF_NOT_FOUND`

---

### Requirement: Update Brief Status
The system SHALL allow admins to change brief status through defined workflow.

#### Scenario: Admin updates brief status
- **WHEN** authenticated admin sends `PUT /briefs/:id` with status in ['pending', 'reviewed', 'in-progress', 'completed']
- **THEN** the system updates brief.status
- **AND** sets brief.updatedAt to current timestamp
- **AND** returns 200 with updated brief
- **AND** creates notification for client: "Your project status changed to [status]"

#### Scenario: Non-admin attempts to update brief status
- **WHEN** authenticated client sends `PUT /briefs/:id` with status change
- **THEN** the system returns 403 with error code `FORBIDDEN`

#### Scenario: Admin updates brief with invalid status
- **WHEN** admin sends PUT with status not in allowed list
- **THEN** the system returns 400 with error code `VALIDATION_ERROR`

---

### Requirement: Add Deliverable to Brief
The system SHALL allow admins to add deliverables (Figma, prototypes, websites, documents) to briefs.

#### Scenario: Admin adds deliverable to brief
- **WHEN** authenticated admin sends `POST /briefs/:briefId/deliverables` with title, description, link, type
- **THEN** the system creates deliverable with auto-generated id
- **AND** associates deliverable with brief (adds to brief.deliverables array)
- **AND** sets addedAt timestamp
- **AND** returns 201 with created deliverable
- **AND** creates notification for client: "New deliverable added: [title]"

#### Scenario: Admin adds deliverable with invalid type
- **WHEN** admin sends type not in ['figma', 'prototype', 'website', 'document']
- **THEN** the system returns 400 with validation error

#### Scenario: Non-admin attempts to add deliverable
- **WHEN** authenticated client sends `POST /briefs/:briefId/deliverables`
- **THEN** the system returns 403 with error code `FORBIDDEN`

---

### Requirement: List Brief Deliverables
The system SHALL return all deliverables for a specific brief.

#### Scenario: User retrieves brief deliverables
- **WHEN** authenticated user sends `GET /briefs/:briefId/deliverables`
- **THEN** the system returns 200 with array of deliverables
- **AND** user is authorized if: admin OR brief.clientId matches JWT userId

#### Scenario: Unauthorized user requests deliverables
- **WHEN** client sends request for deliverables of brief not owned by them
- **THEN** the system returns 403 with error code `FORBIDDEN`

---

## MODIFIED Requirements

### Requirement: Brief Data Persistence
The system SHALL persist brief data in MongoDB instead of holding briefs in memory, enabling data retention across sessions and user sessions.

**Previous behavior**: Brief data held in AppContext state; lost on page refresh
**New behavior**: Brief data queried from `/briefs` endpoint and cached via TanStack Query

#### Scenario: Frontend retrieves briefs from backend
- **WHEN** client navigates to dashboard or admin views briefs
- **THEN** frontend calls `GET /briefs` endpoint
- **AND** backend returns briefs from MongoDB
- **AND** briefs persist even after page refresh or browser close

#### Scenario: Data retained across sessions
- **WHEN** client creates a brief and logs out
- **THEN** brief data remains in MongoDB
- **AND** when client logs back in, their briefs are still visible

---

## REMOVED Requirements

### Requirement: Mock Brief Data in Frontend
**Reason**: Mock data was for prototype validation. Real persistence enables collaboration and data integrity.

**Migration**: 
- Backend seed script populates sample briefs
- Frontend TanStack Query fetches from API on mount
- AppContext state eventually replaced with Query state
