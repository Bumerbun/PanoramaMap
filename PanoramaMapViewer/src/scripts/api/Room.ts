import { Point } from "./Point"
import { ObjectParser } from "../ObjectParser"

export class Room {
    id: number
    name: string
    description: string
    public readonly points: Point[] = []

    constructor(id: number){
        this.id = id
    }

    public async parse(){
        const response = await fetch(`http://localhost:3000/rooms/one/${this.id}?points=1`)
        if (!response.ok){
            throw new Error("room fetch fail")
        }
        const roomData = await response.json()
        ObjectParser.fillFromJson(this, roomData)
        for (var i= 0; i < roomData.roompoints.length; i++){
            const point = Point.fromJson(roomData.roompoints.at(i).point)
            this.points.push(point)
        }
        return this
    }
}