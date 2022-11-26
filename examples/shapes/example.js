const { DataState, Window, Textbox, Element } = require("../../index.js")

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

console.log(window.$("#container"))
var w = new Window(window.$("#container"), {});


var a = w.add_subplot({top:1,bottom:2,left:1,right:2},{
  width : 600,
  height : 400,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  },
  xlim : [-5,5],
  ylim : [-5,5],
  xlabel : "Time Since (sec)",
  ylabel : "Value"
});


let svg_pos = new DataState.Point();

svg_pos.x = 3
svg_pos.y = 2
a.add_element(new Element.SVGRenderer(svg_pos, Element.Resources.LocationPinIcon, {size: 15}));


let landscape = new DataState.Path()

a.plot(landscape, {scolor:"#0000aa"})

w.init();
w.start();

var t0 = Date.now();


setInterval(()=>{

  landscape.set([{x:0, y:1}, svg_pos])
},100)


setInterval(() => {
  t = (Date.now()-t0)*5e-4
  svg_pos.x = Math.sin(t);
  svg_pos.y = 1-Math.cos(t);
}, 10);
