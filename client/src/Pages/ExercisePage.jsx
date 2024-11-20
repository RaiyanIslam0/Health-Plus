import React from "react";
import DashboardPage from "./DashboardPage";
import Exercise from "./../Components/Exercise";
import ExerciseButtons from "./../Components/ExerciseButtons";

const ExercisePage = () => {
  return (
    <DashboardPage>
      <Exercise />
      <ExerciseButtons />
    </DashboardPage>
  );
};

export default ExercisePage;
