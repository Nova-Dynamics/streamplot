const { DataState, Window, Vis3D, Element } = require("../../../index.js")
const THREE = require('three');

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

console.log(window.$("#container"))
var w = new Window(window.$("#container"), {});


var a = new Vis3D(w, {top:1,bottom:2,left:1,right:2},{
  title: "Isthisworking",
  width : 1000,
  height : 800,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  }
});

let corners = [
    {
      "id": 0,
      "corners": [
        [-0.364347, 0.112521, 0.622869],
        [-0.363852, 0.0225205, 0.622797],
        [-0.377233, 0.0225205, 0.533796],
        [-0.377233, 0.11252, 0.533796]
      ]
    },
    {
      "id": 1,
      "corners": [
        [-0.387926, -0.326503, 0.651918],
        [-0.327926, -0.326503, 0.651916],
        [-0.327928, -0.326503, 0.591916],
        [-0.387928, -0.326503, 0.591918]
      ]
    },
    {
      "id": 2,
      "corners": [
        [-0.0438629, 0.43922, 0.679916],
        [0.016137, 0.43922, 0.679916],
        [0.016137, 0.43922, 0.619916],
        [-0.0438629, 0.43922, 0.619916]
      ]
    },
    {
      "id": 3,
      "corners": [
        [0.3002, -0.326503, 0.651916],
        [0.3602, -0.326503, 0.651918],
        [0.360202, -0.326503, 0.591918],
        [0.300202, -0.326503, 0.591916]
      ]
    },
    {
      "id": 4,
      "corners": [
        [0.336621, 0.0225205, 0.622869],
        [0.336621, 0.11252, 0.622869],
        [0.349506, 0.11252, 0.533796],
        [0.349506, 0.0225205, 0.533796]
      ]
    }
  ]
  

corners.forEach((corner)=>{

  corner.corners.forEach((corner)=>{
    let point = new DataState.V3D.Point()
    let sphere = new Element.V3D.Sphere(point, {radius: 0.01});
    a.add_element(sphere);

    point.x = corner[0];
    point.y = corner[1];
    point.z = corner[2];
  })

  let p0 = new DataState.V3D.Path()

  p0.push({x: corner.corners[0][0], y: corner.corners[0][1], z: corner.corners[0][2]});
  p0.push({x: corner.corners[1][0], y: corner.corners[1][1], z: corner.corners[1][2]});

  let line0 = new Element.V3D.Line(p0, {material: new THREE.LineBasicMaterial( { color: 0x0000ff } )});
  a.add_element(line0);

  let p1 = new DataState.V3D.Path()

  p1.push({x: corner.corners[1][0], y: corner.corners[1][1], z: corner.corners[1][2]});
  p1.push({x: corner.corners[2][0], y: corner.corners[2][1], z: corner.corners[2][2]});

  let line1 = new Element.V3D.Line(p1, {material: new THREE.LineBasicMaterial( { color: 0xff00ff } )});
  a.add_element(line1);

  let p2 = new DataState.V3D.Path()

  p2.push({x: corner.corners[2][0], y: corner.corners[2][1], z: corner.corners[2][2]});
  p2.push({x: corner.corners[3][0], y: corner.corners[3][1], z: corner.corners[3][2]});

  let line2 = new Element.V3D.Line(p2, {material: new THREE.LineBasicMaterial( { color: 0x00ff00 } )});
  a.add_element(line2);

  let p3 = new DataState.V3D.Path()

  p3.push({x: corner.corners[3][0], y: corner.corners[3][1], z: corner.corners[3][2]});
  p3.push({x: corner.corners[0][0], y: corner.corners[0][1], z: corner.corners[0][2]});

  let line3 = new Element.V3D.Line(p3, {material: new THREE.LineBasicMaterial( { color: 0xffff00 } )});
  a.add_element(line3);

});

w.init();
w.start();
