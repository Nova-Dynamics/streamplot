const d3line = require('d3-shape').line;

const base = require("./base");
const ds = require("./datastate");

class Line extends base.ElementBase {
    constructor(axis,config_obj) {
        super(axis,config_obj);

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
        if (!this.data_states[0].is_updated) { return; }
        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("path").attr("id",this.id)
            .attr("label",this.label)
            .attr("class",this.class)
            .attr("style",`fill: ${this.fcolor}; stroke: ${this.scolor}; stroke-width: ${this.sw};`)
            .attr("d",this.line(this.data_states[0].data));
    }

    // static time_since(axis, data_path, config){
    //   let line = new this(axis,config);
    //   new ds.TimeSinceDS(line, data_path, config);
    //   return line;
    // }
    //
    // static trajectory(axis, data_path, config){
    //   let line = new this(axis,config);
    //   new ds.TrajectoryDS(line, data_path, config);
    //   return line;
    // }

    static plot(axis,data_class,config) {
        let line = new this(axis,config);
        new data_class(line,config);
        return line;
    }
}

class Polygon extends Line {
    constructor(axis,config_obj) {
        super(axis,config_obj);
        // Reset defaults to filled with no line
        this.class = config_obj.class || "poly";
        this.fcolor = config_obj.fcolor || "#000000";
        this.scolor = config_obj.scolor || "#00000000";
    }
}

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

class Text extends base.ElementBase {
    constructor(field, config) {
        super(field, config);

        this.color = config.color || "#000000";
        this.font_size = config.font_size || "medium";
    }

    setup() {
        this.div = this.field.textarea.append("div").attr("id",this.id);
    }

    draw() {
        if (this.data_states.reduce((acc, curr)=> acc && !curr.is_updated, true)) { return; }
        let spans = this.div.selectAll("pre").data(this.data_states);
        spans.enter().append("pre")
            .merge(spans)
            .html((d)=> d.data)
            .attr("class", "text-element")
            .attr("style",`color: ${this.color}; font-size: ${this.font_size}`)
            .exit()
            .remove();
    }

    static write_line(ax,config) {
        let text = new this(ax,config);
        new ds.TextDS(text,config);
        return text;
    }
}

class Matrix extends base.ElementBase {
    draw() {
        if (!this.data_states[0].is_updated) { return; }
        let width = Math.abs(this.field.xtrans(this.data_states[0].dx) - this.field.xtrans(0));
        let height = Math.abs(this.field.ytrans(this.data_states[0].dx) - this.field.ytrans(0));
        let rects = this.field.plot.selectAll(`rect.${this.id}`)
            .data(this.data_states[0].data);
        rects.enter().append("rect").merge(rects)
            .attr("class",`${this.id}`)
            .attr("x",(d)=> this.field.xtrans(d.x) )
            .attr("width",width)
            .attr("y",(d)=> this.field.ytrans(d.y))
            .attr("height",height)
            .attr("style",(d)=> `fill: ${d.fill}`)
            .exit()
            .remove();
    }

    static plot(axis, data_class, config) {
        let matplot = new this(axis,config);
        new data_class(matplot, config);
        return matplot;
    }
}

// $ cat elements.js | grep -E -o "class ([^\W]*) extends"
module.exports = exports = {
    Line : Line,
    Polygon : Polygon,
    Pointer : Pointer,
    Text : Text,
    Matrix : Matrix
};
