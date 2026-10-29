// Original pastoral score: 12-second motif, no sampled or copyrighted recordings.
// Small voice count keeps the soundtrack practical on entry-level phones.
const F={D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,D5:587.33};
export function pastoralPhrase(variation=0){
 const k=((Math.trunc(variation)%4)+4)%4;
 const bass=['D3','G3','B3','A3'];
 const motifs=[
  ['D4','F4','A4','G4','F4','E4','D4','A3'],
  ['E4','G4','B4','A4','G4','F4','E4','D4'],
  ['F4','A4','D5','B4','A4','G4','F4','E4'],
  ['D4','E4','G4','F4','E4','D4','A3','D4']
 ];
 const score=[];
 for(let bar=0;bar<4;bar++){
  const root=F[bass[(bar+k)%4]],t=bar*3;
  score.push({at:t,frequency:root,duration:2.45,volume:.042,wave:'sine'});
  score.push({at:t+.12,frequency:root*2,duration:1.75,volume:.014,wave:'triangle'});
  const notes=motifs[(bar+k)%4];
  for(let n=0;n<4;n++){const index=(n*2+(k%2))%8;score.push({at:t+.3+n*.67,frequency:F[notes[index]],duration:.58,volume:.025+(n===0?.004:0),wave:'triangle'});}
 }
 return score;
}
