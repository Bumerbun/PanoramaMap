import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomPoint } from "./RoomPoint";

@Entity()
export class Room{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "varchar",
        length: 100,
        name: "name", 
        nullable: true})
    name: string | null

    @Column({
        type: "text",
        name: "desciption", 
        nullable: true})
    description: string | null;

    @OneToMany(() => RoomPoint, (rpoint) => rpoint.room)
    roompoints: RoomPoint[]
}