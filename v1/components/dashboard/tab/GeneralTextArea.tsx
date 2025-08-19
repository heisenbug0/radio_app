import { Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function GeneralTextArea({
  form,
  label,
  formTarget,
}: {
  form: UseFormReturnType<any>;
  label: string;
  formTarget: string;
}) {
  return (
    <Textarea
      label={label}
      minRows={4}
      maw={600}
      className="w-full"
      styles={(theme) => ({
        label: {
          fontSize: 16,
          fontFamily: "manrope-semibold",
          textTransform: "capitalize",
        },
        input: {
          marginTop: 4,
          backgroundColor: theme.colors.appBg[0],
          borderColor: theme.colors.gray[2],
          borderWidth: 1,
          fontFamily: "manrope-regular",
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
          fontSize: 13,
        },
      })}
      {...form.getInputProps(formTarget)}
    />
  );
}
