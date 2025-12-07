const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const { sku, name, price, category } = req.body;

    if (!sku || !name || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Product.findOne({ sku });
    if (exists) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await Product.create({
      sku,
      name,
      price,
      category,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (e) {
    console.log("Create product error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// const getProducts = async (req, res) => {
//   try {
//     const { search, category, page = 1, limit = 10 } = req.query;

//     let query = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { sku: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (category) {
//       query.category = category;
//     }

//     let sortOption = { price: -1 };

//     if (req.headers["x-sort"] === "asc") {
//       sortOption = { price: 1 };
//     }

//     const products = await Product.find(query)
//       .sort(sortOption)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const count = await Product.countDocuments(query);

//     return res.status(200).json({
//       total: count,
//       page: Number(page),
//       limit: Number(limit),
//       products,
//     });
//   } catch (e) {
//     console.log("Get products error:", e);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10, sort } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // NEW: sorting matches test expectations
    const sortOption =
      sort === "asc"
        ? { price: 1 }
        : { price: -1 }; // default: high → low (descending)

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await Product.countDocuments(query);

    return res.status(200).json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      products,
    });
  } catch (e) {
    console.log("Get products error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (e) {
    console.log("Update product error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log("Delete product error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
