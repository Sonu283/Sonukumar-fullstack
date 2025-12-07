const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID & quantity required" });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });

      return res.status(200).json({ message: "Cart updated", item: updated });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      }
    });

    return res.status(201).json({ message: "Added to cart", item: cartItem });
  } catch (err) {
    console.log("Add to cart error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await prisma.cartItem.findMany({
      where: { userId }
    });

    return res.status(200).json({ items });
  } catch (err) {
    console.log("Get cart error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.log("Remove cart error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
