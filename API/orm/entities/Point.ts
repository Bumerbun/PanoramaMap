import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, OneToOne} from "typeorm"
import { PointType } from "./PointType";

@Entity()
export class Point{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @ManyToOne(() => PointType, (ptype) => ptype.id, {nullable: false})
    @JoinColumn({ name:"ptype"})
    ptype: PointType

    @Column({name: "x", nullable: false})
    x: number

    @Column({name: "y", nullable: false})
    y: number

    @Column({name: "z", nullable: false})
    z: number
}