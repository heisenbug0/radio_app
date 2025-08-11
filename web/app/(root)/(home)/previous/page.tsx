"use client";

import InitialLoader from "@/components/Loader";
import PrevEventsCard from "@/components/home/PrevEventsCard";
import useGetCalls from "@/hooks/useGetCalls";
import { Box, Title, Container, SimpleGrid } from "@mantine/core";
import { Call } from "@stream-io/video-react-sdk";
import React from "react";

const Previous = () => {
  const { endedCalls, isLoading } = useGetCalls();

  if (isLoading) return <InitialLoader />;
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
          Previous meetings
        </Title>
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" verticalSpacing="md">
          {endedCalls.map((meeting: Call) => (
            <PrevEventsCard key={meeting?.id} meeting={meeting} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Previous;
