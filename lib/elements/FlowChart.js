const { Element } = require("../Element")
const d3force = require('d3-force');
const {select} = require("d3-selection");


class FlowChart extends Element {
    constructor(datastate, config_obj={}) {
        super(datastate, config_obj);

        // Set defaults
        // this.scolor = config_obj.scolor || "#000000";
        // this.fcolor = config_obj.fcolor || "#00000000";

    }

    setup() {
        this.simulation = d3force.forceSimulation(this.datastate.nodes)
        .force('link', d3force.forceLink())
        .force('charge', d3force.forceManyBody().strength(-100))
        .force('center', d3force.forceCenter(this.field.xtrans(0), this.field.ytrans(0)))
    }


    draw() {  

        this.field.plot.select(`#${this.id}`).remove();



       
        this.field.plot.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("refX", 65) /*must be smarter way to calculate shift*/
        .attr("refY", 5)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z") //this is actual shape for arrowhead
            .attr("fill", "#000000")

        //creating a variable for the links where the data will be stored
        var link = this.field.plot.selectAll('.link')
        .append('g')
        .data(this.datastate.links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', function(d){ return 1 })
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrowhead)");

         // creating a variable for the nodes where the data will be stored
        var node = this.field.plot.selectAll('.node')
        // .append('g')
        .data(this.datastate.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        
        node
        .append('rect')
        .attr('width', function(d) { return d.width })
        .attr('height', function(d) { return d.height })
        .attr('stroke', '#ADADAD')
        .attr('fill', function(d) { return d.active ? "#04c357" : "white" })
        .attr('class', 'node')

        let link_label = this.field.plot.selectAll('.link_label')
        .append('g')
        .data(this.datastate.links)
        .enter()
        .append('text')
        .attr("text-anchor", "middle")
        .attr("paint-order", "stroke")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "5px")
        .text(function(d) { return d.link_label })
        .attr('class', 'link_label')

        

        var labels = node.append("text")
        .attr("dx", 10)
        .attr("dy", 0)
        .text(function(d) { return d.title })
        //.call(wrap, 100);

        //allign labels vertically in the center of box
        labels
        .attr("y", function(d){
            //I have no idea why it's 66, should have been 50px+1.1em = 61px
            let y = (66 - this.getBBox().height) / 2;
            console.log(y);
            return y;
        })

       

    this.simulation
      .nodes(this.datastate.nodes)
      .on('tick', () => {
        

        attrsFunction(link, (link)=>this.calculate_link_coords(link))

        link_label.attr('x', (d)=>{ return (this.datastate.nodes[d.source].x + this.datastate.nodes[d.target].x)/2; })
        .attr('y', (d)=>{ return (this.datastate.nodes[d.source].y + this.datastate.nodes[d.target].y)/2; })
        
        
        node
        .attr("transform", function(d) { return "translate(" + (d.x - 50) + "," + (d.y - 25) + ")"; })
        .attr("fixed", function(d) {d.fixed = true}); //disable force on load

    });

    this.simulation.force('link')
                    .links(link);
    }

    calculate_link_coords(link) {

        let source = this.datastate.nodes[link.source]
        let target = this.datastate.nodes[link.target]

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
