/**
 *
 * Needs jquery as $ and d3
 */

const d3select = require('d3-selection').select;
const { scaleLinear } = require('d3-scale');
const { axisBottom, axisLeft } = require('d3-axis');


class ElementBase {
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
        this.data_states.forEach((data_state) => {data_state.init();});
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

class DataStateBase {
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

module.exports = exports = {
    ElementBase : ElementBase,
    DataStateBase : DataStateBase
};
