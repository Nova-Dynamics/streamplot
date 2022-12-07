const Line = require("./Line")
const Matrix = require('../linalg');

class Covariance2d extends Line {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);


        this.nsteps = config_obj.nsteps || 50;
        this.nsig = config_obj.nsig || 1;

        this.theta = [...Array(this.nsteps)].map((v,i) => Math.PI*2*i/(this.nsteps-1));
        this.xy_vecs = this.theta.map(th => Matrix.column([
        this.nsig * Math.sin(th), this.nsig * Math.cos(th),
        ]))

    }

    get_cov_pts()
    {
        let covariance = Matrix.array(this.datastate.covariance);
        let result = covariance.eig();
        let v = result.values;
        let w = result.vecs;

        // Get sqrt(covariance)
        let root_v = Matrix.diag(v.map(e => {
        let rv = Math.sqrt(e)
            return Math.max(0,Math.abs(rv));
        }));
        let proj = w.T().dot(root_v.dot(w))
        let offset = Matrix.column([this.datastate.pose.x||0, this.datastate.pose.y||0])

        let data = this.xy_vecs.map(vec => ((proj.dot(vec)).add(offset)).column(0).slice(0,2))
        data = data.map((e)=>({x: e[0], y:e[1]}))
        return data
    }

    draw() {
        
        let data = this.get_cov_pts()

        this.field.plot.select(`#${this.id}`).remove();
        this.field.plot.append("path")
            .attr("id", this.id)
            .attr("label",this.label)
            .attr("class",this.class)
            .attr("style",`fill: ${this.fcolor}; stroke: ${this.scolor}; stroke-width: ${this.sw};`)
            .attr("d",this.line(data));
    }


}

module.exports = Covariance2d
