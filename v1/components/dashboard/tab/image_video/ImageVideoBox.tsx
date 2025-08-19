import { SimpleGrid, Box, Textarea } from "@mantine/core";
import MultipleImagesUpload from "./MultipleImagesUpload";
import SingleImageUpload from "./SingleImageUpload";
import { UseFormReturnType } from "@mantine/form";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

export default function ImageVideoBox({
  form,
}: {
  form: UseFormReturnType<any>;
}) {
  const router = useRouter();
  const { property_id } = router.query;
  const { user } = useUser();
  const { properties } = useProperties({
    src: `get_property?userid=${user?.id}&id=${property_id ?? 0}`,
  });

  return (
    <>
      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: "62rem", cols: 2, spacing: "md" },
          { maxWidth: "48rem", cols: 2, spacing: "sm" },
          { maxWidth: "36rem", cols: 1, spacing: "sm" },
        ]}
        className="w-full "
      >
        <SingleImageUpload
          header="title"
          form={form}
          formTarget="titleImage"
          editData={properties[0]?.threeD_image}
        />
        <SingleImageUpload
          header="3D"
          form={form}
          formTarget="threeD_Image"
          editData={properties[0]?.title_image}
        />
        <Textarea
          label="Video Link"
          description="Embed video url"
          placeholder={`<iframe width="560" height="315" src="https://dfdf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`}
          minRows={8}
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
              fontWeight: 500,
              "&:focus": {
                borderColor: theme.colors.gray[4],
              },
            },
          })}
          className="w-full"
          {...form.getInputProps("videoEmbedLink")}
        />
      </SimpleGrid>
      <MultipleImagesUpload
        form={form}
        editData={properties[0]?.gallery ?? []}
      />
    </>
  );
}
