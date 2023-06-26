import { Vector2 } from "three";
import { CanvasControl } from "./CanvasControl"
import { IDelegate, DelegateBuilder } from "../../DelegateBuilder"

export class ClickParams{
    windowPoint: Vector2
    canvasPoint: Vector2
    mouseevent: MouseEvent

}

export class ClickControl{
    public clickable: Boolean = true
    public canvasControl: CanvasControl
    public sender: any
    private clickEvents : DelegateBuilder = new DelegateBuilder()
    private mousemoveEvents : DelegateBuilder = new DelegateBuilder()
    constructor(sender: any, canvasControl: CanvasControl){
        this.sender = sender
        this.canvasControl = canvasControl

        window.addEventListener('click', (event: MouseEvent) => {
            if (this.clickable == false){
                return
            }
            const windowPoint = new Vector2(event.pageX, event.pageY)
            const canvasPoint = this.canvasControl.getCanvasPoint(windowPoint)
            if (!canvasPoint){
                    return
            }

            const clickParams = new ClickParams()
            clickParams.windowPoint = windowPoint
            clickParams.canvasPoint = canvasPoint
            clickParams.mouseevent = event
            this.clickEvents.invoke(this.sender, clickParams)
            
        })

        window.addEventListener('mousemove', (event: MouseEvent) =>{
            const windowPoint = new Vector2(event.pageX, event.pageY)
            const canvasPoint = this.canvasControl.getCanvasPoint(windowPoint)
            if (!canvasPoint){
                    return
            }
            const clickParams = new ClickParams()
            clickParams.windowPoint = windowPoint
            clickParams.canvasPoint = canvasPoint
            clickParams.mouseevent = event
            this.mousemoveEvents.invoke(this.sender, clickParams)
        })
        window.addEventListener('mousedown', (_e) => {
            this.clickable = true
        })
        window.addEventListener('mousemove', (_e) => {
            if (this.clickable == true){
                this.clickable = false
            }
        })
    }
    
    public addOnClick(caller : IDelegate){ 
        this.clickEvents.add(caller)
    }
    public addOnMouseMove(caller : IDelegate){ 
        this.mousemoveEvents.add(caller)
    }
}