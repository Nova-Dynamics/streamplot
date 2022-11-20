const op = require("object-path");

const base = require("./base");

class TimeSinceDS extends base.DataStateBase {

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


class MatrixRGBBottomCenterDS extends base.DataStateBase {

    constructor(element, {data_path, dimensions, length_scale}) {
        super(element);
        this.N = dimensions[0];
        this.M = dimensions[1];
        this.dx = length_scale || 0.1;
        this.data_path = data_path;
    }

    to_hex(list) {
        return '#' + list.map(this.__byte).join("");
    }
    __byte(number) {
        let string = number.toString(16);
        switch (string.length) {
        case 0: return "00";
        case 1: return "0"+string;
        case 2: return string;
        default: return string.slice(2);
        }
    }

    update(datum) {
        if (datum.type !== this.data_path) { return false; }

        this.data = [];
        datum.data.forEach((r,ri) => {
            r.forEach((c,ci) => {
                this.data.push({
                    y : (this.N - 0.5 - ri) * this.dx,
                    x : (ci - (this.M - 1) / 2 - 0.5) * this.dx,
                    fill : this.to_hex(c)
                });
            });
        });
        return true;
    }
}


class PoseDS extends base.DataStateBase {

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

class SingleValueDS extends base.DataStateBase {

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

class PathDS extends base.DataStateBase {

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

class TrajectoryDS extends TimeSinceDS {

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

class TextDS extends base.DataStateBase {

    constructor(element, {data_path, string_func, default_string}) {
        super(element);
        this.data_path = data_path;
        this.string_func = string_func || ((obj) => JSON.stringify(obj));
        this.data = default_string || "No data";
        this.is_updated = true;
    }

    update(datum) {
        if (datum.type !== this.data_path) { return false; }
        this.data = this.string_func(datum.data);
        return true;
    }
}


// $ cat datastate.js | grep -o "class [^\W]* extends"
module.exports = exports = {
    TimeSinceDS : TimeSinceDS,
    MatrixRGBBottomCenterDS : MatrixRGBBottomCenterDS,
    PoseDS : PoseDS,
    SingleValueDS : SingleValueDS,
    PathDS : PathDS,
    TrajectoryDS : TrajectoryDS,
    TextDS : TextDS
};
