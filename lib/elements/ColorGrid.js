const { Element } = require("../Element");

class ColorGrid extends Element {
    constructor(datastate, config_obj = {}) {
        super(datastate, config_obj);

        // Set defaults
        this.grid_size = config_obj.grid_size || 0.1;
        this.class = config_obj.class || "grid";
    }

    setup() {

    }

    draw() {
        // Remove existing grid group
        this.field.plot.select(`#${this.id}`).remove();

        // Add a new group for the grid cells
        const group = this.field.plot.append("g")
            .attr("id", this.id)
            .attr("class", this.class);

        // Get grid data
        const grid_data = this.datastate.grid_data;

        // Bind data to rectangles
        const cells = group.selectAll("rect")
            .data(grid_data, d => `${d.x},${d.y}`);

        // Enter new cells
        cells.enter()
            .append("rect")
            .attr("x", d => this.field.xtrans((d.x * this.grid_size) - this.grid_size / 2))
            .attr("y", d => this.field.ytrans((d.y * this.grid_size) + this.grid_size / 2))
            .attr("width", () => Math.abs(this.field.xtrans(this.grid_size) - this.field.xtrans(0)))
            .attr("height", () => Math.abs(this.field.ytrans(this.grid_size) - this.field.ytrans(0)))
            .attr("fill", d => d.value);

        // Update existing cells
        cells
            .attr("fill", d => d.value);

        // Remove old cells
        cells.exit().remove();
    }

    static plot(axis, datastate, config) {
        const grid_element = new this(axis, datastate, config);
        return grid_element;
    }
}

module.exports = ColorGrid;
