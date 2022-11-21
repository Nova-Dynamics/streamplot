const { Element } = require("../Element")
const DataState = require("../DataState")


class Text extends Element {
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
        new DataState.Text(text,config);
        return text;
    }
}

module.exports = Text
