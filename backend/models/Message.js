const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatId: { 
    type: Number, 
    required: true 
  }, // Tells us if this is for Sarah (2), IT (3), etc.
  text: { 
    type: String, 
    required: true 
  },
  sender: { 
    type: String, 
    required: true,
    enum: ['me', 'them'] // Is it from you or the other person?
  },
  time: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);