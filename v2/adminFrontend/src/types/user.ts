export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "client";
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">>;

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "client";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginResponse {
  access_token: string;
  user: {
    userId: string;
    email: string;
    username: string;
    name: string;
    role: "admin" | "editor" | "client";
  };
}
