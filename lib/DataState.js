

class DataState {
    constructor(element) {

        this.element = element;
        this.data = [];
        this._is_updated = false;

        this.connect_to_element();
    }

    get is_updated() {
        return this._is_updated;
    }
    set is_updated(value) {
        this._is_updated = !!value;
    }

    // -------------------------
    //   Connectivity Methods
    // -------------------------
    connect_to_element() {
        this.element.add_data_state(this);
    }

    // -------------------------
    //   Opereration Methods
    // -------------------------

    /* Wrapper for .update(...) to track if the DataState has been modified
   *
   * @param [Object] datum - the datum to (potentially update with)
   */
    _update(datum) {
        this.is_updated = this.update(datum) || this.is_updated;
    }

    /* Update the DataItem with new datum (Override me!)
   *
   * Each time a new datum arrives, this method is called with that datum,
   *  it is up to you to check if the datum is relevent to this DataState,
   *  and if it is, cache that datum somehow. At the end, return a boolean
   *  indicating if the DataState was actually modified by this method call
   *
   * @param [Object] datum - the datum to (potentially update with)
   * @returns [bool] - boolean reprepresenting if the DataItem was acutally updated
   */
    update(datum) { return false; }


    init() {
        this.setup();
    }

    /* Setup the data state (Override me)
   */
    setup() {}
}


exports["DataState"] = DataState;

exports["TimeSince"] = require("./datastates/TimeSince")
exports["MatrixRGBBottomCenter"] = require("./datastates/MatrixRGBBottomCenter")
exports["Path"] = require("./datastates/Path")
exports["Pose"] = require("./datastates/Pose")
exports["SingleValue"] = require("./datastates/SingleValue")
exports["Text"] = require("./datastates/Text")
exports["Trajectory"] = require("./datastates/Trajectory")

module.export = exports
