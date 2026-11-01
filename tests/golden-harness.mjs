import {createWorld} from '/world.mjs';import {loadNature} from '/nature.mjs';import {loadCharacters} from '/characters.mjs';import {createArrival,loadArrivalHorse} from '/arrival.mjs';import {createBagEndInterior} from '/interior.mjs';import {createRingLegacy} from '/ring-legacy.mjs';import {createShireRoad} from '/shire-road.mjs';import {BUILD} from '/build-info.mjs';
const B=window.BABYLON,V=B.Vector3,canvas=document.querySelector('canvas'),engine=new B.Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true});engine.loadingScreen={displayLoadingUI(){},hideLoadingUI(){}};
const scene=new B.Scene(engine),camera=new B.UniversalCamera('B1 fixed evidence camera',new V(0,5,-23),scene);camera.minZ=.15;camera.maxZ=200;camera.fov=.87;camera.inputs.clear();const world=createWorld(B,scene,{deferredNature:true,deferredCharacters:true}),nature=await loadNature(B,scene,world),actors=await loadCharacters(B,scene,world),arrival=createArrival(B,scene,world);await loadArrivalHorse(B,scene,arrival);const road=createShireRoad(B,scene,world,{nature,createHorse:()=>arrival.createTravelHorse()}),room=createBagEndInterior(B,scene),legacy=createRingLegacy(B,scene,world,room);
await scene.whenReadyAsync();
function freeze(){for(const g of scene.animationGroups){if(g.isStarted){g.goToFrame(g.from);g.pause();}}for(const c of world.characters)c.root.computeWorldMatrix(true);}
window.__GOLDEN__={build:BUILD,async capture(spec){
 if(road.active)road.deactivate();if(arrival.active)arrival.end(camera);if(legacy.active)legacy.end();camera.minZ=.15;camera.fov=spec.fov||.87;
 if(spec.arrival!==undefined){arrival.begin(camera);const pose=arrival.update(spec.arrival,camera);actors.update(0,null,false,pose);}
 if(spec.road){road.activate({step:spec.road});for(let i=0;i<Math.round((spec.seconds||1)*60);i++)road.update(1/60,{moving:false,paused:false});}
 if(spec.ring){legacy.begin();actors.update(0,null,false,legacy.update(spec.seconds));}
 freeze();scene.onAfterAnimationsObservable.notifyObservers(scene);
 let target=spec.target&&new V(...spec.target),eye=spec.eye&&new V(...spec.eye);
 if(spec.actor){const actor=world.characters.find(c=>c.id===spec.actor);actor.root.rotation.y=0;actor.imported.head.computeWorldMatrix(true);target=actor.imported.head.getAbsolutePosition().clone();eye=target.add(new V(...spec.offset));}
 if(spec.ring){const ring=scene.meshes.find(m=>m.name==='Bilbo plain gold heirloom');if(!ring)throw Error('Ring mesh not found');target=ring.getAbsolutePosition().clone();eye=target.add(new V(...spec.offset));}
 camera.position.copyFrom(eye);camera.setTarget(target);await scene.whenReadyAsync();scene.render(false,true);scene.render(false,true);
 return {id:spec.id,build:BUILD,camera:{eye:camera.position.asArray(),target:camera.getTarget().asArray(),fov:camera.fov,minZ:camera.minZ},activeMeshes:scene.getActiveMeshes().length,activeTriangles:scene.getActiveIndices()/3,renderSize:[engine.getRenderWidth(),engine.getRenderHeight()],fixedPose:true,gameplay:false};
}};
