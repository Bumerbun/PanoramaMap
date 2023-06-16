import { Check, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm"
import { PanoramaPoint } from "./PanoramaPoint";
import { Point } from "./Point";

@Entity()
@Check('"point1" != "point2"')
@Unique(["point1", "point2"])
export class PointConnection{
    
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToOne(() => Point, (point) => point.id, {nullable: false})
    @JoinColumn({name: "point1"})
    point1: PanoramaPoint

    @ManyToOne(() => Point, (point) => point.id, {nullable: false})
    @JoinColumn({name: "point2"})
    point2: PanoramaPoint
}