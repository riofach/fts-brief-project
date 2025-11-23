# Tasks for Admin Notification

## 1. Backend Implementation
- [ ] 1.1 Implement `notifyAdminsOfNewBrief` method in `NotificationService`
- [ ] 1.2 Update `BriefService.createBrief` to call notification service
- [ ] 1.3 Verify no schema changes are required (using `STATUS_UPDATE`)

## 2. Validation
- [ ] 2.1 Manual test: Create brief as client -> Check admin notifications table
- [ ] 2.2 Verify notification content matches "New Brief Submitted: [Project Name]"
