const { DataState } = require("../DataState")

class Path extends DataState {

    constructor(config={}) {
        super();

    }


    push(p) {
        this.is_updated = true;
        this.data.push(p)
    }

    clear() {
        this.data = []
    }

    set(data) {
        this.clear()
        data.forEach(p => this.push(p));
    }
}
module.exports = Path
