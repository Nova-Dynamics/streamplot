const { Line, Matrix, Text } = require("./Element");
const { scaleLinear } = require('d3-scale');
const { axisBottom, axisLeft } = require('d3-axis');
const d3select = require('d3-selection').select;
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);


class Field {
    constructor(window,bbox) {
        this.bbox = bbox;
        this.window = window;

        this.elements = [];
        this.redraw = true;
    }

    // -------------------------
    //   Connectivity Methods
    // -------------------------

    connect_to_window() {
        this.id = this.window.add_field(this);
    }

    add_element(element) {
        let i = 1*this.elements.length;

        element.connect_to_field(this, `field-${this.id}-element-${i}`)
        this.elements.push(element);
        return element;
    }

    remove_element(element) {

        this.plot.select(`#${element.id}`).remove();
        this.elements.push(element);
        this.elements = this.elements.filter((e)=>e.id!=element.id);
    }

    select_datastate_by_id(ds_id) {
        let el = this.elements.find((e)=>e.datastate.id==ds_id);

        if (el)
            return el.datastate
        else 
            return undefined
    }

    // -----------------------
    //   Set up Methods
    // -----------------------
    init() {
        this.setup();
        this.elements.forEach((el) => {el.init();});
    }

    /* Run any pre-draw, post construction setup (Override me)
   *
   * Note, this is called before setup is called on any children
   */
    setup() {}

    // -----------------------
    //   Operation Methods
    // -----------------------

    draw() {
        if (this.redraw) {
            this.redraw_self();
            this.redraw = false;
            this.elements.forEach((el) => {el.force_redraw();});
        }

        //Pull all elements with needed redraws
        let redraw_needed = this.elements.filter((e)=>e.needs_redraw);

        //THEN draw them all. This is done so that elements that share datastates will update
        redraw_needed.forEach((el) =>el._draw());
    }

    /* Add anything here relevent to re-rendering self (Overide me)
   */
    redraw_self() {}
}


class Axis extends Field {
    /**
     * Represents an axis for a d3.js visualization.
     * @extends Field
     * @param {Window} window - The window containing the axis.
     * @param {BBox} bbox - The bounding box for the axis.
     * @param {Object} options - The options for the axis.
     * @param {number} [options.width=600] - The width of the axis.
     * @param {number} [options.height=400] - The height of the axis.
     * @param {Object} [options.margins={top:50,right:20,bottom:50,left:50}] - The margins for the axis.
     * @param {Array} [options.xlim=[0,1]] - The minimum and maximum values for the x-axis.
     * @param {Array} [options.ylim=[0,1]] - The minimum and maximum values for the y-axis.
     * @param {string} [options.xlabel="x"] - The label for the x-axis.
     * @param {string} [options.ylabel="y"] - The label for the y-axis.
     * @param {number} [options.xtick_count=5] - The number of ticks on the x-axis.
     * @param {number} [options.ytick_count=5] - The number of ticks on the y-axis.
     * @param {Array} [options.xtick_labels] - The labels for the x-axis ticks.
     * @param {Array} [options.ytick_labels] - The labels for the y-axis ticks.
     */
    constructor(window,bbox,{
        width,
        height,
        margins,
        xlim,
        ylim,
        xlabel,
        ylabel,
        xtick_count=5,
        ytick_count=5,
        xtick_labels,
        ytick_labels,
        title}) 
        {
        super(window,bbox);

        // Set defaults
        this.width = width || 600;
        this.height = height || 400;
        this.margins = {
            top : margins.top || 50,
            right : margins.right || 20,
            bottom : margins.bottom || 50,
            left : margins.left || 50
        };
        this.xlim = xlim || [0,1];
        this.ylim = ylim || [0,1];

        this.xlabel = xlabel || "x";
        this.ylabel = ylabel || "y";
        this.title = title || "";

        // Configure d3 objects
        this.xtrans = scaleLinear().range([0,this.width]).domain(this.xlim);
        this.ytrans = scaleLinear().range([this.height,0]).domain(this.ylim);

        this.xscale = scaleLinear().range([0,this.width]).domain([0, this.xlim[1] - this.xlim[0]]);
        this.yscale = scaleLinear().range([0,this.height]).domain([0, this.ylim[1] - this.ylim[0]]);

        this.xaxis = axisBottom(this.xtrans);
        this.yaxis = axisLeft(this.ytrans);

        if (xtick_labels && xtick_labels.length)
            this.xaxis.tickFormat(d => xtick_labels[d]).ticks(xtick_labels.length);
        else   
            this.xaxis.ticks(xtick_count)
        
        if (ytick_labels && ytick_labels.length)
            this.yaxis.tickFormat(d => ytick_labels[d]).ticks(ytick_labels.length);
        else   
            this.yaxis.ticks(ytick_count)


        this.connect_to_window();
    }

