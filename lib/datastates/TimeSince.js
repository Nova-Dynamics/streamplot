const { DataState } = require("../DataState")


class TimeSince extends DataState {

    constructor(element, config) {
        super(element);

        this.tmax = config.tmax_seconds || 20;
        this.data_path = config.data_path || "";
    }

    update(datum) {
        if (datum.type !== this.data_path) { return false; }
        let now = Date.now();
        this.data.push({
            arrival : now,
            y : datum.data
        });
        this.data.forEach((dat,i) => {
            this.data[i].x = (now - this.data[i].arrival)*1e-3;
        });
        while (this.data.length > 0 && this.data[0].x > this.tmax) { this.data.shift(); }
        return true;
    }
}

module.exports = TimeSince
