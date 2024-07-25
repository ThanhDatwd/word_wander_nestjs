import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './entities/role.entity';
import { Permissions } from './entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>, // Inject repository
    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private permissionRepository: Repository<Permissions>,
  ) {}
  async findAll(): Promise<Users[]> {
    // const user = await this.usersRepository
    //   .createQueryBuilder('users')
    //   .leftJoinAndSelect('users.roles', 'roles')
    //   .leftJoinAndSelect('users.permissions', 'permissions')
    //   .getMany();

    // if (!user) {
    //   throw new NotFoundException(`User with ID not found`);
    // }

    // return user;
    const user = await this.usersRepository.query(`
    SELECT 
      u.id AS user_id,
      u.username,
      u.email,
      array_agg(DISTINCT r.name) AS roles,
      array_agg(DISTINCT p.name) AS permissions
      FROM
          users AS u
      LEFT JOIN 
          user_roles AS ur ON u.id = ur.user_id
      LEFT JOIN 
          roles AS r ON ur.role_id = r.id
      LEFT JOIN 
          user_permissions AS up ON u.id = up.user_id
      LEFT JOIN 
          permissions AS p ON up.permission_id = p.id
      GROUP BY
          u.id, u.username, u.email
    `);

    if (!user || user.length === 0) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  // Phương thức lấy một người dùng theo ID
  findOne(condition: Record<string, any>): Promise<Users> {
    return this.usersRepository.findOne({ where: condition });
  }
  async findOneByKeyValue(column: string, value: any): Promise<Users> {
    const query = `
      SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        array_agg(DISTINCT r.name) AS roles,
        array_agg(DISTINCT p.name) AS permissions
        FROM
            users AS u
        LEFT JOIN 
            user_roles AS ur ON u.id = ur.user_id
        LEFT JOIN 
            roles AS r ON ur.role_id = r.id
        LEFT JOIN 
            user_permissions AS up ON u.id = up.user_id
        LEFT JOIN 
            permissions AS p ON up.permission_id = p.id
        WHERE u.${column}=$1
        GROUP BY
            u.id, u.username, u.email
      `;
    const result = await this.usersRepository.query(query, [value]);
    return result[0];
  }
  findOneByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { username } });
  }
  async findOneById(id: string | number): Promise<Users | null> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.roles', 'roles')
      .leftJoinAndSelect('users.permissions', 'permissions')
      .where('users.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
  // Phương thức tạo người dùng mới
  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
  async createUser(createUserDto: any): Promise<Users> {
    const { username, password, email, roles, permissions } = createUserDto;

    // Find or create roles and permissions
    const rolesEntities = await this.roleRepository.find({
      where: { name: In(roles) },
    });
    const permissionsEntities = await this.permissionRepository.find({
      where: { name: In(permissions) },
    });

    // Create and save the user
    console.log('this is role', roles);
    const user = this.usersRepository.create({
      username,
      password, // Be sure to hash the password before saving
      email,
      roles: rolesEntities,
      permissions: permissionsEntities,
    });

    return this.usersRepository.save(user);
  }

  // Phương thức xóa người dùng theo ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
