const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const noteModel = mongoose.model("NoteTest", noteSchema);

module.exports = { noteModel };
