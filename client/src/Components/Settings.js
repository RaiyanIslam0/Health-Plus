import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Settings = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    birthday: "",
    password: "",
    weight: "",
    height: "",
    goalWeight: "",
    activityLevel: "",
    poundsPerWeek: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [changePassword, setChangePassword] = useState(false); // State for changing password
  const toast = useToast();

  const activityLevels = [
    "sedentary",
    "lightlyActive",
    "moderatelyActive",
    "veryActive",
    "superActive",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://lemickey-hi.onrender.com/users/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
           setUser(response.data);
           console.log(
             "settings: " + JSON.stringify(user.activityLevel)
           );
        } else {
          console.error("Failed to fetch user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      } finally {
        setLoading(false);
      }
    };
        fetchUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("token");

    try {
      // Only include the password field if the user wants to change it
      const updatedUser = { ...user };
      if (!changePassword) {
        delete updatedUser.password; // Don't include password if not changing it
      }

      const response = await axios.put(
        "https://lemickey-hi.onrender.com/users/update",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Profile updated.",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setErrorMessage("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="lg" mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Update Your Profile
      </Text>

      <form onSubmit={handleSubmit}>
        {/* Profile Information */}
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Birthday</FormLabel>
            <Input
              type="date"
              value={user.birthday}
              onChange={(e) => setUser({ ...user, birthday: e.target.value })}
            />
          </FormControl>

          {/* Password Change Option */}
          <FormControl>
            <Checkbox
              isChecked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
            >
              Change Password
            </Checkbox>
          </FormControl>

          {/* Password Field (Only shows if user wants to change password) */}
          {changePassword && (
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Enter a new password"
              />
            </FormControl>
          )}
        </Stack>

        {/* Physical Information */}
        <Stack spacing={4} mt={6}>
          <FormControl isRequired>
            <FormLabel>Weight (lbs)</FormLabel>
            <Input
              type="number"
              value={user.weight}
              onChange={(e) => setUser({ ...user, weight: e.target.value })}
              placeholder="Enter your weight"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Height (cm)</FormLabel>
            <Input
              type="number"
              value={user.height}
              onChange={(e) => setUser({ ...user, height: e.target.value })}
              placeholder="Enter your height"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Goal Weight (lbs)</FormLabel>
            <Input
              type="number"
              value={user.goalWeight}
              onChange={(e) => setUser({ ...user, goalWeight: e.target.value })}
              placeholder="Enter your goal weight"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Activity Level</FormLabel>
            <Select
              value={user.activityLevel}
              onChange={(e) =>
                setUser({ ...user, activityLevel: e.target.value })
              }
            >
              {activityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Weight Change per Week (lbs)</FormLabel>
            <Input
              type="number"
              value={user.poundsPerWeek}
              onChange={(e) =>
                setUser({ ...user, poundsPerWeek: e.target.value })
              }
              placeholder="Enter how many pounds per week you want to lose/gain"
            />
          </FormControl>
        </Stack>

        {/* Submit Button */}
        <Button
          colorScheme="blue"
          width="full"
          mt={6}
          isLoading={loading}
          type="submit"
          isDisabled={loading}
        >
          Save Changes
        </Button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
