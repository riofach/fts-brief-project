## ADDED Requirements

### Requirement: Admin Notifications for New Briefs
The system SHALL notify all administrators when a new brief is submitted by a client.

#### Scenario: Notification creation on submit
- **WHEN** a client successfully creates a new brief
- **THEN** a notification of type `STATUS_UPDATE` is created for every user with `role: ADMIN`
- **AND** the notification message contains "New Brief Submitted: [Project Name]"
