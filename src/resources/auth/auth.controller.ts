import { Body, Controller, Get, Post, Request, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/joiValidationPipe';
import { RequestWithSession } from 'src/types/http';
import { Authentication } from 'src/utils/secure';
import { SignInDto, SignUpDto, VerificationCodeDto } from './auth.dto';
import { AuthService } from './auth.service';
import { signInSchema, signUpSchema, verificationCodechema } from './joiSchema';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(signUpSchema))
  postSignUp(@Body() payload: SignUpDto) {
    return this.authService.emailSignUp(payload).then(async (user) => ({
      token: await this.authService.generateSessionToken(user),
      user,
    }));
  }

  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(signInSchema))
  postSignIn(@Body() payload: SignInDto) {
    return this.authService.emailSignIn(payload);
  }

  @Post('verification-code')
  @UsePipes(new JoiValidationPipe(verificationCodechema))
  postVerificationCode(@Body() payload: VerificationCodeDto) {
    return this.authService.verificationCode(payload);
  }

  @Get('session')
  @Authentication()
  getSession(@Request() req: RequestWithSession) {
    return this.authService.getSession(req.session.id, req.token);
  }
}
