const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "People",
  },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  duration: { type: Number, required: true }, // In minutes
  date: { type: Date, required: true }, // Date of the exercise
});

const exerciseModel = mongoose.model("Exercise", exerciseSchema);

module.exports = { exerciseModel };
