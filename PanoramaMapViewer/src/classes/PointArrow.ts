
import { SphereGeometry, Mesh, MeshBasicMaterial, Vector3, Color } from "three";
import { Point } from "./api/Point";


export class PointArrow{
    public readonly mesh: Mesh<SphereGeometry, MeshBasicMaterial> = new Mesh();
    public point: Point
    public pointVector: Vector3
    private _isPointOver: boolean = false
    public get isPointOver(){
        return this._isPointOver
    }
    public set isPointOver(value: boolean){
        if (this._isPointOver == value){
            return
        }
        this._isPointOver = value
        if (value == true){
            this.mesh.material.color = this.mesh.material.color.add(new Color("#444444"))
            return
        }
        this.mesh.material.color = this.mesh.material.color.sub(new Color("#444444"))
        
    }
    constructor(point: Point){
        this.mesh.geometry = new SphereGeometry(1)
        this.mesh.geometry.scale(0.3,0.3,0.3)
        this.mesh.material = new MeshBasicMaterial({color: "#772222", depthTest: false})
        this.mesh.renderOrder = 999;

        this.point = point
        this.pointVector = new Vector3(point.x, point.y, point.z)
    }
}