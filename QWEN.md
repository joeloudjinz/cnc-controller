Dump t# Qwen Code Context File

## Project Overview

**CNC Controller** - A Node.js/Express backend system for controlling CNC machines that converts uploaded images to G-code files and communicates with CNC machines via serial port.

**Project Type**: Full-stack CNC control application with real-time communication

**Architecture**: Express.js backend with Vue.js frontend (assets in public/), MySQL database, Socket.IO real-time updates, and serial port communication

## Key Technologies

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT with refresh tokens
- **Real-time Communication**: Socket.IO
- **File Processing**: Multer for uploads, img2gcode for image conversion
- **Hardware Communication**: SerialPort
- **Security**: Helmet.js, bcrypt for password hashing

## Project Structure

```
├── server/
│   ├── authentication/          # JWT-based auth system
│   ├── config/                 # Database, multer, server configs
│   ├── files_handler/          # File operations (images, G-code, logs)
│   ├── image_converter/        # Image to G-code conversion
│   ├── middlewares/            # Auth middleware
│   ├── public/                 # Vue.js built assets
│   ├── socket_manager/         # Real-time communication
│   ├── transmitter/            # G-code transmission to CNC
│   ├── users_manager/          # User management
│   └── server.js               # Main entry point
├── DOCUMENTATION.md            # Comprehensive project documentation
├── README.md                   # Project overview
├── package.json                # Dependencies and scripts
└── .env.example                # Environment configuration
```

## Core Features

1. **User Management**: Admin/agent role system with registration, login, password management
2. **Image to G-code Conversion**: Convert images to G-code with configurable parameters
3. **CNC Communication**: Serial port communication with flow control
4. **File Management**: Handle images, G-code files, and logs
5. **Real-time Updates**: Live status updates via Socket.IO
6. **G-code Transmission**: Send G-code to CNC with pause/resume/stop controls

## Current Issues

- **Security**: Hardcoded JWT secret, missing input validation
- **Code Quality**: JavaScript without TypeScript, inconsistent async/await usage
- **Architecture**: Missing separation of concerns, no SOLID principles implementation
- **Testing**: No automated tests
- **Dependencies**: Outdated packages

## Development Commands

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

## Development Conventions

- **Authentication**: JWT tokens passed in Authorization header with 'Bearer ' prefix
- **API Endpoints**: All begin with `/api/local/` followed by feature name
- **File Storage**: Images in resources/images, G-code in resources/gcodes, logs in resources/outputs
- **Serial Communication**: Uses GRBL protocol with flow control based on "ok" responses

## Refactoring Roadmap

**Goal**: Modernize to TypeScript with SOLID principles, add comprehensive testing, implement design patterns, and create proper architecture layers. The roadmap is detailed in `docs/refactoring-roadmap.md`

## Implementation Guidelines

### Incremental Approach
- Each phase should be completed and tested before moving to the next
- Maintain application functionality throughout the refactoring process
- Use feature flags if needed to enable new functionality gradually

### Testing Requirements
- 80%+ code coverage for critical business logic before moving to next phase
- Unit tests for all new service methods
- Integration tests for all API endpoints
- Mock hardware dependencies with realistic behavior
- Test all state transitions in the transmission process
- Test error scenarios and recovery mechanisms

### Code Quality Standards
- Follow consistent naming conventions throughout
- Implement proper error boundaries and error handling
- Add comprehensive logging for debugging and monitoring
- Ensure all code follows SOLID principles
- Use proper dependency injection patterns
- Maintain clean architecture layers

### Security Considerations
- Implement input validation on all endpoints
- Add authentication middleware to all sensitive routes
- Update security headers and settings
- Implement proper rate limiting
- Add security monitoring and logging

## Important Files

- `server/server.js` - Main application entry point
- `DOCUMENTATION.md` - Complete system documentation
- `package.json` - Dependencies and build scripts
- API route files in each feature directory
- Database configuration in `server/config/database.js`

## Special Considerations

- Hardware dependencies (serial port) need to be mocked for testing
- Worker threads used for image conversion
- Real-time communication via Socket.IO
- Database schema with users and conversions tables
- Multiple file types management (images, G-code, logs)