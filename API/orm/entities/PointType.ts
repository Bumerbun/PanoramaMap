import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PointType{

    @PrimaryGeneratedColumn({name:"id"})
    id: number;

    @Column({name:"name", nullable:false})
    name: string;
}