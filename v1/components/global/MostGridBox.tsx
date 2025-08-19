import { SimpleGrid, Skeleton } from "@mantine/core";
import HomeCard from "../home/cards/HomeCard";

export default function MostGridBox({
  data,
  loading,
}: {
  data: PropertyProps[];
  loading: boolean;
}) {
  return (
    <div className="w-full pt-10 px-4 mb-[60px] ">
      <SimpleGrid
        cols={3}
        spacing={44}
        breakpoints={[
          { maxWidth: "72rem", cols: 3, spacing: "md" },
          { maxWidth: "62rem", cols: 2, spacing: "md" },
          { maxWidth: "48rem", cols: 2, spacing: "sm" },
          { maxWidth: "36rem", cols: 1, spacing: "sm" },
        ]}
        className="w-full "
      >
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item: number) => (
              <Skeleton key={item} height={350} className="w-full " />
            ))}
          </>
        ) : (
          <>
            {data?.map((item: PropertyProps) => (
              <HomeCard key={item.id} data={item} />
            ))}
          </>
        )}
      </SimpleGrid>
      {/* <NextPrevButtons /> */}
    </div>
  );
}
