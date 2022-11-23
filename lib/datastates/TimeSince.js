const { DataState } = require("../DataState")


class TimeSince extends DataState {

    constructor(config={}) {
        super();

        this.tmax = config.tmax_seconds || 20;

    }

    push(y) {
        this.is_updated = true;

        let now = Date.now();
        this.data.push({
            arrival : now,
            y : y
        });
        this.data.forEach((dat, i) => {
            this.data[i].x = (now - this.data[i].arrival)*1e-3;
        });
        while (this.data.length > 0 && this.data[0].x > this.tmax) { this.data.shift(); }
        return true;
    }
}

module.exports = TimeSince
