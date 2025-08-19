import { Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function GeneralTextAreaDisabled({
  form,
}: {
  form: UseFormReturnType<any>;
}) {
  return (
    <Textarea
      disabled
      size="sm"
      placeholder="Address"
      minRows={2}
      styles={(theme) => ({
        label: {
          fontSize: 14,
          textTransform: "capitalize",
          fontFamily: "manrope-bold",
          fontWeight: 500,
        },
        input: {
          borderColor: theme.colors.gray[2],
          borderWidth: 1,
          fontFamily: "manrope-medium",
          fontWeight: 500,
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
          "&:disabled": {
            color: "red",
          },
        },
      })}
      className="w-full "
      {...form.getInputProps("address")}
    />
  );
}
