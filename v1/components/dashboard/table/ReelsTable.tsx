import useGetter from "@/hooks/useGetter";
import useUser from "@/hooks/useUser";
import customNotifications from "@/services/notification";
import { delFunc } from "@/services/requests";
import { ActionIcon, Box, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { mutate } from "swr";

const PAGE_SIZES = [100];
export default function ReelsTable() {
  const { user } = useUser();
  const { data, loading } = useGetter(`list/reels?userid=${user?.id}`);
  const [pageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<ListReelsProps[]>([]);
  const [page, setPage] = useState(1);
  const { classes } = useStyles();
  const [loader, setLoader] = useState<boolean>(false);
  const [delId, setDelId] = useState<number>(-1);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(data?.data?.slice(from, to));
  }, [data, page, pageSize]);

  async function handleDelete({ reelId }: { reelId: number }) {
    setLoader(true);
    setDelId(reelId);

    try {
      const res = await delFunc({ url: `reels/${reelId}` });
      if (!res?.error) {
        customNotifications.successNotify({
          message: "Reel successfully deleted.",
        });
        mutate(`list/reels?userid=${user?.id}`);
        mutate(`list/reels`);
      } else {
        customNotifications.cautionNotify({
          message: "Reel failed to delete!",
        });
      }
    } catch (error) {
    } finally {
      setLoader(false);
      setDelId(-1);
    }
  }

  return (
    <>
      <Box className="h-fit  ">
        <DataTable
          classNames={classes}
          highlightOnHover={false}
          textSelectionDisabled
          withColumnBorders
          fontSize="sm"
          records={records}
          fetching={loading}
          loaderColor="dark"
          loaderSize="sm"
          minHeight={200}
          noRecordsText="No data to show"
          columns={[
            {
              accessor: "title",
              title: "Reel Title",
              width: 200,
              ellipsis: true,
              cellsStyle: {
                textTransform: "capitalize",
              },
            },
            {
              accessor: "description",
              width: 250,
            },
            {
              accessor: "views",
              width: 100,
              textAlignment: "center",
            },

            {
              accessor: "action",
              width: "0%",
              render: ({ id }: { id: number }) => (
                <ActionIcon
                  variant="transparent"
                  color="red.9"
                  size={34}
                  mx="auto"
                  loading={id === delId && loader}
                  onClick={() => handleDelete({ reelId: id })}
                >
                  <IconTrash size={24} />
                </ActionIcon>
              ),
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
