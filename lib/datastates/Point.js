const { DataState } = require("../DataState")


class Point extends DataState {

    constructor() {
        super();

        this._x=null
        this._y=null

    }

    set x(v) { this.is_updated = true; this._x = v }
    get x() { return this._x }

    set y(v) { this.is_updated = true; this._y = v }
    get y() { return this._y }


    copy_to(other)
    {
        other.x = this.x;
        other.y = this.y;
    }

}

module.exports = Point
