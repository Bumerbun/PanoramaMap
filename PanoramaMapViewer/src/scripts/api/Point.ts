import { Vector3 } from "three";
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
    imageRotation: number
    pointName: string
    description: string

    public get position(){
        return new Vector3(+this.x, +this.y, +this.z)
    }

    constructor(pointId: number, {json}: IPoint = {}){
        this.id = pointId

        if (json){
            ObjectParser.fillFromJson(this, json)
        }
    }
    public async parsePanorama() {
        const response = await fetch(`http://localhost:3000/panoramas/one/${this.id}?point=1&connections=1`)
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
    public async parse():Promise<Point>{
        const response = await fetch(`http://localhost:3000/panoramas/point/${this.id}?connections=1`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }
        const panorama = (await response.json()).at(0)
        ObjectParser.fillFromJson(this, panorama)
        ObjectParser.fillFromJson(this, panorama.point)
        return this
    }

    public static fromJson(json : any){
        return new Point(0, {json: json})
    }

    public static async getAll(){
        const response = await fetch(`http://localhost:3000/panoramas/`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }
        var pointids = (await response.json()) as any[]
        const points = await Promise.all(pointids.map(async (item) => await new Point(item.panorama_id).parse())) 
        return points
    }
}