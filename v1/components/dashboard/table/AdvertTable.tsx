import useAdverts from "@/hooks/useAdverts";
import { Box, Text, createStyles } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PAGE_SIZES = [100];
export default function AdvertTable() {
  const { adverts } = useAdverts();
  const [pageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = adverts?.slice(0, pageSize);
  const [records, setRecords] = useState<any[]>(initialRecords);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { classes } = useStyles();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(adverts?.slice(from, to));
  }, [adverts, page, pageSize]);

  return (
    <>
      <Box className="h-fit  ">
        <DataTable
          classNames={classes}
          highlightOnHover={false}
          textSelectionDisabled
          fontSize="sm"
          records={records}
          fetching={false}
          loaderColor="dark"
          loaderSize="sm"
          minHeight={200}
          noRecordsText="No data to show"
          columns={[
            {
              accessor: "type",
              title: "Listing Title",
              width: 200,
              ellipsis: true,
              cellsStyle: {
                textTransform: "capitalize",
              },
            },
            {
              accessor: "status",
              width: 100,
              render: ({ status }) => (
                <div className="flex ">
                  {status === 0 && (
                    <Text className="capitalize text-green-700 font-manrope-medium ">
                      approved
                    </Text>
                  )}
                  {status === 1 && (
                    <Text className="capitalize text-yelow-700 font-manrope-medium">
                      pending
                    </Text>
                  )}
                  {status === 2 && (
                    <Text className="capitalize text-red-700 font-manrope-medium">
                      rejected
                    </Text>
                  )}
                </div>
              ),
            },
            {
              accessor: "actions",
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
