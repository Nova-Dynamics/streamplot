const { DataState } = require("../DataState");

class Grid extends DataState {
    constructor(config = {}) {
        super();
        this.grid = new Map(); // Use a Map to store grid data efficiently
    }

    _key(x, y) {
        // Generate a unique key for each grid cell
        return `${x},${y}`;
    }

    set_grid(x, y, value) {
        const key = this._key(x, y);
        this.grid.set(key, { x, y, value });
        this.is_updated = true;
    }

    remove_grid(x, y) {
        const key = this._key(x, y);
        this.grid.delete(key);
        this.is_updated = true;
    }

    clear() {
        this.grid.clear();
        this.is_updated = true;
    }

    get grid_data() {
        // Return an array of grid cell data
        return Array.from(this.grid.values());
    }
}

module.exports = Grid;
