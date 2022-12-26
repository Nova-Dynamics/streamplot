const { DataState, Window, Textbox, Element } = require("../../index.js")

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

var w = new Window(window.$("#container"), {});


var a = w.add_subplot({top:1,bottom:2,left:1,right:2},{
  width : 600,
  height : 400,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  },
  xlim : [-5,5],
  ylim : [-5,5],
  xlabel : "x",
  ylabel : "y"
});

let chart_ds = new DataState.FlowChart()

chart_ds.add_node("quotation")
chart_ds.add_node("process")
chart_ds.add_node("production")
chart_ds.add_node("Purchasing")
chart_ds.add_node("Delivery")

chart_ds.add_link({from_id: "quotation",  to_id: "process",    label: "yourmom"}, 300)
chart_ds.add_link({from_id: "process",    to_id: "production", label: "yourmom"})
chart_ds.add_link({from_id: "process",    to_id: "Purchasing", label: "yourmom"})
chart_ds.add_link({from_id: "Purchasing", to_id: "production", label: "yourmom"})
chart_ds.add_link({from_id: "production", to_id: "Delivery",   label: "yourmom"}, 300)


a.add_element(new Element.FlowChart(chart_ds, {fcolor: "#ff9100"}));

w.init();
w.start();


setInterval(()=>{

    let idx = Math.floor(Math.random() * chart_ds.nodes.length);
    chart_ds.set_active(chart_ds.nodes[idx].id)

}, 500)

setTimeout(()=>{

  chart_ds.remove_node("Delivery")


}, 1750)