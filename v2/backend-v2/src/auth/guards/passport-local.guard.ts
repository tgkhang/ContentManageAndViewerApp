/*
Uses Passport.js library under the hood
Delegates authentication to a Passport strategy named 'my-local'
Much shorter because the logic is in the strategy itself

@UseGuards(PassportLocalGuard) in controller triggers this guard
*/

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportLocalGuard extends AuthGuard('my-local') {}
