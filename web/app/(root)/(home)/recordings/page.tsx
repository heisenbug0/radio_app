"use client";

import InitialLoader from "@/components/Loader";
import RecordingsCard from "@/components/home/RecordingsCard";
import useGetCalls from "@/hooks/useGetCalls";
import { customNotification } from "@/services/custom_notify";
import { Box, Title, Container, SimpleGrid, Text } from "@mantine/core";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const Recordings = () => {
  const { callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        customNotification("Try again!");
      }
    };
    fetchRecordings();
  }, [callRecordings]);

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
          meetings Recordings
        </Title>
        {recordings.length === 0 ? (
          <Box className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
            <Text
              fz={24}
              fw={700}
              ff={"Nunito_sans_bold"}
              tt="capitalize"
              c="light_colors.0"
            >
              no recordings
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            cols={{ base: 1, lg: 2 }}
            spacing="md"
            verticalSpacing="md"
          >
            {recordings.map((record: CallRecording, index: number) => (
              <RecordingsCard key={record.url} recordings={record} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Container>
  );
};

export default Recordings;
