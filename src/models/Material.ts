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
  
    @Column("int")
    qnty: number;
  
    @Column()
    descQnty: string;

    @Column("int")
    minQnty: number;

    @Column("double")
    unitValue: number;
  
    @Column()
    expiration: string;

    @Column()
    dateRegister: string;
  
    @Column()
    dateUpdated: string;
  }