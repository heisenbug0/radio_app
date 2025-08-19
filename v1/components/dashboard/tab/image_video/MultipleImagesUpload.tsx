import { useEffect, useState } from "react";
import {
  Box,
  Text,
  FileButton,
  Button,
  CloseButton,
  Image,
  SimpleGrid,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function MultipleImagesUpload({
  form,
  editData,
}: {
  form: UseFormReturnType<any>;
  editData: any[];
}) {
  const [files, setFiles] = useState<any[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  function handlePreview(e: any[]) {
    setFiles([...files, ...e]);
  }

  function handleDelete(pickedIndex: number) {
    const filtered = files.filter((_item, index) => index !== pickedIndex);
    setFiles(filtered);
  }

  useEffect(() => {
    if (files?.length) {
      const previewLinks = files.map((file) => {
        const url = file?.name ? URL.createObjectURL(file) : file.image_url;
        return url;
      });
      setPreview(previewLinks);
      form.setFieldValue("galleryImages", files);
    } else if (editData?.length) {
      setFiles(editData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData?.length, files]);

  return (
    <Box className="w-full mt-5">
      <Text className="font-manrope-semibold capitalize text-sm mb-1">
        gallery images
      </Text>
      <FileButton
        onChange={(e) => handlePreview(e)}
        accept="image/png,image/jpeg,image/jpg"
        multiple
      >
        {(props) => (
          <Button
            h={54}
            maw={322}
            {...props}
            className="bg-appBg-600 text-black hover:bg-appBg-600 text-base font-manrope-regular font-normal rounded-md w-full"
          >
            Click to choose images
          </Button>
        )}
      </FileButton>
      {preview.length !== 0 && (
        <Box className="w-full bg-appBg-600 rounded-2xl px-5 py-[15px] mt-2">
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: "62rem", cols: 2, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
            ]}
            className="w-full "
          >
            {preview.map((item, index) => (
              <Box
                key={index}
                className="w-full h-[241px] overflow-hidden rounded-2xl bg-transparent flex items-center justify-center relative mb-3"
              >
                <Image
                  src={item}
                  height={241}
                  className="w-full h-[241px]"
                  fit="contain"
                  alt="title image"
                />
                <Box className="absolute top-3 left-3 bg-black w-8 h-8 rounded-full flex justify-center items-center">
                  <CloseButton
                    onClick={() => handleDelete(index)}
                    color="gray.0"
                    size={16}
                    variant="transparent"
                  />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
