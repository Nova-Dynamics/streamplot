
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
module.exports.Element = Element;

module.exports.Line = require("./elements/Line")
module.exports.Circle = require("./elements/Circle")
module.exports.SVGRenderer = require("./elements/SVGRenderer")
module.exports.Polygon = require("./elements/Polygon")
module.exports.Pointer = require("./elements/Pointer")
module.exports.ColorGrid = require("./elements/ColorGrid")
module.exports.Covariance2d = require("./elements/Covariance2d")
module.exports.Text = require("./elements/Text")
module.exports.Matrix = require("./elements/Matrix")
module.exports.Resources = require("./elements/resources/SVG")
module.exports.FlowChart = require("./elements/FlowChart")

module.exports.V3D = {
    Sphere: require("./3d/elements/Sphere"),
    Box: require("./3d/elements/Box"),
    VoxelMap: require("./3d/elements/VoxelMap"),
    Line: require("./3d/elements/Line"),
    Mesh: require("./3d/elements/Mesh")
}
