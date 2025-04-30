import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "src/users/users.service"

type AuthInput = { email: string; password: string }
type SigninData = {
  userId: number
  username: string
  role: string
}
type AuthResponse = {
  accessToken: string
  userId: number
  username: string
  role: string
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResponse | null> {
    //validate
    const user = await this.validateUser(input)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return this.signIn(user)
  }

  async validateUser(input: AuthInput): Promise<SigninData | null> {
    const user = await this.usersService.findOne(input.email)

    if (user && user.password === input.password) {
      return {
        username: user.username,
        userId: user.id,
        role: user.role,
      }
    }
    return null
  }

  async signIn(user: SigninData): Promise<AuthResponse> {
    const tokenPayload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    }

    const accessToken = await this.jwtService.signAsync(tokenPayload)
    return {
      accessToken: accessToken,
      userId: user.userId,
      username: user.username,
      role: user.role,
    }
  }
}