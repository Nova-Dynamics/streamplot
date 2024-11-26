const { Element } = require("../../Element")
const THREE = require('three');
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

class Mesh extends Element {
    constructor(datastate, obj_path, config_obj={}) {
        super(datastate, config_obj);

        // this.material = config_obj.material || new THREE.MeshStandardMaterial({ color: 0xffffff });
        // this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        // this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.obj_path = obj_path;

        let update_func = ()=>this._reconfigure_from_datastate();
        this.datastate.on("updated", update_func);
        this._remove_update_func = ()=>this.datastate.off("updated", update_func);

    }

    async setup() {

        await this._load_mesh();

        this._reconfigure_from_datastate();
        this.field.scene.add(this.mesh);

    }

    async destroy() {
        this._remove_update_func();
        this.field.scene.remove(this.mesh);
    }

    _reconfigure_from_datastate()
    {
        if (!this.mesh) return;

        this.mesh.position.set(this.datastate.x, this.datastate.y, this.datastate.z);
        this.mesh.rotation.setFromVector3(
            new THREE.Vector3(this.datastate.pitch, this.datastate.roll, -this.datastate.yaw ),
            "ZXY"
            );
    }   

    async _load_mesh()
    {
        return new Promise((resolve, reject) => {
            let mtl_loader = new MTLLoader();

            mtl_loader.load(this.obj_path.split('.')[0] + ".mtl", (mtl) => {
                mtl.preload();
    
                let obj_loader = new OBJLoader();
                obj_loader.setMaterials(mtl);
    
                obj_loader.load(this.obj_path, (obj) => {
                    this.mesh = obj;
                    resolve();
                });
    
            });
        });
    }

    draw() {

    }


}

module.exports = Mesh
