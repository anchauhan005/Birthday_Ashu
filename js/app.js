(function(){
  'use strict';
  const STATES=['OPENING','CAKE','CELEBRATION','WAITING_FOR_GIFT','GIFT','SURPRISES','LETTER','FINAL'];let state='OPENING',celebrationTimer=null;
  const sections={OPENING:document.getElementById('opening'),CAKE:document.getElementById('cakeScene'),CELEBRATION:document.getElementById('celebration'),GIFT:document.getElementById('giftScene'),SURPRISES:document.getElementById('surpriseScene'),LETTER:document.getElementById('letterScene'),FINAL:document.getElementById('finalScene')};
  document.querySelectorAll('[data-sister-name]').forEach(el=>el.textContent=CONFIG.sisterName);document.getElementById('letterCardTitle').textContent=`${CONFIG.letter.title.replace('My Sister',CONFIG.sisterName)}`;
  function hideAll(){Object.values(sections).forEach(s=>{if(!s)return;s.hidden=true;s.classList.remove('active','entering')})}
  function show(section){hideAll();section.hidden=false;requestAnimationFrame(()=>section.classList.add('active'));}
  function go(next){state=next;ACCESSIBILITY.announce(`Birthday surprise: ${next.toLowerCase()}`);if(next==='OPENING'){show(sections.OPENING);Particles.setMode('opening')}
    if(next==='CAKE'){show(sections.CAKE);Particles.setMode('cake');Cake.enter()}
    if(next==='CELEBRATION'){show(sections.CELEBRATION);Particles.setMode('celebration');Fireworks.start();AudioSystem.celebration();AudioSystem.startMusic();}
    if(next==='WAITING_FOR_GIFT'){show(sections.CELEBRATION);Particles.setMode('celebration');clearTimeout(celebrationTimer);celebrationTimer=setTimeout(()=>go('GIFT'),CONFIG.timings.celebrationWait)}
    if(next==='GIFT'){show(sections.GIFT);Particles.setMode('gift');}
    if(next==='SURPRISES'){Fireworks.stop();Surprises.enter();}
    if(next==='LETTER'){Fireworks.stop();AudioSystem.fadeMusic?.(0.18);show(sections.LETTER);Letter.enter()}
    if(next==='FINAL'){Fireworks.stop();AudioSystem.fadeMusic?.(0.10);show(sections.FINAL);Particles.setMode('final');Particles.burst(innerWidth/2,innerHeight*.45,35,'letter')}
  }
  document.getElementById('openSurpriseBtn').addEventListener('click',()=>{AudioSystem.click();Particles.burst(innerWidth/2,innerHeight/2,50,'opening');go('CAKE')});
  document.getElementById('giftBox').addEventListener('click',()=>{AudioSystem.gift();document.getElementById('giftBox').classList.add('opening');Particles.burst(innerWidth/2,innerHeight*.48,70,'gift');setTimeout(()=>go('SURPRISES'),900)});
  document.getElementById('muteBtn').addEventListener('click',AudioSystem.toggle);
  document.getElementById('replayBtn')?.addEventListener('click',()=>{clearTimeout(celebrationTimer);Surprises.reset?.();Letter.reset?.();document.getElementById('giftBox')?.classList.remove('opening');window.scrollTo({top:0,left:0,behavior:'auto'});AudioSystem.reset?.();go('OPENING')});
  window.addEventListener('birthday:letter-finished',()=>go('FINAL'));
  window.addEventListener('birthday:candles-blown',()=>{go('CELEBRATION');setTimeout(()=>go('WAITING_FOR_GIFT'),1200)});
  window.addEventListener('birthday:surprises-finished',()=>go('LETTER'));
  try { go('OPENING'); } catch (error) { console.error('Birthday app failed to initialize:', error); document.getElementById('opening')?.classList.add('active'); document.getElementById('opening')?.removeAttribute('hidden'); }
})();
