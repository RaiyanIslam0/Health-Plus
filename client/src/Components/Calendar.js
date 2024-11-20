import React, { useState, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styling for React-Calendar
import { Box, Text, VStack } from "@chakra-ui/react";

const CalendarBox = () => {
  const [value, setValue] = useState(new Date()); // Default to today's date

  const onChange = useCallback((newDate) => {
    setValue(newDate);
    console.log("Selected date:", newDate);
  }, []);

  return (
    <Box
      p={6}
      boxShadow="lg"
      bg="white"
      borderRadius="12px"
      w="49vh"
      height="50vh"
      display="flex"
      flexDirection="column"
      justifyContent="center" // Centers vertically
      alignItems="center" // Centers horizontally
    >
      {/* Display Selected Date */}
      <VStack spacing={4} mb={6} textAlign="center">
        <Text fontSize="xl" color="gray.600" fontWeight="bold">
          {value.toDateString()}
        </Text>
      </VStack>

      {/* Calendar */}
      <Calendar
        value={value}
        onChange={onChange}
        className="custom-calendar" // Custom class for additional styling
        tileClassName={({ date, view }) => {
          if (
            value &&
            date.toDateString() === value.toDateString() &&
            view === "month"
          ) {
            return "selected-date"; // Add custom class for the selected date
          }
          return null;
        }}
      />
    </Box>
  );
};

export default CalendarBox;
