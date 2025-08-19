import {
  Avatar,
  Box,
  Container,
  Flex,
  Group,
  Overlay,
  Text,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconVideo,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import useGetter from "@/hooks/useGetter";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import LoginModal from "@/components/modal/LoginModal";
import Image from "next/image";
import ViewReel from "@/components/modal/ViewReel";
import { TempContext } from "@/context/TempContext";

export default function HomeReels() {
  const token = Cookies.get("access_token");
  const { data } = useGetter(`list/reels`);
  const [mount, setMount] = useState<boolean>(false); // login modal
  const [showReel, setShowReel] = useState<boolean>(false);
  const router = useRouter();
  const setVal = useContext(TempContext).setVal;

  const handleOpenLogin = () => setMount(true);
  const handleCloseLogin = () => setMount(false);

  const handleCloseViewReel = () => {
    setVal("");
    setShowReel(false);
  };

  function convertToPicture(videoLink: string) {
    const main_path = "https://res.cloudinary.com/";
    const result = videoLink.split(main_path);
    const sub_path = `${result[1].split(".")[0]}.jpg`;
    const imageUrl = `${main_path}${sub_path}`;
    return imageUrl ?? "";
  }

  const clips = data?.data?.map((reel: ListReelsProps) => {
    return (
      <Carousel.Slide h={{ base: 200, sm: 500 }} key={reel.id}>
        <Box
          bg="linear-gradient(145deg, #DB066F 0%, #EB5A53 56%, #F79A3E 100%)"
          w="100%"
          h="100%"
          pos="relative"
          className="rounded-xl overflow-hidden"
        >
          <Image
            src={convertToPicture(reel?.video_link)}
            alt="playstore"
            fill
            priority
            sizes="(min-width: 808px) 50vw, 100vw"
          />
          <Overlay
            gradient="linear-gradient(145deg,  rgba(65, 70, 78, 0.5) 0%, rgba(0, 0, 0, 0.1) 100%)"
            opacity={0.85}
            className="cursor-pointer"
            onClick={() => {
              setVal(reel);
              setShowReel(true);
            }}
          >
            <Flex
              gap={10}
              align="center"
              pos="absolute"
              top={{ base: 10 }}
              left={{ base: 10 }}
            >
              <Box w={{ base: 30, sm: 40 }} h={{ base: 30, sm: 40 }}>
                <Avatar radius={100} size={"100%"} src={reel?.user.image} />
              </Box>
              <Box>
                <Text
                  c="white"
                  fw={600}
                  tt="capitalize"
                  fz={{ base: 10, sm: 13 }}
                >
                  {reel?.user.name}
                </Text>
              </Box>
            </Flex>
            <Box
              pos="absolute"
              className="text-white"
              top={{ base: 10 }}
              right={{ base: 10 }}
            >
              <IconEye size={20} />
              <Text fw={400} c="white" ta="center" mt={-8} fz={{ base: 10 }}>
                {reel?.views}
              </Text>
            </Box>
            <Box
              pos="absolute"
              bottom={{ base: 10 }}
              left={{ base: 10 }}
              w="100%"
            >
              <Group spacing={2}>
                <Text fw={400} c="white" fz={{ base: 14 }} lineClamp={2}>
                  {reel?.description}...
                </Text>
                <Text
                  fw={500}
                  c="white"
                  fz={{ base: 13 }}
                  className="cursor-pointer"
                  onClick={() => {
                    setVal(reel);
                    setShowReel(true);
                  }}
                >
                  Read more
                </Text>
              </Group>
            </Box>
          </Overlay>
        </Box>
      </Carousel.Slide>
    );
  });

  return (
    <>
      <Container size={1650} className="w-full h-full ">
        <Carousel
          loop={false}
          dragFree
          align="start"
          slideSize={350}
          slideGap="md"
          containScroll="trimSnaps"
          breakpoints={[
            { maxWidth: "md", slideSize: "50%" },
            // { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
          ]}
          height="100%"
          sx={{ flex: 1 }}
          nextControlIcon={
            <Box
              w={{ base: 20, sm: 40 }}
              h={{ base: 20, sm: 40 }}
              className="text-primary-700 bg-white rounded-full flex items-center justify-center "
            >
              <IconChevronRight size={30} />
            </Box>
          }
          previousControlIcon={
            <Box
              w={{ base: 20, sm: 40 }}
              h={{ base: 20, sm: 40 }}
              className="text-primary-700 bg-white rounded-full flex items-center justify-centerr"
            >
              <IconChevronLeft size={30} />
            </Box>
          }
          previousControlLabel="previous"
          nextControlLabel="next"
          styles={{
            control: {
              "&[data-inactive]": {
                opacity: 0,
                cursor: "default",
              },
            },
          }}
        >
          <Carousel.Slide h={{ base: 200, sm: 500 }}>
            <div className="w-full h-full relative rounded-xl overflow-hidden ">
              <Overlay
                center
                gradient="linear-gradient(145deg, #DB066F 0%, #EB5A53 56%, #F79A3E 100%)"
                opacity={0.85}
              >
                <Box
                  onClick={() => {
                    if (token) {
                      router.push("/dashboard/reels");
                    } else handleOpenLogin();
                  }}
                  c="white"
                  ta="center"
                  className="cursor-pointer"
                >
                  <IconVideo size={60} />
                  <Text
                    fz={{ base: 12, md: 16 }}
                    ta="center"
                    className="font-manrope-medium"
                  >
                    Create a reel
                  </Text>
                </Box>
              </Overlay>
            </div>
          </Carousel.Slide>
          {clips}
        </Carousel>
      </Container>
      {mount && <LoginModal opened={mount} close={handleCloseLogin} />}
      {showReel && <ViewReel opened={showReel} close={handleCloseViewReel} />}
    </>
  );
}
