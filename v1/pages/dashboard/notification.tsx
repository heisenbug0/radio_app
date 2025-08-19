import NotificationTable from "@/components/dashboard/table/NotificationTable";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { Paper, Title } from "@mantine/core";

export default function UserNotification() {
  return (
    <UserDashboardLayout>
      <main className="w-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold mb-5">
          user notification
        </Title>
        <Paper withBorder radius={10} mt={20} className="bg-white p-4">
          <NotificationTable />
        </Paper>
      </main>
    </UserDashboardLayout>
  );
}
UserNotification.requireAuth = true;
