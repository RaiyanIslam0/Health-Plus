import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  Divider,
  Spinner,
  Icon,
  Stack,
  Tooltip,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import DashFoodTrackerModal from "./DashFoodTrackerModal";
import ExerciseTrackerModal from "./ExerciseTrackerModal";
import { FaUtensils, FaDumbbell } from "react-icons/fa"; // Importing icons

// Mock function to simulate token decoding
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

// Determine the current meal type based on time of day
const getCurrentMealType = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 11) return "breakfast";
  if (currentHour < 16) return "lunch";
  return "dinner";
};

const FoodExerciseCard = () => {
  const navigate = useNavigate(); 
  const [foodData, setFoodData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [exerciseList, setExerciseList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFoodData = useCallback(async (mealType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      setIsLoading(true);
      const userId = getUserIdFromToken(token);
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const response = await axios.get(
        `http://localhost:8083/nutritionMine/mealDate/${mealType}?date=${formattedDate}`,
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        setFoodData((prev) => ({
          ...prev,
          [mealType]: response.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${mealType} data:`, error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExerciseData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      setIsLoading(true);
      const userId = getUserIdFromToken(token);
      const today = new Date().toLocaleDateString("en-CA");

      const response = await axios.get(
        `http://localhost:8083/exerciseMine/date?date=${today}`,
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        setExerciseList(response.data);
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoodData("breakfast");
    fetchFoodData("lunch");
    fetchFoodData("dinner");
    fetchExerciseData();
  }, [fetchFoodData, fetchExerciseData]);

  // Get the current meal type based on time
  const currentMealType = getCurrentMealType();

  // const cardWidth = useBreakpointValue({ base: "100%", md: "45%" });

  const handleNavigateToDiary = () => {
    navigate("/diary"); // Navigate to the /diary route
  };

  return (
    <Box
      p={6}
      bg="gray.50"
      borderRadius="md"
      boxShadow="lg"
      width="88vh"
      maxW="1200px"
      mx="auto"
    >
      {isLoading && (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="teal.400" />
          <Text ml={4} fontSize="lg" color="teal.500">
            Loading data...
          </Text>
        </Flex>
      )}

      <Stack direction={{ base: "column", md: "row" }} spacing={6}>
        {/* Food Section */}
        <Box
          flex="1"
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="xl"
          minHeight="300px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Heading size="lg" color="teal.600" mb={4}>
            <Icon as={FaUtensils} mr={2} />
            Meals for{" "}
            {currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)}
          </Heading>
          {foodData[currentMealType]?.length > 0 ? (
            <VStack align="flex-start" spacing={4}>
              {foodData[currentMealType].map((food) => (
                <Flex key={food._id} align="center" gap={2}>
                  <Text fontSize="md" color="gray.700">
                    🍽️ {food.food_name} - {food.nf_calories} kcal
                  </Text>
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text fontSize="md" color="gray.500">
              No {currentMealType} logged yet.
            </Text>
          )}
          <Divider my={4} />
          <Button
            variant="outline"
            colorScheme="teal"
            size="sm"
            onClick={handleNavigateToDiary}
          >
            Add Meal
          </Button>
        </Box>

        {/* Exercise Section */}
        <Box
          flex="1"
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="xl"
          minHeight="300px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Heading size="lg" color="teal.600" mb={4}>
            <Icon as={FaDumbbell} mr={2} />
            Exercises
          </Heading>
          {exerciseList.length > 0 ? (
            <VStack align="flex-start" spacing={4}>
              {exerciseList.map((exercise) => (
                <Flex key={exercise._id} align="center" gap={2}>
                  <Text fontSize="md" color="gray.700">
                    🏋️ {exercise.name} - {exercise.calories} kcal burned
                  </Text>
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text fontSize="md" color="gray.500">
              No exercises logged yet.
            </Text>
          )}
          <Divider my={4} />
          <Button
            variant="outline"
            colorScheme="teal"
            size="sm"
            onClick={handleNavigateToDiary}
          >
            Add Exercise
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FoodExerciseCard;
