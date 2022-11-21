const TimeSince = require("./TimeSince")

class Trajectory extends TimeSince {

    parse(position_state) {
        return {
            x : position_state.x,
            y : position_state.y
        };
    }

    update(datum) {
        if (datum.type !== this.data_path) { return false; }
        let now = Date.now();
        this.data.push(Object.assign({arrival:now},this.parse(datum.data)));
        this.data.forEach((dat,i) => {
            this.data[i].t = (now - this.data[i].arrival)*1e-3;
        });
        while (this.data.length > 0 && this.data[0].t > this.tmax) { this.data.shift(); }
        return true;
    }
}

module.exports = Trajectory
