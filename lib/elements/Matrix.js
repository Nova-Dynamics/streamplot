const { Element } = require("../Element")

class Matrix extends Element {
    draw() {
        if (!this.datastate.is_updated) { return; }
        let width = Math.abs(this.field.xtrans(this.datastate.dx) - this.field.xtrans(0));
        let height = Math.abs(this.field.ytrans(this.datastate.dx) - this.field.ytrans(0));
        let rects = this.field.plot.selectAll(`rect.${this.id}`)
            .data(this.datastate.data);
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

    static plot(axis, datastate, config) {
        let matplot = new this(axis, datastate, config);
        return matplot;
    }
}

module.exports = Matrix
