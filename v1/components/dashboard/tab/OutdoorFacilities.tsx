import { Loader, SimpleGrid } from "@mantine/core";
import GeneralNumber from "./GeneralNumber";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

export default function OutdoorFacilities({
  form,
  editData,
  loading,
}: {
  form: UseFormReturnType<any>;
  editData: any[];
  loading: boolean;
}) {
  useEffect(() => {
    if (editData[0]?.property_id) {
      form.setFieldValue("outdoorBox", []);
      editData.forEach((data: any) => {
        form.insertListItem("outdoorBox", {
          id: data.id,
          name: data.name,
          distance: Number(data.distance),
          property_id: data.property_id,
          facility_id: data.facility_id,
        });
      });
    } else {
      if (editData?.length) {
        form.setFieldValue("outdoorBox", []);
        editData.forEach((facilityType: { name: string; id: number }) => {
          form.insertListItem("outdoorBox", {
            id: facilityType.id,
            value: "",
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);
  return (
    <>
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <Loader size="md" color="primary.0" />
        </div>
      ) : (
        <SimpleGrid
          cols={4}
          spacing="md"
          breakpoints={[
            { maxWidth: "62rem", cols: 3, spacing: "md" },
            { maxWidth: "48rem", cols: 2, spacing: "sm" },
            { maxWidth: "36rem", cols: 1, spacing: "sm" },
          ]}
          className="w-full "
        >
          {editData?.map((facility: OutdoorFacilitiesProps, index: number) => (
            <GeneralNumber
              key={facility.id}
              label={`${facility.name} (KM)`}
              form={form}
              formTarget={
                editData[0]?.property_id
                  ? `outdoorBox.${index}.distance`
                  : `outdoorBox.${index}.value`
              }
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
