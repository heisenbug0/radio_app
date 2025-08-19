import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function GeneralTextInput({
  label,
  placeholder,
  form,
  formTarget,
}: {
  label: string;
  placeholder: string;
  form: UseFormReturnType<any>;
  formTarget: string;
}) {
  return (
    <TextInput
      size="md"
      label={label}
      placeholder={placeholder}
      styles={(theme) => ({
        label: {
          fontSize: 16,
          textTransform: "capitalize",
          fontFamily: "manrope-semibold",
          fontWeight: 500,
        },
        input: {
          backgroundColor: theme.colors.appBg[0],
          borderColor: theme.colors.gray[2],
          borderWidth: 1,
          fontFamily: "manrope-medium",
          fontWeight: 500,
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
        },
      })}
      className="w-full"
      {...form.getInputProps(formTarget)}
    />
  );
}
