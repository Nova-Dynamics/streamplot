const { Element } = require("../Element")
const d3line = require('d3-shape').line;


class Line extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        this.scolor = config_obj.scolor || "#000000";
        this.fcolor = config_obj.fcolor || "#00000000";
        this.sw = config_obj.sw || 2;
        this.label = config_obj.label || "";
        this.class = config_obj.class || "line";
    }

    setup() {
        this.line = d3line()
            .x((d) => { return this.field.xtrans(d.x); })
            .y((d) => { return this.field.ytrans(d.y); });
    }

    draw() {

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("path")
            .attr("id", this.id)
            .attr("label",this.label)
            .attr("class",this.class)
            .attr("style",`fill: ${this.fcolor}; stroke: ${this.scolor}; stroke-width: ${this.sw};`)
            .attr("d",this.line(this.datastate.data));
    }

    static plot(axis,datastate,config) {
        let line = new this(axis, datastate, config);
        return line;
    }
}

module.exports = Line
