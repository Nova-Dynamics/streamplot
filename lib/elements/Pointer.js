const Polygon = require("./Polygon")

class Pointer extends Polygon {

    constructor(datastate, config) {
        super(datastate,config);
        this.width = config.width || 0.1;
        this.skewness = config.skewness || 2;
        this.width2 = this.skewness * this.width;
        this.follow = config.follow || false;
        this.datastate = datastate;
    }

    generate_triangle(pos) {
        return [
            {x: pos.x + this.width2*Math.sin(pos.heading), y: pos.y + this.width2*Math.cos(pos.heading)},
            {x: pos.x + this.width*Math.sin(pos.heading + 2*Math.PI/3), y: pos.y + this.width*Math.cos(pos.heading + 2*Math.PI/3)},
            {x: pos.x + this.width*Math.sin(pos.heading + 4*Math.PI/3), y: pos.y + this.width*Math.cos(pos.heading + 4*Math.PI/3)},
            {x: pos.x + this.width2*Math.sin(pos.heading), y: pos.y + this.width2*Math.cos(pos.heading)}
        ];
    }

    draw() {

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("path").attr("id",this.id)
            .attr("class","poly")
            .attr("style",`fill: ${this.fcolor}; stroke: ${this.scolor}`)
            .attr("d",this.line(this.generate_triangle(this.datastate)));

        if (this.follow) {
            let x0 = this.field.xlim[0];
            let x1 = this.field.xlim[1];
            let y0 = this.field.ylim[0];
            let y1 = this.field.ylim[1];
            if (this.datastate.x < x0 || this.datastate.x > x1 || this.datastate.y < y0 || this.datastate.y > y1) {
                this.field.set_xlim([this.datastate.x - (x1-x0)/2, this.datastate.x + (x1-x0)/2]);
                this.field.set_ylim([this.datastate.y - (y1-y0)/2, this.datastate.y + (y1-y0)/2]);
                this.request_redraw_axes();
            }
        }
    }
}

module.exports = Pointer
