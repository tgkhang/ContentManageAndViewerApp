# Content Management and Viewer Application

This is a full-stack content management and viewing application consisting of three main components.

## Project Structure

### Version 1 (Legacy)
Each project has its own setup instructions. Please refer to their respective README files:

- [Backend Setup](./v1/backend/README.md)
- [Client Frontend Setup](./v1/ClientFrontend/README.md)
- [Admin Frontend Setup](./v1/AdminFrontend/README.md)

### Version 2 (Current)
- [Backend v2 Setup](./v2/backend-v2/README.md)
- [Client Frontend v2 Setup](./v2/clientFrontend/README.md)
- [Admin Frontend v2 Setup](./v2/adminFrontend/README.md)

## Version Differences

### Backend Changes (v1 → v2)

**New Features:**
- **Swagger API Documentation** - Added `@nestjs/swagger` for auto-generated API docs at `/api` endpoint
- **Enhanced Real-time Communication** - Improved WebSocket implementation with content rooms for live updates
- **Better Type Safety** - Enhanced DTOs and validation patterns

**Architecture Improvements:**
- More modular structure with clearer separation of concerns
- Improved role-based authorization system
- Enhanced pagination support in user management
- Optimized S3 file handling with better error management

### Frontend Changes (v1 → v2)

**Major Updates:**
- **React 19** - Upgraded from React 19.0.0 to 19.1.1
- **React Router v7** - Enhanced routing with React Router 7.9.1 (from 7.5.3)
- **Styled Components** - Added `styled-components` library for enhanced styling capabilities
- **Material-UI v7** - Updated to latest MUI version (7.3.3 from 7.0.2)
- **TypeScript 5.8** - Upgraded from TypeScript 5.7 to 5.8.3
- **Vite 7** - Build tool upgraded to Vite 7.1.6 from 6.3.1

**New Features:**
- Enhanced WebSocket integration with singleton pattern
- Improved authentication flow with JWT token validation
- Better route guards (AuthGuard/GuestGuard)
- Lazy-loaded route configuration for better performance
- Real-time content updates across multiple users

**UI/UX Improvements:**
- More responsive design with updated MUI components
- Better error handling and loading states
- Enhanced user management interface
- Improved content editing experience

### Key Technology Stack Updates

| Component | Version 1 | Version 2 |
|-----------|-----------|-----------|
| React | 19.0.0 | 19.1.1 |
| React Router | 7.5.3 | 7.9.1 |
| Material-UI | 7.0.2 | 7.3.3 |
| TypeScript | 5.7.2 | 5.8.3 |
| Vite | 6.3.1 | 7.1.6 |
| Axios | 1.9.0 | 1.12.2 |
| ESLint | 9.22.0 | 9.35.0 |

### Migration Notes

Version 2 is the actively developed version with improved features and better performance. Version 1 is maintained for legacy support but new development should use Version 2.

**When to use Version 2:**
- New projects or features
- Production deployments
- Projects requiring Swagger documentation
- Applications needing advanced real-time features

**When to use Version 1:**
- Maintaining existing deployments
- Legacy system compatibility

## Development

1. Clone the repository
2. Set up each project following their individual README instructions
3. Run each project in development mode

## Technology Stack

- **Backend**: NestJS
- **Frontend**: React + TypeScript + Vite
- **Database**: MongoDB, S3 (AWS)
