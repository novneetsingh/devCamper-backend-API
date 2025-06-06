const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");

const { auth } = require("../middlewares/auth");

router.post("/register", register);

router.post("/login", login);

router.get("/logout", auth, logout);

router.get("/me", auth, getMe);

router.post("/forgotpassword", forgotPassword);

router.put("/resetpassword/:resetToken", resetPassword);

router.put("/updatedetails", auth, updateDetails);

router.put("/updatepassword", auth, updatePassword);

module.exports = router;
