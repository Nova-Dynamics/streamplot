const { DataState } = require("../DataState")

class FlowChart extends DataState {

    constructor() {
        super();
        this._nodes = [];
        this._links = [];
    }


    /**
    * Sets the active state of a node.
    * @param {string} id - The ID of the node to set the active state of.
    * @param {boolean} active - Whether the node should be active. Default is true.
    */
    set_active(id, active=true)
    {
        this.nodes.forEach((n)=>n.active=(n.id==id) && active);
        this.is_updated = true;
    }

    /**
    * Adds a node to the flowchart.
    * @param {string} id - The ID of the node to add.
    * @param {number} width - The width of the node. Default is 100.
    * @param {number} height - The height of the node. Default is 50.
    */
    add_node(id, width=100, height=50)
    {
        this.nodes.push({id, width, height})
        this.is_updated = true;
    }


    /**
    * Add a link to the flow chart.
    * @param {Object} params - An object containing the link parameters.
    * @param {string} params.from_id - The ID of the node the link starts from.
    * @param {string} params.to_id - The ID of the node the link ends at.
    * @param {string} params.label - The label to display on the link.
    */
    add_link({from_id, to_id, label}, distance=undefined)
    {
        this.links.push({source: from_id, target: to_id, label, distance})
        this.is_updated = true;
    }


    /**
    * Removes a link between two nodes in the flowchart.
    * @param {string} from_id - The ID of the node the link is coming from. If null, will remove any links coming from any node.
    * @param {string} to_id - The ID of the node the link is going to. If null, will remove any links going to any node.
    */
    remove_link(from_id=null, to_id=null)
    {
        let l = this.links.filter((f)=>{
            if (from_id==null && to_id==null) return false;

            if (from_id !== null && to_id !== null)
                return f.source.id==from_id && f.target.id==to_id
            else if (from_id === null)
                return f.target.id==to_id || f.target==to_id //links are mutated once the sim has started. Make functional either way
            else if (to_id === null)
                return f.source.id==from_id || f.source==from_id
        })
        
        if (l && l.length)
        {
            for (let r of l)
                this.links.splice(this.links.indexOf(r), 1);
        }
         

        this.is_updated = true;
    }


    /**
    * Removes a node from the flowchart.
    * @param {string} id - The ID of the node to remove.
    */
    remove_node(id)
    {
        let n = this.nodes.find((f)=>f.id==id)

        

        if (n)
        {
            //remove all links going to and leaving this
            this.remove_link(null, n.id)
            this.remove_link(n.id, null)

            this.nodes.splice(this.nodes.indexOf(n), 1);
        }

        this.is_updated = true;
    }

    set nodes(v)
    {
        this.is_updated = true;
        this._nodes = v;
    }

    get nodes()
    {
        return this._nodes;
    }

    set links(v)
    {
        this.is_updated = true;
        this._links = v;
    }

    get links()
    {
        return this._links;
    }
}

module.exports = FlowChart
