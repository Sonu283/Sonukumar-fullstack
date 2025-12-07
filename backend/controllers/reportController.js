const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Product = require("../models/productModel");

const getReports = async (req, res) => {
  try {
    const sqlReport = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") AS date,
        SUM(total) AS total_revenue
      FROM "Order"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") DESC;
    `;

    const mongoReport = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);

    return res.status(200).json({
      sqlReport,
      mongoReport
    });
  } catch (err) {
    console.log("Report Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getReports };
