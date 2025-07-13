# Quality Test Project

A comprehensive Node.js/Express application for testing documentation generation quality.

## Features

- User authentication with JWT
- MongoDB data persistence
- Input validation with Joi
- Comprehensive test suite
- RESTful API design

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Testing

```bash
npm test
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Health Check  
- GET /health - Service health status

## Environment Variables

- MONGODB_URI - MongoDB connection string
- JWT_SECRET - JWT signing secret
- PORT - Server port (default: 3000)
- NODE_ENV - Environment (development/production)
