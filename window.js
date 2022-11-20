const base = require("./base");
const { Axis } = require("./axis");

class Window extends base.WindowBase {
    add_subplot(bbox,config) {
        return new Axis(this,bbox,config);
    }
}

module.exports = exports = {
    Window : Window
};
