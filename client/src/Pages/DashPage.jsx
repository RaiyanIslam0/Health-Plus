import React from "react";
import DashboardPage from "./DashboardPage";
import SearchFood from "./../Components/SearchFood";
import FoodTracker from "./../Components/FoodTracker";
import FoodDiary from "./../Components/FoodDiary";

const DashPage = () => {
  return (
    <DashboardPage>
      <FoodDiary />
    </DashboardPage>
  );
};

export default DashPage;