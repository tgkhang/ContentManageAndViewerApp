import axiosInstance from "./axios";

// validate the structure of JWT token, should have three parts separated by dots
export const isValidToken = (accessToken: string | null): boolean => {
  if (!accessToken) return false;
  try {
    const tokenParts = accessToken.split(".");
    return tokenParts.length === 3;
  } catch {
    return false;
  }
};

// storing the token in localStorage and setting the Authorization header for axios requests
export const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
