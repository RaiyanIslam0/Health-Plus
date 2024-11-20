const mongoose = require("mongoose");

const NutritionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "People",
    required: true,
  },
  food_name: { type: String, required: true },
  serving_qty: { type: Number, required: true },
  serving_unit: { type: String, required: true },
  serving_weight_grams: { type: Number, required: true },
  nf_calories: { type: Number, required: true },
  nf_total_carbohydrate: { type: Number, required: true },
  nf_protein: { type: Number, required: true },
  nf_total_fat: { type: Number, required: true },
  meal_type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString("en-CA"),
  },
});


const nutritionModel = mongoose.model("Nutrition", NutritionSchema);
module.exports = { nutritionModel };
