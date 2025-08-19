import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import MostGridBox from "@/components/global/MostGridBox";

export default function MostFavouriteProperties() {
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?most_liked=1&current_user=${user?.id}`,
  });
  return (
    <AllPropertyLayout>
      <main className="w-full">
        <MostGridBox data={properties} loading={loading} />
      </main>
    </AllPropertyLayout>
  );
}
