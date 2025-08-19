import { FormEvent, useEffect, useState } from "react";
import PropertyDetails from "@/components/dashboard/tab/PropertyDetails";
import EstateType from "@/components/dashboard/tab/estatetype/EstateType";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import { Tabs, Title, Paper, Box, Button, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import OutdoorFacilities from "@/components/dashboard/tab/OutdoorFacilities";
import Location from "@/components/dashboard/tab/location/Location";
import LocationMap from "@/components/dashboard/tab/location/LocationMap";
import ImageVideoBox from "@/components/dashboard/tab/image_video/ImageVideoBox";
import { useCategoryById } from "@/hooks/useCategories";
import { staticFormValues } from "@/data/staticFormValues";
import useUser from "@/hooks/useUser";
import { createProperty, updateProperty } from "@/services/requests";
import { errorFunc } from "@/services/utils";
import customNotifications from "@/services/notification";
import { mutate } from "swr";
import useProperties from "@/hooks/useProperties";
import { usePackageDetails } from "@/hooks/useAdverts";
import { useRouter } from "next/router";
import useOutdoorFacilities from "@/hooks/useOutdoorFacilities";
import dynamic from "next/dynamic";

const TextEditor = dynamic(
  () => import("@/components/global/editor/TextEditor"),
  {
    ssr: false,
  }
);
export default function AddProperty() {
  const router = useRouter();
  const { property_id } = router.query;
  const { user } = useUser();
  const { properties } = useProperties({
    src: `get_property?userid=${user?.id}&id=${property_id ?? 0}`,
  });
  const { packageDetails } = usePackageDetails({
    src: `get_package?user_id=${user?.id}`,
  });
  const { outdoorFacilities, loading: outLoader } = useOutdoorFacilities();
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<any>({
    initialValues: {
      propertyType: "",
      categoryId: "",
      title: "",
      price: "",
      description: "",
      state: "",
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
      address: "",
      titleImage: null,
      threeD_Image: null,
      galleryImages: [],
      videoEmbedLink: "",
      facilitiesBox: [],
      outdoorBox: [],
    },
    validate: {
      title: isNotEmpty("property title can't be empty"),
      price: isNotEmpty("price can't be empty"),
      city: isNotEmpty("city can't be empty"),
      state: isNotEmpty("state can't be empty"),
      country: isNotEmpty("country can't be empty"),
      address: isNotEmpty("address can't be empty"),
      propertyType: isNotEmpty("type can't be empty"),
      categoryId: isNotEmpty("category can't be empty"),
      titleImage: isNotEmpty("title image can't be empty"),
      // videoEmbedLink: isNotEmpty("video link can't be empty"),
    },
  });
  const propCatId = form.getInputProps("categoryId").value;
  const { allCategories: parameters, loading } = useCategoryById(propCatId);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // update the description key when text editor updates
    form.setFieldValue("description", content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  async function handleCreateProperty({
    values,
    e,
  }: {
    values: any;
    e: FormEvent;
  }) {
    e.preventDefault();
    setLoader(true);
    const data = new FormData();
    data.append("category_id", values.categoryId);
    data.append("title", values.title);
    data.append("description", values.description);
    data.append("property_type", values.propertyType);
    data.append("price", values.price);
    data.append("address", values.address);
    data.append("state", values.state);
    data.append("city", values.city);
    data.append("country", values.country);
    data.append("latitude", values.latitude);
    data.append("longitude", values.longitude);
    data.append("title_image", values.titleImage);
    data.append("threeD_image", values.threeD_Image);
    data.append("video_link", values.videoEmbedLink);
    data.append("package_id", JSON.stringify(packageDetails.id));

    values.galleryImages.forEach((image: File, index: number) => {
      data.append(
        `gallery_images[${index}]`,
        image?.name ? image : JSON.stringify(null)
      );
    });

    values.facilitiesBox.forEach((facility: any, index: number) => {
      data.append(
        `parameters[${index}][parameter_id]`,
        JSON.stringify(facility.id)
      );
      data.append(
        `parameters[${index}][value]`,
        JSON.stringify(properties?.length ? facility.value : facility.name)
      );
    });

    values.outdoorBox.forEach((facility: any, index: number) => {
      data.append(
        `facilities[${index}][facility_id]`,
        JSON.stringify(properties?.length ? facility.facility_id : facility.id)
      );
      data.append(
        `facilities[${index}][distance]`,
        JSON.stringify(properties?.length ? facility.distance : facility.value)
      );
    });

    if (!properties?.length) {
      try {
        const response = await createProperty({ data });
        if (!response.error) {
          customNotifications.successNotify({ message: response.message });
          mutate(`get_property?userid=${user?.id}`);
          form.reset();
          window.location.reload();
        }
      } catch (error) {
        errorFunc(error);
      } finally {
        setLoader(false);
      }
    } else {
      data.append("id", JSON.stringify(properties[0].id));
      data.append("action_type", JSON.stringify(0));
      try {
        const response = await updateProperty({ data });
        if (!response.error) {
          customNotifications.successNotify({ message: response.message });
          mutate(`get_property?userid=${user?.id}`);
          location.replace("/dashboard");
          form.reset();
        }
      } catch (error) {
        errorFunc(error);
      } finally {
        setLoader(false);
      }
    }
  }

  useEffect(() => {
    if (parameters?.length) {
      Object.keys(form.values).forEach((item) => {
        if (!staticFormValues.includes(item)) {
          delete form.values[item];
        }
      });
      form.setFieldValue("facilitiesBox", []);
      parameters[0].parameter_types.parameters.forEach(
        (facilityType: { name: string; id: number }) => {
          form.insertListItem("facilitiesBox", {
            id: facilityType.id,
            name: "",
          });
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  useEffect(() => {
    // prefill text editor during property update
    if (properties?.length) setContent(properties[0].description);
    else setContent("");
  }, [properties]);

  useEffect(() => {
    if (properties?.length) {
      form.setValues({
        propertyType: properties[0].propery_type.toLowerCase(),
        categoryId: properties[0].category.id,
        title: properties[0].title,
        price: properties[0].price,
        description: properties[0].description,
        state: properties[0].state,
        city: properties[0].city,
        country: properties[0].country,
        latitude: properties[0].latitude,
        longitude: properties[0].longitude,
        address: properties[0].address,
        titleImage: properties[0].title_image,
        threeD_Image: properties[0].threeD_image,
        videoEmbedLink: properties[0].video_link,
      });

      form.setFieldValue("facilitiesBox", []);
      properties[0].parameters.forEach((facilityType: any) => {
        form.insertListItem("facilitiesBox", {
          id: facilityType.id,
          name: facilityType.name,
          type_of_parameter: facilityType.type_of_parameter,
          value: Number(facilityType.value),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  return (
    <UserDashboardLayout>
      <main className="w-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold mb-5">
          add property
        </Title>
        <form
          className="w-full"
          onSubmit={form.onSubmit((values, e) =>
            handleCreateProperty({ values, e })
          )}
        >
          <Paper className="w-full">
            <Tabs color="primary.0" defaultValue="prop-details">
              <Tabs.List>
                <Tabs.Tab
                  className="capitalize font-manrope-medium text-base"
                  value="prop-details"
                >
                  property details
                </Tabs.Tab>
                <Tabs.Tab
                  className="capitalize font-manrope-medium text-base"
                  value="facilities"
                >
                  facilities
                </Tabs.Tab>
                <Tabs.Tab
                  className="capitalize font-manrope-medium text-base"
                  value="outdoor_facilities"
                >
                  outdoor facilities
                </Tabs.Tab>
                <Tabs.Tab
                  className="capitalize font-manrope-medium text-base"
                  value="location"
                >
                  location
                </Tabs.Tab>
                <Tabs.Tab
                  className="capitalize font-manrope-medium text-base"
                  value="images_video"
                >
                  image & video
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="prop-details" pt="xs">
                <Box className="lg:flex px-4 pt-4 pb-20 space-y-4 lg:space-y-0 lg:space-x-4">
                  <Box className="flex-1">
                    <PropertyDetails form={form} />
                  </Box>
                  {/* property description */}
                  <Box className="w-full max-w-2xl ">
                    <TextEditor content={content} setContent={setContent} />
                  </Box>
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="facilities" pt="xs">
                <Box className="w-full p-4">
                  <EstateType
                    form={form}
                    data={
                      properties?.length
                        ? properties[0]?.parameters ?? []
                        : parameters[0]?.parameter_types?.parameters ?? []
                    }
                    loading={loading}
                  />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="outdoor_facilities" pt="xs">
                <Box className="w-full p-4 min-h-[250px]">
                  <OutdoorFacilities
                    form={form}
                    editData={
                      properties?.length
                        ? properties[0]?.assign_facilities
                        : outdoorFacilities
                    }
                    loading={outLoader}
                  />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="location" pt="xs">
                <Box className="lg:flex px-4 pt-4 pb-20 space-y-4 lg:space-y-0 lg:space-x-4">
                  <Box className="w-full max-w-[529px] ">
                    <Location form={form} />
                  </Box>
                  <LocationMap form={form} />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="images_video" pt="xs">
                <Box className="px-4 pt-4 pb-20 ">
                  <ImageVideoBox form={form} />
                </Box>
                <Group position="right" py={20}>
                  <Button
                    loading={loader}
                    loaderPosition="right"
                    color="gray.0"
                    type="submit"
                    variant="transparent"
                    className="text-base rounded-md text-white bg-primary-700 font-manrope-regular capitalize font-medium h-14"
                  >
                    submit property
                  </Button>
                </Group>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </form>
      </main>
    </UserDashboardLayout>
  );
}
AddProperty.requireAuth = true;
