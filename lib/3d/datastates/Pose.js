const Point = require("./Point")


class Pose extends Point {

    constructor({yaw=0,pitch=0,roll=0}={}) {
        super();

        this._yaw=yaw;
        this._pitch=pitch;
        this._roll=roll;

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

    copy_to(other)
    {
        other.x = this.x;
        other.y = this.y;
        other.z = this.z;

        other.yaw = this.yaw;
        other.pitch = this.pitch;
        other.roll = this.roll;
    }

}

module.exports = Pose
