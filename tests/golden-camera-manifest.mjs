// Camera schema v1. Changes require a new baseline; coordinates are world metres.
export const GOLDEN_BASELINE='9779857b1a7d802980056ecff3ed4048954e7881';
export const GOLDEN_CAMERAS=[
 {id:'01-opening-road',eye:[-5,3,-26],target:[-1,1.4,-17],arrival:18},
 {id:'02-bag-end-door',eye:[11,2.6,2],target:[11,2.1,11]},
 {id:'03-party-tree',eye:[-10,5,10],target:[-2,4,22]},
 {id:'04-home-lane',eye:[-22,3,-7],target:[-12,2,7]},
 {id:'05-wide-meadow',eye:[24,6,-21],target:[0,1,-8]},
 {id:'06-wooded-road',eye:[-20,3,-7],target:[-9,2,5],road:'rider'},
 {id:'07-ferry',eye:[17,4,25],target:[10,1,29.5],road:'crossing',seconds:6},
 {id:'08-bree-gate',eye:[10,3,37],target:[10,3,48],road:'bree'},
 {id:'09-frodo-face',actor:'frodo',offset:[.22,.06,-1],fov:.55},
 {id:'10-gandalf-face',actor:'gandalf',offset:[.35,-.1,-1.7],fov:.55},
 {id:'12-shire-panorama',eye:[-24,22,-35],target:[0,1,10],fov:.95},
 {id:'11-ring-closeup',ring:true,seconds:4,offset:[.15,.1,.28],fov:.72}
];
