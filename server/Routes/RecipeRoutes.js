const express = require("express");

const { recipeModel } = require("../Model/RecipeModel.js");
const { userModel } = require("../Model/UserModel.js");

const recipeRouter = express.Router();
recipeRouter.use(express.json());

// Middleware for user authentication
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

// Create a new recipe
recipeRouter.post("/", authenticateUser, async (req, res) => {
  try {
    const { name, category, cuisine, instructions, ingredients } = req.body;

    if (!name || !category || !cuisine || !instructions || !ingredients) {
      return res.status(400).json({
        message:
          "All fields (name, category, cuisine, instructions, ingredients) are required",
      });
    }

    const newRecipe = new recipeModel({
      user_id: req.user._id,
      name,
      category,
      cuisine,
      instructions,
      ingredients,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create recipe." });
  }
});

// Get all recipes for the authenticated user
recipeRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const recipes = await recipeModel.find({ user_id: req.user._id });
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

// Get a recipe by ID
recipeRouter.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeModel.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipe." });
  }
});

// Update a recipe by ID
recipeRouter.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, cuisine, instructions, ingredients } = req.body;

    const updatedRecipe = await recipeModel.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      { name, category, cuisine, instructions, ingredients },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update recipe." });
  }
});

// Delete a recipe by ID
recipeRouter.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await recipeModel.findOneAndDelete({
      _id: id,
      user_id: req.user._id,
    });

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete recipe." });
  }
});

module.exports = { recipeRouter };
