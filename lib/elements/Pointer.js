const Polygon = require("./Polygon")

class Pointer extends Polygon {

    constructor(ax,config) {
        super(ax,config);
        this.width = config.width || 0.1;
        this.skewness = config.skewness || 2;
        this.width2 = this.skewness * this.width;
        this.follow = config.follow || false;
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
        if (!this.data_states[0].is_updated) { return; }
        let data = Object.assign({},this.data_states[0].data);
        if (this.data_states.length > 1) {
            data.heading += this.data_states[1].data;
        }
        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("path").attr("id",this.id)
            .attr("class","poly")
            .attr("style",`fill: ${this.fcolor}; stroke: ${this.scolor}`)
            .attr("d",this.line(this.generate_triangle(data)));

        if (this.follow) {
            let x0 = this.field.xlim[0];
            let x1 = this.field.xlim[1];
            let y0 = this.field.ylim[0];
            let y1 = this.field.ylim[1];
            if (data.x < x0 || data.x > x1 || data.y < y0 || data.y > y1) {
                this.field.set_xlim([data.x - (x1-x0)/2, data.x + (x1-x0)/2]);
                this.field.set_ylim([data.y - (y1-y0)/2, data.y + (y1-y0)/2]);
                this.request_redraw_axes();
            }
        }
    }
}

module.exports = Pointer
