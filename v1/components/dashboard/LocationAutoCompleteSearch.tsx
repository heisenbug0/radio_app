import { inputStyle } from "@/data/usestyles";
import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRef, useEffect } from "react";

export default function LocationAutoCompleteSearch({
  form,
}: {
  form: UseFormReturnType<any>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps JavaScript API is not loaded.");
        return;
      }

      const autoComplete = new window.google.maps.places.Autocomplete(
        inputRef.current!,
        {
          fields: [
            "place_id",
            "geometry",
            "name",
            "formatted_address",
            "address_components",
          ],
        }
      );

      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        if (!place.place_id) {
          return;
        }

        const latitude = place?.geometry?.location?.lat();
        const longitude = place?.geometry?.location?.lng();
        form.setFieldValue("address", place?.formatted_address);
        form.setFieldValue("latitude", latitude);
        form.setFieldValue("longitude", longitude);
      });
    };
    initMap();
  }, [form]);

  return (
    <TextInput
      label="Address"
      mb={8}
      ref={inputRef}
      size="md"
      placeholder="Search for location/address"
      styles={(theme) => ({
        input: {
          borderRadius: 4,
          boxShadow: inputStyle.boxShadow,
          borderColor: theme.colors.gray[2],
          borderWidth: 1,
          fontFamily: "manrope-medium",
          fontWeight: 500,
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
        },
      })}
      className="w-full"
    />
  );
}
