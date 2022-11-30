const { Element } = require("../Element")
const DataState = require("../DataState")


class Text extends Element {
    constructor(datastate, config={}) {
        super(datastate, config);

        this.color = config.color || "#000000";
        this.font_size = config.font_size || "medium";
        this.postprocessor = config.postprocessor || ((v)=>v);
        this.default_value = config.default_value || "None";
    }

    setup() {
        
        this.div = this.field.textarea.append("div").attr("id", this.id);
    }

    draw() {
        
        let spans = this.div.selectAll("pre").data([this.datastate]);
        spans.enter().append("pre")
            .merge(spans)
            .html((d) => this.postprocessor(d.value || this.default_value) )
            .attr("class", "text-element")
            .attr("style",`color: ${this.color}; font-size: ${this.font_size}`)
            .exit()
            .remove();

    }

    static write_line(datastate, config) {
        let text = new this(datastate, config);
        return text;
    }
}

module.exports = Text
