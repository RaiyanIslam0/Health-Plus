import React from "react";
import DashboardPage from "./DashboardPage";
import SearchFood from "./../Components/SearchFood";
import RecipeLookup from "./../Components/RecipeLookup";

const FoodsPage = () => {
  return (
    <DashboardPage>
      <RecipeLookup />
    </DashboardPage>
  );
};

export default FoodsPage;
