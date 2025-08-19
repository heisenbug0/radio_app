import ReelsTable from "@/components/dashboard/table/ReelsTable";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import AddReelDrawer from "@/components/reels/AddReelDrawer";
import { Button, Flex, Paper, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconVideo } from "@tabler/icons-react";

export default function MyReels() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <UserDashboardLayout>
      <div className="h-full ">
        <Flex justify="space-between">
          <Title className="text-2xl capitalize text-black font-manrope-semibold">
            my reels
          </Title>
          <Button
            variant="white"
            c="white"
            bg="dark.8"
            className="font-manrope-medium"
            fw={500}
            tt="capitalize"
            leftIcon={<IconVideo />}
            onClick={open}
          >
            add reel
          </Button>
        </Flex>
        <Paper withBorder radius={10} mt={20} className="bg-white p-4">
          <ReelsTable />
        </Paper>
        <AddReelDrawer opened={opened} close={close} />
      </div>
    </UserDashboardLayout>
  );
}
MyReels.requireAuth = true;
