const { Axis } = require("./Fields");


class Window {
    constructor(selector,{redraw_time_ms}) {
        this.container = window.$(selector);
        this.duty_cycle = redraw_time_ms || 100;

        this.fields = [];
    }

    init() {
        this.fields.forEach((field) => {field.init();});
        this.draw();
    }

    start() {
        this.updating = true;
        this.loop = setInterval(() => { this.draw(); }, this.duty_cycle);
    }

    stop() {
        clearInterval(this.loop);
        this.updating = false;
    }

    add_field(field) {

        // Construct a div to hold the field
        let i = this.fields.length;
        let field_id = `field-${i}`;
        let new_field = window.$("<div>").attr("id",field_id)
            .css(`grid-column-start`, field.bbox.left)
            .css(`grid-column-end`, field.bbox.right)
            .css(`grid-row-start`,field.bbox.top)
            .css(`grid-row-end`,field.bbox.bottom);
        this.container.append(new_field);

        // Register the field locally, and return the id
        this.fields.push(field);
        return field_id;
    }

    update(datum) {
        if (!this.updating) { return; }
        if (datum.data === null || datum.data === undefined) { return; }
        this.fields.forEach((field) => {field.update(datum);});
    }

    draw() {
        this.fields.forEach((field) => {field.draw();});
    }

    add_subplot(bbox,config) {
        return new Axis(this,bbox,config);
    }
}

module.exports = exports = {
    Window : Window
};
