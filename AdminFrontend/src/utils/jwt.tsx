import axiosInstance from "./axios";

export const isValidToken = (accessToken: string | null): boolean => {
  if (!accessToken) return false;
  try {
    const tokenParts = accessToken.split(".");
    return tokenParts.length === 3;
  } catch {
    return false;
  }
};

export const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
