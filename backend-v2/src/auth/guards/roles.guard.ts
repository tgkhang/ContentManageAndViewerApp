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
    
    if (!authorization) {
      throw new ForbiddenException("No authorization header provided")
    }
    
    const token = authorization?.split(" ")[1]
    if (!token) {
      throw new ForbiddenException("No token provided")
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token)
      
      // Validate token payload structure
      if (!tokenPayload.userId || !tokenPayload.username || !tokenPayload.role) {
        throw new ForbiddenException("Invalid token payload")
      }
      
      request.user = {
        userId: tokenPayload.userId,
        username: tokenPayload.username,
        role: tokenPayload.role,
      }

      const hasRequiredRole = requiredRoles.includes(request.user.role)
      if (!hasRequiredRole) {
        console.warn(`Access denied for user ${request.user.username} with role ${request.user.role}. Required roles: ${requiredRoles.join(", ")}`)
        throw new ForbiddenException("Insufficient permissions")
      }

      return hasRequiredRole
    } catch (err) {
      console.error('Role guard error:', err.message)
      throw new ForbiddenException("Invalid token or insufficient permissions")
    }
  }
}

