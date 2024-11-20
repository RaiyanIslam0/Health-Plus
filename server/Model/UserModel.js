const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    goalWeight: {
      type: Number,
      required: true, // Make this mandatory if necessary
    },
    poundsPerWeek: {
      type: Number,
      required: true, // Make this mandatory if necessary
    },
    activityLevel: {
      type: String,
      required: true,
    },
    dailyCalories: {
      type: Number,
    },
    macros: {
      protein: Number, // grams
      carbs: Number, // grams
      fat: Number, // grams
    },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("People", userSchema);

module.exports = { userModel };
