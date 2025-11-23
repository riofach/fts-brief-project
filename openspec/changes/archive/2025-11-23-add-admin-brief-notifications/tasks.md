# Tasks for Admin Notification

## 1. Backend Implementation

- [x] 1.1 Implement `notifyAdminsOfNewBrief` method in `NotificationService`
- [x] 1.2 Update `BriefService.createBrief` to call notification service
- [x] 1.3 Verify no schema changes are required (using `STATUS_UPDATE`)

## 2. Validation

- [x] 2.1 Manual test: Create brief as client -> Check admin notifications table
- [x] 2.2 Verify notification content matches "New Brief Submitted: [Project Name]"
