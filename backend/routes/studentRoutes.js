const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const { verifyToken, isTeacher } = require("../middleware/authMiddleware");

// GET (ALL USERS LOGGED IN)
router.get("/", verifyToken, async (req, res) => {
  const students = await Student.find().sort({ _id: -1 });
  res.json(students);
});

// POST (TEACHER ONLY)
router.post("/", verifyToken, isTeacher, async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

// PUT
router.put("/:id", verifyToken, isTeacher, async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", verifyToken, isTeacher, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;