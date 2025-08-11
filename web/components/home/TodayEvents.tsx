import {
  Group,
  Title,
  ActionIcon,
  Box,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import TodayEventsCard from "./TodayEventsCard";
import useGetCalls from "@/hooks/useGetCalls";
import { Call } from "@stream-io/video-react-sdk";

const TodayEvents = () => {
  const { upComingCalls, isLoading } = useGetCalls();

  if (isLoading)
    return (
      <Box className="h-full mt-5 w-full flex items-center justify-center">
        <Loader variant="bar" size="lg" color="light_colors.1" />
      </Box>
    );
  return (
    <>
      <Group justify="space-between" mb={24}>
        <Title
          order={2}
          fz={30}
          c="light_colors.0"
          tt="capitalize"
          fw={700}
          ff="Nunito_sans_bold"
        >
          today&apos;s upcoming meetings
        </Title>
        <ActionIcon
          w={100}
          variant="transparent"
          fz={18}
          fw={400}
          ff="Nunito_sans_regular"
          color="light_colors.2"
        >
          sell all
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" verticalSpacing="md">
        {upComingCalls.map((meeting: Call) => (
          <TodayEventsCard key={meeting?.id} meeting={meeting} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default TodayEvents;
