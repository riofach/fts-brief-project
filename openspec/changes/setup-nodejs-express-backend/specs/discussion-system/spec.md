# Discussion System - Backend API Specification

## ADDED Requirements

### Requirement: Post Discussion Message
The system SHALL allow authenticated users (client and admin) to post messages on briefs.

#### Scenario: User posts message to brief discussion
- **WHEN** authenticated user sends `POST /briefs/:briefId/discussions` with message text
- **THEN** the system creates discussion document with userId from JWT
- **AND** sets timestamp to current time
- **AND** sets isFromAdmin based on user role
- **AND** returns 201 with created discussion object
- **AND** creates notification for other participants: "New message on your brief"

#### Scenario: User posts empty message
- **WHEN** user sends message with empty or whitespace-only text
- **THEN** the system returns 400 with error code `VALIDATION_ERROR`

#### Scenario: User posts to non-existent brief
- **WHEN** user sends `POST /briefs/:briefId/discussions` with invalid briefId
- **THEN** the system returns 404 with error code `BRIEF_NOT_FOUND`

#### Scenario: Unauthorized user posts to brief
- **WHEN** client sends message to brief not owned by them
- **THEN** the system returns 403 with error code `FORBIDDEN`
- **AND** message indicates permission required

---

### Requirement: Retrieve Brief Discussions
The system SHALL return all messages for a specific brief in chronological order.

#### Scenario: User retrieves discussions for brief
- **WHEN** authenticated user sends `GET /briefs/:briefId/discussions`
- **THEN** the system returns 200 with array of discussions
- **AND** discussions sorted by timestamp (ascending)
- **AND** each message includes: id, userId, message, timestamp, isFromAdmin
- **AND** user is authorized if: admin OR brief.clientId matches JWT userId

#### Scenario: Client retrieves discussions for own brief
- **WHEN** client sends `GET /briefs/:briefId/discussions` for their brief
- **THEN** all messages are returned with no filtering
- **AND** client sees both client and admin messages

#### Scenario: Non-member attempts to access discussions
- **WHEN** client sends request for discussions of brief not owned by them
- **THEN** the system returns 403 with error code `FORBIDDEN`

#### Scenario: Discussions list for new brief
- **WHEN** user requests `GET /briefs/:briefId/discussions` for brief with no messages
- **THEN** the system returns 200 with empty array
- **AND** no error is raised

---

### Requirement: Discussion Message Attribution
The system SHALL track whether message originated from admin or client for display purposes.

#### Scenario: Admin posts message
- **WHEN** admin sends POST with message
- **THEN** system sets isFromAdmin = true
- **AND** message is clearly attributed to admin in responses

#### Scenario: Client posts message
- **WHEN** client sends POST with message
- **THEN** system sets isFromAdmin = false
- **AND** message displays client's name/company

#### Scenario: Display message sender information
- **WHEN** frontend retrieves discussions
- **THEN** each message includes user name/role for proper UI rendering
- **AND** admin messages show "FTS Admin", client messages show client company name

---

## ADDED Requirements

### Requirement: Delete Discussion Message (Admin Only)
The system SHALL allow admins to remove inappropriate messages.

#### Scenario: Admin deletes message
- **WHEN** admin sends `DELETE /discussions/:messageId`
- **THEN** the system removes the message document
- **AND** returns 200 with success message
- **AND** client notification sent if message was important

#### Scenario: Non-admin attempts to delete message
- **WHEN** client sends DELETE request
- **THEN** the system returns 403 with error code `FORBIDDEN`

#### Scenario: Admin deletes non-existent message
- **WHEN** admin sends DELETE for invalid messageId
- **THEN** the system returns 404 with error code `MESSAGE_NOT_FOUND`

---

## MODIFIED Requirements

### Requirement: Discussion Message Persistence
The system SHALL persist discussion messages in MongoDB instead of holding messages in memory, enabling permanent message history for briefs.

**Previous behavior**: Discussion messages held in AppContext state; lost on page refresh
**New behavior**: Messages fetched from `GET /briefs/:briefId/discussions` endpoint and cached via TanStack Query

#### Scenario: Messages persist across sessions
- **WHEN** client posts message to brief discussion
- **THEN** message is stored in MongoDB with timestamp
- **AND** message persists even after page refresh or logout

#### Scenario: Message history retrieved on brief load
- **WHEN** user navigates to brief details page
- **THEN** frontend calls `GET /briefs/:briefId/discussions`
- **AND** all historical messages are returned in chronological order
- **AND** users can review full conversation history

---

## REMOVED Requirements

### Requirement: Mock Discussion Data in Frontend
**Reason**: Mock data was for UI validation. Real persistence enables client-admin collaboration.

**Migration**: 
- Backend seed script populates sample discussions
- Frontend query endpoint on brief detail page load
