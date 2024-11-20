import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarSignUp from "./../Components/LoginPage_Components/NavbarSignUp";
import "@fontsource/raleway";
import "@fontsource/work-sans";
import "@fontsource/manrope";

import { Checkbox } from "@chakra-ui/react";

//*  Signup Page begins here
let url = "https://lemickey-hi.onrender.com/";
const SignUpPage = () => {
  const InitialState = {
    name: "",
    email: "",
    gender: "",
    password: "",
    birthday: "",
    height: "",
    weight: "",
    goalWeight: "",
    activityLevel: "sedentary",
    poundsPerWeek: "",
    confirmpassword: "",
  };

  const [state, setState] = useState(InitialState);
  const navigate = useNavigate();
  const [signed, setSigned] = useState(false);
  // const [matchpassword, setMatchPassword] = useState(null)
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setState((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${url}users/register`, state).then((res) => {
      console.log(res);
      navigate("/login");
    });
    console.log(state);
    setState(InitialState);
  };
  const passwordsMatch = state.password === state.confirmpassword;

  console.log(passwordsMatch);
  return (
    <div style={{ backgroundColor: "#fffcf6" }}>
      <NavbarSignUp />
      <Box bgColor={"#fffcf6"}>
        <form onSubmit={handleSubmit} style={{ marginTop: "2%" }}>
          <Box
            backgroundImage={"DotPatternLarge.svg"}
            bgRepeat={"no-repeat"}
            bgSize="cover"
          >
            <Heading
              m="10"
              mt="0"
              fontFamily="Work Sans"
              fontWeight={"bold"}
              fontSize={"3xl"}
            >
              Create Your Free Account
            </Heading>

            <Flex
              margin={"auto"}
              p={"8"}
              maxWidth={"700px"}
              background={"white"}
              // border={"1px solid black"}
              borderRadius={"8"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            >
              <FormControl>
                <Box display="flex" flexDirection="column">
                  <Wrap mb="4">
                    <FormLabel width={"30%"}>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        fontFamily={"Manrope"}
                      >
                        Name
                      </Text>
                    </FormLabel>
                    <Input
                      onChange={(e) => handleChange(e)}
                      name="name"
                      value={state.name}
                      border="1px solid gray"
                      width={"60%"}
                      type="text"
                      placeholder="Enter Your Full Name"
                    />
                  </Wrap>

                  <Wrap mb="4">
                    <FormLabel width={"30%"}>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        fontFamily={"Manrope"}
                      >
                        Email
                      </Text>
                    </FormLabel>
                    <Input
                      onChange={(e) => handleChange(e)}
                      name="email"
                      value={state.email}
                      border="1px solid gray"
                      width={"60%"}
                      type="email"
                      placeholder="Enter Your Email Address"
                    />
                  </Wrap>

                  <Wrap mb="4">
                    <FormLabel width={"30%"}>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        fontFamily={"Manrope"}
                      >
                        Password
                      </Text>
                    </FormLabel>

                    <Input
                      border="1px solid gray"
                      width={"60%"}
                      type="text"
                      value={state.password}
                      name="password"
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter Your Strong password"
                    />
                  </Wrap>

                  <Wrap>
                    <FormLabel width={"30%"}>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        fontFamily={"Manrope"}
                      >
                        Confirm Password
                      </Text>
                    </FormLabel>

                    <Input
                      border="1px solid gray"
                      width={"60%"}
                      type="text"
                      value={state.confirmpassword}
                      name="confirmpassword"
                      onChange={(e) => handleChange(e)}
                      placeholder="Confirm Your Password"
                    />
                  </Wrap>
                  {state.password && !passwordsMatch ? (
                    <Text color="red" fontSize="sm">
                      Password do not match.
                    </Text>
                  ) : (
                    <Text></Text>
                  )}
                </Box>
              </FormControl>
            </Flex>

            {/* -------- Profile Details ----- */}

            <Flex
              margin={"auto"}
              p={"8"}
              mt="8"
              maxWidth={"700px"}
              background={"white"}
              borderRadius={"8"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            >
              <FormControl>
                <Wrap mb="8">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={"lg"}
                      fontFamily={"Manrope"}
                    >
                      {" "}
                      Gender{" "}
                    </Text>
                  </FormLabel>
                  <Stack direction={["column", "row"]} spacing="24px">
                    <Flex width={"25rem"}>
                      <RadioGroup>
                        <Radio
                          mr="4"
                          name="gender"
                          value={"male"}
                          onChange={(e) => handleChange(e)}
                          colorScheme="orange"
                          size={"lg"}
                        >
                          Male
                        </Radio>
                        <Radio
                          name="gender"
                          value={"female"}
                          onChange={(e) => handleChange(e)}
                          colorScheme="orange"
                          size={"lg"}
                        >
                          Female
                        </Radio>
                      </RadioGroup>
                    </Flex>
                  </Stack>
                </Wrap>
                {/*--------BirthDay-------- */}
                <Wrap mb="8">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={"lg"}
                      fontFamily={"Manrope"}
                    >
                      Birthday
                    </Text>
                  </FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => handleChange(e)}
                    name="birthday"
                    value={state.birthday}
                  />
                </Wrap>
                {/* -------Height------*/}
                <Wrap mb="8">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={"lg"}
                      fontFamily={"Manrope"}
                    >
                      Height
                    </Text>
                  </FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    name="height"
                    value={state.height}
                    placeholder="Your Height in Centimeter"
                  />
                </Wrap>
                {/* --------Weight--------*/}

                <Wrap>
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={"lg"}
                      fontFamily={"Manrope"}
                    >
                      {" "}
                      Weight
                    </Text>
                  </FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    name="weight"
                    value={state.weight}
                    placeholder="Your Weight in Pounds (lbs)"
                  />
                </Wrap>
                <Wrap mb="4">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight="semibold"
                      fontSize="lg"
                      fontFamily={"Manrope"}
                    >
                      Goal Weight
                    </Text>
                  </FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    name="goalWeight"
                    value={state.goalWeight}
                    placeholder="Enter Your Goal Weight (lbs)"
                  />
                </Wrap>

                {/* Activity Level */}
                <Wrap mb="4">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight="semibold"
                      fontSize="lg"
                      fontFamily={"Manrope"}
                    >
                      Activity Level
                    </Text>
                  </FormLabel>
                  <Select
                    onChange={(e) => handleChange(e)}
                    name="activityLevel"
                    value={state.activityLevel}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="lightlyActive">Lightly Active</option>
                    <option value="moderatelyActive">Moderately Active</option>
                    <option value="veryActive">Very Active</option>
                    <option value="superActive">Super Active</option>
                  </Select>
                </Wrap>

                {/* Pounds to Lose per Week */}
                <Wrap mb="4">
                  <FormLabel width={"30%"}>
                    <Text
                      fontWeight="semibold"
                      fontSize="lg"
                      fontFamily={"Manrope"}
                    >
                      Pounds to Lose per Week
                    </Text>
                  </FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    name="poundsPerWeek"
                    value={state.poundsPerWeek}
                    placeholder="Enter Pounds to Lose per Week"
                  />
                </Wrap>
              </FormControl>
            </Flex>

            <Button
              type="submit"
              mt="3"
              mb="3"
              width={"15rem"}
              colorScheme="green"
              isDisabled={signed}
            >
              SIGN UP
            </Button>

            <br />
            <br />
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default SignUpPage;
