import OnlineViewerCard from "@/components/AllProperties/OnlineViewerCard";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { Paper, Stack, Title } from "@mantine/core";

export default function OnlineViewers() {
  return (
    <UserDashboardLayout>
      <main className="w-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold mb-5">
          online viewers
        </Title>
        <Paper
          withBorder
          maw={550}
          className="w-full rounded-lg p-5 mx-auto"
          mb={60}
        >
          <Stack>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((viewer, index) => (
              <OnlineViewerCard key={index} />
            ))}
          </Stack>
        </Paper>
      </main>
    </UserDashboardLayout>
  );
}
OnlineViewers.requireAuth = true;
