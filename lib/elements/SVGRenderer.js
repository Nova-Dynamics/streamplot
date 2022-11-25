const { Element } = require("../Element")
const SVG = require("./resources/SVG")


class SVGRenderer extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        this.scolor = config_obj.scolor || "#000000";
        this.fcolor = config_obj.fcolor || "#00000000";
        this.label = config_obj.label || "";
        this.radius = config_obj.radius || 10;
        this.width = config_obj.width_px || 10;
        this.height = config_obj.height_px || 10;

    }

    draw() {
        if (!this.datastate.is_updated) { return; }

        //Probably not the way to do this.
        //https://stackoverflow.com/questions/20688115/d3-js-circle-plotting-does-not-working-properly-while-trying-to-load-after-first

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("foreignObject")
            .attr("id", this.id)
            .attr("x", this.field.xtrans(this.datastate.x)-(this.width/2))
            .attr("y", this.field.ytrans(this.datastate.y)-(this.width/2))
            .attr("width", this.width)
            .attr("height", this.height)
            .html( SVG.LocationPinIcon )
            //.html( `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z"/></svg>` )

            
 

    }


}

module.exports = SVGRenderer
