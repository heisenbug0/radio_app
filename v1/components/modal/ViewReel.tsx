import { fill } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { Gravity } from "@cloudinary/url-gen/qualifiers";
import { AutoFocus } from "@cloudinary/url-gen/qualifiers/autoFocus";
import { Modal, Divider, Box, Text, Flex, Button } from "@mantine/core";
import { cld } from "@/data/cloudinaryInstance";
import { accessibility, AdvancedVideo, lazyload } from "@cloudinary/react";
import { useContext } from "react";
import { TempContext } from "@/context/TempContext";
import Link from "next/link";

export default function ViewReel({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const val = useContext(TempContext).val;

  function extractPublicId(url: string): string {
    const f = url.split("/");
    const sixth = f[6];
    const seventh = f[7].split(".")[0];

    return `${sixth}/${seventh}`;
  }

  const myVideo = cld.video(extractPublicId(val.video_link));
  myVideo.resize(
    fill()
      .width(380)
      .height(500)
      .gravity(
        Gravity.autoGravity().autoFocus(AutoFocus.focusOn(FocusOn.faces()))
      )
  );
  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        size="xl"
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <Modal.Overlay />
        <Modal.Content data-autofocus>
          <Divider />
          <Modal.Body>
            <Box p={20}>
              <AdvancedVideo
                cldVid={myVideo}
                controls
                plugins={[lazyload(), accessibility()]}
                className="h-[200px] md:h-[400px] w-full"
                cldPoster="auto"
                autoPlay={false}
              />
              <Box>
                <Text
                  fz={15}
                  fw={400}
                  className="font-manrope-regular"
                  c="dark"
                >
                  {val?.description}
                </Text>
                <Flex gap={20} maw={400} justify="center" mt={20} mx="auto">
                  <Button
                    fullWidth
                    bg="primary.0"
                    size="md"
                    tt="capitalize"
                    className="font-manrope-medium"
                    fw={500}
                    variant="white"
                    c="white"
                    component={Link}
                    href={`/properties/${val?.slug}`}
                  >
                    view property
                  </Button>
                  <Button
                    fullWidth
                    bg="dark.9"
                    size="md"
                    tt="capitalize"
                    className="font-manrope-medium"
                    fw={500}
                    variant="white"
                    c="white"
                    onClick={close}
                  >
                    close
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
