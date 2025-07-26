import { API } from "../../api.config";
import { mutate } from "swr";

export const apiPush = async (
  url: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  data?: { [key: string]: any } | FormData,
  revalidate?: string
) => {
  const isFormData = data instanceof FormData;

  try {
    const response = await API({
      method: method,
      url: url,
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
      data,
    });

    if (revalidate) {
      try {
        mutate(revalidate);
      } catch {
        null;
      }
    }

    return response.data;
  } catch (error: any) {
    let errorMessage = "";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.response.data;

      if (!errorMessage) {
        errorMessage = "Service failed";
      }
    } else {
      errorMessage = "Service unavailable";
    }
    throw new Error(errorMessage);
  }
};
