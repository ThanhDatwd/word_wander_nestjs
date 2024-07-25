import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Roles } from './entities/role.entity';
import { Permissions } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Permissions])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
