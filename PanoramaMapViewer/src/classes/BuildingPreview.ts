import {Color, PerspectiveCamera, Scene, WebGLRenderer } from "three"
//import { ZoomControl } from "./ZoomControl"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { PointArrow } from "./PointArrow"
import { Point } from "./Point"



export class BuildingPreview{
    private window: Window
    private readonly renderer: WebGLRenderer = new WebGLRenderer()
    private readonly scene: Scene = new Scene()
    private readonly camera: PerspectiveCamera = new PerspectiveCamera()
    private connectedCamera: PerspectiveCamera
    //private readonly zoomControl: ZoomControl = new ZoomControl(this.camera)
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    public get element() : HTMLCanvasElement {
        return this.renderer.domElement
    }
    private readonly points: PointArrow[] = []

    public constructor(width:number, height: number, window: Window, connectedCamera: PerspectiveCamera){
        this.window = window
        this.connectedCamera = connectedCamera
        this.renderer.setSize(width, height)
        this.renderer.setClearColor(new Color(0x500000))
        this.renderer.autoClear = false;
        this.camera.position.z = -100
        this.scene.add(this.camera)

        this.animate()
    }

    public async setPoints(){
        var response = await fetch(`http://localhost:3000/panoramas/columns?columnname=id`)
        if (!response.ok){
            return
        }
        var pointids = await response.json()
        for (let i = 0; i < pointids.length; i++){
            const point = await new Point(pointids.at(i).panorama_id).parsePoint()
            const arrow = new PointArrow(point)
            arrow.mesh.position.set(point.x, point.y, point.z)
            this.points.push(arrow)
            this.scene.add(arrow.mesh)
        }
    }


    private render(): void{
        this.renderer.render(this.scene, this.camera)
    }

    private animate(): void{
        this.window.requestAnimationFrame(() => this.animate())
        this.camera.setRotationFromQuaternion(this.connectedCamera.quaternion)
        this.camera.updateProjectionMatrix()
        this.controls.update()
        this.render()
    }

    
    
}