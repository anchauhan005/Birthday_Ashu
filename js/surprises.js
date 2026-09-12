(function(){
  const scene=document.getElementById('surpriseScene'),img=document.getElementById('surpriseImage'),video=document.getElementById('surpriseVideo'),placeholder=document.getElementById('mediaPlaceholder');let index=0;
  const animationNames=['zoom','slide','blur','tilt','glow','drop','particles','scale','rotate','emotional'];
  function setCounter(){document.getElementById('surpriseCounter').textContent=`${String(index+1).padStart(2,'0')} / 10`;document.getElementById('placeholderNumber').textContent=String(index+1).padStart(2,'0')}
  function failMedia(){img.hidden=true;video.hidden=true;placeholder.hidden=false}
  function openMedia(item){img.hidden=true;video.hidden=true;placeholder.hidden=false;img.onload=()=>{img.hidden=false;placeholder.hidden=true};img.onerror=failMedia;video.onerror=failMedia;const target=document.getElementById('mediaShell');target.className='media-shell';target.classList.add(`anim-${item.animation||animationNames[index]||'zoom'}`);if(item.type==='video'){video.src=item.src;video.poster=item.poster||'';video.hidden=false;placeholder.hidden=true;video.currentTime=0;video.play().catch(()=>{video.hidden=true;placeholder.hidden=false})}else{img.src=item.src;img.alt=`Birthday memory ${index+1}`;img.hidden=false;placeholder.hidden=true}}
  function render(){const item=CONFIG.surprises[index];setCounter();document.getElementById('surpriseTitle').textContent=`Surprise ${index+1} ✦`;document.getElementById('surpriseMessage').textContent=item.message;document.getElementById('nextSurpriseBtn').textContent=index===CONFIG.surprises.length-1?'💌 One Last Thing →':'✨ Open Next Surprise →';openMedia(item);Particles?.setMode('surprise');Particles?.burst(innerWidth/2,innerHeight*.38,22,'surprise');AudioSystem.transition()}
  function enter(){scene.hidden=false;scene.classList.add('active');index=0;render()}
  function next(){if(index<CONFIG.surprises.length-1){index++;render()}else{window.dispatchEvent(new CustomEvent('birthday:surprises-finished'))}}
  function reset(){index=0;img.removeAttribute('src');video.pause();video.removeAttribute('src');placeholder.hidden=false}
  window.Surprises={enter,next,current:()=>index,reset};document.getElementById('nextSurpriseBtn')?.addEventListener('click',next);
})();
