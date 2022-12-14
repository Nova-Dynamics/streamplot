const { Element } = require("../Element")
const SVG = require("./resources/SVG")


class SVGRenderer extends Element {
    constructor(datastate, svg_element=SVG.LocationPinIcon, config_obj={}) {
        super(datastate, config_obj);



        this.svg_element = svg_element;

    
        this.width = config_obj.size || 10;
        this.height = this.width*this.svg_element.aspect_ratio;

        this.offset_x = this.svg_element.center_x * this.width;
        this.offset_y = this.svg_element.center_y * this.height;

    }

    draw() {

        //Probably not the way to do this.
        //https://stackoverflow.com/questions/20688115/d3-js-circle-plotting-does-not-working-properly-while-trying-to-load-after-first

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("foreignObject")
            .attr("id", this.id)
            .attr("x", this.field.xtrans(this.datastate.x)-this.field.xscale(this.offset_x))
            .attr("y", this.field.ytrans(this.datastate.y)-this.field.xscale(this.offset_y))
            .attr("width", this.field.xscale(this.width))
            .attr("height", this.field.xscale(this.height))
            .html( this.svg_element.data )

            
 

    }


}

module.exports = SVGRenderer
