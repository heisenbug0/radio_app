import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import GeneralTextInput from "../GeneralTextInput";
import GeneralTextArea from "../GeneralTextArea";

export default function Location({ form }: { form: UseFormReturnType<any> }) {
  return (
    <Stack className="w-full">
      <div className="w-full space-y-2 md:space-y-0 md:flex md:space-x-2 ">
        <GeneralTextInput
          label="city"
          placeholder="Enter city"
          form={form}
          formTarget="city"
        />
        <GeneralTextInput
          label="state"
          placeholder="Enter state"
          form={form}
          formTarget="state"
        />
      </div>
      <div className="w-full space-y-2 md:space-y-0 md:flex md:space-x-2 ">
        <GeneralTextInput
          label="country"
          placeholder="Enter country"
          form={form}
          formTarget="country"
        />
      </div>
      <GeneralTextArea form={form} label="address" formTarget="address" />
    </Stack>
  );
}
