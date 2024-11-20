import React from "react";
import { Box, Flex, Progress, Text } from "@chakra-ui/react";

export default function Bar1({ barval, barpercent, clr, spl }) {
  return (
    <Box w="100%" position="relative" mb={4}>
      <Progress
        colorScheme={clr}
        size="lg"
        value={barval}
        borderRadius="12px"
        hasStripe
        isAnimated
      />
      <Flex position="absolute" top="0" w="100%" justifyContent="center">
        <Text fontSize="11px" color="black" px={1}>
          {spl === 0 ? barpercent : `${spl}%`}
        </Text>
      </Flex>
    </Box>
  );
}
