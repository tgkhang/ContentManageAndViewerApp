# Backend API Documentation

This document provides comprehensive API documentation for the Content Management System backend. Use this as reference when integrating with the frontend application.

## Base Configuration

- **Base URL**: `http://localhost:8080` (development)
- **API Documentation**: Available at `http://localhost:8080/api` (Swagger UI)
- **Authentication**: JWT Bearer token required for most endpoints
- **CORS**: Enabled for `http://localhost:3001` (client) and `http://localhost:3002` (admin)

## Authentication

### Headers
All authenticated requests require:
```
Authorization: Bearer <jwt_token>
```

### Login
- **POST** `/auth/login`
- **Public endpoint** (no authentication required)
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "64f8a8b4c1d2e3f4a5b6c7d8",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "role": "admin"
  }
}
```

### Get Current User Info
- **GET** `/auth/me`
- **Authentication**: Required
- **Response**: Returns current authenticated user information

## User Roles

The system has three user roles with different permissions:
- **admin**: Full access to all endpoints
- **editor**: Can manage content and uploads
- **client**: Limited access, can only view their own profile

## Users Module

### Create User
- **POST** `/users`
- **Role Required**: `admin`
- **Request Body**:
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "SecurePass123!",
  "role": "client"
}
```
- **Validation Rules**:
  - `name`: 2-50 characters
  - `username`: 3-20 characters, alphanumeric and underscores only
  - `email`: Valid email format, max 100 characters
  - `password`: Min 8 characters, must include uppercase, lowercase, number, and special character
  - `role`: Must be one of: `admin`, `editor`, `client`

### Get All Users (Paginated)
- **GET** `/users?page=1&limit=10&search=john`
- **Role Required**: `admin`
- **Query Parameters**:
  - `page` (optional): Page number, default 1
  - `limit` (optional): Items per page, default 10
  - `search` (optional): Search by name, username, or email
- **Response**:
```json
{
  "data": [
    {
      "id": "64f8a8b4c1d2e3f4a5b6c7d8",
      "name": "John Doe",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "client",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### Get User by ID
- **GET** `/users/:id`
- **Authentication**: Required
- **Authorization**:
  - `admin`/`editor` can view any user
  - `client` can only view their own profile
- **Response**: Single user object

### Update Current User Profile
- **PATCH** `/users/me`
- **Authentication**: Required
- **Request Body**: All fields optional
```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "janedoe@example.com"
}
```
- **Note**: Cannot update `role` through this endpoint

### Change Password
- **PATCH** `/users/me/change-password`
- **Authentication**: Required
- **Request Body**:
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```
- **Response**:
```json
{
  "message": "Password changed successfully"
}
```

### Update User by ID
- **PATCH** `/users/:id`
- **Authentication**: Required
- **Authorization**:
  - Users can update their own profile
  - Only `admin` can update other users
  - Only `admin` can change user roles
- **Request Body**: Same as "Update Current User Profile", with optional `role` field for admins

### Delete User
- **DELETE** `/users/:id`
- **Role Required**: `admin`
- **Restrictions**: Cannot delete your own account
- **Response**:
```json
{
  "message": "User successfully deleted",
  "deletedUserId": "64f8a8b4c1d2e3f4a5b6c7d8"
}
```

## Contents Module

### Block Types
Content is structured with blocks. Available block types:
- `text`: Text content
- `image`: Image URL/path
- `video`: Video URL/path

### Create Content
- **POST** `/contents`
- **Role Required**: `editor` or `admin`
- **Request Body**:
```json
{
  "title": "My Blog Post",
  "description": "A description of the content",
  "blocks": [
    {
      "type": "text",
      "value": "This is the first paragraph",
      "caption": "Optional caption",
      "metadata": {}
    },
    {
      "type": "image",
      "value": "https://s3.amazonaws.com/bucket/image.jpg",
      "caption": "Image caption"
    }
  ]
}
```
- **Block Structure**:
  - `type` (required): One of `text`, `image`, `video`
  - `value` (required): The content value (text or URL)
  - `caption` (optional): Caption for the block
  - `metadata` (optional): Additional metadata object

### Get All Contents
- **GET** `/contents`
- **Authentication**: Required
- **Response**: Array of all content items

### Get Contents by User
- **GET** `/contents/user/:userId`
- **Authentication**: Required
- **Response**: Array of content items created by specific user

### Get Content by ID
- **GET** `/contents/:id`
- **Authentication**: Required
- **Response**: Single content object with populated user information

### Update Content
- **PATCH** `/contents/:id`
- **Authentication**: Required
- **Request Body**: Same structure as create, all fields optional
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "blocks": [...]
}
```

### Delete Content
- **DELETE** `/contents/:id`
- **Role Required**: `editor` or `admin`
- **Response**: Success confirmation

## Uploads Module

### Upload File
- **POST** `/uploads`
- **Role Required**: `editor` or `admin`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file`
- **Validation**:
  - Max file size: 10MB
  - Allowed types: Images and videos
- **Request Example** (FormData):
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8080/uploads', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```
- **Response**:
```json
{
  "url": "https://blogintern.s3.us-east-1.amazonaws.com/uploads/1234567890-filename.jpg",
  "key": "uploads/1234567890-filename.jpg",
  "filename": "filename.jpg"
}
```
- **Note**: The returned URL can be used as the `value` field in content blocks

## WebSocket Support

The backend includes WebSocket support via Socket.io for real-time content updates.

- **Socket.io endpoint**: Same as base URL
- **Events**: Content creation, updates, and deletions emit real-time events
- **Connection**: Requires authentication token

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only view your own profile",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email or username already exists",
  "error": "Conflict"
}
```

## Frontend Integration Guide

### Authentication Flow
1. Call `POST /auth/login` with credentials
2. Store the `access_token` from response (localStorage/sessionStorage)
3. Include token in all subsequent requests: `Authorization: Bearer <token>`
4. Handle 401 responses by redirecting to login

### Role-Based UI
- Check user role from login response or `/auth/me`
- Hide/disable admin-only features for non-admin users
- Hide/disable editor features for client users

### File Upload Flow
1. User selects file from input
2. Create FormData and append file
3. POST to `/uploads` endpoint
4. Use returned URL in content block creation

### Content Management Flow
1. Create content with blocks array
2. Each block has type, value, optional caption
3. For images/videos, use URLs from upload endpoint
4. Update content by sending partial data (only changed fields)

### Example: Complete Content Creation Workflow
```javascript
// 1. Upload image
const formData = new FormData();
formData.append('file', imageFile);

const uploadRes = await fetch('http://localhost:8080/uploads', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { url: imageUrl } = await uploadRes.json();

// 2. Create content with the uploaded image
const contentRes = await fetch('http://localhost:8080/contents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "My Post",
    description: "Post description",
    blocks: [
      {
        type: "text",
        value: "Introduction paragraph"
      },
      {
        type: "image",
        value: imageUrl,
        caption: "My uploaded image"
      }
    ]
  })
});
```

## Development Tips

1. **Swagger Documentation**: Visit `http://localhost:8080/api` for interactive API testing
2. **CORS**: Ensure your frontend runs on `http://localhost:3001` (client) or `http://localhost:3002` (admin)
3. **Token Expiration**: Implement token refresh logic or handle 401 errors
4. **Validation**: Backend validates all inputs - check error messages for specific requirements
5. **MongoDB IDs**: All IDs are MongoDB ObjectIds (24-character hex strings)
