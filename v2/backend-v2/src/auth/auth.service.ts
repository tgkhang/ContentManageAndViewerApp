import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import type { LoginResponse } from '../types/auth.types';

type AuthInput = { email: string; password: string };

type SigninData = {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: string;
};


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<LoginResponse> {
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

      // Ensure user has a password set
      if (!user.password) {
        console.warn(`User ${input.email} has no password set`);
        return null;
      }

      // Verify password hash
      const isMatch = await bcrypt.compare(input.password, user.password);

      if (isMatch) {
        return {
          username: user.username,
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }

      return null;
    } catch (err: unknown) {
      // Log authentication errors for security monitoring
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Authentication error:', errorMessage);
      return null;
    }
  }

  async signIn(user: SigninData): Promise<LoginResponse> {
    const tokenPayload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const access_token = await this.jwtService.signAsync(tokenPayload);

    return {
      access_token,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }
}
