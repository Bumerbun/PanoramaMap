//import 'reflect-metadata';
//import { plainToClass } from 'class-transformer';

import { SphereGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { Point } from "./Point";


export class PointArrow{
    public readonly mesh: Mesh<SphereGeometry, MeshBasicMaterial> = new Mesh();
    public point: Point
    public pointVector: Vector3
    constructor(point: Point){
        this.mesh.geometry = new SphereGeometry(1)
        this.mesh.geometry.scale(0.5,0.5,0.5)
        this.mesh.material = new MeshBasicMaterial({color: "#336666"})

        this.point = point

        this.pointVector = new Vector3(point.x, point.y, point.z)
    }
}