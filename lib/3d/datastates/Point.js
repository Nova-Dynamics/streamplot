const { DataState } = require("../../DataState")


class Point extends DataState {

    constructor({x=0,y=0,z=0}={}) {
        super();

        this._x=x;
        this._y=y;
        this._z=z;

    }

    set x(v) { this.is_updated = true; this._x = v }
    get x() { return this._x }

    set y(v) { this.is_updated = true; this._y = v }
    get y() { return this._y }

    set z(v) { this.is_updated = true; this._z = v }
    get z() { return this._z }


    copy_to(other)
    {
        other.x = this.x;
        other.y = this.y;
        other.z = this.z;
    }

}

module.exports = Point
