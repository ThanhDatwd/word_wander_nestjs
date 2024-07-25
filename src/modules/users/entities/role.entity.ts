import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
