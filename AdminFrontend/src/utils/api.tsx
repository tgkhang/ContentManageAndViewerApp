import axiosInstance from "./axios";
import { CreateUserDto, UpdateUserDto } from "../types/user";
import { CreateContentDto, UpdateContentDto } from "../types/content";

// authentication
//export const loginApi = (data) => axiosInstance.post("/auth/login", data);

//users
export const createUserAPI = (data: CreateUserDto) =>
  axiosInstance.post("/users", data);
export const getAllUsersAPI = () => axiosInstance.get("/users");
export const getUserByIdAPI = (id: string) => axiosInstance.get(`/users/${id}`);
export const updateUserAPI = (id: string, data: UpdateUserDto) =>
  axiosInstance.patch(`/users/${id}`, data);
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
