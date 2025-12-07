const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Product = require("../models/productModel");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const mongoProducts = await Product.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });

    
    const priceMap = {};
    mongoProducts.forEach((prod) => {
      priceMap[prod._id] = prod.price;
    });

    let total = 0;
    cartItems.forEach((item) => {
      const price = priceMap[item.productId] || 0;
      total += price * item.quantity;
    });

    const order = await prisma.order.create({
      data: {
        userId,
        total,
      },
    });

    const orderItemsData = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: priceMap[item.productId] || 0,
    }));

    await prisma.orderItem.createMany({
      data: orderItemsData,
    });

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
      items: orderItemsData,
    });
  } catch (err) {
    console.log("Checkout Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { checkout };
