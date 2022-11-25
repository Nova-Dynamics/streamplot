const { Element } = require("../Element")
const d3line = require('d3-shape').line;


class Circle extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        this.scolor = config_obj.scolor || "#000000";
        this.fcolor = config_obj.fcolor || "#00000000";
        this.label = config_obj.label || "";
        this.radius = config_obj.radius || 10;

    }

    setup() {
        this.line = d3line()
            .x((d) => { return this.field.xtrans(d.x); })
            .y((d) => { return this.field.ytrans(d.y); });
    }

    draw() {
        if (!this.datastate.is_updated) { return; }

        //Probably not the way to do this.
        //https://stackoverflow.com/questions/20688115/d3-js-circle-plotting-does-not-working-properly-while-trying-to-load-after-first

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("circle")
            .attr("id", this.id)
            .attr("cx", this.field.xtrans(this.datastate.x))
            .attr("cy", this.field.ytrans(this.datastate.y))
            .attr("r", this.radius)
            .attr("fill", this.fcolor)
            .attr("stroke", this.scolor)

    }


}

module.exports = Circle
