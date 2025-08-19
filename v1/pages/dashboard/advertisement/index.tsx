import AdvertTable from "@/components/dashboard/table/AdvertTable";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { Paper, Title } from "@mantine/core";

export default function Advertisement() {
  return (
    <UserDashboardLayout>
      <div className="h-full ">
        <Title className="text-2xl capitalize text-black font-manrope-semibold">
          my advertisement
        </Title>
        <Paper withBorder radius={10} mt={20} className="bg-white p-4">
          <AdvertTable />
        </Paper>
      </div>
    </UserDashboardLayout>
  );
}
Advertisement.requireAuth = true;
