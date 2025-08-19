import { Box, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import GeneralTextInput from "../tab/GeneralTextInput";

export default function SocailMedia({
  form,
}: {
  form: UseFormReturnType<ProfileProps>;
}) {
  return (
    <Box className="p-5">
      <Stack className="">
        <Box className="w-full space-y-2 md:space-y-0 md:flex md:space-x-4 ">
          <GeneralTextInput
            label="facebook"
            placeholder="Enter facebook url"
            form={form}
            formTarget="facebook"
          />
          <GeneralTextInput
            label="instagram"
            placeholder="Enter instagram url"
            form={form}
            formTarget="instagram"
          />
        </Box>
        <Box className="w-full space-y-2 md:space-y-0 md:flex md:space-x-4 ">
          <GeneralTextInput
            label="pinterest"
            placeholder="Enter pinterest url"
            form={form}
            formTarget="pinterest"
          />
          <GeneralTextInput
            label="twitter"
            placeholder="Enter twitter url"
            form={form}
            formTarget="twitter"
          />
        </Box>
      </Stack>
    </Box>
  );
}
