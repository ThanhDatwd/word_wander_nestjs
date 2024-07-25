/* eslint-disable @typescript-eslint/no-unused-vars */
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload, LoginPayload } from './interfaces/jwt-payload.interface';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { ERR_CODE, LOGIN_MODE } from 'src/shared/constants';
import { bcryptHelper, OperationResult } from 'mvc-common-toolkit';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: number): Promise<any> {
    const user = await this.usersService.findOneByKeyValue('id', id);
    return user;
  }
  async validateLoginUser(payload: LoginPayload): Promise<any> {
    const user = await this.usersService.findOneByUsername(payload.username);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return user;
  }
  public async register(
    logId: string,
    data: RegisterDTO,
  ): Promise<OperationResult> {
    try {
      const passwordHashed = await bcryptHelper.hash(data.password);

      const newUser = await this.usersService.create({
        email: data.email,
        username: data.username,
        password: passwordHashed,
      });

      return {
        success: true,
        data: newUser,
      };
    } catch (error) {
      // this.logger.error(error.message, error.stack);

      // this.auditService.emitLog(
      //   new ErrorLog({
      //     logId: logId,
      //     message: error.message,
      //     payload: data,
      //     action: APP_ACTION.REGISTER_WITH_EMAIL_PASSWORD,
      //   }),
      // );

      return { success: false };
    }
  }

  async login(ogId: string, data: LoginDTO) {
    try {
      let user = null;
      switch (data.mode) {
        case LOGIN_MODE.EMAIL:
          user = await this.usersService.findOneByKeyValue('email', data.email);
          break;

        case LOGIN_MODE.PHONE_NUMBER:
          user = await this.usersService.findOneByKeyValue(
            'phoneNumber',
            data.phoneNumber,
          );
          break;

        case LOGIN_MODE.USERNAME:
          user = await this.usersService.findOneByKeyValue(
            'username',
            data.username,
          );
          break;

        default:
          return {
            success: false,
            message: 'invalid login mode',
            code: ERR_CODE.INVALID_LOGIN_MODE,
          };
      }
      console.log('this is usser', user);

      if (!user) {
        return {
          success: false,
          message: 'user not found',
          code: ERR_CODE.USER_NOT_FOUND,
        };
      }

      // const userPermissionsSet = new Set(user.configMetadata.permissions);

      // if (!userPermissionsSet.has(PERMISSION_REQUIRED.LOGIN)) {
      //   return {
      //     success: false,
      //     message: 'user is not allowed to login',
      //     code: ERR_CODE.PERMISSION_DENIED,
      //   };
      // }

      // const isPasswordValid = await bcryptHelper.compare(
      //   data.password,
      //   user.password,
      // );
      // if (!isPasswordValid) {
      //   return {
      //     success: false,
      //     message: 'password incorrect',
      //     code: ERR_CODE.UNAUTHORIZED,
      //   };
      // }
      const payload: JwtPayload = {
        username: user.username,
        id: user.user_id,
        roles: user.roles,
        permissions: user.permissions,
      };
      return {
        success: true,
        data: { access_token: this.jwtService.sign(payload) },
      };
    } catch (error) {
      // this.logger.error(error.message, error.stack);

      // this.auditService.emitLog(
      //   new ErrorLog({
      //     logId: logId,
      //     message: error.message,
      //     payload: data,
      //     action: APP_ACTION.LOGIN_WITH_EMAIL_PASSWORD,
      //   }),
      // );

      return { success: false };
    }
  }
}
