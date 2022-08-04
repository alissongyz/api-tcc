import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  @Entity()
  export class Material {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
  
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
    grossValue: number;
  
    @Column()
    expiration: string;

    @Column()
    dateRegister: string;
  
    @Column()
    dateUpdated: string;
  }