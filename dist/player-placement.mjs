import {terrainHeightAt} from './terrain.mjs';
// Scene handoffs must use the same foot clearance as ordinary outdoor movement.
export function placePlayerOnTerrain(world,x,z){
 const height=terrainHeightAt(x,z);
 world.body.position.set(x,height+.72,z);
 world.player.root.position.set(x,height+.02,z);
 return {x,y:height+.72,z};
}
