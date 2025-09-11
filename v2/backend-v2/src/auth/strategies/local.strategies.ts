import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'my-local') {
  constructor(private authservice: AuthService) {
    super({ usernameField: 'email' });
    // contructor of parent class
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authservice.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
