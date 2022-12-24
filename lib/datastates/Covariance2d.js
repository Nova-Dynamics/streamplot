const { DataState } = require("../DataState")

class Covariance2d extends DataState {

    constructor(pose) {
        super();
        this._cov = [[0, 0], [0, 0]];
        this._pose = pose;

        this._pose.on("updated", ()=>this.is_updated = true);
    }

    set pose(p)
    {
        this.is_updated = true;
        this._pose = p;
        this._pose.on("updated", ()=>this.is_updated = true);
    }

    get pose()
    {
        return this._pose;
    }

    set covariance(c)
    {
        this.is_updated = true;
        this._cov = c;
    }

    get covariance()
    {
        return this._cov;
    }

}

module.exports = Covariance2d
