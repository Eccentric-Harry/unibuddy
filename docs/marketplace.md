# UniBuddy Marketplace Module

The marketplace module enables students to buy and sell items within their college community in a secure and convenient way.

## Features

- **Create Listings**: Students can create listings with detailed descriptions and up to 5 images per listing
- **Browse Listings**: Browse items with filtering by category, price range, and search terms
- **Express Interest**: Reserve items and start a conversation with the seller
- **Message Sellers**: Contact sellers without reserving items
- **Status Tracking**: Track listing status (active, reserved, sold)
- **College Verification**: Only verified college users can create listings or express interest

## Backend API Endpoints

### GET /api/listings

Get a paginated list of listings with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `query` (optional): Search in title and description
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (default: 0): Page number
- `size` (default: 10): Items per page
- `sort` (default: "createdAt,desc"): Sort field and direction

**Response:**
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Item title",
      "description": "Item description",
      "price": 25.99,
      "category": "books",
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "path": "listings/userId/image.jpg",
          "alt": "Image description"
        }
      ],
      "status": "ACTIVE",
      "seller": {
        "id": "uuid",
        "name": "Seller Name",
        "avatarUrl": "https://example.com/avatar.jpg",
        "year": 2,
        "collegeName": "Example University"
      },
      "createdAt": "2023-10-06T12:00:00Z",
      "updatedAt": "2023-10-06T12:00:00Z"
    }
  ],
  "totalPages": 5,
  "totalElements": 42,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false
}
```

### GET /api/listings/{id}

Get a specific listing by ID.

**Response:**
Same as listing object in the list response, but with additional details if the listing is reserved.

### POST /api/listings

Create a new listing. Requires authentication and college verification.

**Request Body:**
```json
{
  "title": "Item title",
  "description": "Item description",
  "price": 25.99,
  "category": "books",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "path": "listings/userId/image.jpg",
      "alt": "Image description"
    }
  ]
}
```

**Response:**
The created listing object.

### POST /api/listings/{id}/express-interest

Express interest in a listing, reserve it, and start a conversation.

**Request Body:**
```json
{
  "message": "Hi, I'm interested in your item. Is it still available?"
}
```

**Response:**
```json
{
  "conversationId": "uuid",
  "message": "Interest expressed successfully"
}
```

### PATCH /api/listings/{id}/status

Update the status of a listing (only allowed for the owner).

**Request Body:**
```json
{
  "status": "ACTIVE" // or "RESERVED", "SOLD", "INACTIVE"
}
```

**Response:**
The updated listing object.

### POST /api/listings/{id}/report

Report a listing for inappropriate content or other issues.

**Request Body:**
```json
{
  "reason": "Prohibited item"
}
```

**Response:**
```json
{
  "message": "Listing reported successfully"
}
```

## Frontend Components

### Pages
- `/marketplace` - Main marketplace page with listing grid and filters
- `/marketplace/:id` - Listing detail page with images, description, and seller info

### Components
- `ListingCard` - Card component for displaying a listing in the grid
- `ListingGrid` - Grid layout for multiple listings with pagination
- `ListingFilters` - Filters for category, price range, and search
- `CreateListingModal` - Modal for creating new listings with image upload
- `ImageModal` - Modal for displaying full-size images with carousel

## Image Handling

Images are uploaded directly from the frontend to Supabase Storage:

1. **Client-Side**: 
   - Images are compressed using browser-image-compression
   - Size limited to 5MB per image, maximum 5 images per listing
   - Direct upload to Supabase Storage bucket: `listing-images`

2. **Storage Path Format**:
   - `listings/{userId}/{timestamp}-{random}.{extension}`

## Rate Limiting & Validation

- Users are limited to 10 active listings at a time
- Listings with inappropriate content are automatically filtered
- Users can report problematic listings

## Environment Variables

The marketplace module requires the following environment variables:

- `SUPABASE_URL`: URL for your Supabase project
- `SUPABASE_ANON_KEY`: Anonymous/public key for Supabase client
- `SUPABASE_SERVICE_KEY`: Service role key for server-side operations (if needed)
- `SUPABASE_STORAGE_BUCKET`: Storage bucket name (default: "listing-images")

## Usage Example

### Creating a Listing
```typescript
import { uploadImage } from '../services/supabase';
import { createListing } from '../services/api';

// Upload images to Supabase Storage
const uploadedImage = await uploadImage(file, userId);

// Create listing with uploaded image
const response = await createListing({
  title: "C++ Data Structures Textbook",
  description: "Good condition, a few highlights.",
  price: 25.99,
  category: "books",
  images: [uploadedImage]
});
```

### Expressing Interest
```typescript
import { expressInterest } from '../services/api';

// Express interest in a listing
const response = await expressInterest(listingId, {
  message: "Hi, I'm interested in this textbook. Is it still available?"
});

// Navigate to the conversation
navigate(`/conversations/${response.data.conversationId}`);
```
