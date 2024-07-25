import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpResponse } from 'mvc-common-toolkit';
import { ERR_CODE, Permission, Role } from 'src/shared/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(RolesGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @Permissions(Permission.VIEW_USER)
  async findAll(): Promise<HttpResponse> {
    const users = await this.usersService.findAll();
    if (!users) {
      return {
        success: false,
        message: 'User not found',
        code: ERR_CODE.USER_NOT_FOUND,
      };
    }

    return {
      success: true,
      data: users,
    };
  }

  // Lấy thông tin người dùng theo ID
  @Public()
  @Get(':id')
  @Roles(Role.ADMIN)
  @Permissions(Permission.VIEW_USER)
  findOne(@Param('id') id: number): Promise<Users> {
    return this.usersService.findOne({ id });
  }

  // Tạo người dùng mới
  //   @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<HttpResponse> {
    try {
      const createUser = await this.usersService.createUser(createUserDto);
      console.log(createUserDto);
      return {
        success: true,
        data: createUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Xóa người dùng theo ID
  //   @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
