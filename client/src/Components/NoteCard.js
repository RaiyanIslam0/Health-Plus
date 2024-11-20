import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Text,
  Textarea,
  Stack,
  Flex,
  Button,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import DashFoodTrackerModal from "./DashFoodTrackerModal";
import ExerciseTrackerModal from "./ExerciseTrackerModal";
import { jwtDecode } from "jwt-decode";

const NoteCard = () => {
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

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

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const date = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");
      try {
        const userId = getUserIdFromToken(token);
        const response = await axios.get(
          `https://lemickey-hi.onrender.com/noteMine/${date}`,
          {
            headers: {
              "x-user-id": userId,
            },
          }
        );
        if (response.status === 200) {
          setNote(response.data.note || ""); // Handle missing note gracefully
        } else {
          setNote(""); // No note found, let the user create one
        }
      } catch (err) {
        setError("Error fetching the note. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [date]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");
    try {
      const userId = getUserIdFromToken(token);
      const response = await axios.post(
        "https://lemickey-hi.onrender.com/noteMine",
        {
          date,
          note,
        },
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Note saved.",
          description: "Your note has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
      }
    } catch (err) {
      toast({
        title: "Error saving note.",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Card borderRadius="lg" boxShadow="md" bg="white" width="100%" p={4}>
        <CardBody>
          <Flex justifyContent="center" alignItems="center">
            <Spinner size="lg" />
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      width="100%"
      p={4}
      height="50vh"
    >
      <Flex justify="space-between" align="stretch" mt={6} width="100%">
        {/* FoodTrackerModal */}
        <DashFoodTrackerModal />

        {/* ExerciseTrackerModal */}
        <ExerciseTrackerModal width="48%" />
      </Flex>

      <CardBody mt={4}>
        {" "}
        {/* Added margin-top here */}
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            Notes for {formattedDate}
          </Text>
          <Button
            size="sm"
            colorScheme={isEditing ? "red" : "blue"}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </Flex>
        {/* Divider */}
        <Divider mb={4} />
        {/* Note Content */}
        <Stack spacing={4}>
          {isEditing ? (
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note here..."
              size="md"
              borderColor="gray.300"
              textAlign="left"
              borderRadius="md"
              padding="10px"
              boxShadow="sm"
              backgroundColor="#f9fafb" // Light background color for the note box
              minHeight="200px" // Ensure it always takes up a minimum height
              height="100%" // Make it take up remaining height
              resize="none" // Prevent resizing
            />
          ) : (
            <Text
              fontSize="md"
              color="gray.700"
              textAlign="left"
              border="1px solid #ccc" // Border to define the box
              borderRadius="md" // Rounded corners
              padding="10px" // Padding inside the note box
              backgroundColor="#f9fafb" // Light background color for the note box
              minHeight="240px" // Ensure it always takes up a minimum height
              height="100%" // Make it take up remaining height
              display="block" // Align the text from the top
              overflow="auto" // Allow scrolling if content overflows
            >
              {note ||
                "No note available for this date. Click 'Edit' to add one."}
            </Text>
          )}
        </Stack>
        {/* Save Button */}
        {isEditing && (
          <Flex justifyContent="flex-end" mt={4}>
            <Button colorScheme="green" onClick={handleSave}>
              Save
            </Button>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default NoteCard;
