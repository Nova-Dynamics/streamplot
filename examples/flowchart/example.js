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

// chart_ds.nodes = [
//   {title: "quotation", width: 100, height: 50},
//   {title: "process order", width: 100, height: 50},
//   {title: "production", width: 100, height: 50},
//   {title: "Purchasing", width: 100, height: 50},
//   {title: "Delivery", width: 100, height: 50}
// ]

// chart_ds.links = [
//   {source: 0, target: 1, link_label: "yourmom"},
//   {source: 1, target: 2, link_label: "yourmom"},
//   {source: 1, target: 3, link_label: "yourmom"},
//   {source: 3, target: 2, link_label: "yourmom"},
//   {source: 2, target: 4, link_label: "yourmom"},
// ]

chart_ds.nodes = [
  {id: "quotation", width: 100, height: 50},
  {id: "process order", width: 100, height: 50},
  {id: "production", width: 100, height: 50},
  {id: "Purchasing", width: 100, height: 50, active: false},
  {id: "Delivery", width: 100, height: 50}
]

chart_ds.links = [
  {source: "quotation", target: "process order", link_label: "yourmom"},
  {source: "process order", target: "production", link_label: "yourmom"},
  {source: "process order", target: "Purchasing", link_label: "yourmom"},
  {source: "Purchasing", target: "production", link_label: "yourmom"},
  {source: "production", target: "Delivery", link_label: "yourmom"},
]

a.add_element(new Element.FlowChart(chart_ds, {fcolor: "#ff9100"}));

w.init();
w.start();

setTimeout(()=>{
  // chart_ds.nodes = [
  //   {id: "a", width: 100, height: 5},
  //   {id: "b"},
  //   {id: "c"},
  //   {id: "d", active: true}
  //   ]
  //   chart_ds.links = [
  //   {source: "a", target: "b"},
  //   {source: "b", target: "c"},
  //   {source: "c", target: "d"},
  //   {source: "d", target: "a"}
  //   ]

    chart_ds.nodes = [
      {id: "quotation", width: 100, height: 50},
      {id: "process order", width: 100, height: 50},
      {id: "production", width: 100, height: 50},
      {id: "Purchasing", width: 100, height: 50, active: true},
      {id: "Delivery", width: 100, height: 50}
    ]
    
    chart_ds.links = [
      {source: "quotation", target: "process order", link_label: "yourmom"},
      {source: "process order", target: "production", link_label: "yourmom"},
      {source: "process order", target: "Purchasing", link_label: "yourmom"},
      {source: "Purchasing", target: "production", link_label: "yourmom"},
      {source: "production", target: "Delivery", link_label: "yourmom"},
    ]
}, 500)

// setInterval(()=>{
//   chart_ds.nodes.forEach((n)=>{
//     n.active = false;
//     console.log(n)
//   })
//   let idx = Math.floor(Math.random() * 4)

//   chart_ds.nodes[idx].active = true;

//   console.log(idx)

//   chart_ds.is_updated = true
// }, 500)