    /**
     * Sets up the d3.js elements for the axis.
     * @public
     */
    setup() {
        this.plot = d3select(`#${this.id}`)
            .append("svg")
            .attr("width", this.width + this.margins.left + this.margins.right)
            .attr("height", this.height + this.margins.top + this.margins.bottom)
            .append("g")
            .attr("transform", `translate(${this.margins.left},${this.margins.top})`);
    }

    /**
     * Sets the x-axis limits for the axis.
     * @param {Array} xlim - The minimum and maximum values for the x-axis.
     */
    set_xlim(xlim) {
        this.xlim = xlim;
        this.xtrans.domain(xlim);
        this.redraw = true;
    }

    /**
     * Sets the y-axis limits for the axis.
     * @param {Array} ylim - The minimum and maximum values for the y-axis.
     */
    set_ylim(ylim) {
        this.ylim = ylim;
        this.ytrans.domain(ylim);
        this.redraw = true;
    }

    /**
     * Redraws the axis.
     * @public
     */
    redraw_self() {

        this.plot.selectAll(".axis").remove();
        this.plot.selectAll(".label").remove();

        this.plot.append("g")
            .attr("class","x axis")
            .attr("transform",`translate(0,${this.height})`)
            .call(this.xaxis);
        this.plot.append("g")
            .attr("class","y axis")
            .call(this.yaxis);

        this.plot.append("g")
            .attr("class", "x label")
            .attr('transform', `translate(${this.width / 2},${this.height + this.margins.top})`)
            .append("text")
            .attr("text-anchor", "middle")
            .text(this.xlabel);
        this.plot.append("g")
            .attr("class", "y label")
            .attr('transform', `translate(${-30},${this.height / 2})`)
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(this.ylabel);
        this.plot.append("g")
            .attr("class", "title label")
            .attr('transform', `translate(${this.width / 2},-10)`)
            .append("text")
            .attr("text-anchor", "middle")
            .text(this.title);
    }

    /**
     * Adds a line plot to the axis.
     * @param {Object} data_class - The data for the line plot.
     * @param {Object} config - The configuration options for the line plot.
     * @returns {Object} The line plot element.
     */
    plot(data_class,config) {
        
        let line = this.add_element(Line.plot(data_class,config));
        return line;
    }

    /**
     * Adds a matrix plot (heatmap) to the axis.
     * @param {Object} data_class - The data for the matrix plot.
     * @param {Object} config - The configuration options for the matrix plot.
     * @returns {Object} The matrix plot element.
     */
    imshow(data_class,config) {
        let matplot = this.add_element(Matrix.plot( data_class, config));
        return matplot;
    }
}


class Textbox extends Field {
    constructor(window,bbox,{title}) {
        super(window,bbox);

        this.title = title || "";

        this.connect_to_window();
    }

    setup() {
        this.textarea = d3select(`#${this.id}`);
        if (this.title !== "") {
            this.textarea.append("h2").attr("class","textbox-field").text(this.title);
        }
    }

    static write(window,bbox,self_config, datastates) {
        let textbox = new this(window,bbox,self_config);
        datastates.forEach(({datastate, config={}}) => { textbox.add_element( Text.write_line(datastate, config) ) });
        return textbox;
    }
}

class Vis3D extends Field {
    constructor(window,bbox,{title, width, height}) {
        super(window,bbox);

        this.title = title || "";
        this.width = width;
        this.height = height;

        this.connect_to_window();
    }

    setup() {
        

        // Create a three.js scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize( this.width, this.height );
        document.getElementById(this.id).appendChild( renderer.domElement );

        // Add a cube to the scene
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 1
        scene.add( cube );

        // Set the ambient light of the scene
        const ambientLight = new THREE.AmbientLight( 0x404040 );
        scene.add( ambientLight );


        // Add a light to the scene
        const light = new THREE.PointLight( 0xffffff, 1, 100 );
        light.position.set( 5, 5, 5 );
        scene.add( light );

        const planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        plane.quaternion.copy(rotation);

        scene.add(plane);

        // Position the camera
        camera.position.z = 5;

        // Set up the trackball controls
        const controls = new OrbitControls( camera, renderer.domElement );
        //controls.up.set(0, 0, 1);

        // Render the scene
        function render() {
        requestAnimationFrame( render );
          // Rotate the cube
        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;

        controls.update();

        renderer.render( scene, camera );
        }
        render();

        
    }

}


module.exports = exports = {
    Field : Field,
    Axis: Axis,
    Textbox: Textbox,
    Vis3D: Vis3D
};
