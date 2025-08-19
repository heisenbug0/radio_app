import { Paper, Divider, Text, TypographyStylesProvider } from "@mantine/core";

export default function AboutProperty({ data }: { data: PropertyProps }) {
  return (
    <Paper radius={8} withBorder className="">
      <Text className="text-black font-manrope-bold text-base capitalize p-5">
        about property
      </Text>
      <Divider />
      <TypographyStylesProvider>
        <div
          className="p-5 text-black font-manrope-regular text-sm"
          dangerouslySetInnerHTML={{ __html: data?.description }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
