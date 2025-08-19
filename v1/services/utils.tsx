import { UseFormReturnType } from "@mantine/form";
import customNotifications from "./notification";
import { registerUser } from "./requests";
import Cookies from "js-cookie";
import { ImageLoaderProps } from "next/image";

export function errorFunc(error: any) {
  if (!error?.response)
    customNotifications.failedNotify({
      message: error?.message,
    });
  else
    customNotifications.failedNotify({
      message: error?.response?.data?.message,
    });
}

export async function processRegister({
  firebaseId,
  values,
  setLoader,
  form,
}: {
  firebaseId: string;
  values: RegFormProps;
  setLoader: (loader: boolean) => void;
  form: UseFormReturnType<RegFormProps>;
}) {
  const { email, name, mobile } = values;
  // Hardcoded dummy address and location data
  const dummyAddress = "123 Victoria Island, Lagos, Nigeria";
  const dummyLongitude = 3.4219;  // Victoria Island, Lagos longitude
  const dummyLatitude = 6.4281;   // Victoria Island, Lagos latitude

  const data: RegFormSubmitProps = {
    firebase_id: firebaseId,
    type: "email",
    email,
    name,
    mobile,
    address: dummyAddress,
    longitude: dummyLongitude.toString(),
    latitude: dummyLatitude.toString(),
  };

  try {
    const result = await registerUser(data);
    if (!result?.error) {
      customNotifications.successNotify({ message: result.message });
      form.reset();
      Cookies.set("access_token", result.token, {
        expires: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
      });
      setTimeout(() => window.location.replace("/"), 2500);
    }
    return result;
  } catch (error) {
    errorFunc(error);
  } finally {
    setLoader(false);
  }
}

export function userImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/users/")[1];
  return `https://realestateapi.ajebur.com/images/users/${src}?w=${width}&q=${
    quality || 75
  }`;
}
export function categoryImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/category/")[1];
  return `https://realestateapi.ajebur.com/images/category/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function titleImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/property_title_img/")[1];
  return `https://realestateapi.ajebur.com/images/property_title_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function facilityImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/facility_img/")[1];
  return `https://realestateapi.ajebur.com/images/facility_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function galleryImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/property_gallery_img/")[1];
  return `https://realestateapi.ajebur.com/images/property_gallery_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function parameterImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  src = src.split("parameter_img/")[1];
  return `https://realestateapi.ajebur.com/images/parameter_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function cityImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/images/city_image/")[1];

  return `https://realestateapi.ajebur.com/images/city_image/${src}?w=${width}&q=${
    quality || 75
  }`;
  // return `https://images.unsplash.com/${src}?w=${width}&q=${quality || 75}`;
}

export function articleImageLoader({ src, width, quality }: ImageLoaderProps) {
  src = src.split("/article_img/")[1];
  return `https://realestateapi.ajebur.com/images/article_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}

export function notificationImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  src = src.split("/property_title_img/")[1];
  return `https://realestateapi.ajebur.com/images/property_title_img/${src}?w=${width}&q=${
    quality || 75
  }`;
}
