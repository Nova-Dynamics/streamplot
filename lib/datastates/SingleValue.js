const { DataState } = require("../DataState")
const op = require("object-path");

class SingleValue extends DataState {

    constructor(element, config) {
        super(element);
        this.data_path = config.data_path;
        this.key = config.key;
    }

    // Gets landscape
    update(datum) {
        if (datum.type !== this.data_path) { return false; }

        this.data = op.get(datum.data,this.key);
        return true;
    }
}

module.exports = SingleValue
