import {
    WebGLRenderer, 
    Scene, 
    PerspectiveCamera, 
    TextureLoader, 
    Color,
} from "three"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { SphereImage } from "./SphereImage"
import { PointArrow } from "./PointArrow"

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
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    private readonly loader: TextureLoader = new TextureLoader()

    private readonly sphere: SphereImage = new SphereImage()
    private arrows: PointArrow[]

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

        this.scene.add(this.camera)
        this.scene.add(this.sphere.mesh)
        this.animate()
    }

    public async addArrows(pointID: number | string){
        var response = await fetch(`http://localhost:3000/panoramas/connections/${pointID}`)
        if (!response.ok){
            return
        }
        console.log(this.arrows)

        var pointArrow = new PointArrow()
        this.frontScene.add(pointArrow.mesh)
        var pointArrow2 = new PointArrow()
        this.frontScene.add(pointArrow2.mesh)
        
        var farness = 3.7
        pointArrow.mesh.position.set(farness, -1, farness)
        pointArrow2.mesh.position.set(farness, -1, 0)
        // var point = new Vector3(300, -500 ,300)
        // pointArrow.mesh.lookAt(point)
        //var angle = this.scene.position.angleTo(pointArrow.mesh.position)
        pointArrow.mesh.rotation.setFromVector3(this.scene.position.multiplyScalar(-1))
        pointArrow.mesh.rotateX(Math.PI / 2)
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
        var response = await fetch(`http://localhost:3000/panoramas`)
        if (!response.ok){
            return
        }
        var pointData = (await response.json())[0]
        this.panoramaPoint = pointData
        console.log(this.panoramaPoint)
        this.setImage(pointData.imagePath)


        

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