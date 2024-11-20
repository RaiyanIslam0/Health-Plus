// import React from "react";
// import { Box } from "@chakra-ui/react";
// import NavbarSignUp from "../Components/LoginPage_Components/NavbarSignUp";

// const HomePage = () => {
//   return (
//     <div>
//       <NavbarSignUp></NavbarSignUp>
//       <Box>
//         <h1>Welcome</h1>
//       </Box>
//     </div>
//   );
// };

// export default HomePage;


import React from "react";
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FaChartLine, FaUtensils, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarSignUp from "../Components/LoginPage_Components/NavbarSignUp";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login"); // Navigate to the /diary route
  };
  return (
    <div>
      <NavbarSignUp />
      <Box
        bgGradient="linear(to-r, #fffcf6, #f7f7f7)"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        px={4}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, teal.400, blue.500)"
            bgClip="text"
          >
            Welcome to LeMickey
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            color="gray.600"
            maxW="600px"
          >
            Empowering your journey with cutting-edge tools for tracking,
            planning, and optimizing your lifestyle. Whether you're looking to
            manage your fitness goals, diet plans, or daily activities, we've
            got you covered.
          </Text>
          <Button
            size="lg"
            colorScheme="teal"
            variant="solid"
            onClick={handleNavigateToLogin}
          >
            Get Started
          </Button>
        </VStack>
        <Stack mt={12} direction={{ base: "column", md: "row" }} spacing={8}>
          <FeatureCard
            title="Track Your Goals"
            description="Monitor your progress with our intuitive dashboards."
            icon={FaChartLine}
          />
          <FeatureCard
            title="Discover Recipes"
            description="Find the perfect recipes tailored to your dietary needs."
            icon={FaUtensils}
          />
          <FeatureCard
            title="Personalized Plans"
            description="Get customized plans to meet your fitness and health targets."
            icon={FaClipboardList}
          />
        </Stack>
      </Box>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <Box
      p={6}
      bg="white"
      boxShadow="lg"
      borderRadius="lg"
      textAlign="center"
      _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
    >
      <Icon as={icon} boxSize={12} color="teal.500" mb={4} />
      <Heading fontSize="xl" color="teal.500">
        {title}
      </Heading>
      <Text mt={2} fontSize="md" color="gray.600">
        {description}
      </Text>
    </Box>
  );
};


export default HomePage;
