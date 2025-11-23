# Add "Delete All Read Notifications" Feature

## Why
Users currently can only delete notifications one by one or mark them as read. There is no way to clear clutter quickly. A "Delete All Read" button is a standard feature in notification systems that improves user experience by allowing easy cleanup of old, processed information.

## What Changes
- **Backend**:
  - Add `NotificationService.deleteReadNotifications(userId)` method.
  - Add `DELETE /api/notifications/read` endpoint.
- **Frontend**:
  - Add `useDeleteReadNotifications` hook in `src/hooks/useNotifications.ts`.
  - Add "Clear Read" button to `NotificationsPage.tsx` (likely near the "Mark all as read" button).

## Impact
- **Affected specs**: `notifications` (new requirement).
- **Affected code**:
  - `backend/src/services/notificationService.ts`
  - `backend/src/controllers/notificationController.ts`
  - `backend/src/routes/notifications.ts`
  - `src/hooks/useNotifications.ts`
  - `src/pages/NotificationsPage.tsx`

## Design Decisions
- **Endpoint**: `DELETE /api/notifications/read` is restful and clear.
- **Permissions**: Users can only delete *their own* read notifications.
