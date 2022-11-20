const base = require("./base");
const { Line, Matrix } = require("./element");

class Axis extends base.AxisBase {

    plot(data_class,config) {
        let line = Line.plot(this,data_class,config);
        return line;
    }

    imshow(data_class,config) {
        let matplot = Matrix.plot(this,data_class,config);
        return matplot;
    }
}

module.exports = exports = {
    Axis : Axis
};
