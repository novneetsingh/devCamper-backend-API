const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// register a user
exports.register = async (req, res, next) => {
  // create user
  const user = await User.create(req.body);

  createTokenAndSetCookie(user, res);
};

// login a user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials: User not found", 401));
  }

  // check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials: Wrong password", 401));
  }

  createTokenAndSetCookie(user, res);
};

// Get token from model, create cookie and send response
const createTokenAndSetCookie = (user, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set options for cookie
  const options = {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true, // prevents client-side JS from accessing the cookie (protection against XSS)
    secure: process.env.NODE_ENV === "production", // uses HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // cross-site cookie settings
    path: "/", // cookie accessible on all routes
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
  });
};
