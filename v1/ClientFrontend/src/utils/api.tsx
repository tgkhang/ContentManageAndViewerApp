import axiosInstance from "./axios";
import { UpdateUserDto } from "../types/user";

// authentication
export const loginAPI = (data: { email: string; password: string }) =>
  axiosInstance.post("/auth-v2/login", data);
export const validateAPI = () => axiosInstance.get("/auth/me");

//users
export const getUserByIdAPI = (id: string) => axiosInstance.get(`/users/${id}`);
export const updateUserAPI = (id: string, data: UpdateUserDto) =>
  axiosInstance.patch(`/users/${id}`, data);

//contents
export const getAllContentsAPI = () => axiosInstance.get("/contents");
export const getContentByUserIdAPI = (userId: string) =>
  axiosInstance.get(`/contents/user/${userId}`);
export const getContentByIdAPI = (id: string) =>
  axiosInstance.get(`/contents/${id}`);
