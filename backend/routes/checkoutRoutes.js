const express = require("express");
const auth = require("../middleware/authMiddleware");
const { checkout } = require("../controllers/checkoutController");

const router = express.Router();

router.post("/", auth, checkout);

module.exports = router;
