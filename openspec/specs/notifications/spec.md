# notifications Specification

## Purpose
TBD - created by archiving change add-delete-read-notifications. Update Purpose after archive.
## Requirements
### Requirement: Delete Read Notifications
The system SHALL allow users to delete all their read notifications in a single action.

#### Scenario: User clears read notifications
- **GIVEN** the user has 5 read notifications and 2 unread notifications
- **WHEN** the user requests to delete read notifications
- **THEN** the 5 read notifications are permanently deleted
- **AND** the 2 unread notifications remain intact

### Requirement: Admin Notifications for New Briefs
The system SHALL notify all administrators when a new brief is submitted by a client.

#### Scenario: Notification creation on submit
- **WHEN** a client successfully creates a new brief
- **THEN** a notification of type `STATUS_UPDATE` is created for every user with `role: ADMIN`
- **AND** the notification message contains "New Brief Submitted: [Project Name]"

