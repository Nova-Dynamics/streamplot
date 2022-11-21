const { DataState } = require("../DataState")

class Path extends DataState {

    constructor(element, config) {
        super(element);
        this.data_path = config.data_path || "";
    }

    parse(position_vec) {
        return {
            x : position_vec[0],
            y : position_vec[1]
        };
    }

    // Gets landscape
    update(datum) {
        if (datum.type !== this.data_path) { return false; }

        this.data = datum.data.path.map(p => this.parse(p));
        return true;
    }
}
module.exports = Path
