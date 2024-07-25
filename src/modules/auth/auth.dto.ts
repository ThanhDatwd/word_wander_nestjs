import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LOGIN_MODE } from 'src/shared/constants';

export class LoginDTO {
  //   @ApiProperty({
  //     example: LOGIN_MODE.EMAIL,
  //   })
  @IsIn(Object.values(LOGIN_MODE))
  mode: LOGIN_MODE;

  //   @ApiProperty({
  //     example: 'abc@gmail.com',
  //   })
  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsOptional()
  @MaxLength(20)
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  @IsAlphanumeric()
  username: string;

  //   @ApiProperty({
  //     example: 'Abcd@1234',
  //   })
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

export class RegisterDTO {
  // public validate(): OperationResult {
  //   if (this.email) {
  //     const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  //     if (!isEmailValid) {
  //       return {
  //         success: false,
  //         message: 'invalid email format',
  //         code: ERR_CODE.INVALID_EMAIL_FORMAT,
  //         httpCode: HttpStatus.BAD_REQUEST,
  //       };
  //     }
  //   }

  //   if (!this.email && !this.phoneNumber) {
  //     return {
  //       success: false,
  //       message: 'require_email_or_phone number',
  //       code: ERR_CODE.REQUIRE_EMAIL_OR_PHONE_NUMBER,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   }

  //   if (this.username) {
  //     const isUsernameValid = /^[^\d][a-zA-Z0-9_]*$/;
  //     if (!isUsernameValid) {
  //       return {
  //         success: false,
  //         message: 'username is invalid',
  //         code: ERR_CODE.INVALID_USERNAME_FORMAT,
  //         httpCode: HttpStatus.BAD_REQUEST,
  //       };
  //     }
  //   }

  //   const errorMsg = stringUtils.validatePasswordStrengthWithMessage(
  //     this.password,
  //   );

  //   if (errorMsg) {
  //     return {
  //       success: false,
  //       message: errorMsg,
  //       code: ERR_CODE.INVALID_PASSWORD_FORMAT,
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   }

  //   return {
  //     success: true,
  //   };
  // }

  @ApiProperty({
    example: 'abc@gmail.com',
  })
  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'user123',
  })
  @MinLength(1)
  @MaxLength(100)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({
    example: '+84987654321',
  })
  @IsOptional()
  @MaxLength(20)
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'Abcd@1234',
  })
  @MinLength(8)
  @MaxLength(60)
  password: string;
}
