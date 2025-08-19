import useNotifications from "@/hooks/useNotifications";
import { notificationImageLoader } from "@/services/utils";
import { Box, createStyles } from "@mantine/core";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import Image from "next/image";
import { useEffect, useState } from "react";

const PAGE_SIZES = [100];
export default function NotificationTable() {
  const { allNotifications, loading } = useNotifications();
  const [pageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = allNotifications?.slice(0, pageSize);
  const [records, setRecords] = useState<any[]>(initialRecords);
  const [page, setPage] = useState(1);
  const { classes } = useStyles();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(allNotifications?.slice(from, to));
  }, [allNotifications, page, pageSize]);

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
              accessor: "image",
              width: 120,
              render: ({ image }) => (
                <Box className="w-[150px] h-[75px] relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    loader={notificationImageLoader}
                    alt="notification image"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Box>
              ),
            },
            {
              accessor: "title",
              width: 150,
              textAlignment: "center",
            },
            {
              accessor: "message",
              width: 400,
              textAlignment: "center",
            },
            {
              accessor: "created_at",
              title: "Date",
              width: 100,
              ellipsis: true,
              render: ({ created_at }) =>
                dayjs(created_at).format("MMMM DD, YYYY"),
              cellsStyle: {
                textTransform: "capitalize",
              },
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
