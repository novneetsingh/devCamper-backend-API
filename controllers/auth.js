const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { mailSender } = require("../services/mailSender");
const crypto = require("crypto");

// register a user
exports.register = async (req, res) => {
  // create user
  const user = await User.create(req.body);

  console.log(user);

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

// logout a user
exports.logout = async (req, res) => {
  // Clear the token cookie properly
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Must match cookie settings
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // cross-site cookie settings
    path: "/", // Ensures cookie is removed from all routes
  });

  return res.status(200).json({
    success: true,
    message: "User Logged Out Successfully",
  });
};

// get current user details
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ErrorResponse("User not found with this email", 404);
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false,
  });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}.\n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

  try {
    await mailSender({
      email: user.email,
      subject: "Password Reset Request",
      body: message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    throw new ErrorResponse("Email could not be sent", 500);
  }

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
  });
};

// reset password
exports.resetPassword = async (req, res) => {
  // hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // find user with token and check if it has not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse("Invalid reset token", 400);
  }

  // update password and reset token and expire
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};

// Get token from model, create cookie and send response
const createTokenAndSetCookie = (user, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set options for cookie
  const options = {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
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
