import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, CardBody, Text, Flex, Box } from "@chakra-ui/react";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const CaloriesChart = () => {
  const [data, setData] = useState({
    goal: 1800, // Default goal, will be updated after fetching
    food: 0, // Default food calories
  });

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

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      try {
        const userId = getUserIdFromToken(token);
        console.log("User ID:", userId);

        const response = await axios.get(
          "http://localhost:8083/users/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const { dailyCalories } = response.data;
          console.log("User Details:", response.data);

          // Set user goal, but keep food data intact
          setData((prevData) => ({
            ...prevData,
            goal: dailyCalories || 1800,
          }));
        } else {
          console.error("Failed to fetch user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []); // Runs once when the component mounts to fetch user details

  useEffect(() => {
    // Fetch nutrition data
    const fetchNutritionData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      try {
        const userId = getUserIdFromToken(token);

        // Get today's date in the required format
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const nutritionResponse = await axios.get(
          `http://localhost:8083/nutritionMine/date/check/now`,
          {
            headers: {
              "x-user-id": userId,
            },
            params: { date: formattedDate },
          }
        );

        const nutritionData = nutritionResponse.data;
        console.log("calorie " + nutritionResponse.data);

        // Sum up all food calories
        const totalFoodCalories = nutritionData.reduce(
          (total, item) => total + item.nf_calories,
          0
        );

        // Update only the food calories, keeping the goal intact
        setData((prevData) => ({
          ...prevData,
          food: parseFloat(totalFoodCalories.toFixed(2)),
        }));
      } catch (error) {
        console.error("Error fetching nutrition data:", error.message);
      }
    };

    fetchNutritionData();
  }, []); // Runs once when the component mounts to fetch nutrition data

  const remaining = data.goal - data.food;

  // Chart data for food and remaining calories
  const chartData = {
    labels: ["Food", "Remaining"],
    datasets: [
      {
        data: [data.food, remaining],
        backgroundColor: ["#FF6384", "#FFCD56"],
        hoverBackgroundColor: ["#FF6384", "#FFCD56"],
        borderWidth: 0, // Remove border between slices
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: "70%", // Creates the donut effect
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw} kcal`,
        },
      },
      legend: {
        position: "top",
        display: false, // Hide the legend
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
          Calories
        </Text>
        <Text fontSize="md" color="gray.600" mb={4} textAlign="left">
          Remaining = Goal - Food
        </Text>

        <Flex direction="row" justify="space-between" align="center">
          <Box
            width="32%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            {/* Donut Chart with remaining calories inside */}
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
              {remaining.toFixed(2)}
            </Box>
          </Box>

          <Box width="40%" pl={6}>
            {/* Goal and Food display */}
            <Flex direction="column" mb={4}>
              <Text fontSize="lg" color="gray.700">
                Goal: {data.goal}
              </Text>
              <Text fontSize="lg" color="gray.700">
                Food: {data.food.toFixed(2)}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CaloriesChart;
