import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; //bearer token

    if (!authorization) {
      throw new UnauthorizedException('No authorization header provided');
    }
    const token = authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);

      console.log('Token payload:', tokenPayload);

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
        // email : tokenPayload.email,
      };
      return true;
    } catch (err) {
      // Log authentication failures for security monitoring
      console.warn('Authentication failed:', err.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
