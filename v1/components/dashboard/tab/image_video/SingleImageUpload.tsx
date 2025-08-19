import { useEffect, useState } from "react";
import {
  Box,
  Text,
  FileButton,
  Button,
  CloseButton,
  Image,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function SingleImageUpload({
  header,
  form,
  formTarget,
  editData,
}: {
  header: string;
  form: UseFormReturnType<any>;
  formTarget: string;
  editData: string;
}) {
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string>("");

  function handleDelete() {
    setFile(null);
    setPreview("");
  }

  useEffect(() => {
    if (file) {
      const url = file?.name ? URL.createObjectURL(file) : editData;
      setPreview(url);
      form.setFieldValue(formTarget, file);
    } else {
      setPreview(editData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, formTarget, editData]);

  return (
    <Box maw={322} className="w-full">
      <Text className="font-manrope-semibold capitalize text-sm mb-1">
        {header} image
      </Text>
      {!preview && (
        <FileButton onChange={setFile} accept="image/png,image/jpeg,image/jpg">
          {(props) => (
            <Button
              h={54}
              {...props}
              className="bg-appBg-600 text-black hover:bg-appBg-600 text-base font-manrope-regular font-normal rounded-md w-full"
            >
              Click to choose an image
            </Button>
          )}
        </FileButton>
      )}
      {preview && (
        <Box className="w-full bg-appBg-600 h-[241px] rounded-2xl px-5 py-[15px]">
          <Box className="w-full h-full overflow-hidden rounded-2xl bg-transparent flex items-center justify-center relative ">
            <Image
              src={preview}
              height={241}
              className="w-full h-[241px]"
              fit="contain"
              alt="title image"
            />
            <Box className="absolute top-3 left-3 bg-black w-8 h-8 rounded-full flex justify-center items-center">
              <CloseButton
                onClick={handleDelete}
                color="gray.0"
                size={16}
                variant="transparent"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
