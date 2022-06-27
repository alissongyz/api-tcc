import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  VETERINARIO = 'veterinario',
  FARMACEUTICO = 'farmaceutico',
  USUARIO = 'usuario'
}

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  dateRegister: string;

  @Column()
  dateUpdated: string;
}