const { Element } = require("../../Element")
const THREE = require('three');

class Line extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        this.material = config_obj.material || new THREE.LineBasicMaterial( { color: 0x0000ff } );
        this.geometry = new THREE.BufferGeometry();

        this.mesh = new THREE.Line( this.geometry, this.material );

        this.datastate.on("updated", ()=>this._reconfigure_from_datastate());

    }

    setup() {

        this._reconfigure_from_datastate();
        this.field.scene.add(this.mesh);

    }

    _reconfigure_from_datastate()
    {
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.BufferGeometry().setFromPoints( this.datastate.data.map((p)=>new THREE.Vector3(p.x,0,p.y)) );
    }

    draw() {}


}

module.exports = Line