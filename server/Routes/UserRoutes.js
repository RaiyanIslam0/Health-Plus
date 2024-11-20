const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("env2")("./.env");
const { userModel } = require("../Model/UserModel.js");
// const { calculateCaloriesAndMacros } = require("./CalorieCalculator");


const userRouter = express.Router();
userRouter.use(express.json());

function calculateCaloriesAndMacros({
  gender,
  weight, // Current weight in lbs
  height, // Height in cm
  age, // Age in years
  activityLevel, // Sedentary, Lightly active, etc.
  goalWeight, // Target weight in lbs
  poundsPerWeek, // Weight loss/gain per week
}) {
  // Step 1: Convert weight from lbs to kg
  const weightInKg = weight * 0.453592;
  const goalWeightInKg = goalWeight * 0.453592;

  // Step 2: Calculate BMR
  let bmr;
  if (gender.toLowerCase() === "male") {
    bmr = 10 * weightInKg + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weightInKg + 6.25 * height - 5 * age - 161;
  }

  // Step 3: Adjust for activity level
  const activityFactors = {
    sedentary: 1.2,
    lightlyactive: 1.375,
    moderatelyactive: 1.55,
    veryactive: 1.725,
    superactive: 1.9,
  };

  const tdee = bmr * activityFactors[activityLevel.toLowerCase()];

  // Step 4: Adjust for weight goals
  const caloriesPerKg = 7700; // Approx calories in 1 kg
  const calorieAdjustment = (caloriesPerKg * poundsPerWeek * 0.453592) / 7; // Convert pounds to kg
  const dailyCalories = tdee - calorieAdjustment;

  // Step 5: Macronutrient split (e.g., 40% carbs, 30% protein, 30% fat)
  const macros = {
    protein: Math.round((dailyCalories * 0.3) / 4), // grams of protein
    carbs: Math.round((dailyCalories * 0.4) / 4), // grams of carbs
    fat: Math.round((dailyCalories * 0.3) / 9), // grams of fat
  };

  return {
    dailyCalories: Math.round(dailyCalories),
    macros,
  };
}





// Home page route
userRouter.get("/", (req, res) => {
  res.send("HOME PAGE USER");
});

// User registration route
userRouter.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      password,
      birthday,
      height,
      weight,
      goalWeight,
      poundsPerWeek,
      activityLevel,
    } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    const { dailyCalories, macros } = calculateCaloriesAndMacros({
      gender,
      weight,
      height,
      age,
      activityLevel,
      goalWeight,
      poundsPerWeek,
    });

    const user = new userModel({
      name,
      email,
      gender,
      password: hashedPassword,
      birthday,
      height,
      weight,
      goalWeight,
      poundsPerWeek,
      activityLevel,
      dailyCalories,
      macros,
    });
    await user.save();
    res.send("You are registered");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// User login route
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
          res.status(200).send({ message: "Login successful", token: token });
        } else {
          res.status(401).send({ message: "Wrong password" });
        }
      });
    } else {
      res.status(404).send({ message: "Please register yourself first" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get user details route
userRouter.get("/details", async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.userID;

    // Fetch user details
    const user = await userModel.findById(userID).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token" });
    }
    res.status(500).send({ message: "Internal server error" });
  }
});


// Update user details route
userRouter.put("/update", async (req, res) => {
  try {
    const {
      email,
      name,
      gender,
      password,
      birthday,
      height,
      weight,
      goalWeight,
      poundsPerWeek,
      activityLevel,
    } = req.body;

    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.userID;

    // Fetch user details
    const user = await userModel.findById(userID);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update the user data
    const updatedUser = {
      name: name || user.name,
      email: email || user.email,
      gender: gender || user.gender,
      password: password ? await bcrypt.hash(password, 5) : user.password,
      birthday: birthday || user.birthday,
      height: height || user.height,
      weight: weight || user.weight,
      goalWeight: goalWeight || user.goalWeight,
      poundsPerWeek: poundsPerWeek || user.poundsPerWeek,
      activityLevel: activityLevel || user.activityLevel,
    };

    // Calculate new age and recalculate calories and macros
    const age = new Date().getFullYear() - new Date(updatedUser.birthday).getFullYear();
    const { dailyCalories, macros } = calculateCaloriesAndMacros({
      gender: updatedUser.gender,
      weight: updatedUser.weight,
      height: updatedUser.height,
      age,
      activityLevel: updatedUser.activityLevel,
      goalWeight: updatedUser.goalWeight,
      poundsPerWeek: updatedUser.poundsPerWeek,
    });

    // Update the user's details and calories/macros
    updatedUser.dailyCalories = dailyCalories;
    updatedUser.macros = macros;

    // Save the updated user
    await userModel.findByIdAndUpdate(userID, updatedUser, { new: true });

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token" });
    }
    res.status(500).send({ message: "Internal server error" });
  }
});




module.exports = { userRouter };
