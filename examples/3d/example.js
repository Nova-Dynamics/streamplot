const { DataState, Window, Vis3D, Element } = require("../../index.js")

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

console.log(window.$("#container"))
var w = new Window(window.$("#container"), {});


var a = new Vis3D(w, {top:1,bottom:2,left:1,right:2},{
  title: "Isthisworking",
  width : 600,
  height : 400,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  }
});

//a.connect_to_window()

w.init();
w.start();
