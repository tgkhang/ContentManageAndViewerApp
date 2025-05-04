import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthInput = { email: string; password: string };
type SigninData = {
  userId: string;
  username: string;
  role: string;
};
type AuthResponse = {
  accessToken: string;
  userId: string;
  username: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResponse | null> {
    //validate
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SigninData | null> {
    try {
      const user = await this.usersService.findByEmail(input.email);

      // hash
      const isMatch = await bcrypt.compare(
        input.password,
        user.password || '123123',
      );

      if (isMatch) {
        return {
          username: user.username,
          userId: user._id.toString(),
          role: user.role,
        };
      }

      // if (user && user.password === input.password) {
      //   return {
      //     username: user.username,
      //     userId: user._id.toString(), // Convert MongoDB ObjectId to string
      //     role: user.role,
      //   };
      // }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async signIn(user: SigninData): Promise<AuthResponse> {
    const tokenPayload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return {
      accessToken: accessToken,
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
  }
}
