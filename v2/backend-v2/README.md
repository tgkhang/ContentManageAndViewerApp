# Backend Server

This is the backend server built with NestJS, providing APIs for both the client and admin frontends.

## Description

The backend server handles all the business logic, database operations, and API endpoints for the content management system.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- AWS S3 account (for file storage)

## Installation

```bash
# Navigate to the backend directory
cd backend-v2

# Install dependencies
npm install
# or
yarn install
# or
npm install --legacy-peer-deps
```

## Environment Setup

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
PORT=8080
ADMIN_SITE=http://localhost:3002
CLIENT_SITE=http://localhost:3001
CORS_ORIGIN=*
```

## Seeding Database

To seed initial user accounts, run:

```bash
node seed.js
```

This will create the following test accounts (if they don't exist):
- **admin@gmail.com** (admin role) - Password: Demo@123
- **user1@gmail.com** (editor role) - Password: Demo@123
- **user2@gmail.com** (client role) - Password: Demo@123

## Running the App

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the server is running, access Swagger API documentation at:
```
http://localhost:8080/api
```