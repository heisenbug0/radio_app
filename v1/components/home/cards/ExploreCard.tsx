import { categoryImageLoader } from "@/services/utils";
import { Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ExploreCard({ data }: { data: AllCategoriesProps }) {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(
          `/categories/${data?.category.toLowerCase()}?id=${data?.id}`
        )
      }
      className=" bg-black/30 hover:bg-appBg-800 cursor-pointer p-6 relative rounded-xl h-[262px] text-black hover:text-white "
    >
      <div className="w-[100px] h-[100px] rounded-full bg-white justify-center items-center flex">
        <div className="w-[60px] h-[60px] overflow-hidden rounded-full ">
          <Image
            src={data?.image}
            loader={categoryImageLoader}
            alt="Category Image"
            width={60}
            height={60}
          />
        </div>
      </div>
      <div className="absolute bottom-4 left-6">
        <Text className="capitalize font-manrope-semibold text-sm ">
          {data?.category}
        </Text>
        <Text className="capitalize font-manrope-medium text-xs ">
          {data?.properties_count !== 1
            ? `${data?.properties_count} properties`
            : `${data?.properties_count} property`}
        </Text>
      </div>
    </div>
  );
}
