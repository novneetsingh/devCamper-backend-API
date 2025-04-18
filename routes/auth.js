const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const { auth } = require("../middlewares/auth");

router.post("/register", register);

router.post("/login", login);

router.get("/logout", auth, logout);

router.get("/me", auth, getMe);

router.post("/forgotpassword", forgotPassword);

router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
