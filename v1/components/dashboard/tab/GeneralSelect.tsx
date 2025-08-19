import { Select, SelectItem } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function GeneralSelect({
  label,
  placeholder,
  data,
  form,
  formTarget,
}: {
  label: string;
  placeholder: string;
  data: SelectItem[];
  form: UseFormReturnType<any>;
  formTarget: string;
}) {
  return (
    <Select
      maxDropdownHeight={150}
      className="w-full"
      size="md"
      label={label}
      placeholder={placeholder}
      data={data}
      styles={(theme) => ({
        label: {
          fontSize: 16,
          fontFamily: "manrope-semibold",
          textTransform: "capitalize",
        },
        input: {
          marginTop: 4,
          borderColor: theme.colors.gray[2],
          borderWidth: 1,
          fontFamily: "manrope-regular",
          backgroundColor: theme.colors.appBg[0],
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
        },
        item: {
          // applies styles to selected item
          padding: 5,
          "&[data-selected]": {
            "&, &:hover": {
              backgroundColor: "black",
            },
          },
        },
      })}
      {...form.getInputProps(formTarget)}
    />
  );
}
