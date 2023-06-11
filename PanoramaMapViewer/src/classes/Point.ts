
export class Point{
    id: number;
    x: number
    y: number
    z: number
    imagePath: string
    pointName: string
    description: string

    constructor(pointId?: number){
        if (pointId){
            this.id = pointId
        }
    }

    public async parsePoint():Promise<Point>{
        const response = await fetch(`http://localhost:3000/panoramas/one/${this.id}`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }
        var point = await response.json()
        const properties = Object.getOwnPropertyNames(this)
        for (let i = 0; i < properties.length; i++){
            if (point[properties[i]] != null){
                (this as any)[`${properties[i]}`] = point[properties[i]]
            }
        }
        return this
    }

    public async getAllPoints(){
        const response = await fetch(`http://localhost:3000/panoramas/`)
        if (!response.ok){
            throw new Error("panorama fetch fail")
        }

    }
}