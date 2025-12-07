const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ orders });
  } catch (err) {
    console.log("Order fetch error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
