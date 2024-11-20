import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import Bar1 from "./bar1";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MacronutrientChart = () => {
  const [userGoals, setUserGoals] = useState({
    goalCalories: 2135,
    goalProtein: 133,
    goalCarbs: 240,
    goalFat: 71,
  });

  const [nutritionData, setNutritionData] = useState({
    totalConsumed: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  });

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

  useEffect(() => {
    const fetchUserGoals = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const userId = getUserIdFromToken(token);
        console.log("User ID:", userId);

        const userResponse = await axios.get(
          "http://localhost:8083/users/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } =
          userResponse.data;

        setUserGoals({
          goalCalories: dailyCalories || 2135,
          goalProtein: dailyProtein || 133,
          goalCarbs: dailyCarbs || 240,
          goalFat: dailyFat || 71,
        });
      } catch (error) {
        console.error("Error fetching user goals:", error.message);
      }
    };

    fetchUserGoals();
  }, []);

  useEffect(() => {
    const fetchNutritionData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const userId = getUserIdFromToken(token);
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


        const totalNutrition = nutritionResponse.data.reduce(
          (totals, item) => ({
            calories: totals.calories + item.nf_calories,
            protein: totals.protein + item.nf_protein,
            carbs: totals.carbs + item.nf_total_carbohydrate,
            fat: totals.fat + item.nf_total_fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        setNutritionData({
          totalConsumed: totalNutrition.calories,
          totalProtein: totalNutrition.protein,
          totalCarbs: totalNutrition.carbs,
          totalFat: totalNutrition.fat,
        });
      } catch (error) {
        console.error("Error fetching nutrition data:", error.message);
      }
    };

    fetchNutritionData();
  }, []);

  return (
    <Box
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
      <Text fontSize="24px" fontWeight="bold" color="gray.700">
        Macronutrient Targets
      </Text>
      <Flex marginTop="20px" direction="row" justify="space-between">
        <Stack spacing={5} align="start">
          <Text fontSize="18px" fontWeight="medium" color="gray.500">
            Energy
          </Text>
          <Text fontSize="18px" fontWeight="medium" color="gray.500">
            Protein
          </Text>
          <Text fontSize="18px" fontWeight="medium" color="gray.500">
            Carbs
          </Text>
          <Text fontSize="18px" fontWeight="medium" color="gray.500">
            Fat
          </Text>
        </Stack>
        <Stack spacing={8} w="80%" marginLeft="24px">
          <Bar1
            barval={Math.floor(
              (nutritionData.totalConsumed / userGoals.goalCalories) * 100
            )}
            barpercent={`${nutritionData.totalConsumed.toFixed(2)} kcal / ${
              userGoals.goalCalories
            } kcal`}
            clr="gray"
            spl={0}
          />
          <Bar1
            barval={Math.floor(
              (nutritionData.totalProtein / userGoals.goalProtein) * 100
            )}
            barpercent={`${nutritionData.totalProtein.toFixed(2)} g / ${
              userGoals.goalProtein
            } g`}
            clr="green"
            spl={0}
          />
          <Bar1
            barval={Math.floor(
              (nutritionData.totalCarbs / userGoals.goalCarbs) * 100
            )}
            barpercent={`${nutritionData.totalCarbs.toFixed(2)} g / ${
              userGoals.goalCarbs
            } g`}
            clr="blue"
            spl={0}
          />
          <Bar1
            barval={Math.floor(
              (nutritionData.totalFat / userGoals.goalFat) * 100
            )}
            barpercent={`${nutritionData.totalFat.toFixed(2)} g / ${
              userGoals.goalFat
            } g`}
            clr="red"
            spl={0}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

export default MacronutrientChart;
