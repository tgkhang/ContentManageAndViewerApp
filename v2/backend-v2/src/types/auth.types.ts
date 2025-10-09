// structure of data stored inside a JWT
export interface JwtPayload {
  userId: string;
  username: string;
  role: 'admin' | 'editor' | 'client';
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

// standard Request object to include authenticated user data.
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: string;
    email?: string;
    name?: string;
  };
}

// structure of the response sent after successful login.
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
