# Client Frontend

This is the client-facing frontend application built with React, TypeScript, and Vite.

## Description

The client frontend provides the user interface for end-users to view and interact with content managed through the admin dashboard.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
# Navigate to the client frontend directory
cd ClientFrontend

# Install dependencies
npm install
# or
npm install --legacy-peer-deps
# or 
yarn install
```

## Environment Setup

Create a `.env` file in the root directory with the variables in file .env.example:

```env
VITE_API_URL=http://localhost:3000
```

## Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

## Building for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
``
