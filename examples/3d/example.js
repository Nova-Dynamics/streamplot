const { DataState, Window, Vis3D, Element } = require("../../index.js")

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

console.log(window.$("#container"))
var w = new Window(window.$("#container"), {});


var a = new Vis3D(w, {top:1,bottom:2,left:1,right:2},{
  title: "Isthisworking",
  width : 800,
  height : 600,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  }
});

let point = new DataState.V3D.Point()

a.add_element(new Element.V3D.Sphere(point, {radius: 0.1}));


w.init();
w.start();

var t0 = Date.now();

setInterval(()=>{

  t = (Date.now()-t0)*5e-4

  point.x = 2*Math.sin(t);
  point.y = 2-2*Math.cos(t);


},30)