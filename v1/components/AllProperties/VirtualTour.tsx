import { Paper, Divider, Box, Text, AspectRatio } from "@mantine/core";
import { useEffect, useState } from "react";

export default function VirtualTour({ data }: { data: string }) {
  const [videoSrc, setVideoSrc] = useState<string | undefined>("");

  useEffect(() => {
    if (data) {
      const iframeDiv = document.createElement("div");
      iframeDiv.innerHTML = data;
      const iframe = iframeDiv.querySelector("iframe");
      const src = iframe?.getAttribute("src");
      setVideoSrc(src as string);

      return () => iframeDiv.remove();
    }
  }, [data]);
  return (
    <Paper radius={8} withBorder className="mt-7">
      <Text className="text-black font-manrope-bold text-base capitalize p-5">
        video tour
      </Text>
      <Divider />
      <Box className="w-full p-3">
        <Box className="w-full relative">
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </AspectRatio>
        </Box>
      </Box>
    </Paper>
  );
}
