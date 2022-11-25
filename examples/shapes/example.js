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


let circle_pos = new DataState.Point();

circle_pos.x = 3
circle_pos.y = 2
a.add_element(new Element.SVGRenderer(circle_pos, {fcolor:"#00ff00aa"}));


let landscape = new DataState.Path()

a.plot(landscape, {scolor:"#0000aa"})

w.init();
w.start();

var t0 = Date.now();


// setInterval(()=>{

//   landscape.set([...Array(30)].map((d,i) => ({x: 3*Math.sin(t)+0.1*i, y: 0.01*i**2})))
// },100)


// setInterval(() => {
//   t = (Date.now()-t0)*5e-4
//   circle_pos.x = Math.sin(t);
//   circle_pos.y = 1-Math.cos(t);
// }, 10);
