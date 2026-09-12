(function () {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  let w=0,h=0,dpr=1,running=false,raf=0,last=0,launchTimer=0;
  const rockets=[], sparks=[]; const MAX_SPARKS=520, MAX_ROCKETS=5;
  const colors=['#ffd76a','#ff93c2','#a994ff','#ffffff','#cbb4ff'];
  function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function launch(){ if(rockets.length>=MAX_ROCKETS)return; rockets.push({x:w*(0.18+Math.random()*.64),y:h+10,vx:(Math.random()-.5)*.7,vy:-(5+Math.random()*1.9),targetY:h*(.12+Math.random()*.25),color:colors[(Math.random()*colors.length)|0],trail:[]}); }
  function explode(r){ const count=45+((Math.random()*35)|0); for(let i=0;i<count&&sparks.length<MAX_SPARKS;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*3.1;sparks.push({x:r.x,y:r.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:.012+Math.random()*.012,color:r.color,size:.8+Math.random()*1.6})} }
  function frame(t){raf=requestAnimationFrame(frame);if(!running){last=t;return}const dt=Math.min((t-last)/16.667,2);last=t;ctx.clearRect(0,0,w,h);launchTimer-=dt;if(launchTimer<=0){launch();launchTimer=28+Math.random()*45}
    for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy+=.025*dt;r.trail.push({x:r.x,y:r.y});if(r.trail.length>7)r.trail.shift();ctx.beginPath();for(let j=0;j<r.trail.length;j++){const p=r.trail[j];ctx.globalAlpha=j/r.trail.length;ctx.strokeStyle=r.color;ctx.lineWidth=1;ctx.lineTo(p.x,p.y)}ctx.stroke();ctx.globalAlpha=.9;ctx.fillStyle='#fff';ctx.fillRect(r.x-1,r.y-1,2,2);if(r.y<=r.targetY||r.vy>=0){explode(r);rockets.splice(i,1)}}
    for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=.045*dt;s.life-=s.decay*dt;ctx.globalAlpha=Math.max(0,s.life);ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();if(s.life<=0)sparks.splice(i,1)}ctx.globalAlpha=1}
  function start(){if(running)return;running=true;canvas.classList.add('active');canvas.style.opacity='1';resize();last=performance.now();launchTimer=5;raf=raf||requestAnimationFrame(frame)}
  function stop(){running=false;rockets.length=0;sparks.length=0;ctx.clearRect(0,0,w,h);canvas.classList.remove('active');canvas.style.opacity='0'}
  addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)return;last=performance.now()});window.Fireworks={start,stop};resize();
})();
