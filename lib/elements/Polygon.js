const Line = require("./Line")

class Polygon extends Line {
    constructor(axis,config_obj) {
        super(axis,config_obj);
        // Reset defaults to filled with no line
        this.class = config_obj.class || "poly";
        this.fcolor = config_obj.fcolor || "#000000";
        this.scolor = config_obj.scolor || "#00000000";
    }
}

module.exports = Polygon
