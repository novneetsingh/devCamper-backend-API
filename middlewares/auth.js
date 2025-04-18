const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

// Authentication middleware
exports.auth = (req, res, next) => {
  // Extract token from various sources
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ErrorResponse("No token provided", 401);
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    throw new ErrorResponse("Invalid token", 401);
  }

  // Add decoded token payload to the request object
  req.user = decoded;
  next();
};

// Authorization middleware to check if user is admin or publisher
exports.isAuthorized = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "publisher") {
    throw new ErrorResponse(
      "You are not authorized to access this resource",
      403
    );
  }
  next();
};

// Authorization middleware to check if user is admin only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ErrorResponse(
      "You are not authorized to access this resource",
      403
    );
  }
  next();
};

// Authorization middleware to check if user role is user or admin
exports.isUserOrAdmin = (req, res, next) => {
  if (req.user.role !== "user" && req.user.role !== "admin") {
    throw new ErrorResponse(
      "You are not authorized to access this resource",
      403
    );
  }
  next();
};
