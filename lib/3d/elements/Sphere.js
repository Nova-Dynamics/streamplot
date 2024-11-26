const { Element } = require("../../Element")
const THREE = require('three');

class Sphere extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        this.radius = config_obj.radius || 1;
        this.material = config_obj.material || new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        let update_func = ()=>this._reconfigure_from_datastate();
        this.datastate.on("updated", update_func);
        this._remove_update_func = ()=>this.datastate.off("updated", update_func);

    }

    setup() {

        this._reconfigure_from_datastate();
        this.field.scene.add(this.mesh);

    }

    async destroy() {
        this._remove_update_func();
        this.field.scene.remove(this.mesh);
    }

    _reconfigure_from_datastate()
    {
        this.mesh.position.set(this.datastate.x, this.datastate.y, this.datastate.z);
    }

    draw() {

    }


}

module.exports = Sphere
