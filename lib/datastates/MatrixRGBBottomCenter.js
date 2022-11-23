const { DataState } = require("../DataState")


class MatrixRGBBottomCenter extends DataState {

    constructor({dimensions, length_scale}) {
        super();
        this.N = dimensions[0];
        this.M = dimensions[1];
        this.dx = length_scale || 0.1;
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
        this.is_updated = true;


        this.data = [];
        datum.forEach((r,ri) => {
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

module.exports = MatrixRGBBottomCenter
