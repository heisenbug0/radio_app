import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Box } from "@mantine/core";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import Image from "next/image";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { galleryImageLoader } from "@/services/utils";

export default function ImagesCarouselModal({
  opened,
  setOpened,
  setMount,
  allImages,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  setMount: Dispatch<SetStateAction<boolean>>;
  allImages: PropertyProps;
}) {
  const TRANSITION_DURATION = 200;
  const [embla, setEmbla] = useState<Embla | null>(null);
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  function handleClose() {
    setOpened(false);
    setMount(false);
  }
  return (
    <>
      <Modal.Root
        transitionProps={{ duration: TRANSITION_DURATION }}
        opened={opened}
        onClose={handleClose}
        size="xl"
        centered
      >
        <Modal.Overlay opacity={0.8} />
        <Modal.Content>
          <Modal.Header className="bg-neutral-800 text-white">
            <Modal.Title>Property Images</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Box className="hidden md:block w-full">
            <Modal.Body
              style={{ height: 400, display: "flex" }}
              className="bg-neutral-800 text-white "
            >
              <Carousel
                height="100%"
                sx={{ flex: 1 }}
                slideSize="100%"
                loop
                getEmblaApi={setEmbla}
                nextControlIcon={
                  <IconArrowRight
                    size={16}
                    className="text-white border-2 border-neutral-700 w-10 h-10 rounded-full bg-neutral-800"
                  />
                }
                previousControlIcon={
                  <IconArrowLeft
                    size={16}
                    className="text-white border-2 border-neutral-700 w-10 h-10 rounded-full bg-neutral-800"
                  />
                }
              >
                {allImages?.gallery.map(
                  (image: { id: number; image: string; image_url: string }) => (
                    <Carousel.Slide key={image.id}>
                      <Image
                        src={image?.image_url}
                        loader={galleryImageLoader}
                        alt={`${image.image} image`}
                        fill
                        sizes="(min-width: 808px) 50vw, 100vw"
                        priority
                      />
                    </Carousel.Slide>
                  )
                )}
              </Carousel>
            </Modal.Body>
          </Box>
          <Box className="md:hidden">
            <Modal.Body
              style={{ height: 250, display: "flex" }}
              className="bg-neutral-800 text-white"
            >
              <Carousel
                height="100%"
                sx={{ flex: 1 }}
                slideSize="100%"
                loop
                getEmblaApi={setEmbla}
                nextControlIcon={
                  <IconArrowRight
                    size={16}
                    className="text-white border-2 border-neutral-700 w-10 h-10 rounded-full bg-neutral-800"
                  />
                }
                previousControlIcon={
                  <IconArrowLeft
                    size={16}
                    className="text-white border-2 border-neutral-700 w-10 h-10 rounded-full bg-neutral-800"
                  />
                }
              >
                {allImages?.gallery.map(
                  (image: { id: number; image: string; image_url: string }) => (
                    <Carousel.Slide key={image.id}>
                      <Image
                        src={image?.image_url}
                        loader={galleryImageLoader}
                        alt={`${image.image} image`}
                        fill
                        sizes="(min-width: 808px) 50vw, 100vw"
                        priority
                      />
                    </Carousel.Slide>
                  )
                )}
              </Carousel>
            </Modal.Body>
          </Box>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
