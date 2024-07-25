import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Users, (user) => user.permissions)
  users: Users[];
}
