import useUser from "@/hooks/useUser";
import customNotifications from "@/services/notification";
import { makeFavourite } from "@/services/requests";
import { ActionIcon, Loader } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";
import { mutate } from "swr";

export default function FavouriteBTN({ data }: { data: PropertyProps }) {
  const [loader, setLoader] = useState<boolean>(false);
  const { user } = useUser();

  async function handleFavourite(property_id: number) {
    setLoader(true);
    try {
      const res = await makeFavourite({ property_id });
      if (!res.error) {
        customNotifications.successNotify({ message: res.message });
        mutate(`get_favourite_property`);
        mutate(`get_property?id=${data?.id}&current_user=${user?.id}`);
        mutate(`get_property?current_user=${user?.id}`);
        mutate(`get_property?top_rated=1&current_user=${user?.id}`);
        mutate(`get_property?most_liked=1&current_user=${user?.id}`);
        mutate(`get_property?promoted=1&current_user=${user?.id}`);
        mutate(`get_property?city=${data?.city}&current_user=${user?.id}`);
      }
    } catch (error: any) {
      if (!error?.response)
        customNotifications.failedNotify({
          message: error?.message,
        });
      else {
        if (
          error?.response?.data?.message.toLowerCase() ===
          "Authorization Token not found".toLowerCase()
        ) {
          customNotifications.failedNotify({
            message: "Please login to add this property to favourites!",
          });
        } else {
          customNotifications.failedNotify({
            message: error?.response?.data?.message,
          });
        }
      }
    } finally {
      setLoader(false);
    }
  }
  return (
    <ActionIcon
      onClick={(e) => {
        e.stopPropagation();
        handleFavourite(data?.id);
      }}
      size={35}
      variant="transparent"
      className="bg-white rounded-full flex items-center justify-center top-4 right-4 absolute "
    >
      {loader ? (
        <Loader size="sm" color="primary.0" />
      ) : (
        <>
          {data?.is_favourite ? (
            <IconHeartFilled className="text-primary-700" size={25} />
          ) : (
            <IconHeart className="text-black" size={25} />
          )}
        </>
      )}
    </ActionIcon>
  );
}
