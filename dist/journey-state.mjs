// Film chapters have their own saved gate; side activities do not advance them.
export const JOURNEY_PHASES=Object.freeze(['birthday','investigation','revelation','departure','roads']);
export function restoreJourneyPhase(value,partyCompleted){return partyCompleted&&JOURNEY_PHASES.includes(value)?value:'birthday';}
export const journeyChapter=s=>s.journeyPhase==='roads'?'F1-03':s.journeyPhase&&s.journeyPhase!=='birthday'?'F1-02':'F1-01';
export const ringDangerKnown=(s,id)=>['departure','roads'].includes(s.journeyPhase)&&['frodo','gandalf','sam'].includes(id);
export const travelRoster=s=>['departure','roads'].includes(s.journeyPhase)?['frodo','sam']:[];
export function advanceJourney(s,action){if(s.stage!==5||!s.partyCompleted)return false;const gates={'research-ring':['birthday','investigation'],'begin-revelation':['investigation','revelation'],'finish-revelation':['revelation','departure'],'leave-village':['departure','roads']};const g=gates[action];if(!g||(s.journeyPhase||'birthday')!==g[0])return false;s.journeyPhase=g[1];return true;}
