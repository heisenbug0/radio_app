"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { inputStyle } from "@/data/usestyles";

export default function MapView({ form }: { form: UseFormReturnType<any> }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps JavaScript API is not loaded.");
        return;
      }

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: "weekly",
        id: "iloveRealEstate",
      });

      const position = {
        lat: Number(form.getInputProps("latitude").value),
        lng: Number(form.getInputProps("longitude").value),
      };

      const { Map } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const geocoder = new google.maps.Geocoder();
      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 5,
        mapId: "iLove_Real_Estate_Map",
      };
      // setup the map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

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

      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // setup marker
      const marker = new Marker({
        map: map,
        position: position,
      });

      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        if (!place.place_id) {
          return;
        }

        map.setZoom(11);
        map.setCenter(place?.geometry?.location!);

        const latitude = place?.geometry?.location?.lat();
        const longitude = place?.geometry?.location?.lng();

        const propState = place?.address_components?.filter((item: any) =>
          item.types.includes("administrative_area_level_1")
        );
        const propCity = place?.address_components?.filter((item: any) =>
          item.types.includes("locality")
        );
        const propCity2 = place?.address_components?.filter((item: any) =>
          item.types.includes("administrative_area_level_2")
        );
        const propCity3 = place?.address_components?.filter((item: any) =>
          item.types.includes("administrative_area_level_3")
        );
        const propCountry = place?.address_components?.filter((item: any) =>
          item.types.includes("country")
        );

        marker.setPosition(place?.geometry?.location);
        marker.setVisible(true);

        form.setFieldValue(
          "city",
          propCity2?.[0]?.long_name ??
            propCity?.[0]?.long_name ??
            propCity3?.[0]?.long_name ??
            ""
        );
        form.setFieldValue("state", propState?.[0]?.long_name);
        form.setFieldValue("country", propCountry?.[0]?.long_name);
        form.setFieldValue("address", place?.formatted_address);
        form.setFieldValue("latitude", latitude);
        form.setFieldValue("longitude", longitude);
      });
    };
    initMap();
  }, [form]);

  return (
    <main>
      <TextInput
        mb={8}
        ref={inputRef}
        size="md"
        placeholder="Search for location"
        styles={(theme) => ({
          input: {
            borderRadius: 4,
            boxShadow: inputStyle.boxShadow,
            backgroundColor: theme.colors.appBg[0],
            borderColor: theme.colors.gray[2],
            borderWidth: 1,
            fontFamily: "manrope-medium",
            fontWeight: 500,
            "&:focus": {
              borderColor: theme.colors.gray[4],
            },
          },
        })}
        className="w-full max-w-xs"
      />
      <div ref={mapRef} style={{ height: "400px" }} />
    </main>
  );
}
