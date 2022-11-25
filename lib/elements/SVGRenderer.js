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
        this.svg  = config_obj.svg || SVG.LocationPinIcon;
        this.width = config_obj.width_px || 10;
        this.height = config_obj.height_px || 18;
        

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
            .html( this.svg )

            
 

    }


}

module.exports = SVGRenderer
