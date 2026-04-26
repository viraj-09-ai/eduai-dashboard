const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { verifyToken } = require("../middleware/authMiddleware");

// 📥 GET all messages for a specific chat
router.get("/:chatId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// 🟢 POST a new message
router.post("/", verifyToken, async (req, res) => {
  try {
    const newMessage = await Message.create({
      chatId: req.body.chatId,
      text: req.body.text,
      sender: req.body.sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;