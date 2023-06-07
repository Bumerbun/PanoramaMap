import { Entity, Column, OneToOne} from "typeorm"
import { Point } from "./Point";

@Entity()
export class Panorama extends Point{

    @Column({name: "imagepath", nullable: false})
    imagePath!: string

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
}