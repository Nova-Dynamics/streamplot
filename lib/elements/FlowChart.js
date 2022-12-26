const { Element } = require("../Element")
const d3force = require('d3-force');
const {select} = require("d3-selection");


class FlowChart extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        this.default_height = config_obj.default_height || 50;
        this.default_width = config_obj.default_width || 100;
        this.inactive_color = config_obj.inactive_color || "white";
        this.active_color = config_obj.active_color || "green";
        this.text_color = config_obj.text_color || "black";
        this.center_x = config_obj.center_x || 0;
        this.center_y = config_obj.center_y || 0;
        this.default_link_distance = config_obj.default_link_distance || 200;

    }

    setup() {
      const svg = this.field.plot


      this.simulation = d3force.forceSimulation()
          .force("charge", d3force.forceManyBody().strength(-1000))
          .force("link", d3force.forceLink().id(d => d.id).distance(d => d.distance || this.default_link_distance))
          .force('center', d3force.forceCenter(this.field.xtrans(this.center_x), this.field.ytrans(this.center_y)))
          .force("x", d3force.forceX())
          .force("y", d3force.forceY())
          .on("tick", () => {
            this.node_elements.attr('transform', (d) => {
              let x = d.x - (d.width || this.default_width) / 2;
              let y = d.y - (d.height || this.default_height) / 2;

              return `translate(${x},${y})`
            })
            
            this.link_elements.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
          });

      this.link_elements = svg.append("g")
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
        .selectAll("link");

      this.node_elements = svg.append("g")
        .selectAll(".node");


      //Add a marker to the svg that can be referenced later.
      this.field.plot.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 45)
      .attr("refY", 5)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 z") //this is actual shape for arrowhead
          .attr("fill", "#000000")
          

    }


    draw() {  

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(this.node_elements.data().map(d => [d.id, d]));
      this.datastate.nodes = this.datastate.nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      this.datastate.links = this.datastate.links.map(d => Object.assign({}, d));

      this.simulation.nodes(this.datastate.nodes);
      this.simulation.force("link").links(this.datastate.links);

      //this.simulation.alpha(1).restart();
      this.simulation.restart();

      this.node_elements = this.node_elements
        .data(this.datastate.nodes, d => d.id)
        .join(
          enter => {
            let g = enter.append('g')
            .attr("class", "node")
            
            g.append('rect')
            .attr('width', (d) => { console.log(d.active); return d.width  || this.default_width })
            .attr('height', (d) => { return d.height || this.default_height})
            .attr('stroke', '#ADADAD')
            .attr('fill', (d) => { return d.active ? this.active_color : this.inactive_color })

            g.append('text')
            .text((d) => d.id)
            .attr('x', (d) => d.width / 2)
            .attr('y', (d) => d.height / 2)
            .attr("fill", this.text_color)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle');

            return g
          },
          update => {
            
            update.select("rect")
            .attr('fill', (d) => { return d.active ? this.active_color : this.inactive_color })

            return update;
          })

          

        this.link_elements = this.link_elements
        .data(this.datastate.links, d => `${d.source.id}-${d.target.id}`)
        .join( enter => {
          let g = enter.append("g")
          .attr("class", "link")

          //Append visable line
          g.append("line")
          .attr("stroke", "black")
          .attr("marker-end", "url(#arrowhead)")

          //Append invisible line for tooltip (Much larger to make it easier to hover)
          g.append("line")
          .attr('stroke', 'transparent')
          .attr('stroke-width', 16)    
          .append("svg:title")
          .text(function(d) { return d.label; })

          return g;
        });
            
    }


    // Use if you want to clean up where the links are connected to the nodes
    // EG: attrsFunction(element, (link)=>this.calculate_link_coords(link))
    // calculate_link_coords(link) {

    //     let source = link.source
    //     let target = link.target

    //     let tx = target.x;
    //     let ty = target.y;

    //     if (source.x > target.x + target.width/2)
    //         tx = target.x + target.width/2;
    //     else if (source.x < target.x - target.width/2)
    //         tx = target.x - target.width/2;

    //     if (source.y > target.y + target.height/2)
    //         ty = target.y + target.height/2;
    //     else if (source.y < target.y - target.height/2)
    //         ty = target.y - target.height/2;

    //     return {
    //       'x1': source.x,
    //       'y1': source.y,
    //       'x2': tx,
    //       'y2': ty
    //     };
    //   }

}

// function attrsFunction(selection, map) {
//     return selection.each(function() {
//       var x = map.apply(this, arguments), s = select(this);
//       for (var name in x) s.attr(name, x[name]);
//     });
//   }

module.exports = FlowChart
