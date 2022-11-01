import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  @Entity()
  export class Medicines {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
  
    @Column()
    name: string;
  
    @Column()
    qnty: number;
  
    @Column()
    minQnty: string;

    @Column()
    descQnty: number;

    @Column()
    valueOfInput: number;
  
    @Column()
    validity: string;

    @Column()
    lote: string;

    @Column()
    dateRegister: Date;
  
    @Column()
    dateUpdated: Date;
  }