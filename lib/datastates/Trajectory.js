const TimeSince = require("./TimeSince")

class Trajectory extends TimeSince {


    push({x, y}) {

        this.is_updated = true;
        
        let arrival = Date.now();
        this.data.push({arrival, x, y});

        this.data.forEach((dat,i) => {
            this.data[i].t = (arrival - this.data[i].arrival)*1e-3;
        });
        while (this.data.length > 0 && this.data[0].t > this.tmax) { this.data.shift(); }

        return true;
    }
}

module.exports = Trajectory
