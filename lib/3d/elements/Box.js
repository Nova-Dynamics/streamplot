const { Element } = require("../../Element")
const THREE = require('three');

class Box extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        this.width = config_obj.width || 1;
        this.height = config_obj.height || 1;
        this.depth = config_obj.depth || 1;
        this.material = config_obj.material || new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.datastate.on("updated", ()=>this._reconfigure_from_datastate());

    }

    setup() {

        this._reconfigure_from_datastate();
        this.field.scene.add(this.mesh);

    }

    _reconfigure_from_datastate()
    {
        this.mesh.position.set(this.datastate.x, this.datastate.y, this.datastate.z);
    }

    draw() {

    }


}

module.exports = Box
