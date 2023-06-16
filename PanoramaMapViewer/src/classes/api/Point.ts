import { ObjectParser } from "../ObjectParser";

interface IPoint {
    pointId?: number
    json?: any
}

export class Point{
    id: number;
    x: number
    y: number
    z: number
    imagePath: string
    pointName: string
    description: string

    constructor({pointId, json}: IPoint){
        if (pointId){
            this.id = pointId
        }
        if (json){
            ObjectParser.fillFromJson(this, json)
        }
    }

    public async parsePoint():Promise<Point>{
        const response = await fetch(`http://localhost:3000/panoramas/one/${this.id}?point=1`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }
        const panorama = await response.json()
        ObjectParser.fillFromJson(this, panorama)
        const response2 = await fetch(`http://localhost:3000/points/one/${panorama.point.id}`)
        const point = await response2.json()
        ObjectParser.fillFromJson(this, point)
        return this
    }

    public async getAllPoints(){
        const response = await fetch(`http://localhost:3000/panoramas/`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }

    }
}