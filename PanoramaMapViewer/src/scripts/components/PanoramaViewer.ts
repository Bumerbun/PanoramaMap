import {
    WebGLRenderer, 
    Scene, 
    PerspectiveCamera, 
    TextureLoader, 
    Color,
    Vector3,
    Cache
} from "three"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { SphereImage } from "./SphereImage"
import { PointObject } from "./PointObject"
import { Point } from "../api/Point"
import { ZoomControl } from "./controls/ZoomControl"
import { CanvasControl } from "./controls/CanvasControl"

export class PanoramaViewer {
    private window: Window
    private readonly renderer: WebGLRenderer = new WebGLRenderer()
    private readonly scene: Scene = new Scene()
    private readonly frontScene: Scene = new Scene()
    public readonly camera: PerspectiveCamera = new PerspectiveCamera()
    public readonly canvasControl: CanvasControl = new CanvasControl(this.element, this.element)
    public readonly zoomControl: ZoomControl = new ZoomControl(this.camera, this.canvasControl)
    private readonly controls: OrbitControls = new OrbitControls(this.camera, this.element)
    private readonly loader: TextureLoader = new TextureLoader()

    private readonly sphere: SphereImage = new SphereImage()
    private arrows: PointObject[] = []
    private clickable: boolean = true

    private panoramaPoint: Point

    public get element() : HTMLCanvasElement {
        return this.renderer.domElement
    }

    constructor(container: Element, window: Window){
        this.canvasControl.offsetElement = container
        this.window = window
        this.resizeCanvasToDisplaySize()
        this.renderer.setClearColor(new Color(0x500000))
        this.renderer.autoClear = false;

        this.camera.fov = 80
        this.zoomControl.zoom = 50
        this.zoomControl.maxZoom = 100
        this.zoomControl.minZoom = 10
        this.camera.position.z = 0
        this.controls.minDistance = 0.1
		this.controls.maxDistance = 0.1
        this.controls.enableZoom = true
        this.controls.zoomSpeed = 2
		this.controls.rotateSpeed = 0.5
        const targetContorPoint = new Vector3(0, 0, 0.001)
        this.controls.target = targetContorPoint
        this.scene.add(this.camera)
        this.scene.add(this.sphere.mesh)
        this.animate()
        this.window.addEventListener('mousedown', (_e) => {
            this.clickable = true
        })
        this.window.addEventListener('mousemove', (_e) => {
            if (this.clickable == true){
                this.clickable = false
            }
        })
    }


    public async addArrows(pointID: number | string)
    {
        var response = await fetch(`http://localhost:3000/panoramas/point/${pointID}?point=1&connections=1`)
        if (!response.ok){
            return
        }
        if (this.arrows.length != 0){
            for (let i = 0; i < this.arrows.length; i++){
                this.arrows[i].mesh.geometry.dispose()
                this.arrows[i].mesh.material.dispose()
                this.frontScene.remove(this.arrows[i].mesh)
            }
            this.arrows.length = 0
        }
        Cache.clear()
        var panorama = await response.json()
        var connections = panorama.at(0).point.pointConnections
        for (let i = 0; i < connections.length; i++){
            var point = Point.fromJson(connections[i].point2)
            var arrow = new PointObject(point, this.canvasControl, this.camera)
            arrow.clickControl.addOnClick((sender: PointObject, _parameters: any) => {
                if (sender.isPointOver){
                    this.setPoint(sender.point.id)
                }
            })
            var normalizedPosition = arrow.pointVector.sub(this.panoramaPoint.position)
            arrow.mesh.position.set(-normalizedPosition.x, normalizedPosition.y, normalizedPosition.z) 
            this.arrows.push(arrow) 
            this.frontScene.add(arrow.mesh)
        }
    }

    public setImage(imagePath : string){
        var texture = this.loader.load(`http://localhost:3000/static/images/${imagePath}` ,
            () => this.render()
        )
        this.sphere.texture.dispose()
        this.sphere.texture = texture
        this.render()
    }

    public async setPoint(pointID: number){
        const point = await new Point(pointID).parse()
        this.panoramaPoint = point
        this.sphere.mesh.rotation.set(0, (Math.PI / 180) * point.imageRotation, 0)
        this.setImage(this.panoramaPoint.imagePath)    
        this.addArrows(this.panoramaPoint.id)
    }

    private render(): void{
        this.resizeCanvasToDisplaySize()
        this.renderer.render(this.scene, this.camera)
        this.renderer.render(this.frontScene, this.camera)
    }

    private animate(): void{
        this.window.requestAnimationFrame(() => this.animate())
        //this.resizeCanvasToDisplaySize()
        this.camera.updateProjectionMatrix()
        this.controls.update()
        this.render()
    }

    private resizeCanvasToDisplaySize() {
        const width = this.canvasControl.offsetElement.clientWidth;
        const height = this.canvasControl.offsetElement.clientHeight;
        if (this.element.width !== width || this.element.height !== height) {
            this.element.width = width
            this.element.height = height
            this.renderer.setSize(this.element.width, this.element.height, false)
            this.camera.aspect = this.element.width / this.element.height
        }
      }
    
    
    
}