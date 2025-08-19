"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function PropertyLocation({ data }: { data: PropertyProps }) {
  const mapRef = useRef<HTMLDivElement>(null);

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
        lat: Number(data?.latitude),
        lng: Number(data?.longitude),
      };

      const { Map } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 5,
        mapId: "iLove_Real_Estate_Map",
      };
      // setup the map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // setup marker
      const marker = new Marker({
        map: map,
        position: position,
      });

      // autoComplete.addListener("place_changed", () => {
      //   const place = autoComplete.getPlace();
      //   if (!place.place_id) {
      //     return;
      //   }

      //   map.setZoom(11);
      //   map.setCenter(place?.geometry?.location!);

      //   marker.setPosition(place?.geometry?.location);
      //   marker.setVisible(true);
      // });
    };
    initMap();
  }, [data]);

  return (
    <main>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </main>
  );
}
