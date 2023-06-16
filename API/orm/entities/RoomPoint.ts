import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Point } from "./Point";
import { Room } from "./Room";


@Entity()
export class RoomPoint{
    
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Point,(point) => point.id, {nullable: false})
    @JoinColumn()
    point: Point

    @ManyToOne(() => Room, (room) => room.id, {nullable: false})
    @JoinColumn()
    room: Room
}