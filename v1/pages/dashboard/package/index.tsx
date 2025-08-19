import InitialLoader from "@/components/InitialLoader";
import SubInfoCard from "@/components/dashboard/SubInfoCard";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { usePackageDetails } from "@/hooks/useAdverts";
import useUser from "@/hooks/useUser";
import {
  Box,
  Divider,
  Paper,
  Title,
  Badge,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconCalendar, IconCurrencyNaira } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";

export default function Subscription() {
  const { user } = useUser();
  const { packageDetails, allLoading } = usePackageDetails({
    src: `get_package?user_id=${user?.id ?? ""}`,
  });

  const startDate: Date = new Date(packageDetails?.start_date);
  const duration: number = packageDetails?.duration;
  const endDate: Date = new Date(packageDetails?.end_date);
  const currentDate: Date = new Date();
  const remainingDays: number = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <UserDashboardLayout>
      <>
        {allLoading ? (
          <InitialLoader />
        ) : (
          <Box className="h-full">
            <Group mb={20} position="apart">
              <Title className="text-2xl capitalize text-black font-manrope-semibold">
                my package
              </Title>
              <Link href="/packages" className="list-none no-underline">
                <ActionIcon
                  variant="transparent"
                  className="w-fit capitalize text-primary-700 font-manrope-semibold"
                >
                  buy new package
                </ActionIcon>
              </Link>
            </Group>

            <Paper radius={6}>
              <Group position="apart" className="bg-black rounded-t-md p-5">
                <Title className="text-white capitalize text-2xl font-medium font-manrope-medium">
                  current plan
                </Title>
                <Badge
                  radius={5}
                  variant="transparent"
                  className="bg-neutral-800 text-white capitalize h-9 font-manrope-regular font-normal text-base"
                >
                  {packageDetails?.name}
                </Badge>
              </Group>
              <Group position="apart" className="p-5">
                <Box>
                  <Text className="font-manrope-semibold capitalize text-base mb-2">
                    package validity
                  </Text>
                  <Text className="text-3xl font-manrope-bold font-bold text-primary-700">
                    {duration ?? 0} days
                  </Text>
                </Box>
                <Box>
                  <Text className="font-manrope-semibold capitalize text-base mb-2">
                    price
                  </Text>
                  <Group spacing={1}>
                    <IconCurrencyNaira size={34} className="text-primary-700" />
                    <Text className="text-3xl font-manrope-bold font-bold text-primary-700">
                      {Number(packageDetails?.price ?? 0).toLocaleString()}
                    </Text>
                  </Group>
                </Box>
              </Group>
              <Divider />
              <Box className="p-5 w-full mb-5">
                <SubInfoCard
                  data={packageDetails}
                  user={user}
                  remainingDays={remainingDays ?? 0}
                />
              </Box>
              <Group position="apart" spacing={30} className="p-4">
                <Group spacing={5}>
                  <Box className="w-20 h-20 rounded-md bg-primary-700 flex items-center justify-center">
                    <IconCalendar size={40} className="text-white" />
                  </Box>
                  <Box>
                    <Text className="font-manrope-regular capitalize text-base mb-0.5">
                      started on
                    </Text>
                    <Text className="font-manrope-semibold capitalize text-base font-semibold">
                      {dayjs(startDate).format("DD MMMM, YYYY")}
                    </Text>
                  </Box>
                </Group>
                <Group spacing={5}>
                  <Box className="md:text-right ">
                    <Text className="font-manrope-regular capitalize text-base mb-0.5">
                      ends on
                    </Text>
                    <Text className="font-manrope-semibold capitalize text-base font-semibold">
                      {dayjs(endDate).format("DD MMMM, YYYY")}
                    </Text>
                  </Box>
                  <Box className="w-20 h-20 rounded-md bg-primary-700 flex items-center justify-center">
                    <IconCalendar size={40} className="text-white" />
                  </Box>
                </Group>
              </Group>
            </Paper>
          </Box>
        )}
      </>
    </UserDashboardLayout>
  );
}
Subscription.requireAuth = true;
