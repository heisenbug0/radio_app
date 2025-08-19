import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useUser from "@/hooks/useUser";
import useProperties from "@/hooks/useProperties";
import MostGridBox from "@/components/global/MostGridBox";

export default function MostViewedProperties() {
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?top_rated=1&current_user=${user?.id}`,
  });

  return (
    <AllPropertyLayout>
      <main className="w-full">
        <MostGridBox data={properties} loading={loading} />
      </main>
    </AllPropertyLayout>
  );
}
