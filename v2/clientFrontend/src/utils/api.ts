import axiosInstance from "./axios";

// authentication
export const loginAPI = (data: { email: string; password: string }) =>
  axiosInstance.post("/auth/login", data);
export const validateAPI = () => axiosInstance.get("/auth/me");

// user profile
export const getCurrentUserProfileAPI = () => axiosInstance.get("/users/me");
export const updateCurrentUserAPI = (data: { name?: string; email?: string; username?: string }) =>
  axiosInstance.patch("/users/me", data);
export const changePasswordAPI = (data: { currentPassword: string; newPassword: string }) =>
  axiosInstance.patch("/users/me/change-password", data);

// contents (read-only)
export const getAllContentsAPI = (params?: { page?: number; limit?: number; search?: string }) =>
  axiosInstance.get("/contents", { params });
export const getContentByIdAPI = (id: string) =>
  axiosInstance.get(`/contents/${id}`);
