import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Exercise from "./Exercise";
import FoodTrackerModal from "./FoodTrackerModal";

// FoodItem component for displaying each food in a meal
const FoodItem = ({ food, onDelete }) => (
  <tr>
    <td>{food.food_name}</td>
    <td>{food.serving_qty}</td>
    <td>{food.serving_weight_grams}</td>
    <td>{food.nf_calories} </td>
    <td>{food.nf_total_carbohydrate}</td>
    <td>{food.nf_total_fat} </td>
    <td>{food.nf_protein} </td>

    <td>
      <button onClick={onDelete} className="delete-food-button">
        Delete
      </button>
    </td>
  </tr>
);

const FoodDiary = () => {
  const [foodData, setFoodData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    exercise: {
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      sodium: 0,
      sugar: 0,
    },
    exerciseList: [], // To hold list of added exercises
    exercise: { calories: 0 }, // Placeholder for a single exercise
  });
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [dailyGoal, setDailyGoal] = React.useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    caloriesBurned: 0,
  });

  const handleAddExercise = async () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const userId = getUserIdFromToken(token); // Extract user ID from token
      // Get today's date in the format YYYY-MM-DD
      // const date = new Date().toISOString().split("T")[0];
      const today = new Date().toLocaleDateString("en-CA");

      // Make API request to fetch exercises for the current date
      //date
      const response = await axios.get(
        `https://lemickey-hi.onrender.com/exerciseMine/date?date=${today}`,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );

      if (response.status === 200) {
        const exercises = response.data; // Response from the API
        console.log("exercise " + exercises);

        // Update state with the fetched exercise data and deduplicate by _id
        setFoodData((prevState) => {
          const updatedExerciseList = prevState.exerciseList || [];

          // Combine new exercises with the existing ones
          const combinedData = [...updatedExerciseList, ...exercises];

          // Deduplicate by _id
          const deduplicatedData = combinedData.reduce((acc, exercise) => {
            if (!acc.some((existing) => existing._id === exercise._id)) {
              acc.push(exercise);
            }
            return acc;
          }, []);

          return {
            ...prevState,
            exerciseList: deduplicatedData, // Update the exercise list in state
          };
        });

        // Calculate the total calories burned after deduplication
        const totalCalories = exercises.reduce(
          (total, exercise) => total + exercise.calories,
          0
        );

        setTotalCaloriesBurned((prevTotal) =>
          parseFloat(totalCalories.toFixed(2))
        );

        console.log("calories burned " + totalCaloriesBurned);

        console.log(
          `${exercises.length} exercises added. Total Calories burned: ${totalCalories}`
        );
      } else {
        console.error("Failed to fetch exercises:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error.message);
    }
  };

  const handleDeleteExercise = async (index) => {
    const exerciseToDelete = foodData.exerciseList[index];
    const exerciseIdToDelete = exerciseToDelete._id; // Get the ID of the exercise item to delete
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const userId = getUserIdFromToken(token); // Extract user ID from token
      console.log("User ID:", userId);

      // Make the DELETE request to the backend
      const response = await axios.delete(
        `https://lemickey-hi.onrender.com/exerciseMine/${exerciseIdToDelete}`,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );

      if (response.status === 200) {
        console.log("Exercise deleted successfully!");

        // Update state to reflect the deletion
        setFoodData((prevState) => {
          const updatedExerciseList = prevState.exerciseList.filter(
            (_, i) => i !== index
          );
          return { ...prevState, exerciseList: updatedExerciseList };
        });

        // Update total calories burned
        setTotalCaloriesBurned(
          (prevTotal) => prevTotal - exerciseToDelete.calories
        );
      } else {
        console.error("Failed to delete exercise:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting exercise:", error.message);
    }
  };

  const handleFetchUserDetails = async () => {
    console.log("test");
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      // Decode the user ID from the token if necessary
      const userId = getUserIdFromToken(token); // Replace with your implementation
      console.log("User ID:", userId);

      // Fetch user details from the backend
      const response = await axios.get(
        "https://lemickey-hi.onrender.com/users/details",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );

      if (response.status === 200) {
        const userDetails = response.data;
        console.log("User Details:", userDetails);

        // Extract relevant data
        const { activityLevel, macros, dailyCalories } = userDetails;

        const activityFactors = {
          sedentary: 200,
          lightlyactive: 300,
          moderatelyactive: 400,
          veryactive: 500,
          superactive: 600,
        };

        const caloriesBurned =
          activityFactors[activityLevel.toLowerCase()] || 0;

        // Update the dailyGoal state
        const updatedDailyGoal = {
          calories: dailyCalories,
          carbs: macros.carbs,
          fat: macros.fat,
          protein: macros.protein,
          caloriesBurned: caloriesBurned,
        };

        console.log("Updated Daily Goal:", updatedDailyGoal);

        // Set this in the state or use it in your application logic
        setDailyGoal(updatedDailyGoal); // Replace with your state management logic
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  useEffect(() => {
    handleFetchUserDetails();
    handleAddFood("breakfast");
    handleAddFood("lunch");
    handleAddFood("dinner");
    handleAddFood("snack");
    handleAddExercise();
  }, []); // Runs only once when the component mounts

  const getUserIdFromToken = (token) => {
    try {
      if (!token) throw new Error("Token is missing");
      const decoded = jwtDecode(token); // Decode the token
      return decoded.userID; // Return the userID field
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const handleAddFood = async (mealType) => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const userId = getUserIdFromToken(token); // Extract user ID from token
      console.log("User ID:", userId);

      //   // Format the current date (e.g., '2024-11-15') to send as a query parameter
      //   const date = new Date().toISOString().split("T")[0];

      // Make the GET request to fetch nutrition data
      const response = await axios.get(
        `https://lemickey-hi.onrender.com/nutritionMine/mealDate/${mealType}?date=${formattedDate}`,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );

      if (response.status === 200) {
        const nutritionData = response.data;
        console.log(nutritionData);
        console.log(foodData);

        // // Update state with the fetched nutrition data
        // setFoodData((prevData) => ({
        //   ...prevData,
        //   [mealType]: [...prevData[mealType], ...nutritionData],
        // }));

        // Update state with the fetched nutrition data
        setFoodData((prevData) => {
          const updatedMealData = prevData[mealType] || []; // Ensure we don't access undefined
          const combinedData = [...updatedMealData, ...nutritionData];

          // Optional: Deduplicate data by _id
          const deduplicatedData = combinedData.reduce((acc, item) => {
            if (!acc.some((existing) => existing._id === item._id)) {
              acc.push(item);
            }
            return acc;
          }, []);

          return {
            ...prevData,
            [mealType]: deduplicatedData, // Update the specific meal type
          };
        });

        console.log(foodData);

        console.log(`${nutritionData.length} items added to ${mealType}`);
      } else {
        console.error("Failed to fetch nutrition data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error.message);
    }
  };

  const handleDeleteFood = async (meal, index) => {
    const foodIdToDelete = foodData[meal][index]._id; // Get the ID of the food item to delete
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const userId = getUserIdFromToken(token); // Extract user ID from token
      console.log("User ID:", userId);

      // Make the DELETE request to the backend
      const response = await axios.delete(
        `https://lemickey-hi.onrender.com/nutritionMine/${foodIdToDelete}`,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );

      if (response.status === 200) {
        console.log("Food item deleted successfully!");

        // Update state to reflect the deletion
        setFoodData((prevData) => {
          const updatedMeal = [...prevData[meal]];
          updatedMeal.splice(index, 1); // Remove the food item from the array
          return {
            ...prevData,
            [meal]: updatedMeal, // Update the meal array
          };
        });
      } else {
        console.error("Failed to delete food item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting food item:", error.message);
    }
  };

  const calculateTotal = (meal) => {
    return foodData[meal].reduce(
      (totals, food) => {
        totals.calories += food.nf_calories;
        totals.carbs += food.nf_total_carbohydrate;
        totals.fat += food.nf_total_fat;
        totals.protein += food.nf_protein;
        totals.sodium += food.sodium;
        totals.sugar += food.sugar;

        // Round each total to 2 decimal places
        totals.calories = parseFloat(totals.calories.toFixed(2));
        totals.carbs = parseFloat(totals.carbs.toFixed(2));
        totals.fat = parseFloat(totals.fat.toFixed(2));
        totals.protein = parseFloat(totals.protein.toFixed(2));
        totals.sodium = parseFloat(totals.sodium.toFixed(2));
        totals.sugar = parseFloat(totals.sugar.toFixed(2));

        return totals;
      },
      { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
    );
  };

  const calculateDailyTotals = () => {
    const meals = ["breakfast", "lunch", "dinner", "snack"];
    return meals.reduce(
      (totals, meal) => {
        const mealTotals = calculateTotal(meal);
        totals.calories += mealTotals.calories;
        totals.carbs += mealTotals.carbs;
        totals.fat += mealTotals.fat;
        totals.protein += mealTotals.protein;
        totals.sodium += mealTotals.sodium;
        totals.sugar += mealTotals.sugar;
        // Round each total to 2 decimal places
        totals.calories = parseFloat(totals.calories.toFixed(2));
        totals.carbs = parseFloat(totals.carbs.toFixed(2));
        totals.fat = parseFloat(totals.fat.toFixed(2));
        totals.protein = parseFloat(totals.protein.toFixed(2));
        totals.sodium = parseFloat(totals.sodium.toFixed(2));
        totals.sugar = parseFloat(totals.sugar.toFixed(2));
        return totals;
      },
      { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
    );
  };

  const calculateRemaining = (totals, goal) => ({
    calories: (goal.calories - totals.calories).toFixed(2),
    carbs: (goal.carbs - totals.carbs).toFixed(2),
    fat: (goal.fat - totals.fat).toFixed(2),
    protein: (goal.protein - totals.protein).toFixed(2),
    sodium: (goal.sodium - totals.sodium).toFixed(2),
    sugar: (goal.sugar - totals.sugar).toFixed(2),
  });

  // Get today's date dynamically
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dailyTotals = calculateDailyTotals();
  const remaining = calculateRemaining(dailyTotals, dailyGoal);

  //   const exerciseDaily = totalCalories;
  //   const remainingExercise = dailyGoal.caloriesBurned - exerciseDaily;

  return (
    <div className="food-diary">
      <h1>Your Food Diary For: {formattedDate}</h1>

      <div className="meal-section">
        <h3>Breakfast</h3>
        <table className="meal-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Servings</th>
              <th>Serving Weight (g)</th>
              <th>Calories (kcal)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the food items */}
            {foodData.breakfast.map((food, index) => (
              <FoodItem
                key={index}
                food={food}
                onDelete={() => handleDeleteFood("breakfast", index)}
              />
            ))}
            {/* Add the total row */}
            <tr className="total-row">
              <td>
                <button
                  onClick={() => handleAddFood("breakfast")}
                  className="add-food-button"
                >
                  <FoodTrackerModal />
                </button>
              </td>
              <td
                colSpan={2}
                style={{ fontWeight: "bold", textAlign: "right" }}
              >
                Total:
              </td>
              <td>{calculateTotal("breakfast").calories} kcal</td>
              <td>{calculateTotal("breakfast").carbs} g</td>
              <td>{calculateTotal("breakfast").fat} g</td>
              <td>{calculateTotal("breakfast").protein} g</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        {/* <button
          onClick={() => handleAddFood("breakfast")}
          className="add-food-button"
        >
          <FoodTrackerModal />
        </button> */}
      </div>

      <div className="meal-section">
        <h3>Lunch</h3>
        <table className="meal-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Servings</th>
              <th>Serving Weight (g)</th>
              <th>Calories (kcal)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {foodData.lunch.map((food, index) => (
              <FoodItem
                key={index}
                food={food}
                onDelete={() => handleDeleteFood("lunch", index)}
              />
            ))}
            {/* Add the total row */}
            <tr className="total-row">
              <td>
                <button
                  onClick={() => handleAddFood("lunch")}
                  className="add-food-button"
                >
                  <FoodTrackerModal />
                </button>
              </td>

              <td
                colSpan={2}
                style={{ fontWeight: "bold", textAlign: "right" }}
              >
                Total:
              </td>
              <td>{calculateTotal("lunch").calories} kcal</td>
              <td>{calculateTotal("lunch").carbs} g</td>
              <td>{calculateTotal("lunch").fat} g</td>
              <td>{calculateTotal("lunch").protein} g</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meal-section">
        <h3>Dinner</h3>
        <table className="meal-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Servings</th>
              <th>Serving Weight (g)</th>
              <th>Calories (kcal)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {foodData.dinner.map((food, index) => (
              <FoodItem
                key={index}
                food={food}
                onDelete={() => handleDeleteFood("dinner", index)}
              />
            ))}
            <tr className="total-row">
              <td>
                <button
                  onClick={() => handleAddFood("dinner")}
                  className="add-food-button"
                >
                  <FoodTrackerModal />
                </button>
              </td>
              <td
                colSpan={2}
                style={{ fontWeight: "bold", textAlign: "right" }}
              >
                Total:
              </td>
              <td>{calculateTotal("dinner").calories} kcal</td>
              <td>{calculateTotal("dinner").carbs} g</td>
              <td>{calculateTotal("dinner").fat} g</td>
              <td>{calculateTotal("dinner").protein} g</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meal-section">
        <h3>Snack</h3>
        <table className="meal-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Servings</th>
              <th>Serving Weight (g)</th>
              <th>Calories (kcal)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {foodData.snack.map((food, index) => (
              <FoodItem
                key={index}
                food={food}
                onDelete={() => handleDeleteFood("snack", index)}
              />
            ))}
            <tr className="total-row">
              <td>
                <button
                  onClick={() => handleAddFood("snack")}
                  className="add-food-button"
                >
                  <FoodTrackerModal />
                </button>
              </td>
              <td
                colSpan={2}
                style={{ fontWeight: "bold", textAlign: "right" }}
              >
                Total:
              </td>
              <td>{calculateTotal("snack").calories} kcal</td>
              <td>{calculateTotal("snack").carbs} g</td>
              <td>{calculateTotal("snack").fat} g</td>
              <td>{calculateTotal("snack").protein} g</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        {/* <button
          onClick={() => handleAddFood("snacks")}
          className="add-food-button"
        >
          <FoodTrackerModal />
        </button> */}
      </div>

      <div className="exercise-section">
        <h3>Exercise</h3>
        <Exercise />
        <button className="add-exercise-button" onClick={handleAddExercise}>
          View Exercises
        </button>

        <div className="exercise-list">
          <table className="exercise-table">
            <thead>
              <tr>
                <th>Exercise Name</th>
                <th>Calories Burned (kcal)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {foodData.exerciseList.map((exercise, index) => (
                <tr key={index}>
                  <td>{exercise.name}</td>
                  <td>{exercise.calories} </td>
                  <td>
                    <button
                      className="delete-exercise-button"
                      onClick={() => handleDeleteExercise(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="exercise-info">
          <p>Total Calories burned: {totalCaloriesBurned} kcal</p>
        </div>
      </div>

      <div className="totals">
        <h3>Nutrition Summary</h3>
        <table className="totals-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Calories (kcal)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th>Calories Burned (kcal)</th>
              {/* <th>Sugar (g)</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Totals</strong>
              </td>
              <td>{dailyTotals.calories}</td>
              <td>{dailyTotals.carbs}</td>
              <td>{dailyTotals.fat}</td>
              <td>{dailyTotals.protein}</td>
              <td>{totalCaloriesBurned}</td>
              {/* <td>{dailyTotals.sugar}</td> */}
            </tr>
            <tr>
              <td>
                <strong>Your Daily Goal</strong>
              </td>
              <td>{dailyGoal.calories}</td>
              <td>{dailyGoal.carbs}</td>
              <td>{dailyGoal.fat}</td>
              <td>{dailyGoal.protein}</td>
              <td>{dailyGoal.caloriesBurned}</td>
              {/* <td>{dailyGoal.sugar}</td> */}
            </tr>
            <tr>
              <td>
                <strong>Remaining</strong>
              </td>
              <td>{remaining.calories}</td>
              <td>{remaining.carbs}</td>
              <td>{remaining.fat}</td>
              <td>{remaining.protein}</td>
              <td>
                {parseFloat(
                  (dailyGoal.caloriesBurned - totalCaloriesBurned).toFixed(2)
                )}
              </td>
              {/* <td>{remaining.sugar}</td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodDiary;
