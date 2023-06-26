import { Intersection, Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { IDelegate, DelegateBuilder } from "../../DelegateBuilder";

export class RaycasterParams{
    intersectedObjects: Intersection[]
}

export class RaycasterControl{

    private readonly raycaster: Raycaster = new Raycaster()
    public camera: PerspectiveCamera
    public sender: any
    public desiredObjects: Object3D[]
    private intersectEvents : DelegateBuilder = new DelegateBuilder(); 


    constructor(sender: any, camera: PerspectiveCamera, desiredObjects: Object3D[]){
        this.camera = camera
        this.sender = sender;
        this.desiredObjects = desiredObjects
    }

    public raycast(point: Vector2){
        this.raycaster.setFromCamera(point, this.camera)
        const intersections = this.raycaster.intersectObjects(this.desiredObjects)
        const raycasterParams = new RaycasterParams()
        raycasterParams.intersectedObjects = intersections
        this.intersectEvents.invoke(this.sender, raycasterParams)
        return intersections
    }

    public addOnIntersaction(caller : IDelegate){ 
        this.intersectEvents.add(caller)
    }
}