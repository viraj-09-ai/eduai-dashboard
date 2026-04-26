// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = "eduai_super_secret_key_2026"; 

// This checks if the user has a valid token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    // Remove "Bearer " from the token string
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = verified; // Add user data to the request
    next(); // Let them pass
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// This checks if the user is specifically a teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: "Access Denied. Teachers only." });
  }
  next();
};

module.exports = { verifyToken, isTeacher };