const { DataState } = require("../DataState")

class Text extends DataState {

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


module.exports = Text
