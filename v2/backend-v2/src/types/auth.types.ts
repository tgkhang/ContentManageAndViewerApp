export interface JwtPayload {
  userId: string;
  username: string;
  role: 'admin' | 'editor' | 'client';
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: string;
    email?: string;
    name?: string;
  };
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    name: string;
  };
}
