const { DataState } = require("../DataState")

class Path extends DataState {

    constructor(config={}) {
        super();

    }


    push(p) {
        this.is_updated = true;
        this.data.push(p)
    }


    set(data) {
        data.map(p => this.push(p));
    }
}
module.exports = Path
