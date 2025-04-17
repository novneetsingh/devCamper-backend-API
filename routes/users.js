const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { auth } = require("../middlewares/auth");

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
