# Role Persistence System

This document explains how the role persistence system works in the volunteer dashboard application.

## Problem Solved

Before this implementation, users would be redirected to the home page after refreshing the dashboard because:
1. React state (including user role) was lost on page refresh
2. Route guards would reject access before the role could be fetched from the server
3. This caused a poor user experience with unwanted redirects

## Solution Overview

The role persistence system implements the following features:

### 1. Local Storage Persistence
- User roles are stored in `localStorage` with timestamps
- Keys used: `volunteer_app_role` and `volunteer_app_role_timestamp`
- Automatic cleanup of expired roles (older than 30 minutes)

### 2. Smart Role Loading
- **Fast Path**: If a valid stored role exists, use it immediately for instant UX
- **Background Refresh**: Fetch fresh role from server in background to detect changes
- **Fallback**: If no stored role, fetch from server and store for future use

### 3. Loading State Management
- New `roleLoading` state prevents premature route decisions
- `PrivateRoute` components wait for both auth and role loading to complete
- Users see a loading spinner instead of being redirected

## Implementation Details

### AuthProvider Changes
- Added `roleLoading` state to track role resolution
- Implemented role storage utilities with expiration
- Modified auth flow to handle role persistence
- Added background role refresh for real-time updates

### PrivateRoute Updates
- Now checks both `loading` and `roleLoading` states
- Prevents route decisions until role is fully determined
- Eliminates race conditions between auth and role loading

### useUserRole Hook
- Simplified to work with the new persistence system
- Provides `roleLoading` state for components that need it
- Removed old localStorage logic (now handled centrally)

## Storage Keys

```javascript
const ROLE_STORAGE_KEY = 'volunteer_app_role';
const ROLE_TIMESTAMP_KEY = 'volunteer_app_role_timestamp';
const ROLE_REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes
```

## Flow Diagram

```
Page Refresh → Check localStorage → Role exists & valid?
                                    ↓
                              Yes → Use stored role → Show dashboard
                                    ↓
                               No → Fetch from server → Store role → Show dashboard
```

## Benefits

1. **Instant Dashboard Access**: No more waiting for server role fetch on refresh
2. **Better UX**: Users stay on dashboard after refresh
3. **Real-time Updates**: Background role refresh detects permission changes
4. **Automatic Cleanup**: Expired roles are automatically removed
5. **Fallback Safety**: Server remains authoritative source of truth

## Testing

To test the system:

1. Login to dashboard
2. Refresh the page
3. Check browser console for role persistence logs
4. Verify dashboard loads without redirect
5. Check localStorage for stored role data

## Troubleshooting

### Issue: Role keeps changing to "volunteer" on refresh

If you're experiencing this issue, follow these debugging steps:

#### 1. Check Console Logs
Look for these log messages in the browser console:
- `=== AUTH STATE CHANGE ===`
- `Stored role found: [role]`
- `Fresh role from server: [role]`
- `Role changed from server, updating to: [role]`

#### 2. Use the RoleDebugger Component
The `RoleDebugger` component has been added to your dashboard to help troubleshoot:
- Shows current role state
- Displays localStorage values
- Provides manual refresh and clear functions
- Shows raw localStorage data

#### 3. Run Debug Script
Copy and paste the `ROLE_DEBUG_SCRIPT.js` content into your browser console:
```javascript
// Run this in browser console
window.roleDebug.runAllChecks();
```

#### 4. Check localStorage
Manually inspect localStorage in browser dev tools:
```javascript
// In browser console
localStorage.getItem('volunteer_app_role')
localStorage.getItem('volunteer_app_role_timestamp')
```

#### 5. Common Causes
- **Server returning wrong role**: Check your backend API response
- **Role expiration**: Roles expire after 30 minutes
- **Token issues**: Invalid or expired JWT tokens
- **Race conditions**: Multiple role fetch requests

#### 6. Manual Role Refresh
Use the refresh button in the RoleDebugger component or call:
```javascript
// In browser console (if available)
window.roleDebug.refreshUserRole()
```

#### 7. Clear and Retest
If the issue persists, clear the stored role and test again:
```javascript
// In browser console
window.roleDebug.clearStoredRole()
// Then refresh the page
```

## Future Enhancements

- Configurable role refresh intervals
- Role change notifications
- Offline role validation
- Role-based feature flags

