import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";

  @Entity()
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
  
    @Column()
    userName: string;
  
    @Column()
    itemName: string;

    @Column()
    qnty: number;

    @Column()
    motive: string;
  
    @Column()
    status: string;

    @Column()
    deleted: boolean
  
    @Column()
    dateRegister: string;

    @Column()
    dateUpdated: string;
  }