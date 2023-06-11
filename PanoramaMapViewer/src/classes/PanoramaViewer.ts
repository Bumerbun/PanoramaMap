import {
    WebGLRenderer, 
    Scene, 
    PerspectiveCamera, 
    TextureLoader, 
    Color,
Raycaster,
Vector2,
Vector3
} from "three"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { SphereImage } from "./SphereImage"
import { PointArrow } from "./PointArrow"
import { Point } from "./Point"
import { ZoomControl } from "./ZoomControl"
import { CanvasControl } from "./CanvasControl"

export class PanoramaViewer {
    private _width: number = 0
    public get width() : number {
        return this._width
    }
    private _height: number = 0
    public get height() : number {
        return this._height
    }
    private window: Window
    private readonly renderer: WebGLRenderer = new WebGLRenderer()
    private readonly scene: Scene = new Scene()
    private readonly frontScene: Scene = new Scene()
    private readonly camera: PerspectiveCamera = new PerspectiveCamera()
    private readonly zoomControl: ZoomControl = new ZoomControl(this.camera)
    private readonly raycaster: Raycaster = new Raycaster()
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    private readonly loader: TextureLoader = new TextureLoader()

    private readonly sphere: SphereImage = new SphereImage()
    private arrows: PointArrow[] = []
    private clickable: boolean = true
    private caughtArrows: PointArrow[] = []

    private panoramaPoint: Point

    public get element() : HTMLCanvasElement {
        return this.renderer.domElement
    }

    constructor(width: number, height: number, window: Window){
        this.setSize(width, height)
        this.window = window
        this.renderer.setClearColor(new Color(0x500000))
        this.renderer.autoClear = false;

        this.camera.fov = 80
        this.zoomControl.canvas = this.element
        this.zoomControl.zoom = 50
        this.zoomControl.maxZoom = 100
        this.zoomControl.minZoom = 10
        //this.camera.position.z = -20
        this.controls.minDistance = 1
		this.controls.maxDistance = 1
        this.controls.zoomSpeed = 2
		this.controls.rotateSpeed = 0.5
        const targetContorPoint = new Vector3(0, 0, Math.PI / 2)
        this.controls.target = targetContorPoint
        this.camera.lookAt(targetContorPoint)
        this.scene.add(this.camera)
        this.scene.add(this.sphere.mesh)
        this.animate()


        this.window.addEventListener('click', (event: MouseEvent) => {
            if (this.clickable == false){
                return
            }
            const canvasPoint = CanvasControl.getCanvasPoint(new Vector2(event.pageX, event.pageY), this.element)
            if (!CanvasControl.isCanvasPointValid(new Vector2(event.pageX, event.pageY), this.element)){
                    return
            }
            this.raycaster.setFromCamera(canvasPoint, this.camera)
            const rayIntersections =this.raycaster.intersectObjects(this.arrows.map((elem) => elem.mesh)) 
            const arrow = this.arrows.find((elem) => elem.mesh.id == rayIntersections.at(0)?.object.id)
            if (arrow){
                this.setPoint(arrow.point.id)       
            }
        })
        this.window.addEventListener('mousemove', (event: MouseEvent) => {
            const canvasPoint = CanvasControl.getCanvasPoint(new Vector2(event.pageX, event.pageY), this.element)
            if (!CanvasControl.isCanvasPointValid(new Vector2(event.pageX, event.pageY), this.element)){
                    return
            }
            this.raycaster.setFromCamera(canvasPoint, this.camera)
            const rayIntersections =this.raycaster.intersectObjects(this.arrows.map((elem) => elem.mesh)) 
            this.caughtArrows = this.arrows.filter((elem) => elem.mesh.id == rayIntersections.at(0)?.object.id)
            for (let i = 0; i < this.arrows.length; i++){
                if (this.caughtArrows.includes(this.arrows[i])){
                    this.arrows[i].isPointOver = true
                } else{
                    this.arrows[i].isPointOver = false
                }
            }
        })
        this.window.addEventListener('mousedown', (_e) => {
            this.clickable = true
        })
        this.window.addEventListener('mousemove', (_e) => {
            if (this.clickable == true){
                this.clickable = false
            }
        })
    }


    public async addArrows(pointID: number | string){
        var response = await fetch(`http://localhost:3000/panoramas/connections/${pointID}`)
        if (!response.ok){
            return
        }
        if (this.arrows.length != 0){
            for (let i = 0; i < this.arrows.length; i++){
                this.frontScene.remove(this.arrows[i].mesh)
            }
            this.arrows.length = 0
        }
        var connections = await response.json()
        for (let i = 0; i < connections.length; i++){
            if (connections[i].point2 == pointID){
                connections[i].point2 = connections[i].point1
                connections[i].point1 = pointID
            }
            var point =await new Point(connections[i].point2).parsePoint()
            var arrow = new PointArrow(point)
            var normalizedPosition = arrow.pointVector.normalize().multiplyScalar(5)
            arrow.mesh.position.set(normalizedPosition.x, normalizedPosition.y, normalizedPosition.z) 
            this.frontScene.add(arrow.mesh) 
            this.arrows.push(arrow)
        }
    }

    public setSize(width: number, height: number){
        this._width = width
        this._height = height

        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
    }

    public setImage(imagePath : string){
        var texture = this.loader.load(`http://localhost:3000/static/images/${imagePath}` ,
            () => this.render()
        )
        this.sphere.texture = texture
        this.render()
    }

    public async setPoint(_pointID: number){
        const point = await new Point(_pointID).parsePoint()
        this.panoramaPoint = point
        this.setImage(this.panoramaPoint.imagePath)
        this.addArrows(this.panoramaPoint.id)
    }

    private render(): void{
        //this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
        //this.renderer.clearDepth()
        this.renderer.render(this.frontScene, this.camera)
    }

    private animate(): void{
        this.window.requestAnimationFrame(() => this.animate())
        this.camera.updateProjectionMatrix()
        this.controls.update()
        this.render()
    }
    
    
    
}