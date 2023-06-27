import {PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three"
//import { ZoomControl } from "./ZoomControl"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { PointObject } from "./PointObject"
import { Point } from "../api/Point"
import { PanoramaViewer } from "./PanoramaViewer"
import { Room } from "../api/Room"
import { RoomObject } from "./RoomOject"
import { CanvasControl } from "./controls/CanvasControl"



export class BuildingPreview{
    private window: Window
    private readonly renderer: WebGLRenderer = new WebGLRenderer({alpha: true})
    private readonly scene: Scene = new Scene()
    private readonly camera: PerspectiveCamera = new PerspectiveCamera()
    private connectedViewer: PanoramaViewer
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    public get element() : HTMLCanvasElement {
        return this.renderer.domElement
    }
    private readonly points: PointObject[] = []
    private readonly rooms: RoomObject[] = []
    private canvasControl: CanvasControl
    private htmlElement?: HTMLElement

    public constructor(window: Window, canvasControl: CanvasControl, htmlElement?: HTMLElement, connectedViewer?: PanoramaViewer){
        this.window = window
        this.canvasControl = canvasControl
        if (htmlElement){
            this.htmlElement = htmlElement
        }
        if (connectedViewer){
            this.connectedViewer = connectedViewer
        }
        this.resizeCanvasToDisplaySize()
        this.renderer.setClearColor(0x000000, 0.3)
        this.renderer.autoClear = false;
        this.camera.position.z = -30
        this.controls.minDistance = 0.1
		this.controls.maxDistance = 2000
        this.scene.background = null
        this.scene.add(this.camera)

        this.animate()
    }

    public async setPoints(){
        var response = await fetch(`http://localhost:3000/panoramas/columns?columnname=id`)
        if (!response.ok){
            return
        }
        var tempCanvasControl = new CanvasControl(this.element, this.canvasControl.offsetElement)
        var pointids = await response.json()
        for (let i = 0; i < pointids.length; i++){
            const point = await new Point(pointids.at(i).panorama_id).parsePanorama()
            const arrow = new PointObject(point, tempCanvasControl, this.camera)
            arrow.clickControl.addOnClick((sender: PointObject, _parameters: any) => {
                
                if (sender.isPointOver){
                    this.connectedViewer.setPoint(sender.point.id)
                }
            })
            arrow.mesh.position.set(-point.x, point.y + 1.7, point.z)
            arrow.mesh.material.depthTest = true
            arrow.mesh.geometry.scale(3,3,3)
            this.points.push(arrow)
            this.scene.add(arrow.mesh)
        }

        // const center = this.scene.children.map((e) => e.position).reduce((s, n) => s.add(n), new Vector3()).divideScalar(this.scene.children.length)
        // this.controls.target = center
    }

    public async setBuildings(){
        var response = await fetch(`http://localhost:3000/rooms/columns?columnname=id`)
        if (!response.ok){
            return
        }
        const roomsids = await response.json()
        for (let i = 0; i < roomsids.length; i++){
            const room = await new Room(roomsids.at(i).room_id).parse()
            const roomObject = new RoomObject(room)
            this.rooms.push(roomObject)
            this.scene.add(roomObject.group)
        }

        const center = this.scene.children.map((e) => e.position).reduce((s, n) => s.add(new Vector3(+n.x, +n.y, +n.z)), new Vector3()).divideScalar(this.scene.children.length)
        this.controls.target = center
    }


    private render(): void{
        //this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
    }

    private animate(): void{
        this.window.requestAnimationFrame(() => this.animate())
        this.resizeCanvasToDisplaySize()
        //this.camera.setRotationFromQuaternion(this.connectedViewer.camera.quaternion)
        this.camera.updateProjectionMatrix()
        this.controls.update()
        this.render()
    }

    private resizeCanvasToDisplaySize() {
        var width = this.canvasControl.offsetElement.clientWidth;
        var height = this.canvasControl.offsetElement.clientHeight;
        if (this.htmlElement){
            width = this.htmlElement.clientWidth
            height = this.htmlElement.clientHeight
        }
        if (this.element.width !== width || this.element.height !== height) {
            this.element.width = width
            this.element.height = height
            this.renderer.setSize(this.element.width, this.element.height, false)
            this.camera.aspect = this.element.width / this.element.height
        }
      }
    
    
}