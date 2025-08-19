import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import MostGridBox from "@/components/global/MostGridBox";

export default function FeaturedProperties() {
  const { properties, loading } = useProperties({
    src: `get_property?promoted=1`,
  });
  return (
    <AllPropertyLayout>
      <main className="w-full">
        <MostGridBox data={properties} loading={loading} />
        {!loading && properties?.length === 0 && (
          <p className="font-medium font-manrope-medium capitalize w-full text-center">
            No Favourite Properties Yet!
          </p>
        )}
      </main>
    </AllPropertyLayout>
  );
}
