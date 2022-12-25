const { Element } = require("../Element")
const d3force = require('d3-force');
const {select} = require("d3-selection");


class FlowChart extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        // this.scolor = config_obj.scolor || "#000000";
        // this.fcolor = config_obj.fcolor || "#00000000";

        this.default_height = config_obj.default_height || 50;
        this.default_width = config_obj.default_width || 100;

    }

    setup() {
      const svg = this.field.plot


      this.simulation = d3force.forceSimulation()
          .force("charge", d3force.forceManyBody().strength(-1000))
          .force("link", d3force.forceLink().id(d => d.id).distance(200))
          .force('center', d3force.forceCenter(this.field.xtrans(0), this.field.ytrans(0)))
          .force("x", d3force.forceX())
          .force("y", d3force.forceY())
          .on("tick", () => {
            this.node_elements.attr("x", d => d.x - (d.width || this.default_width) / 2)
                .attr("y", d => d.y - (d.height || this.default_height) / 2)
    
            this.link_elements.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
          });

      this.link_elements = svg.append("g")
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
        .selectAll("line");

      this.node_elements = svg.append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
        .selectAll("rect");

    }


    draw() {  

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(this.node_elements.data().map(d => [d.id, d]));
      this.datastate.nodes = this.datastate.nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      this.datastate.links = this.datastate.links.map(d => Object.assign({}, d));

      this.simulation.nodes(this.datastate.nodes);
      this.simulation.force("link").links(this.datastate.links);
      this.simulation.alpha(1).restart();

      this.node_elements = this.node_elements
        .data(this.datastate.nodes, d => d.id)
        .join(enter =>  enter.append('rect')
          .attr('width', (d) => { console.log(d); return d.width  || this.default_width })
          .attr('height', (d) => { return d.height || this.default_height})
          .attr('stroke', '#ADADAD')
          .attr('fill', (d) => { return d.active ? "#04c357" : "#00000000" }))

    

        this.link_elements = this.link_elements
        .data(this.datastate.links, d => `${d.source.id}\t${d.target.id}`)
        .join("line");
            
    }



    calculate_link_coords(link) {

        let source = this.datastate.nodes[link.source] || link.source
        let target = this.datastate.nodes[link.target] || link.target

        let tx = target.x;
        let ty = target.y;

        // if (source.x > target.x + target.width/2)
        //     tx = target.x + target.width/2;
        // else if (source.x < target.x - target.width/2)
        //     tx = target.x - target.width/2;

        // if (source.y > target.y + target.height/2)
        //     ty = target.y + target.height/2;
        // else if (source.y < target.y - target.height/2)
        //     ty = target.y - target.height/2;

        return {
          'x1': source.x,
          'y1': source.y,
          'x2': tx,
          'y2': ty
        };
      }

}

function attrsFunction(selection, map) {
    return selection.each(function() {
      var x = map.apply(this, arguments), s = select(this);
      for (var name in x) s.attr(name, x[name]);
    });
  }

module.exports = FlowChart
