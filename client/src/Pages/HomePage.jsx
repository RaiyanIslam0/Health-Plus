import React from "react";
import { Box } from "@chakra-ui/react";
import NavbarSignUp from "../Components/LoginPage_Components/NavbarSignUp";

const HomePage = () => {
  return (
    <div>
      <NavbarSignUp></NavbarSignUp>
      <Box>
        <h1>Welcome</h1>
      </Box>
    </div>
  );
};

export default HomePage;
