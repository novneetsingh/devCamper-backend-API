const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth");

const { auth } = require("../middlewares/auth");

router.post("/register", register);

router.post("/login", login);

router.get("/logout", auth, logout);

module.exports = router;
