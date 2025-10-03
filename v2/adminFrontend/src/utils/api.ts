import type { CreateContentDto, UpdateContentDto } from "../types/content";
import type { CreateUserDto, UpdateUserDto } from "../types/user";
import axiosInstance from "./axios";



// authentication
export const loginAPI = (data: { email: string; password: string }) =>
  axiosInstance.post("/auth/login", data);
export const validateAPI = () => axiosInstance.get("/auth/me");

//users
export const createUserAPI = (data: CreateUserDto) =>
  axiosInstance.post("/users", data);
export const getAllUsersAPI = (params?: { page?: number; limit?: number; search?: string }) =>
  axiosInstance.get("/users", { params });
export const getUserByIdAPI = (id: string) => axiosInstance.get(`/users/${id}`);
export const updateUserAPI = (id: string, data: UpdateUserDto) =>
  axiosInstance.patch(`/users/${id}`, data);
export const updateCurrentUserAPI = (data: UpdateUserDto) =>
  axiosInstance.patch("/users/me", data);
export const changePasswordAPI = (data: { currentPassword: string; newPassword: string }) =>
  axiosInstance.patch("/users/me/change-password", data);
export const deleteUserAPI = (id: string) =>
  axiosInstance.delete(`/users/${id}`);

//contents
export const createContentAPI = (data: CreateContentDto) =>
  axiosInstance.post("/contents", data);
export const getAllContentsAPI = () => axiosInstance.get("/contents");
export const getContentByUserIdAPI = (userId: string) =>
  axiosInstance.get(`/contents/user/${userId}`);
export const getContentByIdAPI = (id: string) =>
  axiosInstance.get(`/contents/${id}`);
export const updateContentAPI = (id: string, data: UpdateContentDto) =>
  axiosInstance.patch(`/contents/${id}`, data);
export const deleteContentAPI = (id: string) =>
  axiosInstance.delete(`/contents/${id}`);

//upload
export const uploadFileAPI = (data: FormData) =>
  axiosInstance.post("/uploads", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
