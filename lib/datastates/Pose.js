const Point = require("./Point")


class Pose extends Point {

    constructor() {
        super();

        this._heading=null

    }

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
