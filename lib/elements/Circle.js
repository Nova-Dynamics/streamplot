const { Element } = require("../Element")


class Circle extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        this.scolor = config_obj.scolor || "#000000";
        this.fcolor = config_obj.fcolor || "#00000000";
        this.label = config_obj.label || "";
        this.radius = config_obj.radius || 10;

    }

    draw() {
        //Probably not the way to do this.
        //https://stackoverflow.com/questions/20688115/d3-js-circle-plotting-does-not-working-properly-while-trying-to-load-after-first

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("circle")
            .attr("id", this.id)
            .attr("cx", this.field.xtrans(this.datastate.x))
            .attr("cy", this.field.ytrans(this.datastate.y))
            .attr("r", this.field.xscale(this.radius)) //Interpolate between x and y?
            .attr("fill", this.fcolor)
            .attr("stroke", this.scolor)

    }


}

module.exports = Circle
