import useAdverts from "@/hooks/useAdverts";
import useProperties from "@/hooks/useProperties";
import { Paper, RingProgress, Text, Box } from "@mantine/core";

export default function SubInfoCard({
  data,
  user,
  remainingDays,
}: {
  data: PackageDetailsProps;
  user: UserProps;
  remainingDays: number;
}) {
  const { adverts } = useAdverts();
  const { properties } = useProperties({
    src: `get_property?userid=${user?.id}`,
  });

  function calcDayPercent() {
    const diff = data?.duration - remainingDays;
    return (diff * 100) / data?.duration;
  }

  return (
    <Box className="flex flex-col justify-center items-center space-y-10 md:space-y-0 md:flex-row md:space-x-10">
      <AdvertProps
        title="property"
        subData={properties}
        target={data?.property_limit}
      />
      <AdvertProps
        title="advertisement"
        subData={adverts}
        target={data?.advertisement_limit}
      />
      <Paper
        withBorder
        className="w-full max-w-[227px] shadow-lg shadow-gray-300 p-3"
      >
        <Text className="font-manrope-semibold capitalize text-base mb-2 text-center">
          remaining
        </Text>
        <RingProgress
          className="mx-auto"
          sections={[
            {
              value: calcDayPercent(),
              tooltip: `Used - ${data?.duration - remainingDays} days`,
              color:
                calcDayPercent() <= 50
                  ? "green"
                  : calcDayPercent() <= 80
                  ? "yellow"
                  : "primary.0",
            },
          ]}
          label={
            <Text
              color="dark"
              weight={500}
              align="center"
              className="font-manrope-semibold capitalize text-xs "
            >
              {remainingDays} days
            </Text>
          }
        />
      </Paper>
    </Box>
  );
}

function AdvertProps({
  target,
  subData,
  title,
}: {
  subData: any;
  title: string;
  target: number;
}) {
  function calcPercent() {
    return (subData?.length * 100) / target;
  }

  return (
    <Paper
      withBorder
      className="w-full max-w-[227px] shadow-lg shadow-gray-300 p-3"
    >
      <Text className="font-manrope-semibold capitalize text-base mb-2 text-center">
        {title}
      </Text>
      <RingProgress
        className="mx-auto"
        sections={[
          {
            value: calcPercent(),
            tooltip: `Created - ${subData?.length}`,
            color:
              calcPercent() <= 50
                ? "green"
                : calcPercent() <= 80
                ? "yellow"
                : "primary.0",
          },
        ]}
        label={
          <Text
            color="dark"
            weight={500}
            align="center"
            className="font-manrope-semibold capitalize text-xs "
          >
            {subData?.length}/{target}
          </Text>
        }
      />
    </Paper>
  );
}
