import axiosInstance from "./axiosInstance";

export async function registerUser(data: RegFormSubmitProps) {
  const response = await axiosInstance.post("user_signup", data);
  return response.data;
}

export async function updateUser({ data }: { data: FormData }) {
  const response = await axiosInstance.post("update_profile", data);
  return response.data;
}

async function getter(getUrl: string) {
  const response = await axiosInstance.get(getUrl);
  return response.data;
}
export const getterFetcher = (getUrl: string) => getter(getUrl);

export async function createProperty({ data }: { data: FormData }) {
  const response = await axiosInstance.post("post_property", data);
  return response.data;
}

export async function updateProperty({ data }: { data: FormData }) {
  const response = await axiosInstance.post("update_post_property", data);
  return response.data;
}

export async function createAdvert({ data }: { data: CreateAdsProps }) {
  const response = await axiosInstance.post("store_advertisement", data);
  return response.data;
}

export async function makeFavourite({ property_id }: { property_id: number }) {
  const response = await axiosInstance.post("add_favourite", { property_id });
  return response.data;
}
export async function purchasePackage({
  package_id,
  user_id,
}: {
  package_id: number;
  user_id: number;
}) {
  const response = await axiosInstance.post("paystack_payment_link", {
    package_id,
    user_id,
  });
  return response.data;
}

export async function setViewCount({
  property_id,
  viewer_id,
}: {
  property_id: number;
  viewer_id: number;
}) {
  const response = await axiosInstance.post("set_property_total_click", {
    property_id,
    viewer_id,
  });
  return response.data;
}

// new post function
export async function postFunc<DataProps>({
  data,
  url,
}: {
  data: DataProps;
  url: string;
}) {
  const response = await axiosInstance.post(url, data);
  return response.data;
}

export async function delFunc({ url }: { url: string }) {
  const response = await axiosInstance.delete(url);
  return response.data;
}
