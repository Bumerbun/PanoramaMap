import { Vector2 } from "three";


export class CanvasControl{
    public offsetElement: Element
    public canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement, offsetElement: Element){
        this.offsetElement = offsetElement
        this.canvas = canvas
    }

    public getCanvasPoint(clickPoint: Vector2): Vector2 | null{
        var offsetTop = this.canvas.offsetTop
        var offsetLeft = this.canvas.offsetLeft
        if (this.offsetElement){
            const offsets = this.offsetElement.getBoundingClientRect()
            offsetTop = offsets.top
            offsetLeft = offsets.left
        }
        const canvasPoint = new Vector2(
            (((clickPoint.x - offsetLeft) / this.canvas.clientWidth ) * 2 - 1),
            (- ((clickPoint.y - offsetTop) / this.canvas.clientHeight ) * 2 + 1)
        )
        if ((canvasPoint.x > 1 || canvasPoint.x < -1
                || canvasPoint.y > 1 || canvasPoint.y < -1)) {
                    return null
        }
        return canvasPoint
    }

    public isCanvasPointValid(clickPoint: Vector2): boolean {
        const canvasPoint = this.getCanvasPoint(clickPoint)
        return canvasPoint != null
    }
}