const StreamPlot = require("../../index.js")

window.jQuery = window.$ = require("jquery");
window.$ = require("jquery");

console.log(window.$("#container"))
var w = new StreamPlot.Window(window.$("#container"), {});

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

a.plot(StreamPlot.datastate.TimeSinceDS,{scolor:"steelblue",tmax_seconds:20,data_path:'voltage'});
// Equivalent to:
//   Line.plot(a,TimeSinceDS,{scolor:"steelblue",tmax_seconds:20,data_path:'voltage'});
a.plot(StreamPlot.datastate.TimeSinceDS,{scolor:"red",tmax_seconds:20,data_path:'speed'});
// Line.plot(a,TimeSinceDS,{scolor:"red",tmax_seconds:20,data_path:'speed'});


StreamPlot.Textbox.write(w,{top:2,bottom:3,left:1,right:3},{title:"Platform.state"},[
  {
    data_path : "platform.state",
    string_func : (obj) => `Neck Yaw: ${parseInt(obj.neck_yaw)} mrad`,
    default_string: "Neck Yaw: N.A."
  },{
    data_path : "platform.state",
    string_func : (obj) => `Neck Pitch: ${parseFloat(obj.neck_pitch)} mrad`,
    default_string: "Neck Pitch: N.A."
  }
]);

var a2 = w.add_subplot({top:1,bottom:2,left:2,right:3},{
  width : 600,
  height : 600,
  margins : {
    top: 30, right: 20, bottom: 30, left: 50
  },
  xlim : [-2.5,2.5],
  ylim : [-0.05,4.95],
  title : "Flow Map"
});

a2.imshow(StreamPlot.datastate.MatrixRGBBottomCenterDS,{data_path:'map',dimensions:[50,50]});
// StreamPlot.element.Matrix.plot(a2,StreamPlot.datastate.MatrixRGBBottomCenterDS,{data_path:'map',dimensions:[50,50]});

a2.plot(StreamPlot.datastate.TrajectoryDS,{scolor:"#00aa00",tmax_seconds:20,data_path:'current_dead_reckon'});
// StreamPlot.element.Line.plot(a2,StreamPlot.datastate.TrajectoryDS,{scolor:"#00aa00",tmax_seconds:20,data_path:'current_dead_reckon'});

StreamPlot.element.Pointer.plot(a2,StreamPlot.datastate.PoseDS,{fcolor:"#000000aa",data_path:'current_dead_reckon'})

var e6 = new StreamPlot.element.Pointer(a2,{fcolor:"#aa0000aa", skewness: 4, width:0.05});
var d6 = new StreamPlot.datastate.PoseDS(e6,{data_path:'current_dead_reckon'});
var d7 = new StreamPlot.datastate.SingleValueDS(e6,{data_path:'platform.state',key:'neck_yaw'});

StreamPlot.element.Line.plot(a2,StreamPlot.datastate.PathDS,{scolor:"#0000aa",data_path:'landscape'})

w.init();
w.start();


// Emulate
var t0 = Date.now();
var iter = [...Array(50)]
setInterval(()=>{
  w.update({type:"voltage",data:Math.sin((Date.now()-t0)*5e-4)})
},30)
setInterval(()=>{
  w.update({type:"speed",data:Math.sin((Date.now()-t0)*5e-4)**2})
},30)
setInterval(()=>{
  t = (Date.now()-t0)*5e-4
  w.update({type:"current_dead_reckon",data:{x:2*Math.sin(t),y:2-2*Math.cos(t),heading:Math.PI/2 - t}})
},30)
setInterval(()=>{
  w.update({type:"map",data: iter.map((d)=>iter.map((d)=>randcolor()))})
},1000)
setTimeout(()=>{
  w.update({type:"landscape",data:{path:[...Array(30)].map((d,i) => [0.1*i,0.01*i**2])}})
},1000)
setInterval(()=>{
  t = (Date.now()-t0)*5e-4
  w.update({type:"platform.state",data:{neck_yaw:t,neck_pitch:0.1*t}})
},100)
