import SubscriptionPlansCard from "@/components/SubscriptionPlansCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import { usePackageDetails } from "@/hooks/useAdverts";
import useUser from "@/hooks/useUser";
import { Box, SimpleGrid, Skeleton, Title } from "@mantine/core";

export default function SubscriptionPlans() {
  const { user } = useUser();
  const { allPackages, allLoading } = usePackageDetails({
    src: `get_package?current_user=${user?.id}`,
  });

  return (
    <AllPropertyLayout>
      <main className="w-full">
        <Box className="w-full py-10 px-4">
          <Title className="text-black font-manrope-bold mb-4 text-xl md:text-3xl ">
            Choose a plan that&apos;s right for YOU!
          </Title>
          <SimpleGrid
            cols={4}
            spacing="md"
            breakpoints={[
              { maxWidth: "72rem", cols: 3, spacing: "md" },
              { maxWidth: "62rem", cols: 2, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
            ]}
            className="w-full "
          >
            {allLoading ? (
              <>
                {[1, 2, 3, 4].map((item: number) => (
                  <Skeleton key={item} height={300} className="w-full " />
                ))}
              </>
            ) : (
              <>
                {allPackages?.map((item: PackageDetailsProps) => (
                  <SubscriptionPlansCard
                    key={item.id}
                    item={item}
                    user={user}
                  />
                ))}
              </>
            )}
          </SimpleGrid>
        </Box>
      </main>
    </AllPropertyLayout>
  );
}
