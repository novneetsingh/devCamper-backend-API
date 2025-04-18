const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { auth, isAdmin } = require("../middlewares/auth");

router
  .route("/")
  .get(auth, isAdmin, getAllUsers)
  .post(auth, isAdmin, createUser);

router
  .route("/:id")
  .get(auth, isAdmin, getUser)
  .put(auth, isAdmin, updateUser)
  .delete(auth, isAdmin, deleteUser);

module.exports = router;
