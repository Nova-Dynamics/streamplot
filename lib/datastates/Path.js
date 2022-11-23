const { DataState } = require("../DataState")

class Path extends DataState {

    constructor(config={}) {
        super();

    }


    push(data) {
        this.is_updated = true;
        this.data.push(data)
    }


    set(data) {
        data.map(p => this.push(p));
    }
}
module.exports = Path
