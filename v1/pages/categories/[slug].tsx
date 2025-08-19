import GeneralNumber from "@/components/dashboard/tab/GeneralNumber";
import GeneralTextInput from "@/components/dashboard/tab/GeneralTextInput";
import DynamicSlugCard from "@/components/home/cards/DynamicSlugCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Radio,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function CategoryProperties() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [filterData, setFilterData] = useState({
    type: "",
    place: "",
    mnP: "",
    mxP: "",
    posted: "",
  });
  const { properties, loading } = useProperties({
    src: `get_property?category_id=${id}&current_user=${
      user?.id ?? ""
    }&property_type=${filterData.type}&min_price=${filterData.mnP}&max_price=${
      filterData.mxP
    }&posted_since=${filterData.posted}&search=${filterData.place}`,
  });
  const form = useForm<FilterPropertyProps>({
    initialValues: {
      propCategory: "",
      propType: "sell",
      propLocation: "",
      minPrice: "",
      maxPrice: "",
      posted: "",
    },
  });

  function handleFilter({
    values,
    e,
  }: {
    values: FilterPropertyProps;
    e: FormEvent;
  }) {
    e.preventDefault();
    setFilterData({
      ...filterData,
      type: values.propType as string,
      place: values.propLocation as string,
      mnP: values.minPrice,
      mxP: values.maxPrice,
      posted: values.posted,
    });
  }
  return (
    <AllPropertyLayout>
      <main className="w-full h-full pt-[50px] pb-28 px-4 md:px-8 xl:px-4 xl:flex xl:space-x-7 space-y-4 xl:space-y-0 ">
        <form
          onSubmit={form.onSubmit((values, e) => handleFilter({ values, e }))}
        >
          <Box className="w-full xl:max-w-[351px] bg-white rounded-lg h-fit">
            <Group position="apart" p={5}>
              <Text className="capitalize font-manrope-bold text-base">
                filter properties
              </Text>
              <ActionIcon
                onClick={() => form.reset()}
                variant="transparent"
                className="w-fit font-manrope-regular capitalize text-[13px] "
              >
                clear filter
              </ActionIcon>
            </Group>
            <Divider />
            <Box p={16}>
              <SegmentedControl
                mb={16}
                color="dark"
                className="w-full "
                data={[
                  { label: "For Sell", value: "sell" },
                  { label: "For Rent", value: "rent" },
                ]}
                transitionDuration={500}
                transitionTimingFunction="linear"
                styles={() => ({
                  label: {
                    fontFamily: "manrope-medium",
                  },
                })}
                {...form.getInputProps("propType")}
              />
              <Box mt={16}>
                <GeneralTextInput
                  label="Location (optional)"
                  placeholder="Enter location"
                  form={form}
                  formTarget={"propLocation"}
                />
              </Box>
              <Box className="flex space-x-3" my={16}>
                <GeneralNumber
                  label="Min Price"
                  form={form}
                  formTarget="minPrice"
                />
                <GeneralNumber
                  label="Max Price"
                  form={form}
                  formTarget="maxPrice"
                />
              </Box>
              <Box mb={20}>
                <Text fz={14} className="font-manrope-semibold mb-3">
                  Posted Since
                </Text>
                <Radio.Group
                  {...form.getInputProps("posted")}
                  name="postedTime"
                >
                  <Radio color="dark" value="anytime" mb={10} label="Anytime" />
                  <Radio
                    color="dark"
                    value="lastweek"
                    mb={10}
                    label="Last Week"
                  />
                  <Radio color="dark" value="yesterday" label="Yesterday" />
                </Radio.Group>
              </Box>
              <Button
                type="submit"
                fullWidth
                leftIcon={<IconSend />}
                className="bg-primary-700 hover:bg-primary-700 capitalize font-manrope-regular font-medium rounded-lg"
              >
                apply filter
              </Button>
            </Box>
          </Box>
        </form>
        <DynamicSlugCard properties={properties} loading={loading} />
      </main>
    </AllPropertyLayout>
  );
}
