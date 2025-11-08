# Marketplace Messaging Feature Implementation

## Overview
Implemented a seamless messaging workflow for marketplace listings where users can click "Message Seller" button and be directed to the marketplace messages section with the conversation automatically opened.

## Changes Made

### 1. Backend API (Already Existed)
- **Endpoint**: `POST /api/conversations/start/{listingId}`
- **Controller**: `ConversationController.startConversation()`
- **Service**: `ConversationService.getOrCreateConversation()`
- **Functionality**: 
  - Creates a new conversation if one doesn't exist between buyer and seller for the listing
  - Returns existing conversation if it already exists
  - Validates that user is verified and not trying to message themselves

### 2. Frontend API Service (`/frontend/src/services/api.ts`)
**Added**:
- `conversationApi.startConversation(listingId)` - Creates or gets existing conversation with seller

**Updated**:
- `conversationApi.sendMessage()` - Now supports both string and FormData to handle text messages and images

### 3. Chat Page (`/frontend/src/pages/ChatPage.tsx`)
**Added**:
- URL search params support using `useSearchParams` hook
- New `useEffect` to handle URL parameters:
  - `tab` parameter - switches to marketplace or global chat tab
  - `conversation` parameter - auto-selects the specified conversation
  - Auto-opens chat view on mobile when conversation is specified
  - Clears URL params after processing to keep URL clean

### 4. Listing Detail Page (`/frontend/src/pages/ListingDetailPage.tsx`)
**Updated `handleMessageSeller` function**:
- Calls `conversationApi.startConversation(listingId)` to create or get conversation
- Navigates to `/chat?tab=marketplace&conversation={conversationId}`
- Added comprehensive error handling:
  - Email verification required
  - Cannot message yourself
  - Generic error fallback

### 5. Bug Fixes
**ChatWindow Component** (`/frontend/src/components/chat/ChatWindow.tsx`):
- Removed unused members popup that was causing `showMembers is not defined` error
- Fixed import statement
- Removed unused state variables

## User Workflow

### First Time Messaging a Seller
1. User views a marketplace listing detail page
2. Clicks "Message Seller" button
3. Backend creates a new conversation between buyer and seller
4. User is redirected to Chat page with:
   - Marketplace tab automatically selected
   - Conversation with seller automatically opened
5. User can immediately start chatting with the seller

### Returning to Existing Conversation
1. User clicks "Message Seller" on a listing they've already messaged about
2. Backend returns the existing conversation ID
3. User is redirected to the same conversation
4. Previous message history is displayed
5. User can continue the conversation

## Technical Details

### URL Parameters
- **Format**: `/chat?tab=marketplace&conversation={uuid}`
- **Parameters**:
  - `tab`: "marketplace" | "global"
  - `conversation`: UUID of the conversation to open
- **Behavior**: Parameters are automatically removed after processing to keep URL clean

### API Flow
```
User clicks "Message Seller"
  ↓
Frontend: conversationApi.startConversation(listingId)
  ↓
Backend: POST /api/conversations/start/{listingId}
  ↓
Backend: Check if conversation exists
  ↓
Backend: Return existing or create new conversation
  ↓
Frontend: Navigate to /chat?tab=marketplace&conversation={id}
  ↓
ChatPage: Auto-select marketplace tab and conversation
  ↓
User sees chat window ready to send messages
```

### Error Handling
1. **Not authenticated**: Redirects to login page
2. **Email not verified**: Shows toast message requiring email verification
3. **Trying to message self**: Shows toast explaining the error
4. **Other errors**: Generic error message with retry option

## Testing Checklist
- [ ] Click "Message Seller" on a listing (first time)
- [ ] Verify redirected to chat page with marketplace tab
- [ ] Verify conversation is auto-selected
- [ ] Verify can send message
- [ ] Click "Message Seller" on same listing (second time)
- [ ] Verify opens existing conversation with previous messages
- [ ] Test on mobile - verify chat view opens automatically
- [ ] Test error cases:
  - [ ] Not logged in
  - [ ] Email not verified
  - [ ] Try to message own listing (should show error)

## Files Modified
1. `/frontend/src/services/api.ts`
2. `/frontend/src/pages/ChatPage.tsx`
3. `/frontend/src/pages/ListingDetailPage.tsx`
4. `/frontend/src/components/chat/ChatWindow.tsx` (bug fix)

## Dependencies
- React Router DOM (useSearchParams)
- Existing conversation and messaging system
- Existing authentication and user context

