import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Textarea,
  Select,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { jwtDecode } from "jwt-decode";

const RecipeViewModal = ({ recipeId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Appetizer");
  const [cuisine, setCuisine] = useState("American");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch recipe data for editing when modal is opened
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserId(getUserIdFromToken(token));
    } else {
      console.log("No token found. User might not be logged in.");
    }

    if (recipeId) {
      axios
        .get(`https://lemickey-hi.onrender.com/recipe/${recipeId}`, {
          headers: {
            "x-user-id": userId,
          },
        })
        .then((response) => {
          const recipe = response.data;
          setName(recipe.name);
          setCategory(recipe.category);
          setCuisine(recipe.cuisine);
          setInstructions(recipe.instructions);
          setIngredients(recipe.ingredients || [{ name: "", quantity: "" }]);
        })
        .catch((error) => {
          console.error("Error fetching recipe data:", error);
          setError("Failed to load recipe details.");
        });
    }
  }, [recipeId]);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (token) {
      setUserId(getUserIdFromToken(token));
    } else {
      console.log("No token found. User might not be logged in.");
    }

    // Validation
    if (
      !name ||
      !category ||
      !cuisine ||
      !instructions ||
      ingredients.some((ing) => !ing.name || !ing.quantity)
    ) {
      setError("All fields are required, including all ingredients.");
      return;
    }

    try {
      const response = await axios.put(
        `https://lemickey-hi.onrender.com/recipe/${recipeId}`,
        {
          name,
          category,
          cuisine,
          instructions,
          ingredients,
        },
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      console.log(name);

      alert(`Recipe "${response.data.name}" updated successfully!`);
      // Reset form or close modal
      onClose();
    } catch (error) {
      console.error(error);
      setError("Failed to update recipe. Please try again.");
    }
  };

  return (
    <>
      {/* <Button onClick={onOpen} colorScheme="teal">
        {recipeId ? "Edit Recipe" : "View Recipe"}
      </Button> */}
      <Link onClick={onOpen} color="teal.500">
        View Recipe
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>{recipeId ? "Edit Recipe" : "View Recipe"}</ModalHeader> */}
          <ModalHeader>View Recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* {error && (
              <Text color="red.500" mb={4}>
                {error}
              </Text>
            )} */}
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <Input
                placeholder="Recipe Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isReadOnly={!recipeId} // Prevent editing if not editing
              />
              <Select
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                isReadOnly={!recipeId}
              >
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
              </Select>
              <Select
                placeholder="Cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                isReadOnly={!recipeId}
              >
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
              </Select>
              <Textarea
                placeholder="Instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                isReadOnly={!recipeId}
              />
              <Box w="full">
                <Text fontWeight="bold" mb={2}>
                  Ingredients
                </Text>
                {ingredients.map((ingredient, index) => (
                  <HStack key={index} mb={2}>
                    <Input
                      placeholder="Ingredient Name"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(index, "name", e.target.value)
                      }
                      isReadOnly={!recipeId}
                    />
                    <Input
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      isReadOnly={!recipeId}
                    />
                    {recipeId && (
                      <IconButton
                        icon={<CloseIcon />}
                        colorScheme="red"
                        onClick={() => handleRemoveIngredient(index)}
                      />
                    )}
                  </HStack>
                ))}
                {recipeId && (
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={handleAddIngredient}
                    size="sm"
                  >
                    Add Ingredient
                  </Button>
                )}
              </Box>
              {recipeId && (
                <Button type="submit" colorScheme="green" w="full">
                  Update Recipe
                </Button>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="red">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipeViewModal;
