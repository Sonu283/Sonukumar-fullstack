const express = require("express");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();


router.get("/", getProducts);


router.post("/create", auth, isAdmin, createProduct);
router.put("/update/:id", auth, isAdmin, updateProduct);
router.delete("/delete/:id", auth, isAdmin, deleteProduct);

router.post("/details", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid or missing product IDs" });
    }

    const Product = require("../models/productModel");

    const products = await Product.find({
      _id: { $in: ids },
    });

    return res.status(200).json({ products });
  } catch (err) {
    console.error("Product details error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
