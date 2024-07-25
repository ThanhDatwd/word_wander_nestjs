import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from '../../config/postgres.config';

@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig)],
})
export class PostgresModule {}
