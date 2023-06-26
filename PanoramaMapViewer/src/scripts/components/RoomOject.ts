import {EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { Room } from "../api/Room";
export class RoomObject {
    public readonly mesh: Mesh<ConvexGeometry, MeshBasicMaterial> = new Mesh()
    public readonly edges: LineSegments = new LineSegments()
    public readonly group: Group = new Group()
    public room: Room
    public get position(): Vector3 {
        var sum = this.room.points.at(0)?.position
        if (!sum){
            return new Vector3()
        }
        const length = this.room.points.length
        for (let i = 1; i < length; i++){
            sum.x = (+sum.x + +this.room.points[i].x)
            sum.y = (+sum.y + +this.room.points[i].y)
            sum.z = (+sum.z + +this.room.points[i].z)
        }
        return new Vector3(sum.x / length, sum.y / length, sum.z / length,)
    }
    
    constructor(room: Room){
        this.room = room

        var average = this.room.points.map((elem) => +elem.x + +elem.y + +elem.z)
                                    .reduce((prev, current) => prev + current, 0) / (this.room.points.length * 3)
        console.log(average)
        const geometry = new ConvexGeometry(this.room.points.map((elem) => new Vector3(elem.position.x, elem.position.y, elem.position.z).subScalar(0)))
        this.mesh.geometry = geometry
        this.mesh.geometry.scale(1,1,1)
        const material = new MeshBasicMaterial({color: "#BBBBFF", transparent: true, opacity: 0.2})
        this.mesh.material = material
        this.group.add(this.mesh)

        const edgesGeometry = new EdgesGeometry(this.mesh.geometry)
        const edgesmaterial = new LineBasicMaterial({color: "#000077"})
        this.edges.geometry = edgesGeometry
        this.edges.material = edgesmaterial
        this.group.add(this.edges)
    }
    
}