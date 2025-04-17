const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// register a user
exports.register = async (req, res, next) => {
  // create user
  const user = await User.create(req.body);

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
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

  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
};

