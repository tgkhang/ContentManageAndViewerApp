// TODO: Move to environment variables for production
// Use a secure, randomly generated secret in production
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  'development-jwt-secret-key-replace-in-production-2024';
