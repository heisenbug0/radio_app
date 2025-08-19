import { Paper, Title } from "@mantine/core";
import TransactionTable from "@/components/dashboard/table/TransactionTable";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export default function TransactionHistory() {
  return (
    <UserDashboardLayout>
      <main className="w-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold mb-5">
          transaction history
        </Title>
        <Paper withBorder radius={10} mt={20} className="bg-white p-4">
          <TransactionTable />
        </Paper>
      </main>
    </UserDashboardLayout>
  );
}
TransactionHistory.requireAuth = true;
