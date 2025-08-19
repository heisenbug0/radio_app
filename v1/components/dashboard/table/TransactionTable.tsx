import { useGetPaymentDetails } from "@/hooks/useNotifications";
import { Box, Group, Text, createStyles } from "@mantine/core";
import { IconCurrencyNaira } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";

const PAGE_SIZES = [100];
export default function TransactionTable() {
  const { transactions, loading } = useGetPaymentDetails();
  const [pageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = transactions?.slice(0, pageSize);
  const [records, setRecords] = useState<any[]>(initialRecords);
  const [page, setPage] = useState(1);
  const { classes } = useStyles();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(transactions?.slice(from, to));
  }, [transactions, page, pageSize]);

  return (
    <>
      <Box className="h-fit  ">
        <DataTable
          classNames={classes}
          highlightOnHover={false}
          textSelectionDisabled
          fontSize="sm"
          records={records}
          fetching={loading}
          loaderColor="dark"
          loaderSize="sm"
          minHeight={200}
          noRecordsText="No data to show"
          columns={[
            {
              accessor: "id",
              title: "S/N",
              width: 80,
            },
            {
              accessor: "transaction_id",
              title: "Transaction ID",
              width: 150,
            },
            {
              accessor: "created_at",
              title: "Date",
              render: ({ created_at }) =>
                dayjs(created_at).format("MMMM DD, YYYY"),
              width: 100,
            },
            {
              accessor: "amount",
              width: 100,
              render: ({ amount }) => (
                <Group spacing={1}>
                  <IconCurrencyNaira size={18} />
                  <Text className="font-manrope-regular p-0 my-1">
                    {Number(amount).toLocaleString()}
                  </Text>
                </Group>
              ),
            },
            {
              accessor: "payment_gateway",
              title: "Gateway",
              width: 100,
            },
            {
              accessor: "status",
              width: 100,
            },
          ]}
        />
      </Box>
    </>
  );
}

export const useStyles = createStyles((theme) => ({
  root: { fontSize: 200 },
  header: {
    "&& th": {
      color: "black",
      backgroundColor: theme.colors.appBg[0],
      fontWeight: 600,
      height: 57,
      fontFamily: "manrope-regular",
    },
  },
}));
