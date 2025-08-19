import axios from "axios";
import Cookies from "js-cookie";
import customNotifications from "./notification";

const axiosInstance = axios.create({
  baseURL: "https://realestateapi.ajebur.com/api/",
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  function (config: any) {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("error: ", error);
    const token = Cookies.get("access_token");
    if (error?.response?.status === 401 && token) {
      // The token has expired, so refresh it or log user out
      customNotifications.cautionNotify({
        message: "Session expired. Logging you out!",
      });
      Cookies.remove("access_token");
      setTimeout(() => window.location.replace("/"), 2500);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
