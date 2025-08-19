import { Box, Button } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import ImagesCarouselModal from "../modal/ImagesCarouselModal";
import { galleryImageLoader } from "@/services/utils";

export default function PropertyImages({ data }: { data: PropertyProps }) {
  const [opened, setOpened] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean>(false);

  function handleOpen() {
    setOpened(true);
    setMount(true);
  }
  return (
    <Box className="w-full space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
      <Box className="w-full lg:max-w-[295px] xl:max-w-[475px] space-y-4">
        {data?.gallery[0]?.image_url && (
          <Box
            onClick={handleOpen}
            className="w-full h-[200px] md:h-[390px] lg:h-[302px] rounded-2xl lg:rounded-none lg:rounded-tl-2xl cursor-pointer relative overflow-hidden"
          >
            <Image
              src={data?.gallery[0]?.image_url ?? ""}
              loader={galleryImageLoader}
              alt={`${data?.gallery[0]?.image} image`}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              priority
            />
          </Box>
        )}
        {data?.gallery[1]?.image_url && (
          <Box
            onClick={handleOpen}
            className="w-full h-[200px] md:h-[390px] lg:h-[302px] rounded-2xl lg:rounded-none lg:rounded-bl-2xl cursor-pointer relative overflow-hidden"
          >
            <Image
              src={data?.gallery[1]?.image_url ?? ""}
              loader={galleryImageLoader}
              alt={`${data?.gallery[1]?.image} image`}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              priority
            />
          </Box>
        )}
      </Box>
      {data?.gallery[2]?.image_url && (
        <Box
          onClick={handleOpen}
          className="flex-1 h-[200px] md:h-[390px] lg:h-[620px] rounded-2xl lg:rounded-none lg:rounded-r-2xl  cursor-pointer relative overflow-hidden"
        >
          <Image
            src={data?.gallery[2]?.image_url ?? ""}
            loader={galleryImageLoader}
            alt={`${data?.gallery[2]?.image} image`}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            priority
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            type="button"
            className="hover:text-primary-700 bg-white hover:bg-white text-black font-normal rounded-xl absolute bottom-3 right-4 text-sm capitalize font-manrope-medium"
          >
            see all photos
          </Button>
        </Box>
      )}
      {mount && (
        <ImagesCarouselModal
          allImages={data}
          opened={opened}
          setOpened={setOpened}
          setMount={setMount}
        />
      )}
    </Box>
  );
}
