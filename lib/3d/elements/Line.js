const { Element } = require("../../Element")
const THREE = require('three');

class Line extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        this.material = config_obj.material || new THREE.LineBasicMaterial( { color: 0x0000ff } );
        this.geometry = new THREE.BufferGeometry();

        this.mesh = new THREE.Line( this.geometry, this.material );

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
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.BufferGeometry().setFromPoints( this.datastate.data.map((p)=>new THREE.Vector3(p.x, p.y, p.z)) );
    }

    draw() {}


}

module.exports = Line