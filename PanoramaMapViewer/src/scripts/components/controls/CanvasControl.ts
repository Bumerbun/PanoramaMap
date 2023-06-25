import { Vector2 } from "three";


export class CanvasControl{
    public static getCanvasPoint(clickPoint: Vector2, canvas: HTMLCanvasElement): Vector2{
        const canvasPoint = new Vector2(
            (((clickPoint.x - canvas.offsetLeft) / canvas.clientWidth ) * 2 - 1),
            (- ((clickPoint.y - canvas.offsetTop) / canvas.clientHeight ) * 2 + 1))
        return canvasPoint
    }

    public static isCanvasPointValid(clickPoint: Vector2, canvas: HTMLCanvasElement): boolean{
        const canvasPoint = this.getCanvasPoint(clickPoint, canvas)
        return !(canvasPoint.x > 1 || canvasPoint.x < -1
                || canvasPoint.y > 1 || canvasPoint.y < -1) 
    }
}