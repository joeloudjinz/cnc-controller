# CNC Controller - Comprehensive Documentation

## Project Overview

**Project Name**: Loudjein.cnc  
**Type**: Backend system for CNC machine control  
**Purpose**: Interacts with CNC machine through serial port, converts uploaded images to G-code files  
**Frontend Repository**: [GitHub - cnc-controller-fe](https://github.com/joe-inz/cnc-controller-fe)

## Technology Stack

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js (v4.17.1)
- **Database**: MySQL with mysql driver (v2.17.1)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer (v1.4.1)
- **Serial Communication**: SerialPort (v7.1.5)
- **Image to G-code**: img2gcode (v1.1.2)
- **Security**: Helmet.js, CORS, bcrypt
- **Environment**: dotenv for configuration management
- **File System**: fs-extra for file operations
- **Real-time Communication**: Socket.IO (v2.4.0)
- **Worker Threads**: Built-in Node.js worker_threads for image conversion processing

### Client-side
- **Frontend Framework**: Vue.js (built assets in `public/` directory)
- **Real-time Communication**: Socket.IO client

## Architecture

### Project Structure
```
server/
├── server.js (main entry point)
├── authentication/ (JWT-based authentication)
├── config/ (database, multer, server configuration)
├── files_handler/ (file operations: images, G-code, logs)
├── image_converter/ (image to G-code conversion)
├── middlewares/ (auth middleware)
├── public/ (Vue.js built assets)
├── socket_manager/ (real-time communication)
├── transmitter/ (G-code transmission to CNC)
└── users_manager/ (user management)
```

### Core Components

#### 1. Authentication Module
- JWT-based token authentication with refresh tokens
- Token validity: 5 minutes for access token, 24 hours for refresh token
- User session management with active/inactive status

#### 2. User Management System
- Admin/Agent role management
- User registration, login, logout functionality
- Password hashing with bcrypt (salt rounds: 10)
- Soft deletion (archiving) of users
- Password reset functionality

#### 3. File Handling System
- Manages three types of files:
  - **Images**: Uploaded images stored in `/resources/images`
  - **G-code files**: Generated G-code files stored in `/resources/gcodes`
  - **Log files**: Transmission logs stored in `/resources/outputs`
- File upload with custom naming and organization
- File deletion with cascade operations (image deletion also removes corresponding G-code)

#### 4. Image to G-code Converter
- Converts uploaded images to G-code files
- Uses `img2gcode` library for conversion process
- Worker thread implementation for parallel processing
- Laser mode support (M-mode vs Z-mode)
- Configurable parameters: tool diameter, sensitivity, scale axes, deep step, feed rates

#### 5. Serial Communication & Transmission
- Automatic detection of connected serial devices
- Port management (open/close/read/write operations)
- G-code line-by-line transmission with flow control
- Buffer management using GRBL protocol responses ("ok", "error")
- Pause, resume, and stop functionality for transmissions
- Laser mode toggle ($32=1 for M-mode, $32=0 for Z-mode)

#### 6. Real-time Communication (Socket.IO)
- Real-time updates for:
  - Port status changes
  - Conversion process updates
  - Transmission logs and status
  - File management events
  - User management events

## API Endpoints

### Authentication API (`/api/local/auth`)
- `POST /api/local/auth/login` - User login with credentials
- `POST /api/local/auth/logout` - User logout
- `POST /api/local/auth/token/refresh` - Token refresh with refresh token

### User Management API (`/api/local/users`)
- `POST /api/local/users/create` - Create new user
- `GET /api/local/users/:id` - Get users list (excluding current user)
- `PUT /api/local/users/:id` - Update user information
- `PUT /api/local/users/password/:id` - Update user password
- `DELETE /api/local/users/:id` - Soft delete user
- `GET /api/local/users/role/:id` - Get user role
- `GET /api/local/users/reset/:id` - Reset user password
- `GET /api/local/users/agents/count` - Count agents
- `GET /api/local/users/admins/count` - Count admins

### Image Conversion API (`/api/local/conversions`)
- `POST /api/local/conversions/convert` - Convert image to G-code
- `POST /api/local/conversions/convert/quick` - Quick conversion
- `GET /api/local/conversions/count` - Get conversion count

### File Management API (`/api/local/files`)
- `GET /api/local/files` - Get file tree (images, gcodes, outputs)
- `GET /api/local/files/download` - Download file content
- `GET /api/local/files/display` - Display image as base64
- `DELETE /api/local/files/gcodes` - Delete G-code file
- `DELETE /api/local/files/outputs` - Delete output directory
- `DELETE /api/local/files/images` - Delete image file

### Serial Port API (`/api/local/ports`)
- `GET /api/local/ports` - Get connected ports list
- `POST /api/local/ports/draw` - Start G-code transmission
- `POST /api/local/ports/open` - Open serial port
- `POST /api/local/ports/close` - Close serial port
- `POST /api/local/ports/write` - Write data to port
- `POST /api/local/ports/flush` - Flush port data
- `POST /api/local/ports/resume` - Resume port data emission
- `POST /api/local/ports/pause` - Pause port data emission
- `POST /api/local/ports/draw/pause` - Pause G-code transmission
- `POST /api/local/ports/draw/resume` - Resume G-code transmission
- `POST /api/local/ports/draw/stop` - Stop G-code transmission
- `GET /api/local/ports/draw/isActive` - Check if transmission is active
- `GET /api/local/ports/isOpen` - Check if port is open
- `GET /api/local/ports/isActive` - Check if port is active in transmission

## Database Schema

### Users Table
- `id` - Primary key, auto-increment
- `first_name` - First name of user
- `last_name` - Last name of user
- `email` - User email (unique)
- `password` - Hashed password
- `is_admin` - Admin role flag (boolean)
- `is_active` - Active/inactive status (boolean)
- `is_deleted` - Soft delete flag (boolean)
- `deleted_in` - Timestamp of deletion
- `refresh_token` - JWT refresh token

### Conversions Table
- `id` - Primary key, auto-increment
- `image` - Original image filename
- `gcode` - Generated G-code filename
- `tool_diameter` - Tool diameter used in conversion
- `sensitivity` - Sensitivity parameter
- `scale_axes` - Scale axes parameter
- `deep_step` - Deep step parameter
- `white_z` - Z-coordinate for white areas
- `black_z` - Z-coordinate for black areas
- `safe_z` - Safe Z-coordinate
- `feed_rate` - Feed rate parameter (JSON)
- `time` - Time of conversion
- `error_per` - Error percentage
- `image_size` - Size of original image
- `is_deleted` - Soft delete flag (boolean)

## Security Considerations

### Current Security Measures
- JWT-based authentication with token validation
- Password hashing with bcrypt
- Input validation through API endpoints
- Authentication middleware for protected routes
- Helmet.js for HTTP header security

### Security Concerns
- Hardcoded default token secret in config (`loujein-0000-inno-acad`)
- Missing input validation in some endpoints
- No rate limiting for authentication endpoints
- File upload validation could be improved
- Direct file path exposure in some error messages

## Features & Capabilities

### Core Features
1. **User Management**: Full CRUD operations for users with admin/agent roles
2. **Image to G-code Conversion**: Convert uploaded images to G-code files using configurable parameters
3. **CNC Communication**: Real-time communication with CNC machines via serial port
4. **G-code Transmission**: Transmission of G-code files to CNC machine with pause/resume/stop functionality
5. **File Management**: Manage images, G-code files, and transmission logs
6. **Real-time Updates**: Live updates to frontend via Socket.IO
7. **Authentication**: Secure JWT-based authentication system

### Advanced Features
1. **Laser Mode Support**: Toggle between M-mode and Z-mode for different operations
2. **Worker Thread Processing**: Parallel image conversion using Node.js worker threads
3. **Flow Control**: Intelligent G-code transmission with buffer management
4. **Conversion Monitoring**: Real-time tracking of image conversion process
5. **Transmission Logging**: Comprehensive logging of all transmission operations
6. **Multi-port Management**: Simultaneous management of multiple serial ports

## Environment Configuration

### Environment Variables
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 3000)
- `BASE_URL` - Base URL for the application
- `TOKEN_SECRET` - JWT token secret (should not be hardcoded)
- `DATABASE_HOST` - Database host (default: localhost)
- `DATABASE_NAME` - Database name (default: cnc_iiot)
- `DATABASE_USERNAME` - Database username (default: root)
- `DATABASE_PASSWORD` - Database password
- `DATABASE_ROOT_PASSWORD` - MySQL root password (for Docker containers)

