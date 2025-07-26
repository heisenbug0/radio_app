import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL,
});

export async function retrieveAuthToken() {
  const response = await fetch("/api/auth/credentials");

  if (response.ok) {
    const result: { token: string } = await response.json();

    return result.token;
  } else {
    return null;
  }
}

export const authService = {
  async loadToken() {
    return retrieveAuthToken();
  },
};

// Add request/response interceptors for debugging and security
api.interceptors.request.use(
  async (config) => {
    const token = await retrieveAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("[API REQUEST]", config);
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[API REQUEST ERROR]", error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[API RESPONSE]", response);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[API RESPONSE ERROR]", error);
    }
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        window.location.href = "/"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export const API = api;
