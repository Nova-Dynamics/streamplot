var fs = require('fs');

class Element {
    constructor(field,{}) {
        this.field = field;
        this.data_states = [];

        this.connect_to_field();
    }

    // -------------------------
    //   Connectivity Methods
    // -------------------------
    connect_to_field() {
        this.id = this.field.add_element(this);
    }

    add_data_state(data_state) {
        this.data_states.push(data_state);
    }

    // -------------------------
    //   Setup Methods
    // -------------------------
    init() {
        this.setup();
        this.data_states.forEach((data_state) => {data_state.init()});
    }

    /* Setup the element (Override me)
   *
   * Note that this is run before setup on any children
   */
    setup() {}

    // -------------------------
    //   Opereration Methods
    // -------------------------
    update(datum) {
        this.data_states.forEach((data_state) => {data_state._update(datum);});
    }

    _draw() {
        this.draw();
        this.data_states.forEach((data_state) => { data_state.is_updated = false; });
    }

    /* Draw the graphical element (Override me)
   */
    draw() {}

    /* Have parent redraw axes and labels on next draw
   */
    request_redraw_axes() {this.field.redraw = true;}

    /* Force this element to be redrawn on next draw
   */
    force_redraw() {
        this.data_states.forEach((data_state) => { data_state.is_updated = true; });
    }
}

exports["Element"] = Element;

exports["Line"] = require("./elements/Line")
exports["Polygon"] = require("./elements/Polygon")
exports["Pointer"] = require("./elements/Pointer")
exports["Text"] = require("./elements/Text")
exports["Matrix"] = require("./elements/Matrix")



module.exports = exports;
