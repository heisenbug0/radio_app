import { Radio, Box, Stack, NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCurrencyNaira } from "@tabler/icons-react";
import GeneralSelect from "./GeneralSelect";
import GeneralTextInput from "./GeneralTextInput";
import useCategories from "@/hooks/useCategories";

export default function PropertyDetails({
  form,
}: {
  form: UseFormReturnType<any>;
}) {
  const { selectCategories } = useCategories();

  return (
    <>
      <Radio.Group
        mb={10}
        name="property_type"
        label="Property Type"
        styles={(theme) => ({
          label: {
            textTransform: "capitalize",
            fontFamily: "manrope-medium",
            fontSize: 16,
          },
        })}
        {...form.getInputProps("propertyType")}
      >
        <Box mt="xs" className="flex space-x-10 w-full ">
          <Radio
            color="primary.0"
            value="sell"
            label="sell"
            className="bg-appBg-600 p-2 rounded-md w-full "
            styles={(theme) => ({
              label: {
                textTransform: "capitalize",
                fontFamily: "manrope-medium",
                fontSize: 16,
              },
            })}
          />
          <Radio
            color="primary.0"
            value="rent"
            label="rent"
            className="bg-appBg-600 p-2 rounded-md w-full "
            styles={(theme) => ({
              label: {
                textTransform: "capitalize",
                fontFamily: "manrope-medium",
                fontSize: 16,
              },
            })}
          />
        </Box>
      </Radio.Group>
      <Stack className="mt-3 w-full">
        <GeneralSelect
          label="Category"
          placeholder="Select category"
          data={selectCategories}
          form={form}
          formTarget="categoryId"
        />
        <GeneralTextInput
          label="title"
          placeholder="Enter property title"
          form={form}
          formTarget="title"
        />
        <NumberInput
          icon={<IconCurrencyNaira />}
          size="md"
          min={0}
          label="price"
          withAsterisk
          placeholder="Enter property price"
          styles={(theme) => ({
            label: {
              fontSize: 14,
              textTransform: "capitalize",
              fontFamily: "manrope-medium",
              fontWeight: 500,
            },
            input: {
              backgroundColor: theme.colors.appBg[0],
              borderColor: theme.colors.gray[2],
              borderWidth: 1,
              fontFamily: "manrope-medium",
              fontWeight: 400,
              "&:focus": {
                borderColor: theme.colors.gray[4],
              },
            },
          })}
          className="w-full"
          {...form.getInputProps("price")}
        />
      </Stack>
    </>
  );
}
