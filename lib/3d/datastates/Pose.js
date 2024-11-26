const Point = require("./Point")


function apply_inv(matrix, vec) {

    let out = [0, 0, 0];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            out[i] += matrix[j][i] * vec[j];
        }
    }

    return out;
}


class Pose extends Point {

    constructor({ yaw = 0, pitch = 0, roll = 0 } = {}) {
        super();

        this._yaw = yaw;
        this._pitch = pitch;
        this._roll = roll;

    }

    set yaw(v) {
        this.is_updated = true;
        this._yaw = v
    }

    get yaw() { return this._yaw }

    set pitch(v) {
        this.is_updated = true;
        this._pitch = v
    }

    get pitch() { return this._pitch }

    set roll(v) {
        this.is_updated = true;
        this._roll = v
    }

    get roll() { return this._roll }

    copy_to(other) {
        other.x = this.x;
        other.y = this.y;
        other.z = this.z;

        other.yaw = this.yaw;
        other.pitch = this.pitch;
        other.roll = this.roll;
    }

    from_homo(homo) {

        // Ensure the matrix is 4x4
        if (homo.length !== 4 || homo[0].length !== 4) {
            throw new Error("The input matrix must be 4x4.");
        }


        this._pitch = Math.asin( Math.max(Math.min(homo[1][2], 1), -1));
        this._roll = Math.atan2(-homo[0][2], homo[2][2]);
        this._yaw = Math.atan2(homo[1][0], homo[1][1]);

        let vec = [ homo[0][3], homo[1][3], homo[2][3]]

        vec = apply_inv(homo, vec);
    
        this._x = -vec[0];
        this._y = -vec[1];
        this._z = -vec[2];

        this.is_updated = true;

    }



}

module.exports = Pose
