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
    maxZoom: number
    minZoom: number
    zoomSpeed: number = 1
    public canvas?: HTMLCanvasElement
    private camera: PerspectiveCamera
    
    constructor(camera: PerspectiveCamera, canvas?: HTMLCanvasElement){
        this.maxZoom = this.zoom
        this.minZoom = this.zoom
        this.camera = camera
        if (canvas){
            this.canvas = canvas
        }

        window.addEventListener("wheel", (event: WheelEvent) => {
            const tempZoom = this.zoom + (event.deltaY / (100 / this.zoomSpeed))
            var isPointValid = true
            if (this.canvas)
                isPointValid = CanvasControl.isCanvasPointValid(new Vector2(event.pageX, event.pageY), this.canvas)
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