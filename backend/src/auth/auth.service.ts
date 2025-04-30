import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

type AuthInput = { email: string; password: string };
type SigninData = {
  userId: number;
  username: string;
};
type AuthResponse = {
  accessToken: string;
  userId: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async authenticate(input: AuthInput): Promise<AuthResponse | null> {
    //validate
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: 'fake',
      userId: user.userId,
      username: user.username,
    };
  }

  async validateUser(input: AuthInput): Promise<SigninData | null> {
    const user = await this.usersService.findOne(input.email);

    if (user && user.password === input.password) {
      return {
        username: user.username,
        userId: user.id,
      };
    }
    return null;
  }
}
