
/*
Custom-built JWT authentication logic
Manually extracts token from Authorization: Bearer <token> header
Manually verifies JWT using JwtService
Manually validates token payload structure
Manually attaches user data to request object

@UseGuards(AuthGuard) in controller triggers this guard
*/

import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../../types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();
    const authorization = request.headers.authorization; //bearer token

    if (!authorization) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync<JwtPayload>(token);

      //console.log('Token payload:', tokenPayload);

      // Validate token payload structure
      if (
        !tokenPayload.userId ||
        !tokenPayload.username ||
        !tokenPayload.role
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        userId: tokenPayload.userId,
        username: tokenPayload.username,
        role: tokenPayload.role,
        email: tokenPayload.email,
        name: tokenPayload.name,
      };

      return true;
      
    } catch (err: unknown) {
      // Log authentication failures for security monitoring
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.warn('Authentication failed:', errorMessage);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
