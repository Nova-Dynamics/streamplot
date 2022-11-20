const { Line, Matrix, Text } = require("../element");
const { scaleLinear } = require('d3-scale');
const { axisBottom, axisLeft } = require('d3-axis');
const d3select = require('d3-selection').select;



class Field {
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

class Axis extends Field {
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

    plot(data_class,config) {
        let line = Line.plot(this,data_class,config);
        return line;
    }

    imshow(data_class,config) {
        let matplot = Matrix.plot(this,data_class,config);
        return matplot;
    }
}


class Textbox extends Field {
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

    static write(window,bbox,self_config,text_line_config_list) {
        let textbox = new this(window,bbox,self_config);
        text_line_config_list.forEach((config) => { Text.write_line(textbox,config); });
        return textbox;
    }
}


module.exports = exports = {
    Field : Field,
    Axis: Axis,
    Textbox: Textbox
};
