const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Payment = require('./models/Payment');

const app = express();

const authenticateToken = require('./middleware/authenticateToken');
const authorize = require('./middleware/authorize');

// Route only accessible by customers
app.post('/api/payment', authenticateToken, authorize('customer'), async (req, res) => {
  // Payment logic here...
});

// Admin-only route
app.get('/api/admin/payments', authenticateToken, authorize('admin'), async (req, res) => {
  // Logic for viewing all payments here...
});


// SSL Options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.cert')),
};

// Security Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting to Prevent DDoS Attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log("MongoDB connection error:", err));

// Input Validation Function
const validateInput = (data, regex, fieldName) => {
  if (!regex.test(data)) {
    throw new Error(`${fieldName} is invalid.`);
  }
};

// Static Admin Credentials
const ADMIN_CREDENTIALS = {
  accountNumber: "admin123",
  password: "adminpassword",
};

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password, role } = req.body;

    // Input Validation
    validateInput(fullName, /^[a-zA-Z\s]+$/, 'Full name');
    validateInput(idNumber, /^\d{13}$/, 'ID number');
    validateInput(accountNumber, /^\d{10}$/, 'Account number');
    validateInput(password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword,
      role: role || 'customer' // defaults to 'customer'
    });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Endpoint (for both Admin and Customer)
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  if (accountNumber === ADMIN_CREDENTIALS.accountNumber && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin', account: accountNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, role: 'admin' });
  }

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'customer' });
  } catch (error) {
    res.status(500).send('Error during login');
  }
});

// Middleware to Verify JWT and Role
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

// Payment Endpoint (for Customers)
app.post('/api/payment', authenticateToken, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).send('Access Denied');

  try {
    const { amount, currency, provider, recipientAccount, swiftCode } = req.body;

    validateInput(amount, /^\d+(\.\d{1,2})?$/, 'Amount');
    validateInput(currency, /^[A-Z]{3}$/, 'Currency');
    validateInput(provider, /^[A-Za-z\s]+$/, 'Provider');
    validateInput(recipientAccount, /^\d+$/, 'Recipient account');
    validateInput(swiftCode, /^[A-Z0-9]{8,11}$/, 'SWIFT code');

    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      provider,
      recipientAccount,
      swiftCode,
      status: 'pending'
    });

    await newPayment.save();
    res.status(201).send('Payment processed successfully');
  } catch (error) {
    res.status(500).send('Error processing payment');
  }
});

// Admin Endpoints
app.get('/api/admin/payments', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access Denied');

  try {
    const payments = await Payment.find().populate('userId', 'fullName accountNumber');
    res.json(payments);
  } catch (error) {
    res.status(500).send('Error retrieving payments');
  }
});

app.delete('/api/admin/payments/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access Denied');

  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).send('Payment deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting payment');
  }
});

app.put('/api/admin/payments/:id/process', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access Denied');

  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'processed' }, { new: true });
    res.status(200).send({ msg: 'Payment processed successfully', payment });
  } catch (error) {
    res.status(500).send('Error processing payment');
  }
});

// Start HTTPS Server
const PORT = process.env.PORT || 443;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});
