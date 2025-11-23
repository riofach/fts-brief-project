## ADDED Requirements

### Requirement: Delete Read Notifications
The system SHALL allow users to delete all their read notifications in a single action.

#### Scenario: User clears read notifications
- **GIVEN** the user has 5 read notifications and 2 unread notifications
- **WHEN** the user requests to delete read notifications
- **THEN** the 5 read notifications are permanently deleted
- **AND** the 2 unread notifications remain intact
