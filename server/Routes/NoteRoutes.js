const express = require("express");
const { noteModel } = require("../Model/NoteModel.js");
const { userModel } = require("../Model/UserModel.js");

const noteRouter = express.Router();
noteRouter.use(express.json());

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId)
    return res
      .status(401)
      .json({ message: "Unauthorized: No User ID provided" });

  const user = await userModel.findById(userId);
  if (!user)
    return res.status(401).json({ message: "Unauthorized: User not found" });

  req.user = user;
  next();
};

// Create or update a note for a specific date
noteRouter.post("/", authenticateUser, async (req, res) => {
  try {
    const { date, note } = req.body;

    if (!date || !note) {
      return res
        .status(400)
        .json({ message: "Date and note are required." });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0]; // Ensure date is properly formatted

    const existingNote = await noteModel.findOne({
      user_id: req.user._id,
      date: formattedDate,
    });

    if (existingNote) {
      // Update the existing note
      existingNote.note = note;
      const updatedNote = await existingNote.save();
      return res.status(200).json(updatedNote);
    }

    // Create a new note
    const newNote = new noteModel({
      user_id: req.user._id,
      date: formattedDate,
      note,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create or update note." });
  }
});

// Retrieve a note by date
noteRouter.get("/:date", authenticateUser, async (req, res) => {
  try {
    const { date } = req.params;
    const formattedDate = new Date().toLocaleDateString("en-CA");

    const note = await noteModel.findOne({
      user_id: req.user._id,
      date: formattedDate,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch note." });
  }
});

// Optional: Delete a note for a specific date
noteRouter.delete("/:date", authenticateUser, async (req, res) => {
  try {
    const { date } = req.params;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const deletedNote = await noteModel.findOneAndDelete({
      user_id: req.user._id,
      date: formattedDate,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete note." });
  }
});

module.exports = { noteRouter };
