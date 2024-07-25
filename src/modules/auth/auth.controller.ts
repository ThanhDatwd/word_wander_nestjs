// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HttpResponse, stringUtils } from 'mvc-common-toolkit';
import { Public } from 'src/common/decorators/public.decorator';
import { RequestUser } from 'src/common/decorators/request-user';
import { Users } from '../users/entities/user.entity';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  public async register(@Body() dto: RegisterDTO): Promise<HttpResponse> {
    // const validationResult = dto.validate();
    // if (!validationResult.success) {
    //   return validationResult;
    // }

    // const duplicationCheck = await this.userService.verifyUserUniqueness(dto);
    // if (!duplicationCheck.success) {
    //   return duplicationCheck;
    // }

    const registerResult = await this.authService.register(
      stringUtils.generateRandomId(),
      dto,
    );

    // if (!registerResult.success) {
    //   return registerResult;
    // }

    // await this.chatService.createChatForUser(registerResult.data.id);

    // await this.wsService.publicUserRegisteredToAllManagers(
    //   registerResult.data.id,
    // );

    return {
      success: true,
      data: registerResult,
    };
  }
  @Public()
  @Post('login')
  public async login(@Body() dto: LoginDTO): Promise<HttpResponse> {
    const loginResult = await this.authService.login(
      stringUtils.generateRandomId(),
      dto,
    );

    if (!loginResult.success) {
      return loginResult;
    }

    const { data } = loginResult;

    return {
      success: true,
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  public async whoami(@RequestUser() user: Users): Promise<HttpResponse> {
    return {
      success: true,
      data: user,
    };
  }
}
