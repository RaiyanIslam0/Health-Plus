const express = require("express");
const router = express.Router();
const { nutritionModel } = require("../Model/NutritionModel.js");
// const User = require("../models/User");
const { userModel } = require("../Model/UserModel.js");


// Middleware to simulate user authentication
// In production, replace this with proper JWT or session-based authentication
const authenticateUser = async (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ message: "Unauthorized: No User ID provided" });

  const user = await userModel.findById(userId);
  if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

  req.user = user;
  next();
};

// Add food to daily nutrition for a specific user
router.post("/", authenticateUser, async (req, res) => {
  try {
    const {
      food_name,
      serving_qty,
      serving_unit,
      serving_weight_grams,
      nf_calories,
      nf_total_carbohydrate,
      nf_protein,
      nf_total_fat,
      meal_type,
    } = req.body;

    const newNutrition = new nutritionModel({
      user_id: req.user._id,
      food_name,
      serving_qty,
      serving_unit,
      serving_weight_grams,
      nf_calories,
      nf_total_carbohydrate,
      nf_protein,
      nf_total_fat,
      meal_type,
    });

    const savedNutrition = await newNutrition.save();
    res.status(201).json(savedNutrition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add food" });
  }
});

// Get all daily nutrition data for the authenticated user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const nutritionData = await nutritionModel
      .find({ user_id: req.user._id })
      .sort({ date: -1 });
    res.status(200).json(nutritionData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch nutrition data" });
  }
});

// // Get nutrition data by meal type for the authenticated user
// router.get("/:meal_type", authenticateUser, async (req, res) => {
//   try {
//     const { meal_type } = req.params;
//     const nutritionData = await Nutrition.find({ user_id: req.user._id, meal_type });
//     res.status(200).json(nutritionData);


// Get nutrition data by meal type for the authenticated user
router.get("/:meal_type", authenticateUser, async (req, res) => {
  try {
    const { meal_type } = req.params;
    const nutritionData = await nutritionModel.find({
      user_id: req.user._id, // Filter by the authenticated user's ID
      meal_type,
    });
    res.status(200).json(nutritionData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch meal data" });
  }
});

// Get nutrition data by meal type and date for the authenticated user
router.get("/mealDate/:meal_type", authenticateUser, async (req, res) => {
  try {
    const { meal_type } = req.params;
    const { date } = req.query; // Retrieve date from the query string (e.g., '2024-11-15')

    let filter = {
      user_id: req.user._id, // Ensure the data is for the authenticated user
      meal_type, // Filter by the requested meal_type
    };

    // If a date is provided, filter by date as well
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay }; // Filter by date range
    }

    const nutritionData = await nutritionModel.find(filter);

    res.status(200).json(nutritionData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch nutrition data" });
  }
});



 // Delete a nutrition entry by ID
 router.delete("/:id", async (req, res) => {
   try {
     const { id } = req.params;
     await nutritionModel.findByIdAndDelete(id);
     res.status(200).json({ message: "Nutrition entry deleted successfully" });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: "Failed to delete entry" });
   }
 });

//  // Get nutrition data by date (e.g., today or specific date)
// router.get("/date", authenticateUser, async (req, res) => {
//   try {
//     const { date } = req.query; // Expecting a query parameter like '2024-11-15'

//     if (!date) {
//       return res.status(400).json({ message: "Date parameter is required" });
//     }

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const nutritionData = await nutritionModel.find({
//       user_id: req.user._id,
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });

//     res.status(200).json(nutritionData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch nutrition data by date" });
//   }
// });


router.get("/date/check/now", authenticateUser, async (req, res) => {
  try {
    const { date } = req.query; // Expecting query parameter 'date' in format YYYY-MM-DD

    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    // Convert to the start of the day (00:00:00) and end of the day (23:59:59)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Query exercises based on userId and the date range
    const nutritionData = await nutritionModel.find({
      user_id: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (nutritionData.length === 0) {
      return res
        .status(404)
        .json({ message: "No exercises found for the given date" });
    }

    res.status(200).json(nutritionData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exercises by date" });
  }
});



 module.exports = { router };
