import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

const GreetingCard = () => {
  const [note, setNote] = useState(""); // For storing the note entered by the user
  const { isOpen, onOpen, onClose } = useDisclosure(); // For modal control

  const userName = useSelector((state) => state.authreducer.name); // Assuming user's name is in the Redux store (or pass as props)

  // Get the current hour
  const currentHour = new Date().getHours();

  // Determine time of day and greeting
  let greeting = "";
  let food= "";
  if (currentHour < 12) {
    greeting = "Good Morning";
    food = "Breakfast";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
    food= "Lunch";
  } else {
    greeting = "Good Evening";
    food = "Dinner";
  }

  // Handle note submission
  const handleNoteSubmit = () => {
    console.log("Daily note submitted: ", note);
    // Perform any action here, such as saving the note to a database or Redux store
    onClose(); // Close the modal after submitting
  };

  return (
    <Card maxW="lg" borderRadius="lg" boxShadow="md" bg="white">
      <CardBody>
        <Text fontSize="xl" fontWeight="bold">
          {greeting}, {userName}!
        </Text>
        <Text fontSize="md" color="gray.600" my={2}>
          Reminder to add {food}.
        </Text>

        {/* Button to open modal for daily note */}
        <Button onClick={onOpen} colorScheme="blue" size="sm">
          Add Daily Note
        </Button>

        {/* Modal for adding daily note */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Your Daily Note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Write your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                size="sm"
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleNoteSubmit}>
                Save Note
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default GreetingCard;
