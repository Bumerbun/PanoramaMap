import {
    WebGLRenderer, 
    Scene, 
    PerspectiveCamera, 
    TextureLoader, 
    Color,
Raycaster,
Vector2,
} from "three"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { SphereImage } from "./SphereImage"
import { PointArrow } from "./PointArrow"
import { Point } from "./Point"

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
    private readonly mouse: Vector2 = new Vector2()
    private readonly raycaster: Raycaster = new Raycaster()
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    private readonly loader: TextureLoader = new TextureLoader()

    private readonly sphere: SphereImage = new SphereImage()
    private arrows: PointArrow[] = []

    private panoramaPoint: any

    public get element() : HTMLCanvasElement {
        return this.renderer.domElement
    }

    constructor(width: number, height: number, window: Window){
        this.setSize(width, height)
        this.window = window
        this.renderer.setClearColor(new Color(0x500000))
        this.renderer.autoClear = false;

        this.camera.fov = 20
        this.camera.position.z = -20
        this.controls.minDistance = 0.1
		this.controls.maxDistance = 13
        this.controls.zoomSpeed = 2
		this.controls.rotateSpeed = 0.5

        this.window.addEventListener('click', (event: MouseEvent) => {
            this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera)
            console.log(this.mouse)
            console.log(this.raycaster.intersectObjects(
                this.frontScene.children, true
                //this.arrows.map((elem) => elem.mesh)
                ))
        })

        this.scene.add(this.camera)
        this.scene.add(this.sphere.mesh)
        this.animate()
    }

    public async addArrows(pointID: number | string){
        var response = await fetch(`http://localhost:3000/panoramas/connections/${pointID}`)
        if (!response.ok){
            return
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
        console.log(this.arrows)
    }

    public setSize(width: number, height: number){
        this._width = width
        this._height = height

        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
    }

    public setImage(imagePath : string){
        var texture = this.loader.load(`http://localhost:3000/static/images/${imagePath}` ,() => this.render())
        this.sphere.texture = texture
        this.render()
    }

    public async setPoint(_pointID: number | string){
        var response = await fetch(`http://localhost:3000/panoramas/${1}`)
        if (!response.ok){
            return
        }
        var pointData = await response.json()
        this.panoramaPoint = pointData
        console.log(this.panoramaPoint)
        this.setImage(pointData.imagePath)
        this.addArrows(pointData.id)
    }

    private render(): void{
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
        this.renderer.clearDepth()
        this.renderer.render(this.frontScene, this.camera)
    }

    private animate(): void{
        this.window.requestAnimationFrame(() => this.animate())
        this.camera.updateProjectionMatrix()
        this.controls.update()
        this.render()
    }
    
    
}