
import { SphereGeometry, Mesh, MeshBasicMaterial, Vector3, Color, PerspectiveCamera } from "three";
import { Point } from "../api/Point";
import { ClickParams, ClickControl } from "./controls/ClickControl";
import { RaycasterParams, RaycasterControl } from "./controls/RaycasterControl";
import { CanvasControl } from "./controls/CanvasControl";


export class PointObject {
    public readonly mesh: Mesh<SphereGeometry, MeshBasicMaterial> = new Mesh();
    public point: Point
    public pointVector: Vector3
    public clickControl: ClickControl
    public raycasterControl: RaycasterControl
    public canvasControl: CanvasControl | undefined
    public camera: PerspectiveCamera | undefined

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
    constructor(point: Point, canvasControl?: CanvasControl, camera?: PerspectiveCamera){
        this.canvasControl = canvasControl
        this.camera = camera
        this.mesh.geometry = new SphereGeometry(1)
        this.mesh.geometry.scale(0.2,0.2,0.2)
        this.mesh.material = new MeshBasicMaterial({color: "#772222", depthTest: false})
        this.mesh.renderOrder = 999;

        this.point = point
        this.pointVector = new Vector3(point.x, point.y, point.z)


        if (this.canvasControl){
            this.clickControl = new ClickControl(this, this.canvasControl)
        }
        if (this.camera){
            this.raycasterControl = new RaycasterControl(this, this.camera, [this.mesh]) 
        }
        if (this.canvasControl && this.camera){
            this.clickControl.addOnMouseMove((_sender: PointObject, parameters: ClickParams) => {
                this.raycasterControl.raycast(parameters.canvasPoint)
            })
            this.raycasterControl.addOnIntersaction((_sender: PointObject, parameters: RaycasterParams) => {
                this.isPointOver = parameters.intersectedObjects.length != 0
            })
        }
    }
}