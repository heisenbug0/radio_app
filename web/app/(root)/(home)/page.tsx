"use client";

import Banner from "@/components/home/Banner";
import MeetingTypeCard from "@/components/home/MeetingTypeCard";
import TodayEvents from "@/components/home/TodayEvents";
import { meeting_types } from "@/constants/meeting_types";
import { SimpleGrid, Box, Container } from "@mantine/core";
import { MeetingTypesProps } from "@/custom-type";

export default function Home() {
  return (
    <Container size={1080} px={0} py={10}>
      <Banner />
      <Box mb={40}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="xs"
          verticalSpacing="xs"
        >
          {meeting_types.map((type: MeetingTypesProps) => (
            <MeetingTypeCard key={type.id} data={type} />
          ))}
        </SimpleGrid>
      </Box>
      <TodayEvents />
    </Container>
  );
}
