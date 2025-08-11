"use client";

import RoomDetails from "@/components/home/RoomDetails";
import { Box, Title, Container } from "@mantine/core";
import React from "react";

const PersonalRoom = () => {
  return (
    <Container size={1080} px={0} py={10}>
      <Box className="w-full">
        <Title
          order={1}
          fz={24}
          fw={700}
          ff={"Nunito_sans_bold"}
          tt="capitalize"
          c="light_colors.0"
          mb={30}
        >
          Personal meeting Room
        </Title>
        <RoomDetails />
      </Box>
    </Container>
  );
};

export default PersonalRoom;
