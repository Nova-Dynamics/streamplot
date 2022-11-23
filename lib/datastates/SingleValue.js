const { DataState } = require("../DataState")
const op = require("object-path");

class SingleValue extends DataState {

    constructor() {
        super();
        this._value = null;
    }

    set value(v)
    {
        this.is_updated = true;
        this._value = v;
    }

    get value()
    {
        return this._value;
    }
}

module.exports = SingleValue
