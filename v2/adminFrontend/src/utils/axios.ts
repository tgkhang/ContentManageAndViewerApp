import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000, // 10 seconds timeout
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
    console.error("Error in response:", error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Handle token expiration or unauthorized access
        console.error("Unauthorized access - redirecting to login");
        localStorage.removeItem("accessToken");
        // Optionally redirect to login
        // window.location.href = "/login";
      } else {
        const errorMessage = error.response?.data?.message || "An error occurred";
        console.error("API Error:", errorMessage);
      }
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
