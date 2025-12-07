const express = require("express");
const auth = require("../middleware/authMiddleware"); 
const isAdmin = require("../middleware/roleMiddleware");
const { getReports } = require("../controllers/reportController");

const router = express.Router();

router.get("/", auth, isAdmin, getReports);

module.exports = router;
