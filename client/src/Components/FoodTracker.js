import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FoodTracker = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [portion, setPortion] = useState(1);
  const [mealType, setMealType] = useState("breakfast");
  const [userId, setuserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query },
        {
          headers: {
            "x-app-id": "6581ce03",
            "x-app-key": "a70efdad091c87b626984fd4e8017004",
          },
        }
      );
      setResults(response.data.foods);
    } catch (error) {
      setError("Failed to fetch food data.");
    }
  };

  const getUserIdFromToken = (token) => {
    try {
      if (!token) throw new Error("Token is missing");
      const decoded = jwtDecode(token);
      return decoded.userID; // Return the userID field
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const handleAddToDailyNutrition = async (food) => {
    const token = localStorage.getItem("token");
    if (token) {
      setuserId(getUserIdFromToken(token));
    } else {
      console.log("No token found. User might not be logged in.");
    }
    try {
      const foodData = {
        food_name: food.food_name,
        serving_qty: food.serving_qty * portion,
        serving_unit: food.serving_unit,
        serving_weight_grams: food.serving_weight_grams * portion,
        nf_calories: food.nf_calories * portion,
        nf_total_carbohydrate: food.nf_total_carbohydrate * portion,
        nf_protein: food.nf_protein * portion,
        nf_total_fat: food.nf_total_fat * portion,
        meal_type: mealType,
      };

      await axios.post(
        "https://lemickey-hi.onrender.com/nutritionMine",
        foodData,
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      alert(`${food.food_name} added to ${mealType}!`);
    } catch (error) {
      alert("Failed to add food to daily nutrition.");
    }
  };

  return (
    <div>
      <h4>Food Nutrition Tracker</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food (e.g., 2 eggs, banana)"
        />
        <button type="submit">Get Nutrition Info</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <table className="nutrition-table">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Amount Per Serving</th>
                <th>% Daily Value</th>
              </tr>
            </thead>
            <tbody>
              {results.map((food, index) => (
                <tr key={index}>
                  <td colSpan="3">
                    <strong>{food.food_name}</strong> - {food.serving_qty}{" "}
                    {food.serving_unit} ({food.serving_weight_grams}g)
                  </td>
                </tr>
              ))}
              <tr>
                <td>Total Calories</td>
                <td>{(results[0]?.nf_calories * portion).toFixed(1)} kcal</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Total Fat</td>
                <td>{(results[0]?.nf_total_fat * portion).toFixed(1)} g</td>
                <td>
                  {(((results[0]?.nf_total_fat * portion) / 65) * 100).toFixed(
                    1
                  )}
                  %
                </td>
              </tr>
              <tr>
                <td>Saturated Fat</td>
                <td>{(results[0]?.nf_saturated_fat * portion).toFixed(1)} g</td>
                <td>
                  {(
                    ((results[0]?.nf_saturated_fat * portion) / 20) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
              <tr>
                <td>Cholesterol</td>
                <td>{(results[0]?.nf_cholesterol * portion).toFixed(1)} mg</td>
                <td>
                  {(
                    ((results[0]?.nf_cholesterol * portion) / 300) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
              <tr>
                <td>Sodium</td>
                <td>{(results[0]?.nf_sodium * portion).toFixed(1)} mg</td>
                <td>
                  {(((results[0]?.nf_sodium * portion) / 2300) * 100).toFixed(
                    1
                  )}
                  %
                </td>
              </tr>
              <tr>
                <td>Total Carbohydrates</td>
                <td>
                  {(results[0]?.nf_total_carbohydrate * portion).toFixed(1)} g
                </td>
                <td>
                  {(
                    ((results[0]?.nf_total_carbohydrate * portion) / 300) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
              <tr>
                <td>Dietary Fiber</td>
                <td>{(results[0]?.nf_dietary_fiber * portion).toFixed(1)} g</td>
                <td>
                  {(
                    ((results[0]?.nf_dietary_fiber * portion) / 25) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
              <tr>
                <td>Sugars</td>
                <td>{(results[0]?.nf_sugars * portion).toFixed(1)} g</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Protein</td>
                <td>{(results[0]?.nf_protein * portion).toFixed(1)} g</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Calcium</td>
                <td>{(results[0]?.nf_calcium * portion).toFixed(1)} mg</td>
                <td>
                  {(((results[0]?.nf_calcium * portion) / 1000) * 100).toFixed(
                    1
                  )}
                  %
                </td>
              </tr>
              <tr>
                <td>Iron</td>
                <td>{(results[0]?.nf_iron * portion).toFixed(1)} mg</td>
                <td>
                  {(((results[0]?.nf_iron * portion) / 18) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <label>
              Portion Size:
              <input
                type="number"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
                min="1"
              />
            </label>
          </div>
          <div>
            <label>
              Meal Type:
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </label>
          </div>
          <button
            className="add-exercise-button"
            onClick={() => handleAddToDailyNutrition(results[0])}
          >
            Add to {mealType}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodTracker;
