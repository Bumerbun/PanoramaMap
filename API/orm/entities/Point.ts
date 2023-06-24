import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, OneToOne, OneToMany} from "typeorm"
import { PointType } from "./PointType";
import { PointConnection } from "./PointConnection";

@Entity()
export class Point{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @ManyToOne(() => PointType, (ptype) => ptype.id, {nullable: false})
    @JoinColumn({ name:"ptype"})
    ptype: PointType

    @Column("decimal", {scale: 2, name: "x", nullable: false})
    x: number

    @Column("decimal", {scale: 2, name: "y", nullable: false})
    y: number

    @Column("decimal", {scale: 2, name: "z", nullable: false})
    z: number


    @OneToMany(() => PointConnection, (pConnection) => pConnection.point1)
    pointConnections: PointConnection[]

}