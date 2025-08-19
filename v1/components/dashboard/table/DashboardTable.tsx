import AddAdvert from "@/components/modal/AddAdvert";
import { titleImageLoader } from "@/services/utils";
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Text,
  createStyles,
} from "@mantine/core";
import {
  IconCurrencyNaira,
  IconEdit,
  IconSpeakerphone,
  IconThumbDownFilled,
  IconThumbUpFilled,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PAGE_SIZES = [100];
export default function DashboardTable({
  properties,
  loading,
}: {
  properties: any;
  loading: boolean;
}) {
  const [pageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = properties?.slice(0, pageSize);
  const [records, setRecords] = useState<any[]>(initialRecords);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<number>(0);
  const [mountProm, setMountProm] = useState<boolean>(false);
  const router = useRouter();
  const { classes } = useStyles();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(properties?.slice(from, to));
  }, [properties, page, pageSize]);

  const handleOpenPromote = ({ item_id }: { item_id: number }) => {
    setMountProm(true);
    setData(item_id);
  };
  const handleClosePromote = () => setMountProm(false);

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
              accessor: "propery_type",
              title: "Listing Title",
              width: 300,
              render: ({
                propery_type,
                title,
                city,
                state,
                country,
                price,
                title_image,
              }) => (
                <div className="py-3 flex space-x-3 items-center ">
                  <div className="w-[150px] h-[75px] rounded-lg overflow-hidden relative ">
                    <Image
                      src={title_image}
                      alt="article image"
                      loader={titleImageLoader}
                      fill
                      sizes="(min-width: 808px) 50vw, 100vw"
                      priority
                    />
                    <Text className="bg-yellow-500 py-0.5 px-4 text-white top-0 left-0 font-manrope-regular text-sm capitalize rounded-lt-md absolute">
                      {propery_type}
                    </Text>
                  </div>
                  <div className="flex-1">
                    <Text className="font-manrope-semibold text-black text-sm capitalize">
                      {title}
                    </Text>
                    <Text
                      lineClamp={2}
                      className="font-manrope-semibold text-black/40 text-sm capitalize max-w-[256px] w-full "
                    >
                      {`${city} ${state}, ${country}`}
                    </Text>
                    <Group spacing={1}>
                      <IconCurrencyNaira
                        size={18}
                        className="text-primary-700"
                      />
                      <Text className="font-manrope-semibold text-primary-700 text-xs p-0 my-1">
                        {Number(price).toLocaleString()}
                      </Text>
                    </Group>
                  </div>
                </div>
              ),
            },
            {
              accessor: "category",
              width: 100,
              render: ({ category }) => (
                <Text className="font-manrope-medium text-black text-sm capitalize">
                  {category.category}
                </Text>
              ),
            },
            {
              accessor: "total_view",
              title: "Views",
              width: 100,
              render: ({ total_view }) => (
                <Text className="font-manrope-medium text-black text-sm capitalize">
                  {total_view}
                </Text>
              ),
            },
            {
              accessor: "post_created",
              title: "Posted",
              width: 100,
              ellipsis: true,
              cellsStyle: {
                textTransform: "capitalize",
              },
              render: ({ post_created }) => (
                <Text className="font-manrope-medium text-black text-sm capitalize">
                  {post_created}
                </Text>
              ),
            },
            {
              accessor: "status",
              width: 80,
              render: ({ status }) => (
                <Box className="flex space-x-3">
                  {Number(status) === 0 ? (
                    <Paper
                      withBorder
                      className="w-[70px] rounded-2xl flex items-center justify-center text-yellow-600 text-sm"
                    >
                      inactive
                    </Paper>
                  ) : (
                    <Paper
                      withBorder
                      className="w-[70px] rounded-2xl flex items-center justify-center text-green-600 text-sm"
                    >
                      active
                    </Paper>
                  )}
                </Box>
              ),
            },
            {
              accessor: "promoted",
              width: 80,
              render: ({ promoted }) => (
                <Box className="flex ">
                  {promoted ? (
                    <IconThumbUpFilled
                      aria-label="promoted"
                      size={30}
                      className="text-green-700"
                    />
                  ) : (
                    <IconThumbDownFilled
                      size={30}
                      className="text-red-700"
                      aria-label="not-promoted"
                    />
                  )}
                </Box>
              ),
            },
            {
              accessor: "actions",
              width: 100,
              render: ({ id, promoted }) => (
                <Box className="flex space-x-3">
                  <ActionIcon
                    onClick={() =>
                      router.push(`/dashboard/add-property?property_id=${id}`)
                    }
                    title="edit"
                    variant="transparent"
                  >
                    <IconEdit className="text-yellow-700" />
                  </ActionIcon>
                  <ActionIcon disabled title="delete" variant="transparent">
                    <IconTrash className="text-primary-700" />
                  </ActionIcon>
                  <ActionIcon
                    disabled={promoted}
                    onClick={() => handleOpenPromote({ item_id: id })}
                    title="promote"
                    variant="transparent"
                  >
                    <IconSpeakerphone
                      className={`${promoted ? "" : "text-green-700"}`}
                    />
                  </ActionIcon>
                </Box>
              ),
            },
          ]}
        />
      </Box>
      {mountProm && (
        <AddAdvert
          opened={mountProm}
          close={handleClosePromote}
          advert={data}
        />
      )}
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
