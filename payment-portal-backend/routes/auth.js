const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  // Input Validation using Regex
  if (!/^[a-zA-Z\s]+$/.test(fullName)) {
    return res.status(400).json({ msg: "Full name must contain only letters and spaces." });
  }
  if (!/^\d{13}$/.test(idNumber)) {
    return res.status(400).json({ msg: "ID number must contain exactly 13 digits." });
  }
  if (!/^\d{10}$/.test(accountNumber)) {
    return res.status(400).json({ msg: "Account number must contain exactly 10 digits." });
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return res.status(400).json({ msg: "Password must be at least 8 characters, contain letters and numbers." });
  }

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword,
      role: 'customer'
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
