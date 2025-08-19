import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { getReelsApi } from "@/api/apiRoutes";
import { useRouter } from "next/router";

const convertToPicture = (videoLink = "") => {
  const base = "https://res.cloudinary.com/";
  if (!videoLink?.includes(base)) return "";
  const result = videoLink.split(base);
  const subPath = `${result[1].split(".")[0]}.jpg`;
  return `${base}${subPath}`;
};

const ReelsCarousel = () => {
  const [reels, setReels] = useState([]);
  const router = useRouter();
  const locale = router.query?.locale || "en-new";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getReelsApi();
        setReels(res?.data || []);
      } catch (e) {}
    };
    load();
  }, []);

  if (!Array.isArray(reels) || reels.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold brandColor">Reels</h3>
        <button
          onClick={() => router.push(`/${locale}/user/reels`)}
          className="text-sm brandBg primaryTextColor rounded-md px-3 py-2"
        >
          Manage Reels
        </button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative h-[220px] w-[150px] flex-shrink-0 overflow-hidden rounded-xl"
            onClick={() => router.push(`/${locale}/property-details/${reel?.slug || reel?.property_id}`)}
          >
            <Image
              src={convertToPicture(reel?.video_link)}
              alt={reel?.title || "reel"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 p-2">
              <div className="text-white text-sm font-medium line-clamp-2">
                {reel?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsCarousel;

