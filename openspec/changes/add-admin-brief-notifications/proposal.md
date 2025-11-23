# Add Admin Notification on Brief Creation

## Why
Currently, when a client submits a new project brief, the system creates the brief record but fails to notify any administrators. This disconnect means admins must manually poll the dashboard to discover new work, leading to delays in project review and initiation. Proactive notifications are essential for timely administrative responses.

## What Changes
- **Backend Logic**: Update `BriefService.createBrief` to automatically trigger notifications.
- **Notification Logic**: When a brief is created, find all users with `role: 'ADMIN'` and generate a notification for each.
- **Data Model Constraints**: The `NotificationType` enum is restricted to `STATUS_UPDATE`, `NEW_MESSAGE`, and `DELIVERABLE_ADDED`. We will use `STATUS_UPDATE` for new briefs to avoid database migrations, as "Pending" is the initial status.

## Impact
- **Affected specs**: `notifications` (new requirement for admin alerts).
- **Affected code**: 
  - `backend/src/services/briefService.ts` (trigger logic)
  - `backend/src/services/notificationService.ts` (new helper method: `notifyAdminsOfNewBrief`)
- **Database**: No schema changes required (reusing existing `NotificationType`).

## Design Decisions
- **Notification Type**: Using `STATUS_UPDATE` because `NEW_BRIEF` does not exist in the `NotificationType` enum. Since a new brief starts with `PENDING` status, this is semantically acceptable.
- **Target Audience**: All users with `role: ADMIN` will receive the notification.
- **Implementation**: Logic will reside in `BriefService` to keep the transaction atomic-like (though Prisma transactions might be overkill for this notification step, we will chain the calls).
