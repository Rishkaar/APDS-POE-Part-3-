const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const User = require('./models/User');
const Payment = require('./models/Payment');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware to authenticate and authorize user roles
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Access Denied: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
};

// Static admin credentials
const ADMIN_CREDENTIALS = {
  accountNumber: 'admin123',
  password: 'adminpassword',
};

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;
  
  // Basic validation
  if (!fullName || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword,
      role: 'customer',
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  // Static admin login
  if (accountNumber === ADMIN_CREDENTIALS.accountNumber && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, role: 'admin' });
  }

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'customer' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Payment Endpoint (only accessible by customers)
app.post('/api/payment', authenticateToken, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ msg: 'Access Denied: Only customers can make payments' });

  const { amount, currency, provider, recipientAccount, swiftCode } = req.body;
  try {
    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      provider,
      recipientAccount,
      swiftCode,
      status: 'pending',
    });
    await newPayment.save();
    res.status(201).json({ msg: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error processing payment' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
