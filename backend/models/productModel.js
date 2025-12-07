const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: 
    { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },

    name: 
    { 
        type: String, 
        required: true 
    },

    price: 
    { 
        type: Number, 
        required: true 
    },

    category: 
    { 
        type: String, 
        required: true, 
        index: true 
    },

    updatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Product", productSchema);
