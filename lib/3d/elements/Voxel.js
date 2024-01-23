const { Element } = require("../../Element")
const THREE = require('three');

class Voxel extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        this.size = config_obj.size || 1;
        this.material = config_obj.material;
        this.geometry = config_obj.geometry;

        this.wireframe = config_obj.wireframe;
        this.class_id = config_obj.class_id;

        this.mesh = config_obj.mesh;

        this.free_indices = config_obj.free_indices;
        this.instance_index = config_obj.free_indices.pop();
        
        this.draw_lines = config_obj.lines;

        if (this.draw_lines)
        {
            this.line_material = config_obj.line_material;
            this.line = new THREE.LineSegments( this.wireframe, this.line_material );
        }


        this.datastate.on("updated", ()=>this._reconfigure_from_datastate());

    }

    setup() {

        this._reconfigure_from_datastate();
        
        this.field.scene.add(this.mesh);

        // if (this.draw_lines)
        //     this.field.scene.add(this.line);

    }

    _reconfigure_from_datastate()
    {

        let matrix = new THREE.Matrix4();
        matrix.setPosition(-this.datastate.x, this.datastate.z, this.datastate.y);
        this.mesh.setMatrixAt(this.instance_index, matrix);
        this.mesh.instanceMatrix.needsUpdate = true;

        //this.mesh.position.set(-this.datastate.x, this.datastate.z, this.datastate.y);

        // if (this.draw_lines)
        //     this.line.position.set(-this.datastate.x, this.datastate.z, this.datastate.y);
    }

    remove()
    {
        this.field.scene.remove(this.mesh);
        if (this.draw_lines)
            this.field.scene.remove(this.line);

        this.free_indices.push(this.instance_index);
    }   

    draw() {

    }


    static generate_config( color, voxel_size, class_count, opacity=1, lines=false)
    {
        let material = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity: opacity, depthWrite: false });
        let geometry = new THREE.BoxGeometry(voxel_size, voxel_size, voxel_size);
        let wireframe = new THREE.WireframeGeometry(geometry, 15);
        let line_material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        let mesh = new THREE.InstancedMesh(geometry, material, class_count+1);

        let config = {
        material: material,
        geometry: geometry,
        mesh: mesh,
        wireframe: wireframe,
        line_material: line_material,
        size: voxel_size,
        lines: lines,
        current_instance: 0
        }

        return config;
    }

}

module.exports = Voxel
