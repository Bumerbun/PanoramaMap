import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import { Point } from "./Point";
import { Panorama } from "./Panorama";

@Entity()
export class PointConnection{

    @ManyToOne(() => Panorama, (panorama) => panorama.id)
    @PrimaryColumn({type:"int"})
    @JoinColumn()
    point1: Point

    @ManyToOne(() => Panorama, (panorama) => panorama.id)
    @PrimaryColumn({type:"int"})
    @JoinColumn()
    point2: Point
}