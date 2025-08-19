import { Box, Loader } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function LocationMap({
  form,
}: {
  form: UseFormReturnType<any>;
}) {
  const MapView = useMemo(
    () =>
      dynamic(() => import("./MapView"), {
        loading: () => (
          <div className="h-[400px] w-full flex items-center justify-center">
            <Loader size="md" color="dark" />
          </div>
        ),
        ssr: false,
      }),
    []
  );

  return (
    <Box className="w-full  ">
      <MapView form={form} />
    </Box>
  );
}
