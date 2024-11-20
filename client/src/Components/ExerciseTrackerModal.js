import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Input,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const ExerciseTrackerModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  // Get current date in YYYY-MM-DD format
  // const getCurrentDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  // };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      setUserId(getUserIdFromToken(token));
    } else {
      console.log("No token found. User might not be logged in.");
    }

    try {
      // Get exercise data from Nutritionix API
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/exercise",
        { query },
        {
          headers: {
            "x-app-id": process.env.REACT_APP_NUTRITIONIX_APP_ID,
            "x-app-key": process.env.REACT_APP_NUTRITIONIX_APP_KEY,
          },
        }
      );

      const today = new Date().toLocaleDateString("en-CA");

      setResults(
        response.data.exercises.map((exercise) => ({
          name: exercise.name,
          calories: exercise.nf_calories,
          duration: exercise.duration_min,
          date: today,
        }))
      );
    } catch (error) {
      setError("Failed to fetch exercise data.");
    }
  };

  const handleAddExercise = async () => {
    try {
      await axios.post(
        "https://lemickey-hi.onrender.com/exerciseMine",
        results,
        {
          headers: {
            "x-user-id": userId, // Replace with the actual user ID
          },
        }
      );
      alert("Exercise data successfully added to the database!");
      setResults([]); // Clear the results after successful addition
    } catch (error) {
      setError("Failed to add exercise data to the database.");
    }
  };

  return (
    <>
      {/* <Button onClick={onOpen} colorScheme="teal">
        Add Exercise
      </Button> */}

      <Button
        colorScheme="orange"
        onClick={onOpen}
        // leftIcon={<FaListAlt />}
        width="48%"
        variant="solid"
        _hover={{ bg: "orange.500", color: "white" }}
      >
        🏋️ Add Exercise
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Exercise</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input
                mb={3}
                placeholder="Enter exercise (e.g., ran 3 miles)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" colorScheme="blue" w="full" mb={4}>
                Search Exercise
              </Button>
            </form>

            {error && <Text color="red.500">{error}</Text>}

            {results.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Exercise Results
                </Text>
                {results.map((exercise, index) => (
                  <Box
                    key={index}
                    mb={4}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                  >
                    <Text fontWeight="bold">{exercise.name}</Text>
                    <Text>
                      Calories: {exercise.calories} kcal in {exercise.duration}{" "}
                      minutes
                    </Text>
                    <Button
                      mt={3}
                      colorScheme="green"
                      onClick={handleAddExercise}
                    >
                      Add to Daily Activity
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="red">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExerciseTrackerModal;
