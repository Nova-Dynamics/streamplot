/**
 *
 * Needs jquery as $ and d3
 */

const d3select = require('d3-selection').select;
const { scaleLinear } = require('d3-scale');
const { axisBottom, axisLeft } = require('d3-axis');

class WindowBase {
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
}

class FieldBase {
    constructor(window,bbox) {
        this.bbox = bbox;
        this.window = window;

        this.elements = [];
        this.redraw = true;
    }

    // -------------------------
    //   Connectivity Methods
    // -------------------------

    connect_to_window() {
        this.id = this.window.add_field(this);
    }

    add_element(element) {
        let i = 1*this.elements.length;
        this.elements.push(element);
        return `field-${this.id}-element-${i}`;
    }

    // -----------------------
    //   Set up Methods
    // -----------------------
    init() {
        this.setup();
        this.elements.forEach((el) => {el.init();});
    }

    /* Run any pre-draw, post construction setup (Override me)
   *
   * Note, this is called before setup is called on any children
   */
    setup() {}

    // -----------------------
    //   Operation Methods
    // -----------------------
    update(datum) {
        this.elements.forEach((el) => {el.update(datum);});
    }

    draw() {
        if (this.redraw) {
            this.redraw_self();
            this.redraw = false;
            this.elements.forEach((el) => {el.force_redraw();});
        }
        this.elements.forEach((el) => {el._draw();});
    }

    /* Add anything here relevent to re-rendering self (Overide me)
   */
    redraw_self() {}
}


class AxisBase extends FieldBase {
    constructor(window,bbox,{width,height,margins,xlim,ylim,xlabel,ylabel,title}) {
        super(window,bbox);

        // Set defaults
        this.width = width || 600;
        this.height = height || 400;
        this.margins = {
            top : margins.top || 50,
            right : margins.right || 20,
            bottom : margins.bottom || 50,
            left : margins.left || 50
        };
        this.xlim = xlim || [0,1];
        this.ylim = ylim || [0,1];

        this.xlabel = xlabel || "x";
        this.ylabel = ylabel || "y";
        this.title = title || "";

        // Configure d3 objects
        this.xtrans = scaleLinear().range([0,this.width]).domain(this.xlim);
        this.ytrans = scaleLinear().range([this.height,0]).domain(this.ylim);
        this.xaxis = axisBottom(this.xtrans).ticks(5);
        this.yaxis = axisLeft(this.ytrans).ticks(5);


        this.connect_to_window();
    }

    setup() {
        this.plot = d3select(`#${this.id}`)
            .append("svg")
            .attr("width", this.width + this.margins.left + this.margins.right)
            .attr("height", this.height + this.margins.top + this.margins.bottom)
            .append("g")
            .attr("transform", `translate(${this.margins.left},${this.margins.top})`);
    }

    set_xlim(xlim) {
        this.xlim = xlim;
        this.xtrans.domain(xlim);
    }
    set_ylim(ylim) {
        this.ylim = ylim;
        this.ytrans.domain(ylim);
    }

    redraw_self() {
        this.plot.selectAll(".axis").remove();
        this.plot.selectAll(".label").remove();

        this.plot.append("g")
            .attr("class","x axis")
            .attr("transform",`translate(0,${this.height})`)
            .call(this.xaxis);
        this.plot.append("g")
            .attr("class","y axis")
            .call(this.yaxis);

        this.plot.append("g")
            .attr("class", "x label")
            .attr('transform', `translate(${this.width / 2},${this.height + this.margins.top})`)
            .append("text")
            .attr("text-anchor", "middle")
            .text(this.xlabel);
        this.plot.append("g")
            .attr("class", "y label")
            .attr('transform', `translate(${-30},${this.height / 2})`)
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(this.ylabel);
        this.plot.append("g")
            .attr("class", "title label")
            .attr('transform', `translate(${this.width / 2},-10)`)
            .append("text")
            .attr("text-anchor", "middle")
            .text(this.title);
    }
}


class TextboxBase extends FieldBase {
    constructor(window,bbox,{title}) {
        super(window,bbox);

        this.title = title || "";

        this.connect_to_window();
    }

    setup() {
        this.textarea = d3select(`#${this.id}`);
        if (this.title !== "") {
            this.textarea.append("h2").attr("class","textbox-field").text(this.title);
        }
    }
}

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
    WindowBase : WindowBase,
    FieldBase : FieldBase,
    AxisBase : AxisBase,
    TextboxBase : TextboxBase,
    ElementBase : ElementBase,
    DataStateBase : DataStateBase
};
