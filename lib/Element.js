
class Element {
    constructor(datastate, config={}) {

        this.datastate = datastate;

    }



    // -------------------------
    //   Setup Methods
    // -------------------------
    init() {
        this.setup();
    }

    connect_to_field(field, id)
    {
        this.field = field;
        this.id = id;
    }

    /* Setup the element (Override me)
   *
   * Note that this is run before setup on any children
   */
    setup() {}


    get needs_redraw()
    {
        let needs_redraw = this.datastate.is_updated;
        this.datastate.is_updated = false;

        return needs_redraw;
    }

    _draw() {
        this.draw();
        this.datastate.is_updated = false;
    }

    /* Force this element to be redrawn on next draw
   */
    force_redraw() {
        this.datastate.is_updated = true;
    }
}

exports["Element"] = Element;

exports["Line"] = require("./elements/Line")
exports["Polygon"] = require("./elements/Polygon")
exports["Pointer"] = require("./elements/Pointer")
exports["Text"] = require("./elements/Text")
exports["Matrix"] = require("./elements/Matrix")



module.exports = exports;
