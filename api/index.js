require('dotenv').config();

// Buộc Node.js dùng Google DNS để resolve hostname MongoDB Atlas
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const {
  getNextSequenceValue,
  Counter,
  User,
  Category,
  Product,
  Order
} = require('./models.js');

const {
  authenticateAdmin,
  JWT_SECRET
} = require('./middleware.js');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS - cho phép tất cả origin (frontend Vercel sẽ gọi vào backend Vercel khác domain)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ============================================================
// KẾT NỐI MONGODB ATLAS
// ============================================================
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables!');
    throw new Error('MONGODB_URI is not set');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas (Learts database).');
    await seedDatabase();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    throw err;
  }
}

// Seed dữ liệu mẫu từ db.json nếu DB còn trống
async function seedDatabase() {
  try {
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('Database empty. Seeding from db.json...');
      const dbJsonPath = path.join(__dirname, 'db.json');
      if (fs.existsSync(dbJsonPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

        if (dbData.categories && dbData.categories.length > 0) {
          await Category.insertMany(dbData.categories);
          const maxCatId = Math.max(...dbData.categories.map(c => c.id), 0);
          await Counter.findOneAndUpdate({ id: 'categoryId' }, { seq: maxCatId }, { upsert: true });
          console.log(`Seeded ${dbData.categories.length} categories.`);
        }

        if (dbData.products && dbData.products.length > 0) {
          await Product.insertMany(dbData.products);
          const maxProdId = Math.max(...dbData.products.map(p => p.id), 0);
          await Counter.findOneAndUpdate({ id: 'productId' }, { seq: maxProdId }, { upsert: true });
          console.log(`Seeded ${dbData.products.length} products.`);
        }

        await Counter.findOneAndUpdate(
          { id: 'orderId' },
          { $setOnInsert: { seq: 0 } },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

// Middleware: tự động kết nối DB trước mỗi request (quan trọng cho Vercel Serverless)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database connection failed.', error: err.message });
  }
});

// ============================================================
// 1. AUTH ROUTES
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing username, email or password.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      data: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials.' });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { token, user: { id: user._id, username: user.username, email: user.email } }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
});

// ============================================================
// 1.1. USER MANAGEMENT ROUTES (Admin Only)
// ============================================================

// GET /api/users - Lấy danh sách admin
app.get('/api/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Users retrieved successfully.', data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users.', error: err.message });
  }
});

// DELETE /api/users/:id - Xóa tài khoản admin
app.delete('/api/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Không cho phép tự xóa chính mình
    if (req.user.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully.', data: { id: deletedUser._id, username: deletedUser.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting user.', error: err.message });
  }
});

// ============================================================
// 2. CATEGORY & PRODUCT ROUTES
// ============================================================

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: 1 });
    res.status(200).json({ success: true, message: 'Categories retrieved successfully.', data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching categories.', error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { q, categoryId, sort, featured, page, limit } = req.query;
    let queryObj = {};

    if (q) {
      queryObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (categoryId) queryObj.categoryId = parseInt(categoryId);

    if (featured === 'true') {
      const featuredProducts = await Product.find(queryObj).limit(8);
      return res.status(200).json({ success: true, message: 'Featured products retrieved.', data: featuredProducts });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const skipNum = (pageNum - 1) * limitNum;

    let sortObj = {};
    if (sort === 'priceAsc') sortObj.price = 1;
    else if (sort === 'priceDesc') sortObj.price = -1;
    else sortObj.id = 1;

    const totalItems = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj).sort(sortObj).skip(skipNum).limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: { totalItems, totalPages: Math.ceil(totalItems / limitNum), currentPage: pageNum, limit: limitNum, products }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching products.', error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const category = await Category.findOne({ id: product.categoryId });
    res.status(200).json({
      success: true,
      message: 'Product detail retrieved.',
      data: { ...product.toObject(), categoryName: category ? category.name : 'Uncategorized' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching product detail.', error: err.message });
  }
});

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, name, price, stockQuantity, imageUrl, description, originalPrice, tag } = req.body;

    if (!categoryId || !name || price === undefined || stockQuantity === undefined || !imageUrl || !description) {
      return res.status(400).json({ success: false, message: 'Missing required product fields.' });
    }

    const category = await Category.findOne({ id: parseInt(categoryId) });
    if (!category) return res.status(400).json({ success: false, message: `Category ID ${categoryId} does not exist.` });

    const nextId = await getNextSequenceValue('productId');
    const newProduct = new Product({
      id: nextId,
      categoryId: parseInt(categoryId),
      name,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      imageUrl,
      description,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      tag
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created successfully.', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating product.', error: err.message });
  }
});

app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { categoryId, name, price, stockQuantity, imageUrl, description, originalPrice, tag } = req.body;

    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (categoryId) {
      const category = await Category.findOne({ id: parseInt(categoryId) });
      if (!category) return res.status(400).json({ success: false, message: `Category ID ${categoryId} does not exist.` });
      product.categoryId = parseInt(categoryId);
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stockQuantity !== undefined) product.stockQuantity = parseInt(stockQuantity);
    if (imageUrl) product.imageUrl = imageUrl;
    if (description) product.description = description;
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    if (tag !== undefined) product.tag = tag;

    await product.save();
    res.status(200).json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating product.', error: err.message });
  }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedProduct = await Product.findOneAndDelete({ id });
    if (!deletedProduct) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, message: 'Product deleted successfully.', data: deletedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting product.', error: err.message });
  }
});

// ============================================================
// 3. ORDER ROUTES
// ============================================================

app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, email, address, items } = req.body;

    if (!name || !phone || !email || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required order details.' });
    }

    const orderItemsDetails = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid product item format.' });
      }
      const product = await Product.findOne({ id: parseInt(item.productId) });
      if (!product) return res.status(404).json({ success: false, message: `Product ID ${item.productId} not found.` });

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" insufficient stock. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        });
      }

      totalAmount += product.price * item.quantity;
      orderItemsDetails.push({ productId: product.id, name: product.name, price: product.price, quantity: item.quantity });
    }

    for (const item of items) {
      await Product.findOneAndUpdate({ id: parseInt(item.productId) }, { $inc: { stockQuantity: -parseInt(item.quantity) } });
    }

    const nextOrderId = await getNextSequenceValue('orderId');
    const newOrder = new Order({ id: nextOrderId, name, phone, email, address, items: orderItemsDetails, totalAmount, status: 'Pending' });
    await newOrder.save();

    res.status(201).json({ success: true, message: 'Order created successfully.', data: { orderId: newOrder.id, totalAmount } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error processing order.', error: err.message });
  }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Orders retrieved successfully.', data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving orders.', error: err.message });
  }
});

app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findOne({ id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated successfully.', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating order status.', error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Learts Backend API is running!', timestamp: new Date().toISOString() });
});

// Chạy server cục bộ
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}

// Export cho Vercel Serverless
module.exports = app;
