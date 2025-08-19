import GeneralNumber from "@/components/dashboard/tab/GeneralNumber";
import GeneralSelect from "@/components/dashboard/tab/GeneralSelect";
import GeneralTextInput from "@/components/dashboard/tab/GeneralTextInput";
import DynamicSlugCard from "@/components/home/cards/DynamicSlugCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useCategories from "@/hooks/useCategories";
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
import { FormEvent, useState } from "react";

export default function Properties() {
  const { selectCategories } = useCategories();
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
  const [filterData, setFilterData] = useState({
    catId: "",
    type: "",
    place: "",
    mnP: "",
    mxP: "",
    posted: "",
  });
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?current_user=${user?.id ?? ""}&property_type=${
      filterData.type
    }&category_id=${filterData.catId}&min_price=${filterData.mnP}&max_price=${
      filterData.mxP
    }&search=${filterData.place}&posted_since=${filterData.posted}`,
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
      catId: values.propCategory,
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
              <GeneralSelect
                label="Property Category"
                placeholder="Select category"
                data={selectCategories}
                form={form}
                formTarget={"propCategory"}
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
                  <Radio color="dark" value="2" mb={10} label="Anytime" />
                  <Radio color="dark" value="0" mb={10} label="Last Week" />
                  <Radio color="dark" value="1" label="Yesterday" />
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