## Modernization Recommendations

### Security Improvements
1. Replace hardcoded token secret with environment variable
2. Implement rate limiting for authentication endpoints
3. Add input sanitization and validation
4. Implement file upload validation (file type, size, content)
5. Add proper error handling without exposing internal details

### Architecture Improvements
1. Implement proper MVC pattern with clear separation of concerns
2. Add comprehensive logging system (winston)
3. Implement configuration management system
4. Add input validation middleware (express-validator)
5. Improve error handling with custom error classes

### Performance Enhancements
1. Implement caching for frequently accessed data
2. Optimize database queries and add indexing
3. Implement file upload size limits and validation
4. Add pagination for file listings
5. Implement proper file cleanup and garbage collection

### Code Quality
1. Add unit and integration tests
2. Implement proper documentation (JSDoc)
3. Add ESLint and Prettier for code formatting
4. Implement CI/CD pipeline
5. Add Docker support for containerized deployment

## Deployment

### Current Deployment
- Node.js server running on specified port
- Frontend assets built by Vue.js CLI and served from `/public`
- MySQL database connection
- Serial port communication for CNC machine

### Requirements
- Node.js runtime
- MySQL database
- Serial port access (for CNC machine communication)
- Appropriate permissions for file system access

## Future Enhancements

1. **API Versioning**: Implement versioned API endpoints
2. **File Compression**: Add support for compressed file formats
3. **Job Queue**: Implement job queue for background processing
4. **Monitoring**: Add application monitoring and health checks
5. **Multi-user Collaboration**: Real-time collaboration features
6. **Backup & Recovery**: Automated backup of G-code files
7. **Mobile Support**: Responsive design for mobile devices
8. **Plugin Architecture**: Support for custom extensions