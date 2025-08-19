import customNotifications from "@/services/notification";
import { purchasePackage } from "@/services/requests";
import { errorFunc } from "@/services/utils";
import {
  Paper,
  Box,
  Group,
  Text,
  Badge,
  List,
  ThemeIcon,
  Button,
} from "@mantine/core";
import { IconCheck, IconCurrencyNaira } from "@tabler/icons-react";
import { useState } from "react";

export default function SubscriptionPlansCard({
  item,
  user,
}: {
  item: PackageDetailsProps;
  user: UserProps;
}) {
  const [loader, setLoader] = useState<boolean>(false);

  async function handlePurchase({ package_id }: { package_id: number }) {
    setLoader(true);
    try {
      if (user?.id) {
        const response = await purchasePackage({
          package_id,
          user_id: user.id,
        });
        if (!response?.error) window.open(response.data);
      } else {
        customNotifications.cautionNotify({
          message: "You must be logged in to purchase a package!",
        });
      }
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }
  return (
    <Paper
      withBorder
      radius={10}
      className={`${
        item.is_active === 1 ? "bg-primary-700" : "bg-appBg-800"
      } w-full xl:max-w-[346px] text-white p-5`}
    >
      <Box mb={30}>
        <Badge
          variant="transparent"
          className="bg-appBg-700 h-[42px] rounded-lg font-manrope-medium capitalize font-medium text-base"
        >
          {item?.name}
        </Badge>
        <Group spacing={1} mt={10}>
          <>
            <IconCurrencyNaira size={35} />
            <Text fz={30}>{Number(item?.price).toLocaleString()}</Text>
          </>
        </Group>
      </Box>
      <List
        spacing={2}
        size="sm"
        center
        icon={
          <ThemeIcon color="white" size={16} radius="xl" mt={12}>
            <IconCheck className="text-black" />
          </ThemeIcon>
        }
      >
        <List.Item className="text-white text-base ">
          <Text span>Advertisement limit:</Text>
          <Text span tt="capitalize" ml={7}>
            {item?.advertisement_limit}
          </Text>
        </List.Item>
        <List.Item className="text-white text-base  ">
          <Text span>Property limit:</Text>
          <Text span tt="capitalize" ml={7}>
            {item?.property_limit}
          </Text>
        </List.Item>
        <List.Item className="text-white text-base ">
          <Text span>Validity:</Text>
          <Text span tt="capitalize" ml={7}>
            {item?.duration} days
          </Text>
        </List.Item>
      </List>

      {item.is_active !== 1 && item?.price > 0 && (
        <Button
          onClick={() => handlePurchase({ package_id: item?.id })}
          loading={loader}
          loaderPosition="right"
          color="gray.0"
          fullWidth
          mt={30}
          className="bg-primary-700 text-white font-manrope-light capitalize font-normal rounded-md hover:bg-primary-700"
        >
          purchase
        </Button>
      )}
    </Paper>
  );
}
