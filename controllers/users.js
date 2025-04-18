const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { advancedQuery } = require("../utils/advancedQuery");

// create a user
exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
};

// get all users
exports.getAllUsers = async (req, res) => {
  const { filter, select, sort, skip, limit } = advancedQuery(req.query);

  const users = await User.find(filter)
    .select(select || "")
    .sort(sort || "-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
  });
};

// get a user by id
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// update a user
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// delete a user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
