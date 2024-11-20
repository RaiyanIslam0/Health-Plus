import React, { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import CalendarBox from "../Components/Calendar";
import { Box, Grid, useToast } from "@chakra-ui/react";
import CaloriesChart from "../Components/CaloriesChart";
import ExerciseChart from "../Components/ExerciseChart";
import MacronutrientChart from "../Components/MacronutrientChart";
import UserInfoCard from "../Components/UserInfoCard";
import FoodExerciseCard from "../Components/FoodExerciseCard";
import NoteCard from "../Components/NoteCard";

const DairyPage = () => {
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const toast = useToast();

  const totalcunsumed = 500; 
  const totalprotein = 30; 
  const totalcarbs = 40; 
  const totalfat = 20; 

  // Show reminder based on the time of day
  useEffect(() => {
    const showReminder = () => {
      const currentHour = new Date().getHours();
      let reminderMessage = "";

      if (currentHour < 12) {
        reminderMessage = "Good Morning! Don't forget to log your breakfast.";
      } else if (currentHour < 18) {
        reminderMessage = "Good Afternoon! Have you logged your lunch?";
      } else {
        reminderMessage = "Good Evening! Don't forget to log your dinner.";
      }

      // Show the toast at the top of the page
      toast({
        title: "Meal Log Reminder",
        description: reminderMessage,
        status: "info",
        duration: 5000, // How long the toast stays
        isClosable: true,
        position: "top", // Position the toast at the top
      });
    };

    showReminder(); // Show reminder when the component mounts
  }, [toast]);

  return (
    <DashboardPage>
      <Grid
        templateColumns="repeat(3, 1fr)" // Adjust based on how many items you want per row
        gap={4}
        mb={4}
      >
        <UserInfoCard />
        <NoteCard />
        <CalendarBox />
      </Grid>

      {/* Second Grid: CaloriesChart and MacronutrientChart */}
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr", lg: "2fr 3fr" }}
        gap={4}
        mb={4}
        height="auto"
        minHeight="300px"
      >
        <CaloriesChart />
        <MacronutrientChart
          totalcunsumed={totalcunsumed}
          totalprotein={totalprotein}
          totalcarbs={totalcarbs}
          totalfat={totalfat}
        />
      </Grid>

      {/* Third Grid: ExerciseChart and MacronutrientChart */}
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr", lg: "2fr 3fr" }}
        gap={4}
        mb={4}
        height="auto"
        minHeight="300px"
      >
        <ExerciseChart activityLevel={activityLevel} />
        <FoodExerciseCard />
      </Grid>
    </DashboardPage>
  );
};

export default DairyPage;
