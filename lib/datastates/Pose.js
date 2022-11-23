const { DataState } = require("../DataState")


class Pose extends DataState {

    constructor() {
        super();

        this._x=null
        this._y=null
        this._heading=null

    }

    set x(v) { this.is_updated = true; this._x = v }
    get x() { return this._x }

    set y(v) { this.is_updated = true; this._y = v }
    get y() { return this._y }

    set heading(v) { 
        this.is_updated = true; 
        this._heading = v 
    }

    get heading() { return this._heading }

    copy_to(other)
    {
        other.x = this.x;
        other.y = this.y;
        other.heading = this.heading;
    }

}

module.exports = Pose
