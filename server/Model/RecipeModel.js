const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g., "12" or "1/2 tbsp"
});

const recipeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "People",
  },
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Lamb
  cuisine: { type: String, required: true }, // e.g., Indian
  instructions: { type: String, required: true }, // Step-by-step instructions
  ingredients: [ingredientSchema], // Array of ingredient objects
  createdAt: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    },
  },
});

const recipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = { recipeModel };
