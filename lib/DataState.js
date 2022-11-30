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


exports["DataState"] = DataState;

exports["TimeSince"] = require("./datastates/TimeSince")
exports["MatrixRGBBottomCenter"] = require("./datastates/MatrixRGBBottomCenter")
exports["Path"] = require("./datastates/Path")
exports["Point"] = require("./datastates/Point")
exports["Pose"] = require("./datastates/Pose")
exports["Covariance2d"] = require("./datastates/Covariance2d")
exports["SingleValue"] = require("./datastates/SingleValue")
exports["Trajectory"] = require("./datastates/Trajectory")

module.export = exports
