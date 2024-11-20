import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Input,
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
} from "@chakra-ui/react";

const FoodTrackerModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [portion, setPortion] = useState(1);
  const [mealType, setMealType] = useState("breakfast");
  const [userId, setUserId] = useState("");

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
      return decoded.userID;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const handleAddToDailyNutrition = async (food) => {
    const token = localStorage.getItem("token");
    console.log("token "+token);
    if (token) {
      setUserId(getUserIdFromToken(token));
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

      await axios.post("http://localhost:8083/nutritionMine", foodData, {
        headers: {
          "x-user-id": userId,
        },
      });

      alert(`${food.food_name} added to ${mealType}!`);
    } catch (error) {
      alert("Failed to add food to daily nutrition.");
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" float="left">
        Add Food
      </Button>

      {/* <Button
        colorScheme="teal"
        onClick={onOpen}
        float="left"
        // onClick={onFoodModalOpen}
        // leftIcon={<FaListAlt />}
        width="48%"
        variant="solid"
        _hover={{ bg: "orange.500", color: "white" }}
      >
        Add Food
      </Button> */}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Food</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input
                mb={3}
                placeholder="Enter food (e.g., 2 eggs, banana)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" colorScheme="blue" w="full" mb={4}>
                Get Nutrition Info
              </Button>
            </form>

            {error && <Text color="red.500">{error}</Text>}

            {results.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Nutrition Information
                </Text>
                {results.map((food, index) => (
                  <Box
                    key={index}
                    mb={4}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                  >
                    <Text fontWeight="bold">{food.food_name}</Text>
                    <Text>
                      {food.serving_qty} {food.serving_unit} (
                      {food.serving_weight_grams}g)
                    </Text>
                    <Text>Calories: {food.nf_calories}</Text>
                    <Text>Carbohydrates: {food.nf_total_carbohydrate}g</Text>
                    <Text>Protein: {food.nf_protein}g</Text>
                    <Text>Fat: {food.nf_total_fat}g</Text>
                    <Input
                      mt={2}
                      type="number"
                      placeholder="Portion Size"
                      value={portion}
                      onChange={(e) => setPortion(Number(e.target.value))}
                      min="1"
                    />
                    <Select
                      mt={2}
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </Select>
                    <Button
                      mt={3}
                      colorScheme="green"
                      onClick={() => handleAddToDailyNutrition(food)}
                    >
                      Add to {mealType}
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
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

export default FoodTrackerModal;
