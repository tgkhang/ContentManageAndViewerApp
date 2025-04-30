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

    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      console.log(tokenPayload);
      request.user = {
        userId: tokenPayload.userId,
        username: tokenPayload.username,
        // email : tokenPayload.email,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    //return true;// end point can acess
  }
}
