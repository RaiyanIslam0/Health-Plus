const express = require("express");
const app = express();
const cors = require("cors");
const env = require("env2")("./.env");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3000;
//config - db.js

const { connection } = require("./config/db.js");
//Routers
const { userRouter } = require("./Routes/UserRoutes.js");
const { router } = require("./Routes/NutritionRoutes.js");
const { exerciseRouter } = require("./Routes/ExerciseRoutes.js");
const { recipeRouter } = require("./Routes/RecipeRoutes.js");
const { noteRouter } = require("./Routes/NoteRoutes.js");

//MIDDLEWARES
const { auth } = require("./Middleware/authenticator.js");

//CORS - middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

//FOOD ROUTERS
app.post("/api/exercise", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/exercise",
      { query },
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exercise data" });
  }
});


app.use("/nutritionMine", router);

app.use("/exerciseMine", exerciseRouter);

app.use("/recipe", recipeRouter);

app.use("/noteMine", noteRouter);

app.use("/users", userRouter);


//PROTECTED ROUTES WITH AUTH MIDDLWARE
app.use(auth);


app.listen(PORT, async () => {
  try {
    console.log("listening on port " + PORT);
    console.log("connecting to MongoDB Atlas...");
    await connection;
    console.log("connected to MongoDB Atlas...");
  } catch (err) {
    console.log("The error while connecting to MongoDB Atlas", err);
  }
});