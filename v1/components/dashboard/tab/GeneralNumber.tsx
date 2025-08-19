import { NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function GeneralNumber({
  label,
  form,
  formTarget,
}: {
  label: string;
  form: UseFormReturnType<any>;
  formTarget: string;
}) {
  return (
    <NumberInput
      label={label}
      size="md"
      step={0.1}
      precision={2}
      min={0}
      className="w-full"
      styles={(theme) => ({
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
        label: {
          textTransform: "capitalize",
          fontFamily: "manrope-medium",
          fontSize: 16,
        },
      })}
      {...form.getInputProps(formTarget)}
    />
  );
}
