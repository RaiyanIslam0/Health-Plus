import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "../Pages/SignUpPage";
import DairyPage from "../Pages/DairyPage";
import DashboardPage from "../Pages/DashboardPage";
import DashPage from "../Pages/DashPage";
import FoodsPage from "../Pages/FoodsPage";
import ExercisePage from "../Pages/ExercisePage";
import RecipePage from "../Pages/RecipePage";
import LoginPage from "../Pages/LoginPage";
import SettingPage from "../Pages/SettingPage";
import HomePage from "../Pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../Pages/NotFound";

import AccountSettings from "../Pages/SettingPage";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DairyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/foods"
        element={
          <ProtectedRoute>
            <FoodsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <RecipePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary"
        element={
          <ProtectedRoute>
            <DashPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <SettingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
