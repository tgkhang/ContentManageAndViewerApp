export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdBy?: string;
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, "createdBy">> & {
  updatedBy?: string;
};

export interface User {
  _id: string;
  name: string;
  username: string;
}