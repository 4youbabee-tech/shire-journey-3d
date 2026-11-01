// Unclamped real frame intervals. No engine/game timestep participates in FPS.
export const PERF_TARGET_MS=300000;
export function quantile(values,p){if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),i=(a.length-1)*p,l=Math.floor(i);return a[l]+(a[Math.ceil(i)]-a[l])*(i-l);}
export function summarizeFrames(samples){
 if(!samples.length)return {frames:0,activeMs:0,medianFPS:null,p05FPS:null,slowestFivePercentFPS:null,averageFPS:null,drawCalls:null,triangles:null};
 const ms=samples.map(s=>s.ms),sum=ms.reduce((a,b)=>a+b,0),slow=[...ms].sort((a,b)=>b-a).slice(0,Math.max(1,Math.ceil(ms.length*.05)));
 const stats=key=>({median:quantile(samples.map(s=>s[key]),.5),p95:quantile(samples.map(s=>s[key]),.95),max:samples.reduce((n,s)=>Math.max(n,s[key]),0)});
 return {frames:ms.length,activeMs:sum,medianFPS:1000/quantile(ms,.5),p05FPS:1000/quantile(ms,.95),slowestFivePercentFPS:1000/(slow.reduce((a,b)=>a+b,0)/slow.length),averageFPS:ms.length*1000/sum,drawCalls:stats('drawCalls'),triangles:stats('triangles')};
}
export function createRecorder(targetMs=PERF_TARGET_MS){
 let last=null,activeMs=0,done=false;const samples=[];
 return {tick(now,eligible,drawCalls=0,triangles=0){if(done)return;if(!eligible){last=null;return;}if(last!==null){const ms=now-last;if(Number.isFinite(ms)&&ms>0){samples.push({ms,drawCalls,triangles});activeMs+=ms;if(activeMs>=targetMs)done=true;}}last=now;},pause(){last=null;},get elapsedMs(){return activeMs;},get done(){return done;},report(){return {targetMs,completed:done,...summarizeFrames(samples)};}};
}
