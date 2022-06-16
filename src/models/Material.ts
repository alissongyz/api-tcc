import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  @Entity()
  export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    qnty: number;
  
    @Column()
    descQnty: string;

    @Column()
    minQnty: number;

    @Column()
    unitValue: number;
  
    @Column()
    expiration: string;

    @Column()
    dateRegister: string;
  
    @Column()
    dateUpdated: string;
  }