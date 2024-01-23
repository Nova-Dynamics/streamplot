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
exports.DataState = DataState;

exports.TimeSince = require("./datastates/TimeSince")
exports.MatrixRGBBottomCenter = require("./datastates/MatrixRGBBottomCenter")
exports.Path = require("./datastates/Path")
exports.Point = require("./datastates/Point")
exports.Pose = require("./datastates/Pose")
exports.Covariance2d = require("./datastates/Covariance2d")
exports.SingleValue = require("./datastates/SingleValue")
exports.Trajectory = require("./datastates/Trajectory")
exports.FlowChart = require("./datastates/FlowChart")

exports.V3D = {
    Point: require("./3d/datastates/Point"),
    Pose: require("./3d/datastates/Pose"),
    Path: require("./datastates/Path"), // Same, as it just stores points
}
module.export = exports
