import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ExerciseTracker = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  // Get current date in YYYY-MM-DD format
  // const getCurrentDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  // };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      setUserId(getUserIdFromToken(token));
    } else {
      console.log("No token found. User might not be logged in.");
    }

    try {
      // Get exercise data from Nutritionix API
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/exercise",
        { query },
        {
          headers: {
            "x-app-id": process.env.REACT_APP_NUTRITIONIX_APP_ID,
            "x-app-key": process.env.REACT_APP_NUTRITIONIX_APP_KEY,
          },
        }
      );

      const today = new Date().toLocaleDateString("en-CA");

      setResults(
        response.data.exercises.map((exercise) => ({
          name: exercise.name,
          calories: exercise.nf_calories,
          duration: exercise.duration_min,
          date: today,
        }))
      );
    } catch (error) {
      setError("Failed to fetch exercise data.");
    }
  };

  const handleAddExercise = async () => {
    try {
      await axios.post(
        "https://lemickey-hi.onrender.com/exerciseMine",
        results,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );
      alert("Exercise data successfully added to the database!");
      setResults([]); // Clear the results after successful addition
    } catch (error) {
      setError("Failed to add exercise data to the database.");
    }
  };

  return (
    <div>
      <h2>Exercise Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter exercise (e.g., ran 3 miles)"
        />
        <button type="submit">Search Exercise</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h3 class="exercise-result">Exercise Results</h3>
          <ul>
            {results.map((exercise, index) => (
              <li key={index}>
                <strong>{exercise.name}</strong>: Burned {exercise.calories}{" "}
                calories in {exercise.duration} minutes.
              </li>
            ))}
          </ul>
          <button
            className="add-exercise-button-second"
            onClick={handleAddExercise}
          >
            Add Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseTracker;
