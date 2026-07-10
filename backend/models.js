const mongoose = require('mongoose');

// Counter Schema for integer auto-increment IDs
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Helper function to get next sequence value
async function getNextSequenceValue(sequenceName) {
  const doc = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

// User Schema (Admin)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Auto-incrementing numeric ID
  name: { type: String, required: true },
  description: { type: String }
});
const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Auto-incrementing numeric ID
  categoryId: { type: Number, required: true }, // Number to match category.id
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number },
  tag: { type: String }
});
const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Auto-incrementing numeric ID
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  items: [{
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Counter,
  getNextSequenceValue,
  User,
  Category,
  Product,
  Order
};
