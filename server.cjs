require('dotenv').config();

// Buộc Node.js dùng Google DNS (8.8.8.8) để resolve hostname MongoDB Atlas
// vì DNS cục bộ của mạng không resolve được *.mongodb.net
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
} = require('./models.cjs');

const { 
  authenticateAdmin, 
  JWT_SECRET 
} = require('./middleware.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learts';

app.use(cors());
app.use(express.json());

// Kết nối trực tiếp đến MongoDB Atlas
async function connectToDatabase() {
  try {
    console.log(`Connecting to MongoDB Atlas at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas (Learts database).');
    await seedDatabase();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1); // Dừng server nếu không kết nối được
  }
}

connectToDatabase();

// Seed function if DB is empty
async function seedDatabase() {
  try {
    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    
    if (categoriesCount === 0) {
      console.log('Database categories empty. Seeding from db.json...');
      const dbJsonPath = path.join(__dirname, 'db.json');
      if (fs.existsSync(dbJsonPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
        
        // Seed Categories
        if (dbData.categories && dbData.categories.length > 0) {
          await Category.insertMany(dbData.categories);
          console.log(`Seeded ${dbData.categories.length} categories.`);
          
          const maxCatId = Math.max(...dbData.categories.map(c => c.id), 0);
          await Counter.findOneAndUpdate(
            { id: 'categoryId' },
            { seq: maxCatId },
            { upsert: true }
          );
        }
        
        // Seed Products
        if (dbData.products && dbData.products.length > 0) {
          await Product.insertMany(dbData.products);
          console.log(`Seeded ${dbData.products.length} products.`);
          
          const maxProdId = Math.max(...dbData.products.map(p => p.id), 0);
          await Counter.findOneAndUpdate(
            { id: 'productId' },
            { seq: maxProdId },
            { upsert: true }
          );
        }

        // Initialize Order Counter if not exists
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

// ==========================================
// 1. MODULE XÁC THỰC & QUẢN TRỊ (AUTHENTICATION)
// ==========================================

// POST /api/auth/register - Đăng ký tài khoản Admin mới
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing username, email or password.'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: err.message
    });
  }
});

// POST /api/auth/login - Đăng nhập tài khoản Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body; // Accepts username or email

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentials.'
      });
    }

    // Find User
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username/email or password.'
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username/email or password.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: err.message
    });
  }
});

// ==========================================
// 2. MODULE QUẢN LÝ SẢN PHẨM (PRODUCT & CATEGORY)
// ==========================================

// GET /api/categories - Lấy danh sách danh mục
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: 1 });
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories.',
      error: err.message
    });
  }
});

// GET /api/products - Lấy danh sách sản phẩm với query
app.get('/api/products', async (req, res) => {
  try {
    const { q, categoryId, sort, featured, page, limit } = req.query;
    let queryObj = {};

    // Filter by search
    if (q) {
      queryObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by Category
    if (categoryId) {
      queryObj.categoryId = parseInt(categoryId);
    }

    // Special Query: Featured products
    if (featured === 'true') {
      // Just return first 8 products as mock featured
      const featuredProducts = await Product.find(queryObj).limit(8);
      return res.status(200).json({
        success: true,
        message: 'Featured products retrieved successfully.',
        data: featuredProducts
      });
    }

    // Pagination setup
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const skipNum = (pageNum - 1) * limitNum;

    // Sorting
    let sortObj = {};
    if (sort === 'priceAsc') {
      sortObj.price = 1;
    } else if (sort === 'priceDesc') {
      sortObj.price = -1;
    } else {
      sortObj.id = 1; // Default sorting by ID
    }

    const totalItems = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
        currentPage: pageNum,
        limit: limitNum,
        products
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products.',
      error: err.message
    });
  }
});

// GET /api/products/:id - Lấy chi tiết sản phẩm
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Get Category details for categoryName field
    const category = await Category.findOne({ id: product.categoryId });
    
    res.status(200).json({
      success: true,
      message: 'Product detail retrieved.',
      data: {
        ...product.toObject(),
        categoryName: category ? category.name : 'Uncategorized'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product detail.',
      error: err.message
    });
  }
});

// POST /api/products - Thêm sản phẩm mới (Yêu cầu JWT)
app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, name, price, stockQuantity, imageUrl, description, originalPrice, tag } = req.body;

    // Validate fields
    if (!categoryId || !name || price === undefined || stockQuantity === undefined || !imageUrl || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product details (categoryId, name, price, stockQuantity, imageUrl, description).'
      });
    }

    // Verify Category exists
    const category = await Category.findOne({ id: parseInt(categoryId) });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: `Category ID ${categoryId} does not exist.`
      });
    }

    // Generate unique ID
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

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating product.',
      error: err.message
    });
  }
});

// PUT /api/products/:id - Cập nhật sản phẩm (Yêu cầu JWT)
app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { categoryId, name, price, stockQuantity, imageUrl, description, originalPrice, tag } = req.body;

    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (categoryId) {
      const category = await Category.findOne({ id: parseInt(categoryId) });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: `Category ID ${categoryId} does not exist.`
        });
      }
      product.categoryId = parseInt(categoryId);
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stockQuantity !== undefined) product.stockQuantity = parseInt(stockQuantity);
    if (imageUrl) product.imageUrl = imageUrl;
    if (description) product.description = description;
    
    // Optional / nullable updates
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    if (tag !== undefined) product.tag = tag;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating product.',
      error: err.message
    });
  }
});

// DELETE /api/products/:id - Xóa sản phẩm (Yêu cầu JWT)
app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedProduct = await Product.findOneAndDelete({ id });
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
      data: deletedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product.',
      error: err.message
    });
  }
});

// ==========================================
// 3. MODULE XỬ LÝ ĐƠN HÀNG (ORDER PROCESSING)
// ==========================================

// POST /api/orders - Đặt hàng (Client)
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, email, address, items } = req.body;

    // Validation
    if (!name || !phone || !email || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details (name, phone, email, address, items).'
      });
    }

    const orderItemsDetails = [];
    let totalAmount = 0;

    // Step 1: Validate stock and details first
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product item format in order.'
        });
      }

      const product = await Product.findOne({ id: parseInt(item.productId) });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ID ${item.productId} not found.`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" has insufficient stock. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        });
      }

      totalAmount += product.price * item.quantity;
      orderItemsDetails.push({
        productId: product.id,
        name: product.name,
        price: product.price, // Lock in price at the time of purchase
        quantity: item.quantity
      });
    }

    // Step 2: Deduct stock in DB
    for (const item of items) {
      await Product.findOneAndUpdate(
        { id: parseInt(item.productId) },
        { $inc: { stockQuantity: -parseInt(item.quantity) } }
      );
    }

    // Step 3: Generate order ID and save order
    const nextOrderId = await getNextSequenceValue('orderId');
    const newOrder = new Order({
      id: nextOrderId,
      name,
      phone,
      email,
      address,
      items: orderItemsDetails,
      totalAmount,
      status: 'Pending',
      createdAt: new Date()
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: {
        orderId: newOrder.id,
        totalAmount
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error processing order.',
      error: err.message
    });
  }
});

// GET /api/orders - Lấy danh sách đơn hàng (Yêu cầu JWT, Mới nhất lên đầu)
app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders.',
      error: err.message
    });
  }
});

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Yêu cầu JWT)
app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status.',
      error: err.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
