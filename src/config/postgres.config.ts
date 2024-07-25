import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const POSTGRES_HOST = 'localhost';
const POSTGRES_PORT = 5432;
const POSTGRES_USER = 'postgres';
const POSTGRES_PASSWORD = '1234';
const POSTGRES_DB = 'mocha_mocha';
export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
