// Touch and keyboard controls for the original, optional Ring interaction.
export function installRingControls({inspection,canInspect,onBegin=()=>{}}){
 const button=document.createElement('button');button.id='inspect-ring';button.type='button';button.dir='rtl';button.textContent='الخاتم · R';button.hidden=true;button.setAttribute('aria-label','افحص الخاتم');
 button.style.cssText='position:fixed;right:16px;bottom:140px;min-height:46px;padding:10px 16px;border:1px solid #d0ad59;border-radius:24px;background:#17251beF;color:#f4e6bb;z-index:25;font:inherit';
 const caption=document.createElement('div');caption.id='ring-inspection-caption';caption.dir='rtl';caption.hidden=true;caption.setAttribute('role','status');caption.style.cssText='position:fixed;left:50%;bottom:205px;transform:translateX(-50%);max-width:calc(100% - 28px);width:470px;padding:14px 18px;border:1px solid #b79853;border-radius:14px;background:#111d19eb;color:#f1e5c4;text-align:center;z-index:26;font:16px/1.7 serif;pointer-events:none';
 document.body.append(button,caption);
 function trigger(){if(inspection.active){inspection.cancel();return;}if(canInspect()){onBegin();inspection.begin();}}
 button.onclick=trigger;
 function key(event){if(event.target instanceof Element&&event.target.closest('input,textarea'))return;const command=event.code==='KeyR'||event.code==='Escape'&&inspection.active;if(!command)return;if(!inspection.active&&!canInspect())return;event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)trigger();}
 window.addEventListener('keydown',key,true);
 function update(){if(inspection.active&&!canInspect())inspection.cancel();const active=inspection.active;button.hidden=!active&&!canInspect();button.textContent=active?'أعِد الخاتم · Esc':'الخاتم · R';button.setAttribute('aria-pressed',String(active));caption.hidden=!active;caption.textContent=active?inspection.snapshot().beat.caption:'';}
 return {update,dispose(){window.removeEventListener('keydown',key,true);button.remove();caption.remove();}};
}
