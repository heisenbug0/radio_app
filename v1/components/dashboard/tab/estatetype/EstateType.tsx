import {
  Box,
  Button,
  Chip,
  FileButton,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import GeneralTextArea from "../GeneralTextArea";
import GeneralNumber from "../GeneralNumber";
import GeneralSelect from "../GeneralSelect";
import GeneralTextInput from "../GeneralTextInput";
import { useState } from "react";

export default function EstateType({
  form,
  data,
  loading,
}: {
  form: UseFormReturnType<any>;
  data: any[];
  loading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);

  const filteredData = data?.map((parameter: any, index: number) => {
    if (parameter.type_of_parameter === "textarea") {
      return (
        <GeneralTextArea
          key={parameter.id}
          form={form}
          label={parameter.name}
          formTarget={
            data[0]?.value
              ? `facilitiesBox.${index}.value`
              : `facilitiesBox.${index}.name`
          }
        />
      );
    } else if (parameter.type_of_parameter === "checkbox") {
      return (
        <Box key={parameter.id}>
          <Text className="font-manrope-medium capitalize text-base mb-1 ">
            {parameter.name}
          </Text>
          <Chip.Group
            multiple
            {...form.getInputProps(
              data[0]?.value
                ? `facilitiesBox.${index}.value`
                : `facilitiesBox.${index}.name`
            )}
          >
            <Stack spacing={1} maw={200}>
              {parameter.type_values.map((value: any, index: number) => (
                <Chip
                  key={index}
                  color="primary.0"
                  size="xl"
                  radius={5}
                  variant="filled"
                  styles={(theme) => ({
                    label: {
                      fontFamily: "manrope-regular",
                      fontSize: 14,
                      width: 200,
                      textTransform: "capitalize",
                    },
                  })}
                  value={value}
                >
                  {value}
                </Chip>
              ))}
            </Stack>
          </Chip.Group>
        </Box>
      );
    } else if (parameter.type_of_parameter === "number") {
      return (
        <GeneralNumber
          key={parameter.id}
          label={parameter.name}
          form={form}
          formTarget={
            data[0]?.value
              ? `facilitiesBox.${index}.value`
              : `facilitiesBox.${index}.name`
          }
        />
      );
    } else if (parameter.type_of_parameter === "radiobutton") {
      return (
        <Box key={parameter.id}>
          <Text className="font-manrope-medium capitalize text-base mb-1">
            {parameter.name}
          </Text>
          <SegmentedControl
            fullWidth
            styles={(theme) => ({
              label: {
                fontSize: 16,
                fontFamily: "manrope-semibold",
                textTransform: "capitalize",
              },
            })}
            color="primary.0"
            transitionDuration={500}
            transitionTimingFunction="linear"
            orientation="vertical"
            data={parameter.type_values ?? []}
            {...form.getInputProps(
              data[0]?.value
                ? `facilitiesBox.${index}.value`
                : `facilitiesBox.${index}.name`
            )}
          />
        </Box>
      );
    } else if (parameter.type_of_parameter === "dropdown") {
      return (
        <GeneralSelect
          key={parameter.id}
          label={parameter.name}
          placeholder=""
          data={parameter.type_values ?? []}
          form={form}
          formTarget={
            data[0]?.value
              ? `facilitiesBox.${index}.value`
              : `facilitiesBox.${index}.name`
          }
        />
      );
    } else if (parameter.type_of_parameter === "file") {
      return (
        <Box key={parameter.id} className="w-full max-w-xs">
          <Text className="font-manrope-medium capitalize text-base mb-1">
            {parameter.name} (pdf, png,gif,jpeg,webp)
          </Text>
          <FileButton
            {...form.getInputProps(
              data[0]?.value
                ? `facilitiesBox.${index}.value`
                : `facilitiesBox.${index}.name`
            )}
            onChange={(e: any) => {
              setFile(e);
              form.setFieldValue(
                data[0]?.value
                  ? `facilitiesBox.${index}.value`
                  : `facilitiesBox.${index}.name`,
                e
              );
            }}
            accept="image/png,image/jpeg,application/pdf,image/gif,image/webp"
          >
            {(props) => (
              <Button
                {...props}
                className="bg-primary-700 text-white hover:bg-primary-700 font-manrope-regular font-normal w-full "
              >
                Choose a file
              </Button>
            )}
          </FileButton>
          <Box>
            {file && (
              <Text size="sm" mt="sm">
                Picked file: {file.name}
              </Text>
            )}
          </Box>
        </Box>
      );
    } else if (parameter.type_of_parameter === "textbox") {
      return (
        <GeneralTextInput
          key={parameter.id}
          label={parameter.name}
          placeholder="Enter property title"
          form={form}
          formTarget={
            data[0]?.value
              ? `facilitiesBox.${index}.value`
              : `facilitiesBox.${index}.name`
          }
        />
      );
    }
  });

  return (
    <>
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <Loader size="md" color="primary.0" />
        </div>
      ) : (
        <>
          {data[0]?.value !== 0 ? (
            <SimpleGrid
              cols={4}
              spacing="lg"
              breakpoints={[
                { maxWidth: "62rem", cols: 2, spacing: "md" },
                { maxWidth: "48rem", cols: 2, spacing: "sm" },
                { maxWidth: "36rem", cols: 2, spacing: "sm" },
              ]}
              className="w-full "
            >
              {filteredData}
            </SimpleGrid>
          ) : (
            <Text className="font-manrope-medium text-lg text-center py-32">
              Please select a category to view additional fields.
            </Text>
          )}
        </>
      )}
    </>
  );
}
