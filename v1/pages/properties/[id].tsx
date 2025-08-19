import AboutProperty from "@/components/AllProperties/AboutProperty";
import DesignerDetails from "@/components/AllProperties/DesignerDetails";
import Feature from "@/components/AllProperties/Feature";
import MapSection from "@/components/AllProperties/MapSection";
import OutdoorBox from "@/components/AllProperties/OutdoorBox";
import PropertyDetailsBannerAddOn from "@/components/AllProperties/PropertyDetailsBannerAddOn";
import PropertyImages from "@/components/AllProperties/PropertyImages";
import Viewers from "@/components/AllProperties/Viewers";
import VirtualTour from "@/components/AllProperties/VirtualTour";
import InitialLoader from "@/components/InitialLoader";
import SimilarProperties from "@/components/global/SimilarProperties";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import { setViewCount } from "@/services/requests";
import { Box, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PropertyDetails() {
  const [update, setUpdate] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
  const { properties, loading } = useProperties({
    src: `get_property?id=${id}&current_user=${user?.id ?? ""}`,
  });
  const { properties: similar, loading: simLoading } = useProperties({
    src: `get_property?id=${id}&get_similar=1&current_user=${user?.id ?? ""}`,
  });

  useEffect(() => {
    async function updateViewCount() {
      try {
        await setViewCount({
          property_id: properties[0]?.id,
          viewer_id: user?.id,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setUpdate(false);
      }
    }
    if (update && properties[0]?.id) {
      updateViewCount();
    }
  }, [properties, update, user]);

  return (
    <>
      {loading ? (
        <InitialLoader />
      ) : (
        <AllPropertyLayout>
          <main className="w-full h-full relative -z-0">
            <PropertyDetailsBannerAddOn data={properties[0]} />
            <div className="w-full pt-[50px] px-4 2xl:px-0 mb-10 ">
              <PropertyImages data={properties[0]} />
              <Box className="mt-10 flex flex-col-reverse lg:flex-row lg:space-x-4 ">
                <Box className="flex-1 ">
                  <AboutProperty data={properties[0]} />
                  <Feature data={properties[0]} />
                  <OutdoorBox data={properties[0]} />
                  <MapSection data={properties[0]} />
                  {properties[0]?.video_link && (
                    <VirtualTour data={properties[0]?.video_link} />
                  )}
                </Box>
                <Stack className="mb-6 lg:mb-0">
                  <DesignerDetails data={properties[0]} />
                  {properties[0]?.email === user?.email && (
                    <Viewers data={properties[0]} />
                  )}
                </Stack>
              </Box>
            </div>

            {similar?.length !== 0 && !simLoading && (
              <div className="w-full px-3 bg-appBg-600 ">
                <SimilarProperties properties={similar} />
              </div>
            )}
          </main>
        </AllPropertyLayout>
      )}
    </>
  );
}
