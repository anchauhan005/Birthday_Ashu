(function () {
  let ctx=null, music=null, muted=false, musicStarted=false;
  const getCtx=()=>ctx||(ctx=new (window.AudioContext||window.webkitAudioContext)());
  function tone(freq,duration=.12,type='sine',gain=.04){if(muted)return;try{const ac=getCtx();const o=ac.createOscillator();const g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+duration)}catch(_){}}
  function click(){tone(660,.08,'sine',.03)}
  function celebration(){tone(784,.12,'triangle',.04);setTimeout(()=>tone(988,.2,'triangle',.045),80)}
  function gift(){[523,659,784].forEach((f,i)=>setTimeout(()=>tone(f,.15,'sine',.035),i*70))}
  function transition(){tone(880,.07,'sine',.02)}
  function letter(){tone(523,.16,'triangle',.03);setTimeout(()=>tone(659,.22,'triangle',.035),120)}
  async function startMusic(){if(muted||musicStarted)return false; try{if(music?.src){await music.play();musicStarted=true;return true}musicStarted=true;return false}catch(_){return false}}
  function loadMusic(){if(!CONFIG.audio.birthdayMusic)return;music=new Audio(CONFIG.audio.birthdayMusic);music.loop=true;music.volume=CONFIG.audio.volume;music.preload='auto';music.addEventListener('error',()=>{music=null},{once:true})}
  function setMuted(value){muted=value;if(music){music.muted=muted;if(!muted&&musicStarted)music.play().catch(()=>{})}document.getElementById('muteBtn')?.setAttribute('aria-pressed',String(muted));document.getElementById('muteBtn').textContent=muted?'🔇':'🔊'}
  function toggle(){setMuted(!muted)}
  function fadeMusic(target=.12,duration=900){if(!music)return;const start=music.volume;const begin=performance.now();const step=(now)=>{const t=Math.min(1,(now-begin)/duration);music.volume=start+(target-start)*t;if(t<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
  function reset(){if(music){music.pause();music.currentTime=0;music.volume=CONFIG.audio.volume}musicStarted=false}
  window.AudioSystem={click,celebration,gift,transition,letter,startMusic,loadMusic,setMuted,toggle,fadeMusic,reset,isMuted:()=>muted};
  loadMusic();
})();
