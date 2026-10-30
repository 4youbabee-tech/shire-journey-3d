import test from 'node:test';import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';import {createGardenToolRig} from '../dist/garden-tools.mjs';const B=globalThis.BABYLON;
test('the trowel follows a translated and turned imported palm frame, with finite concave geometry',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);
 try{const parent=new B.TransformNode('actor',scene),hand=new B.TransformNode('hand',scene);hand.parent=parent;hand.position.set(.3,.8,0);const joint=(name,x,z)=>{const n=new B.TransformNode(name,scene);n.parent=hand;n.position.set(x,0,z);return n;};const middle=joint('middle',0,.1),index=joint('index',.03,.1),ring=joint('ring',-.03,.1),rig=createGardenToolRig(B,scene,{parent,hand,middle,index,ring,id:'test gardener'});
 for(const yaw of [0,.7,-1.2]){parent.position.set(4,.2,7);parent.rotation.y=yaw;hand.rotation.x=yaw*.3;rig.update();rig.root.computeWorldMatrix(true);const expected=B.Vector3.Lerp(hand.getAbsolutePosition(),middle.getAbsolutePosition(),.6);assert.ok(B.Vector3.Distance(expected,rig.root.getAbsolutePosition())<1e-5);const direction=middle.getAbsolutePosition().subtract(hand.getAbsolutePosition()).normalize();assert.ok(B.Vector3.Dot(rig.root.getDirection(B.Axis.Z).normalize(),direction)>.999);}
 for(const mesh of rig.root.getChildMeshes())for(const kind of [B.VertexBuffer.PositionKind,B.VertexBuffer.NormalKind])assert.ok(mesh.getVerticesData(kind).every(Number.isFinite));
 rig.update(false);assert.equal(rig.root.isEnabled(),false);rig.update(true);assert.equal(rig.root.isEnabled(),true);
 }finally{scene.dispose();engine.dispose();}
});
