import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true // No roles required, access granted
    }

    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization
    const token = authorization?.split(" ")[1]

    if (!token) {
      throw new ForbiddenException("No token provided")
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token)
      request.user = {
        userId: tokenPayload.userId,
        username: tokenPayload.username,
        role: tokenPayload.role,
      }

      return requiredRoles.includes(request.user.role)
    } catch (err) {
      throw new ForbiddenException("Invalid token or insufficient permissions")
    }
  }
}

