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
  xlim : [0,20],
  ylim : [-1.0,1.0],
  xlabel : "Time Since (sec)",
  ylabel : "Value"
});


let voltage = new DataState.TimeSince({tmax_seconds:20});
let current = new DataState.TimeSince({tmax_seconds:20});
let expected = new DataState.Path();

a.plot(voltage, {scolor:"steelblue"});
a.plot(current, {scolor:"green"});
a.plot(expected, {scolor:"red"});



w.init();
w.start();


for (let i=0;i<20;i++)
  expected.push({x: i, y: (i/10)-1})



setInterval(()=>{
  voltage.push(Math.random())
  current.push(Math.random()-1)
}, 100)
