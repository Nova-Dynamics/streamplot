const { DataState } = require("../DataState")

class FlowChart extends DataState {

    constructor() {
        super();
        this._nodes = {};
        this._links = {};
    }

    set nodes(v)
    {
        this.is_updated = true;
        this._nodes = v;
    }

    get nodes()
    {
        return this._nodes;
    }

    set links(v)
    {
        this.is_updated = true;
        this._links = v;
    }

    get links()
    {
        return this._links;
    }
}

module.exports = FlowChart
