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
    qnty: string;
  
    @Column()
    descQnty: string;

    @Column()
    minQnty: string;

    @Column()
    unitValue: string;

    @Column()
    grossValue: string;
  
    @Column()
    expiration: string;

    @Column()
    dateRegister: Date;
  
    @Column()
    dateUpdated: string;
  }