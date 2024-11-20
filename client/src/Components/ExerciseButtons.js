import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Grid,
  Text,
  Image,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";

let key1 = 0;
const ExerciseButtons = () => {
  const [exerciseData, setExerciseData] = useState({});
  const exerciseOptions = [
    "abductors",
    "adductors",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "neck",
    "quadriceps",
    "traps",
    "triceps",
  ];

  const muscleImages = {
    abductors: "https://i.ibb.co/BtMCmxJ/abductors.png",
    adductors: "https://i.ibb.co/WkZTCnt/adductors.png",
    biceps: "https://i.ibb.co/2nZ0Kd9/biceps.webp",
    calves: "https://i.ibb.co/frJbwjx/Anatomy-of-the-calf-muscles.webp",
    chest: "https://i.ibb.co/KhY1qy0/chest.jpg",
    forearms: "https://i.ibb.co/HFYLDB7/forearms.jpg",
    glutes: "https://i.ibb.co/x6xDTG3/glutes.jpg",
    hamstrings: "https://i.ibb.co/jwznyg3/hamstrings.jpg",
    lats: "https://i.ibb.co/JqHqdfs/lats2.jpg",
    neck: "https://i.ibb.co/jG2zQpd/neck.jpg",
    quadriceps: "https://i.ibb.co/kXHZwX8/Quadriceps-muscles.png",
    traps: "https://i.ibb.co/PDjnHhh/traps.webp",
    triceps: "https://i.ibb.co/dbpY9n9/triceps.jpg",
  };

  const ExerciseImage = ({ muscle }) => {
    const imageUrl = muscleImages[muscle];

    return <Image src={imageUrl} alt={muscle} boxSize="200px" />;
  };

  const handleButtonClick = (muscle) => {
    const options = {
      method: "GET",
      url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
      params: { muscle },
      headers: {
        "X-RapidAPI-Key": "c45f2f9687msh24becdeb95d1334p15b4b8jsn8fb2a5cd01ce",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setExerciseData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Box
        bgGradient="radial(circle, rgba(43,27,57,0.9702074579831933) 65%, rgba(213,193,245,1) 10%)"
        borderRadius="12px"
        h="10%"
        w="100%"
        p={4}
      >
        <Image
          src="https://i.postimg.cc/gjB666N1/image.png"
          alt="Exercise Header"
          w="50%"
        />
      </Box>

      <Grid
        templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        gap={4}
        mt={4}
      >
        {exerciseOptions.map((exercise) => (
          <Button
            key={exercise}
            variant="solid"
            colorScheme="orange"
            onClick={() => handleButtonClick(exercise)}
          >
            <Text fontSize="lg">{exercise}</Text>
          </Button>
        ))}
      </Grid>

      {Object.keys(exerciseData).length > 0 && (
        <Box mt={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Selected Exercise: {exerciseData[0].muscle}
          </Text>
          <ExerciseImage muscle={exerciseData[0].muscle} />
          <Box mt={4}>
            <Text fontSize="lg" color="black" fontWeight="bold">
              Difficulty Color Code:
            </Text>
            <Box display="flex" alignItems="center">
              <Box
                bg="palegreen"
                p={2}
                borderRadius="5px"
                m={1}
                boxShadow="md"
                border="1px solid #ccc"
              >
                Beginner
              </Box>
              <Box
                bg="lightgoldenrodyellow"
                p={2}
                borderRadius="5px"
                m={1}
                boxShadow="md"
                border="1px solid #ccc"
              >
                Intermediate
              </Box>
              <Box bg="lightpink" p={2} borderRadius="5px" m={1} boxShadow="md">
                Expert
              </Box>
            </Box>
          </Box>

          <List spacing={3} mt={4}>
            {exerciseData.map((myEvent) => (
              <ListItem
                key={(key1 += 1)}
                p={4}
                bg={
                  myEvent.difficulty === "intermediate"
                    ? "lightgoldenrodyellow"
                    : myEvent.difficulty === "beginner"
                    ? "palegreen"
                    : "lightpink"
                }
                borderRadius="8px"
                boxShadow="md"
              >
                <Text>{myEvent.name}</Text>
                <Menu>
                  <MenuButton as={Button} variant="outline" colorScheme="teal">
                    Details
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      Type: <Text fontWeight="bold">{myEvent.type}</Text>
                    </MenuItem>
                    <MenuItem>
                      Equipment Needed:{" "}
                      <Text fontWeight="bold">{myEvent.equipment}</Text>
                    </MenuItem>
                    <MenuItem>
                      Instructions:
                      <Box
                        maxH="200px"
                        overflowY="scroll"
                        mt={2}
                        bg="gray.100"
                        p={2}
                        borderRadius="5px"
                      >
                        <Text>{myEvent.instructions}</Text>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};

export default ExerciseButtons;
