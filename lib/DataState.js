const uuid = require('uuid').v4;
const EventEmitter=require("events").EventEmitter;

class DataState extends EventEmitter {
    constructor() {

        super();

        this.id = uuid()
        this.data = [];
        this._is_updated = true;

    }

    get is_updated() {
        return this._is_updated;
    }
    set is_updated(value) {
        this._is_updated = !!value;
        if (value)
            this.emit("updated");
    }
}


//These need to all be added indevidually to prevent circular import problems
module.exports.DataState = DataState;

module.exports.TimeSince = require("./datastates/TimeSince")
module.exports.MatrixRGBBottomCenter = require("./datastates/MatrixRGBBottomCenter")
module.exports.Path = require("./datastates/Path")
module.exports.Point = require("./datastates/Point")
module.exports.Grid = require("./datastates/Grid")
module.exports.Pose = require("./datastates/Pose")
module.exports.Covariance2d = require("./datastates/Covariance2d")
module.exports.SingleValue = require("./datastates/SingleValue")
module.exports.Trajectory = require("./datastates/Trajectory")
module.exports.FlowChart = require("./datastates/FlowChart")

module.exports.V3D = {
    Point: require("./3d/datastates/Point"),
    Pose: require("./3d/datastates/Pose"),
    Path: require("./datastates/Path"), // Same, as it just stores points
}

