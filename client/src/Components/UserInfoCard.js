import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Text,
  Stack,
  Flex,
  Divider,
  Badge,
} from "@chakra-ui/react";
import dayjs from "dayjs";

const UserInfoCard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8083/users/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error("Failed to fetch user details:", response.statusText);
          setError("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <Card
        pl="4"
        pr="4"
        pb="3"
        borderRadius={"8px"}
        boxShadow="rgba(0, 0, 0, 0.12) 0px 4px 12px"
        width={"100%"}
        bg="white"
      >
        <CardBody>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Loading user details...
          </Text>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        pl="4"
        pr="4"
        pb="3"
        borderRadius={"8px"}
        boxShadow="rgba(0, 0, 0, 0.12) 0px 4px 12px"
        width={"100%"}
        bg="white"
      >
        <CardBody>
          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            color="red.500"
          >
            {error}
          </Text>
        </CardBody>
      </Card>
    );
  }

  const calculateAge = (birthday) => {
    const birthDate = dayjs(birthday);
    return dayjs().diff(birthDate, "year");
  };

  const {
    name,
    height,
    weight,
    goalWeight,
    dailyCalories,
    activityLevel,
    poundsPerWeek,
    birthday,
    gender,
    macros: { protein, carbs, fat } = {},
  } = userData || {};

  const age = calculateAge(birthday);

  return (
    <Card
      pl="4"
      pr="4"
      pb="3"
      borderRadius={"8px"}
      boxShadow="rgba(0, 0, 0, 0.12) 0px 4px 12px"
      width={"100%"}
      bg="white"
      height="50vh"
    >
      <CardBody>
        {/* Name and Badge */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {name}
          </Text>
          <Badge colorScheme="blue" fontSize="md">
            {activityLevel}
          </Badge>
        </Flex>

        {/* Divider */}
        <Divider mb={4} />

        {/* User Info */}
        <Stack spacing={3}>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Age:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {age} years
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Height:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {height} cm
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Gender:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {gender.toUpperCase()}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Current Weight:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {weight} lbs
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Goal Weight:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {goalWeight} lbs
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Target Loss/Week:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {poundsPerWeek} lbs
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Daily Calorie Target:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {dailyCalories} kcal
            </Text>
          </Flex>
        </Stack>

        {/* Macronutrient Goals */}
        <Text fontSize="lg" fontWeight="bold" mt={6} mb={2}>
          Macronutrient Goals
        </Text>
        <Stack spacing={2}>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Protein:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {protein || 0} g
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Carbs:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {carbs || 0} g
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.600">
              Fat:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {fat || 0} g
            </Text>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default UserInfoCard;
