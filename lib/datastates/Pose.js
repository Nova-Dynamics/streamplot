const { DataState } = require("../DataState")


class Pose extends DataState {

    constructor(element, config) {
        super(element);
        this.data_path = config.data_path;
    }

    parse(position_state) {
        return {
            x : position_state.x,
            y : position_state.y,
            heading : position_state.heading,
            vx : Math.sin(position_state.heading),
            vy : Math.cos(position_state.heading)
        };
    }

    // Gets landscape
    update(datum) {
        if (datum.type !== this.data_path) { return false; }

        this.data = this.parse(datum.data);
        return true;
    }
}

module.exports = Pose
