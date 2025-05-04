import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Only set Content-Type to application/json if not sending FormData
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error in response:", error.response);
    const { status } = error.response;

    if (status === 401) {
      // Handle token expiration or unauthorized access
      console.error("Unauthorized access");
    } else {
      const errorMessage = error.response.data.message || "An error occurred";
      console.log(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
