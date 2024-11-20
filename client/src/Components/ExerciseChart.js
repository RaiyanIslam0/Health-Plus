import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, CardBody, Text, Flex, Box } from "@chakra-ui/react";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define activity factors (calories burned per activity level)
const activityFactors = {
  sedentary: 200,
  lightlyActive: 300,
  moderatelyActive: 400,
  veryActive: 500,
  superActive: 600,
};

const ExerciseChart = () => {
  const [exerciseData, setExerciseData] = useState({
    caloriesBurned: 0,
    targetCalories: 200, // Default target if activity level is unavailable
  });
  const [userId, setUserId] = useState(null);
  const [activityLevel, setActivityLevel] = useState("sedentary"); // Default activity level

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

  // Fetch user details and set activity level
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const userId = getUserIdFromToken(token);
      setUserId(userId);

      try {
        const response = await axios.get(
          "https://lemickey-hi.onrender.com/users/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const activityCalories = response.data;
        setActivityLevel(activityCalories.activityLevel);

        // Set target calories based on activity level
        setExerciseData((prev) => ({
          ...prev,
          targetCalories: activityFactors[activityCalories.activityLevel],
        }));
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch exercise data based on user ID and current date
  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!userId) return;

      const today = new Date().toLocaleDateString("en-CA");
      try {
        const response = await axios.get(
          "https://lemickey-hi.onrender.com/exerciseMine/date",
          {
            headers: { "x-user-id": userId },
            params: { date: today },
          }
        );

        const exerciseData = response.data;

        // Calculate total calories burned from exercise data
        const totalCaloriesBurned = exerciseData.reduce(
          (total, item) => total + item.calories,
          0
        );

        setExerciseData((prev) => ({
          ...prev,
          caloriesBurned: parseFloat(totalCaloriesBurned.toFixed(2)),
        }));
      } catch (error) {
        console.error("Error fetching exercise data:", error.message);
      }
    };

    fetchExerciseData();
  }, [userId]);

  const { caloriesBurned, targetCalories } = exerciseData;

  const chartData = {
    labels: ["Burned", "Remaining"],
    datasets: [
      {
        data: [caloriesBurned, Math.max(0, targetCalories - caloriesBurned)],
        backgroundColor: ["#36A2EB", "#FFCD56"],
        hoverBackgroundColor: ["#36A2EB", "#FFCD56"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw} kcal`,
        },
      },
      legend: {
        position: "top",
        display: false,
      },
    },
  };

  return (
    <Card
      pl="4"
      pr="4"
      pb="3"
      borderRadius={"4"}
      minH={"30vh"}
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      width={"100%"}
      h="auto"
      bg="white"
    >
      <CardBody>
        <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="left">
          Exercise Calories
        </Text>
        <Text fontSize="md" color="gray.500" mb={4} textAlign="left">
          Based on Activity Level: {activityLevel}
        </Text>

        <Flex direction="row" justify="space-between" align="center">
          <Box
            width="32%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Doughnut
              data={chartData}
              options={chartOptions}
              height={300}
              width={300}
            />
            <Box
              position="absolute"
              fontSize="xl"
              fontWeight="bold"
              color="#333"
              zIndex="10"
            >
              {(targetCalories - caloriesBurned).toFixed(2)}
            </Box>
          </Box>

          <Box width="40%" pl={6}>
            <Flex direction="column" mb={4}>
              <Text fontSize="lg" color="gray.700">
                Target Calories: {targetCalories}
              </Text>
              <Text fontSize="lg" color="gray.700">
                Calories Burned: {caloriesBurned.toFixed(2)}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ExerciseChart;
