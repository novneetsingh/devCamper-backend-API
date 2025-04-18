# DevCamper Backend API

A comprehensive API for managing bootcamps, courses, reviews, and users for a web development bootcamp directory. Built with Node.js, Express, and MongoDB.

## Features

- Complete CRUD functionality for bootcamps, courses, reviews, and users
- Authentication with JWT and cookies
- User authorization with role-based permissions
- Password reset functionality with email
- Advanced filtering, sorting, and pagination
- File upload for bootcamp photos
- Security features (XSS protection, rate limiting, parameter pollution prevention, etc.)
- Geocoding for location-based queries

## Requirements

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/novneetsingh/devCamper-backend-API.git
   cd devcamper-backend-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string

    MAX_FILE_UPLOAD= 5*1024*1024

    FILE_UPLOAD_PATH= ./public/uploads

    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=30d

    MAIL_HOST=smtp.gmail.com
    MAIL_USER=your_email
    MAIL_PASS=your_mail_pass
   ```

4. Import sample data (optional):

   ```
   node seeder -create
   ```

   To delete all data:

   ```
   node seeder -delete
   ```

5. Start the server:
   ```
   npm start
   ```

## API Routes

### Bootcamps

```
GET /api/v1/bootcamps - Get all bootcamps
GET /api/v1/bootcamps/:id - Get single bootcamp
POST /api/v1/bootcamps - Create new bootcamp (Auth required: Admin/Publisher)
PUT /api/v1/bootcamps/:id - Update bootcamp (Auth required: Admin/Publisher)
DELETE /api/v1/bootcamps/:id - Delete bootcamp (Auth required: Admin/Publisher)
GET /api/v1/bootcamps/radius/:zipcode/:distance - Get bootcamps within radius
PUT /api/v1/bootcamps/:id/photo - Upload bootcamp photo (Auth required: Admin/Publisher)
```

### Courses

```
GET /api/v1/courses - Get all courses
GET /api/v1/courses/:id - Get single course
GET /api/v1/bootcamp/:bootcampId/courses - Get courses for bootcamp
POST /api/v1/bootcamp/:bootcampId/courses - Create new course (Auth required: Admin/Publisher)
PUT /api/v1/courses/:id - Update course (Auth required: Admin/Publisher)
DELETE /api/v1/courses/:id - Delete course (Auth required: Admin/Publisher)
```

### Authentication

```
POST /api/v1/auth/register - Register user
POST /api/v1/auth/login - Login user
GET /api/v1/auth/logout - Logout user (Auth required)
GET /api/v1/auth/me - Get current user (Auth required)
POST /api/v1/auth/forgotpassword - Forgot password
PUT /api/v1/auth/resetpassword/:resetToken - Reset password
PUT /api/v1/auth/updatedetails - Update user details (Auth required)
PUT /api/v1/auth/updatepassword - Update password (Auth required)
```

### Users

```
GET /api/v1/users - Get all users (Auth required: Admin)
POST /api/v1/users - Create user (Auth required: Admin)
GET /api/v1/users/:id - Get single user (Auth required: Admin)
PUT /api/v1/users/:id - Update user (Auth required: Admin)
DELETE /api/v1/users/:id - Delete user (Auth required: Admin)
```

### Reviews

```
GET /api/v1/reviews - Get all reviews
GET /api/v1/reviews/:id - Get single review
POST /api/v1/bootcamp/:bootcampId/reviews - Create review (Auth required: User/Admin)
PUT /api/v1/reviews/:id - Update review (Auth required: User/Admin)
DELETE /api/v1/reviews/:id - Delete review (Auth required: User/Admin)
```

## Query Examples

### Filtering

```
GET /api/v1/bootcamps?housing=true
GET /api/v1/bootcamps?averageCost[lte]=10000
GET /api/v1/bootcamps?careers[in]=Business
```

### Selecting Fields

```
GET /api/v1/bootcamps?select=name,description,housing
```

### Sorting

```
GET /api/v1/bootcamps?sort=name
GET /api/v1/bootcamps?sort=-createdAt
```

### Pagination

```
GET /api/v1/bootcamps?page=2&limit=10
```

## Project Structure

```
├── config
│   └── database.js          # Database connection configuration
├── controllers              # Route controllers
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│   ├── reviews.js
│   └── users.js
├── data                     # Sample data for seeding
├── middlewares              # Custom middleware
│   ├── auth.js              # Authentication middleware
│   └── ...
├── models                   # MongoDB models
│   ├── Bootcamp.js
│   ├── Course.js
│   ├── Review.js
│   └── User.js
├── public                   # Static files
├── routes                   # API routes
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│   ├── reviews.js
│   └── users.js
├── services                 # Business logic services
├── utils                    # Utility functions
│   └── geocoder.js          # Geocoding utility
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
├── README.md                # Project documentation
├── seeder.js                # Database seeder
└── server.js                # Main application file
```

## Security

The API implements several security measures:

- XSS Protection (xss)
- NoSQL Injection Protection (express-mongo-sanitize)
- Rate Limiting (express-rate-limit)
- HTTP Parameter Pollution Protection (hpp)
- CORS Enabled (cors)
- Secure Headers (helmet)
- Password Hashing (bcryptjs)
- JSON Web Token Authentication
