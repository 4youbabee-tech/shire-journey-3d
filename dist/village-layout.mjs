// Shire-inspired original compact village layout. Keep story landmarks clear.
export const MAP_BOUNDS=Object.freeze({minX:-49,maxX:49,minZ:-47,maxZ:52});
export const HOMES=Object.freeze([
 {x:11,z:11,s:1.2,color:'green',name:'Bag End'},
 {x:-12,z:7,s:.9,color:'rust',name:'West Hill'},
 {x:-12,z:27,s:.85,color:'blue',name:'Orchard House'},
 {x:19,z:25,s:.75,color:'green',name:'Party Lane'},
 {x:-34,z:-16,s:.74,color:'green',name:'South Mill Lane'},
 {x:-22,z:-29,s:.67,color:'rust',name:'Lower Orchard'},
 {x:-10,z:-32,s:.72,color:'blue',name:'Old Meadow'},
 {x:14,z:-34,s:.72,color:'rust',name:'East Meadow'},
 {x:29,z:-29,s:.8,color:'green',name:'Bywater Road'},
 {x:38,z:-12,s:.7,color:'blue',name:'Brook Cottage'},
 {x:37,z:9,s:.77,color:'rust',name:'Sunflower Hill'},
 {x:34,z:35,s:.77,color:'green',name:'Upper Market'},
 {x:15,z:43,s:.74,color:'blue',name:'North Cross'},
 {x:-6,z:43,s:.78,color:'rust',name:'North Hill'},
 {x:-26,z:41,s:.78,color:'green',name:'Upper Orchard'},
 {x:-38,z:25,s:.71,color:'blue',name:'Garden Lane'},
 {x:-40,z:5,s:.7,color:'rust',name:'West Lane'},
]);
export const ROADS=Object.freeze([
 {width:3.3,points:[[0,-43],[0,-31],[0,-23],[0,-14],[1,-6],[1,1],[4,6],[3,12],[-1,19],[1,30],[1,43]]},
 {width:2.5,points:[[1,0],[-5,1],[-10,5],[-16,10],[-20,16]]},
 {width:2.25,points:[[4,6],[8,7],[11,10]]},
 {width:2.25,points:[[-1,19],[-7,23],[-12,25]]},
 {width:2.35,points:[[-43,-24],[-35,-26],[-25,-24],[-15,-18],[-8,-13],[0,-11]]},
 {width:2.35,points:[[0,-31],[13,-30],[24,-25],[36,-22],[42,-16]]},
 {width:2.5,points:[[0,-12],[10,-7],[23,-5],[32,-5],[39,-2]]},
 {width:2.15,points:[[36,-22],[37,-8],[38,6],[37,20],[34,31]]},
 {width:2.35,points:[[0,26],[11,29],[22,34],[35,37]]},
 {width:2.2,points:[[-34,39],[-23,37],[-11,36],[1,37],[15,39]]},
 {width:2.25,points:[[-41,13],[-32,12],[-25,9],[-17,4],[-11,1]]},
 {width:2.2,points:[[-29,-33],[-22,-25],[-14,-22],[-8,-22],[0,-23]]},
]);
export const LANDMARKS=Object.freeze([
 {id:'road-exit',name:'درب الخروج جنوبًا',x:0,z:-41,type:'road'},
 {id:'bag',name:'بيت بيلبو',x:11,z:11,type:'home'},
 {id:'party',name:'شجرة الاحتفال',x:-2,z:22,type:'tree'},
 {id:'orchard',name:'بستان التفّاح',x:-20,z:17,type:'orchard'},
 {id:'market',name:'سوق القرية',x:27,z:-9,type:'market'},
 {id:'pond',name:'البركة',x:21,z:-2,type:'pond'},
 {id:'mill',name:'بئر القرية',x:-30,z:-15,type:'well'}
]);
