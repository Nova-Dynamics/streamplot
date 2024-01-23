const { Element } = require("../../Element")
const THREE = require('three');

class Voxel {
    constructor(position, config_obj = {}, color=null) {

        this.position = position;

        this.size = config_obj.size || 1;

        this.material = config_obj.material;
        this.geometry = config_obj.geometry;

        this.class_id = config_obj.class_id;

        this.mesh = config_obj.mesh;

        this.free_indices = config_obj.free_indices;
        this.instance_index = config_obj.free_indices.pop();


        let matrix = new THREE.Matrix4();
        matrix.setPosition(-this.position.x, this.position.z, this.position.y);
        this.mesh.setMatrixAt(this.instance_index, matrix);

        if (color) 
        {
            this.mesh.setColorAt(this.instance_index, new THREE.Color(color));
        } else {
            this.mesh.setColorAt(this.instance_index, this.material.color);
        }

        this.color = color;

        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
    }

    remove() {
        this.free_indices.push(this.instance_index);
        const matrix = new THREE.Matrix4();
        this.mesh.setMatrixAt(this.instance_index, matrix);
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    set_color(color) {
        this.mesh.setColorAt(this.instance_index, new THREE.Color(color));
        this.mesh.instanceColor.needsUpdate = true;
    }

}



class VoxelMap extends Element {
    constructor(datastate, config_obj = { voxel_size: 1 }) {
        super(datastate, config_obj);

        this.voxel_size = config_obj.voxel_size;
        this.lines_width = config_obj.lines_width || 1;

        this.classes = {};

        this.map = {};

        // Generate our voxel texture
        const width = 50;
        const height = 50;

        const cx = width / 2;
        const cy = height / 2;

        const size = width * height;
        const data = new Uint8Array(4 * size);

        for (let i = 0; i < size; i++) {
            const stride = i * 4;

            let x = i % width;
            let y = Math.floor(i / width);

            let dist_center_x = Math.abs(x - cx);
            let dist_center_y = Math.abs(y - cy);

            let dist = Math.sqrt(dist_center_x * dist_center_x + dist_center_y * dist_center_y);

            let c = 255;

            if (
                x < this.lines_width ||
                y < this.lines_width ||
                x > width - this.lines_width ||
                y > height - this.lines_width) {
                
                c = 50;

            } else if (
                x < this.lines_width+1 ||
                y < this.lines_width+1 ||
                x > width - this.lines_width - 1 ||
                y > height - this.lines_width - 1) {
                
                c = 100;

            } else if (Math.abs(dist_center_x - dist_center_y) <= 2 && (dist) < 6) {

                c = 128;

            }

            data[stride] = c;
            data[stride + 1] = c;
            data[stride + 2] = c;
            data[stride + 3] = 255;

        }

        // used the buffer to create a DataTexture
        this.vox_texture = new THREE.DataTexture(data, width, height);
        this.vox_texture.needsUpdate = true;

        this.datastate.on("updated", ()=>this._reconfigure_from_datastate());
    }

    add_class(class_id, color, max_count, opacity = 1, lines = true, depth_write = true) {
        

        let material = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity: opacity, depthWrite: depth_write });

        if (lines)
            material.map = this.vox_texture;

        let geometry = new THREE.BoxGeometry(this.voxel_size, this.voxel_size, this.voxel_size);
        let mesh = new THREE.InstancedMesh(geometry, material, max_count);

        for (let i = 0; i < max_count; i++) {
            mesh.setColorAt(i, new THREE.Color(color));
        }

        mesh.instanceColor.needsUpdate = true;
        

        this.classes[class_id] = {
            class_id,
            material,
            geometry,
            mesh,
            free_indices: Array.from(Array(max_count).keys())
        }
    }

    remove_voxel(x, y, z) {
        let { vx, vy, vz } = this._voxelize_position(x, y, z);

        let key = this._position_to_key(vx, vy, vz);

        if (this.map[key] != undefined)
            this.map[key].remove();

        this.map[key] = undefined;
    }

    set_voxel(x, y, z, class_id, color=null) {

        let { vx, vy, vz } = this._voxelize_position(x, y, z);

        let key = this._position_to_key(vx, vy, vz);

        if (this.map[key] != undefined && this.map[key].class_id == class_id && this.map[key].color == color)
            return;


        if (this.map[key] != undefined)
            this.map[key].remove();

        let voxel = new Voxel({ x: vx, y: vy, z: vz }, this.classes[class_id], color);

        this.map[key] = voxel;
    }

    _voxelize_position(x, y, z) {
        let vx = Math.round(x / this.voxel_size) * this.voxel_size;
        let vy = Math.round(y / this.voxel_size) * this.voxel_size;
        let vz = Math.round(z / this.voxel_size) * this.voxel_size;

        return { vx, vy, vz };
    }

    _position_to_key(x, y, z) {
        let vx = Math.round(x / this.voxel_size);
        let vy = Math.round(y / this.voxel_size);
        let vz = Math.round(z / this.voxel_size);
    
        return `${vx},${vy},${vz}`;
    }

    setup() {

        for (let class_id in this.classes) {
            this.field.scene.add(this.classes[class_id].mesh);
        }

    }

    _reconfigure_from_datastate()
    {
        for (let class_id in this.classes) {
            this.classes[class_id].mesh.position.set(-this.datastate.x, this.datastate.z, this.datastate.y)
        }
    }



    draw() {

    }



}

module.exports = VoxelMap