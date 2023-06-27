import { PerspectiveCamera, Vector2 } from "three"
import { CanvasControl } from "./CanvasControl"


export class ZoomControl{
    private _zoom: number = 50
    public get zoom(){
        return this._zoom
    }
    public set zoom(value: number){
        this._zoom = value
        this.camera.fov = value
    }
    public maxZoom: number
    public minZoom: number
    public zoomSpeed: number = 1
    public isEnabled: boolean = true
    public canvasControl : CanvasControl
    private camera: PerspectiveCamera
    
    constructor(camera: PerspectiveCamera, canvasControl: CanvasControl){
        this.maxZoom = this.zoom
        this.minZoom = this.zoom
        this.camera = camera
        this.canvasControl = canvasControl

        window.addEventListener("wheel", (event: WheelEvent) => {
            if (!this.isEnabled){
                return
            }
            const tempZoom = this.zoom + (event.deltaY / (100 / this.zoomSpeed))
            if(document.elementFromPoint(event.clientX, event.clientY) != this.canvasControl.canvas){
                return
            } 
            var isPointValid = true
            if (this.canvasControl.canvas)
                isPointValid = this.canvasControl.isCanvasPointValid(new Vector2(event.clientX, event.clientY))
            if (!isPointValid)
                return
            this.zoom = tempZoom
            if (tempZoom > this.maxZoom){
                this.zoom = this.maxZoom
                return
            }
            if (tempZoom < this.minZoom){
                this.zoom = this.minZoom
                return
            }
            this.zoom = tempZoom
        })
    }

}