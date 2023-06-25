import {
    SphereGeometry, 
    MeshBasicMaterial, 
    Mesh, 
    Texture
} from "three";

export class SphereImage{
    public readonly mesh: Mesh<SphereGeometry, MeshBasicMaterial> = new Mesh();
    private _texture: Texture = new Texture();
    public get texture(): Texture {
        return this._texture
    }
    public set texture(newTexture: Texture){
        this._texture = newTexture;
        this.mesh.material = new MeshBasicMaterial({map: newTexture})
    }

    constructor(){
        this.mesh.geometry = new SphereGeometry(5)
        this.mesh.geometry.scale(-1,1,1)
        this.mesh.material = new MeshBasicMaterial();
    }

}