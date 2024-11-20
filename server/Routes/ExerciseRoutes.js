const express = require("express");

const { exerciseModel } = require("../Model/ExerciseModel.js");
const { userModel } = require("../Model/UserModel.js");

const exerciseRouter = express.Router();
exerciseRouter.use(express.json());

// Middleware to simulate user authentication
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

// Add exercise data to the database
exerciseRouter.post("/", authenticateUser, async (req, res) => {
  try {
    const exercises = req.body;

    // Iterate over each exercise and save it
    const savedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const newExercise = new exerciseModel({
          user_id: req.user._id,
          name: exercise.name,
          calories: exercise.calories,
          duration: exercise.duration,
          date: exercise.date,
        });

        return await newExercise.save();
      })
    );

    res.status(201).json(savedExercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add exercise data." });
  }
});

// Fetch all exercises for the authenticated user
exerciseRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const exercises = await exerciseModel.find({ user_id: req.user._id });
    res.status(200).json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exercise data." });
  }
});

// Get exercises by user and date
exerciseRouter.get("/date", authenticateUser, async (req, res) => {
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
    const exercises = await exerciseModel.find({
      user_id: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: "No exercises found for the given date" });
    }

    res.status(200).json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exercises by date" });
  }
});

 // Delete a nutrition entry by ID
exerciseRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await exerciseModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Exercise entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
});

module.exports = { exerciseRouter };
