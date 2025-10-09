import { SetMetadata } from '@nestjs/common';

// Creates a unique key to store role metadata
export const ROLES_KEY = 'roles';

// Creates a decorator function that accepts multiple roles
// Each function has a metadata key and an array of roles as its value
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
