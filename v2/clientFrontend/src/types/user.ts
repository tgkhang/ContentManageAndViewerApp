export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "client";
  createdAt: string;
  updatedAt: string;
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
