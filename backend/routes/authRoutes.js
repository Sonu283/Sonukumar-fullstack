const express = require("express");
const { signupUser, loginUser, logoutUser } = require("../controllers/authController.js");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);

module.exports = router;
