import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeModal from "./RecipeModal";
import RecipeViewModal from "./RecipeViewModal";
import { jwtDecode } from "jwt-decode";

const RecipeLookup = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [recipeData, setRecipeData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Holds the selected recipe data
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal open/close

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    handleAddRecipe();
  }, []); // Runs only once when the component mounts

  const handleRecipeDetails = (recipeId) => {
    setSelectedRecipeId(recipeId); // Set the selected recipe ID when clicked
  };

  const getUserIdFromToken = (token) => {
    try {
      if (!token) throw new Error("Token is missing");
      const decoded = jwtDecode(token);
      return decoded.userID;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const handleAddRecipe = async () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const userId = getUserIdFromToken(token); // Extract user ID from token
      console.log("User ID:", userId);

      // Make the GET request to fetch recipe data
      const response = await axios.get(
        `https://lemickey-hi.onrender.com/recipe`,
        {
          headers: {
            "x-user-id": userId, // Pass user ID as a header
          },
        }
      );

      if (response.status === 200) {
        const recipeData = response.data;
        console.log("Fetched Recipe Data:", recipeData);

        // Update state with the fetched recipes
        setRecipeData((prevData) => {
          const combinedData = [...prevData, ...recipeData];

          // Optional: Deduplicate recipes by ID or title
          const deduplicatedData = combinedData.reduce((acc, recipe) => {
            if (!acc.some((existing) => existing._id === recipe._id)) {
              acc.push(recipe);
            }
            return acc;
          }, []);

          return deduplicatedData;
        });

        console.log(`${recipeData.length} recipes added`);
      } else {
        console.error("Failed to fetch recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching recipe data:", error.message);
    }
  };

  const handleDeleteRecipe = async (index) => {
    const recipeToDelete = recipeData[index]; // Get the recipe item to delete
    const recipeIdToDelete = recipeToDelete._id; // Assuming each recipe has a unique _id

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
        `https://lemickey-hi.onrender.com/recipe/${recipeIdToDelete}`,
        {
          headers: {
            "x-user-id": userId, // Pass user ID in header
          },
        }
      );

      if (response.status === 200) {
        console.log("Recipe deleted successfully!");

        // Update state to reflect the deletion
        setRecipeData((prevData) => {
          const updatedRecipes = prevData.filter((_, i) => i !== index); // Remove the recipe item from the array
          return updatedRecipes;
        });
      } else {
        console.error("Failed to delete recipe:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setRecipes(response.data.meals || []); // If no results, response.data.meals may be null
    } catch (error) {
      setError("Failed to fetch recipe data.");
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveRecipe = (recipeData) => {
    console.log("Saved recipe:", recipeData);
    // Call API or save to state
  };

  return (
    <div>
      <h2>Recipe Lookup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter recipe (e.g., chicken curry)"
        />
        <button type="submit">Search Recipe</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recipes.length > 0 && (
        <div>
          <h3>Recipe Results</h3>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.idMeal}>
                <h4>{recipe.strMeal}</h4>
                <p>
                  <strong>Category:</strong> {recipe.strCategory}
                </p>
                <p>
                  <strong>Cuisine:</strong> {recipe.strArea}
                </p>
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  width="200"
                />
                <p>
                  <strong>Instructions:</strong> {recipe.strInstructions}
                </p>
                <h5>Ingredients:</h5>
                <ul>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const ingredient = recipe[`strIngredient${i + 1}`];
                    const measure = recipe[`strMeasure${i + 1}`];
                    return (
                      ingredient && (
                        <li key={i}>
                          {ingredient} - {measure}
                        </li>
                      )
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>OR</h2>
      <div className="recipe-section">
        <h3>Saved Recipes</h3>
        <table className="recipe-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Cuisine</th>
              <th>Details</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recipeData.map((recipe, index) => (
              <tr key={index}>
                <td>{recipe.name}</td>
                <td>{recipe.category}</td>
                <td>{recipe.cuisine}</td>
                {/* <td>
                  <button onClick={() => handleRecipeDetails(recipe)}>
                    <RecipeViewModal recipe={recipe._id} />
                    click
                  </button>
                </td> */}
                <td>
                  <button onClick={() => handleRecipeDetails(recipe._id)}>
                    {/* {selectedRecipeId && (
                      <RecipeViewModal recipeId={selectedRecipeId} />
                    )} */}
                    {<RecipeViewModal recipeId={selectedRecipeId} />}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteRecipe(index)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* {selectedRecipeId && <RecipeViewModal recipeId={selectedRecipeId} />} */}
        </table>
        <button onClick={handleAddRecipe}>
          <RecipeModal />
        </button>
      </div>

      {/* <div>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create New Recipe
        </Button>

        <RecipeCreateDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveRecipe}
        />
      </div> */}
    </div>
  );
};

export default RecipeLookup;
