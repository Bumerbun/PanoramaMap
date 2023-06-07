//import 'reflect-metadata';
//import { plainToClass } from 'class-transformer';

import { SphereGeometry, Mesh, MeshStandardMaterial } from "three";


export class PointArrow{
    public readonly mesh: Mesh<SphereGeometry, MeshStandardMaterial> = new Mesh();
    public x: number;
    public y: number;
    public z: number;
    constructor(){
        this.mesh.geometry = new SphereGeometry(1)
        this.mesh.geometry.scale(0.5,0.5,0.5)
        this.mesh.material = new MeshStandardMaterial({color: "#992299"})
        this.mesh.updateMatrix()
    }
}