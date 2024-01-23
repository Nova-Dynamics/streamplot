const { DataState, Window, Vis3D, Element } = require("../../../index.js")
const THREE = require('three');
const voxels = require("./voxels.json");

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

let configs = []
// let colors = [
//   0xffffff,
//   0x0000ff,
//   0x00ff00,
//   0x00ffff,
//   0xff0000,
//   0xff00ff,
//   0xffff00,
//   0xffffff

// ]

let colors = [
  0x0f00ff,
  0x00ff00,
  0x00ffff,
  0xff0000,
]

let class_count = {
  "0": 0,
  "1": 0,
  "2": 0,
  "3": 0,  
};

for (let voxel of voxels.voxels)
{
  if (class_count[voxel[3]] == undefined)
    class_count[voxel[3]] = 0;
  
  class_count[voxel[3]] += 1;
}

console.log(class_count)

let voxelmap = new Element.V3D.VoxelMap(new DataState.V3D.Point(), {voxel_size: voxels.dimensions.dx})

voxelmap.add_class("0", colors[0], class_count[0], 0.05, false, false)
voxelmap.add_class("1", colors[1], class_count[1])
voxelmap.add_class("2", colors[2], class_count[2])
voxelmap.add_class("3", colors[3], class_count[3], 0.05, false, false)



for (let voxel of voxels.voxels)
{

  if (voxel[3] == 1) continue;

  voxelmap.set_voxel(voxel[0]*voxels.dimensions.dx, voxel[1]*voxels.dimensions.dx, voxel[2]*voxels.dimensions.dx, voxel[3])


}

a.add_element(voxelmap);


w.init();
w.start();

let t = 0;
setInterval(() => {
  
  t += 0.01;
  let x = Math.sin(t);
  let y = Math.cos(t);

  voxelmap.set_voxel(x, y, 0.5, 1)
}, 100);


