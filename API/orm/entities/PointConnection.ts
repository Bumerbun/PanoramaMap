import { Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import { Point } from "./Point";

@Entity()
export class PointConnection{

    @OneToOne(() => Point, (point) => point.id)
    @PrimaryColumn({type:"int"})
    point1: Point

    @OneToOne(() => Point, (point) => point.id)
    @PrimaryColumn({type:"int"})
    point2: Point
}