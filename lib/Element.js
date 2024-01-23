
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
        return this.datastate.is_updated;
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
//These need to all be added indevidually to prevent circular import problems
exports.Element = Element;

exports.Line = require("./elements/Line")
exports.Circle = require("./elements/Circle")
exports.SVGRenderer = require("./elements/SVGRenderer")
exports.Polygon = require("./elements/Polygon")
exports.Pointer = require("./elements/Pointer")
exports.Covariance2d = require("./elements/Covariance2d")
exports.Text = require("./elements/Text")
exports.Matrix = require("./elements/Matrix")
exports.Resources = require("./elements/resources/SVG")
exports.FlowChart = require("./elements/FlowChart")

exports.V3D = {
    Sphere: require("./3d/elements/Sphere"),
    Box: require("./3d/elements/Box"),
    VoxelMap: require("./3d/elements/VoxelMap"),
    Line: require("./3d/elements/Line"),
    Mesh: require("./3d/elements/Mesh")
}

module.exports = exports;
