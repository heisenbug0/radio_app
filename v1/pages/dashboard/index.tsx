import OVerviewCardsBox from "@/components/dashboard/OVerviewCardsBox";
import DashboardTable from "@/components/dashboard/table/DashboardTable";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import { Paper } from "@mantine/core";

export default function DashboardHome() {
  const { user } = useUser();
  const { properties, loading, totalProps, totalViews } = useProperties({
    src: `get_property?userid=${user?.id}`,
  });

  return (
    <UserDashboardLayout>
      <div className="h-full">
        <OVerviewCardsBox
          totalProps={totalProps ?? 0}
          totalViews={totalViews ?? 0}
        />
        <Paper withBorder radius={10} mt={20} className="bg-white p-4">
          <DashboardTable properties={properties} loading={loading} />
        </Paper>
      </div>
    </UserDashboardLayout>
  );
}
DashboardHome.requireAuth = true;
