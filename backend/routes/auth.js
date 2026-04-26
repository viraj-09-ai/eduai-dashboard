// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = "eduai_super_secret_key_2026"; // In a real app, this goes in a .env file

// ==========================================
// REGISTER ROUTE
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Hash the password so it's secure
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    // Check if it's MongoDB's specific code for a "Duplicate Key" (code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    // Generic fallback error
    res.status(500).json({ error: "Error creating user" });
  }
});

// ==========================================
// LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// ==========================================
// CHANGE PASSWORD ROUTE (SECURE)
// ==========================================
router.put('/change-password', async (req, res) => {
  try {
    // 1. Check if the user is logged in by looking for their token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const token = authHeader.split(" ")[1];
    
    // 2. Decode the token to figure out WHO is making the request
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Find the user in MongoDB
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 4. Verify their current password before letting them change it
    const { currentPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    // 5. Encrypt the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password securely updated!" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Server error during password update." });
  }
});

module.exports = router;