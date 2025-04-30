import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login( @Body() input: { email: string; password: string }) {
    //throw new NotImplementedException('Not implemented yet');
    return this.authService.authenticate(input);
  }
}
