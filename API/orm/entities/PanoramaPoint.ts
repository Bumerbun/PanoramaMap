import { Entity, Column, OneToOne, OneToMany, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import { Point } from "./Point";
import { PointConnection } from "./PointConnection";

@Entity()
export class PanoramaPoint{

    @PrimaryGeneratedColumn()
    id: number

    @Column({name: "imagepath", nullable: false})
    imagePath: string

    @Column("decimal", {scale:2, name: "imagerotation", nullable: false})
    imageRotation: number 

    @Column({
        type: "varchar",
        length: 100,
        name: "pointname", 
        nullable: true})
    pointName: string | null

    @Column({
        type: "text",
        name: "desciption", 
        nullable: true})
    description: string | null;

    @OneToOne(() => Point,(point) => point.id, {nullable: false})
    @JoinColumn()
    point: Point
}