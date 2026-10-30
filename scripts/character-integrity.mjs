import {createHash} from 'node:crypto';
export function validateGLB(data,expected){
 if(data.length!==expected.bytes)throw Error('GLB byte length mismatch');
 if(createHash('sha256').update(data).digest('hex')!==expected.sha256)throw Error('GLB checksum mismatch');
 if(data.readUInt32LE(0)!==0x46546c67||data.readUInt32LE(4)!==2||data.readUInt32LE(8)!==data.length)throw Error('Invalid GLB header');
 let offset=12,json,binary;
 while(offset<data.length){
  if(offset+8>data.length)throw Error('Truncated GLB chunk header');
  const size=data.readUInt32LE(offset),type=data.readUInt32LE(offset+4);offset+=8;
  if(size%4||offset+size>data.length)throw Error('Truncated GLB chunk');
  if(type===0x4e4f534a)json=JSON.parse(data.subarray(offset,offset+size).toString());
  if(type===0x004e4942)binary=data.subarray(offset,offset+size);
  offset+=size;
 }
 if(!json||!binary||json.buffers.length!==1||json.buffers[0].uri||json.buffers[0].byteLength>binary.length)throw Error('GLB must be self-contained');
 for(const view of json.bufferViews??[])if(view.buffer!==0||(view.byteOffset??0)+view.byteLength>binary.length)throw Error('GLB buffer view outside binary chunk');
 if(!json.skins?.length||!json.meshes?.some(m=>m.primitives.some(p=>p.attributes.JOINTS_0!==undefined&&p.attributes.WEIGHTS_0!==undefined)))throw Error('Missing character skin weights');
 for(const name of ['Idle','Walking_A','Running_A','Interact','Cheer'])if(!json.animations?.some(a=>a.name===name))throw Error('Missing animation '+name);
 return json;
}
