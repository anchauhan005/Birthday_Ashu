(function(){
  'use strict';

  const scene = document.getElementById('cakeScene');
  const statusEl = document.getElementById('micStatus');
  const hintEl = document.getElementById('blowHint');
  const cakeWrap = document.getElementById('cakeWrap');
  const micBtn = document.getElementById('startMicBtn');
  const holdBtn = document.getElementById('holdBlowBtn');
  const manualBtn = document.getElementById('manualBlowBtn');

  let blown = false;
  let listening = false;
  let stream = null;
  let audioCtx = null;
  let analyser = null;
  let source = null;
  let frequencyData = null;
  let raf = 0;
  let calibrationTimer = 0;
  let baseline = 0.012;
  let blowFrames = 0;
  let lastMeter = -1;
  let meterEl = null;
  let thresholdEl = null;

  const flames = () => [...document.querySelectorAll('#candles .flame')];

  function setStatus(text, state){
    if(statusEl) statusEl.textContent = text;
    if(statusEl) statusEl.dataset.state = state || '';
  }

  function ensureMeter(){
    if(meterEl || !statusEl) return;
    const wrap = document.createElement('div');
    wrap.className = 'mic-meter';
    wrap.innerHTML = '<div class="mic-meter-track"><span class="mic-meter-fill"></span><i class="mic-meter-threshold"></i></div><div class="mic-meter-label"><span>Mic level</span><span class="mic-meter-value">0%</span></div>';
    statusEl.insertAdjacentElement('afterend', wrap);
    meterEl = wrap.querySelector('.mic-meter-fill');
    thresholdEl = wrap.querySelector('.mic-meter-threshold');
  }

  function setMeter(level, threshold){
    if(!meterEl) return;
    const pct = Math.max(0, Math.min(100, level * 100));
    const thresholdPct = Math.max(0, Math.min(100, threshold * 100));
    if(Math.abs(pct-lastMeter) > 1){
      meterEl.style.width = pct.toFixed(1) + '%';
      const label = meterEl.parentElement?.nextElementSibling?.querySelector('.mic-meter-value');
      if(label) label.textContent = Math.round(pct) + '%';
      lastMeter = pct;
    }
    if(thresholdEl) thresholdEl.style.left = thresholdPct.toFixed(1) + '%';
  }

  function enter(){
    cleanup();
    scene.hidden = false;
    scene.classList.add('active','entering');
    blown = false;
    blowFrames = 0;
    cakeWrap?.classList.remove('blown','windy');
    flames().forEach(f => { f.style.opacity = '1'; });
    setStatus('Microphone is optional — you can also hold the button or tap Blow Out Candles.','idle');
    requestAnimationFrame(() => scene.classList.add('cake-ready'));
  }

  function cleanup(){
    listening = false;
    if(raf) cancelAnimationFrame(raf);
    if(calibrationTimer) clearTimeout(calibrationTimer);
    raf = 0;
    calibrationTimer = 0;
    if(source){ try{ source.disconnect(); }catch(e){} source=null; }
    if(analyser){ try{ analyser.disconnect(); }catch(e){} analyser=null; }
    frequencyData = null;
    if(stream){ stream.getTracks().forEach(t => t.stop()); stream=null; }
    blowFrames = 0;
    setMeter(0, .08);
  }

  function extinguish(){
    if(blown) return;
    blown = true;
    cleanup();
    scene.classList.add('candles-out');
    cakeWrap?.classList.add('blown');
    if(hintEl) hintEl.textContent = 'Wish made. ✨';
    setStatus('✨ The candles are out! Your wish is on its way.','success');
    if(micBtn) micBtn.disabled = true;
    if(window.AudioSystem) AudioSystem.transition();
    if(window.Particles) Particles.burst(innerWidth/2, innerHeight*.45, 45, 'cake');
    setTimeout(() => window.dispatchEvent(new CustomEvent('birthday:candles-blown')), 650);
  }

  function rmsFrom(data){
    let sum = 0;
    for(let i=0;i<data.length;i++){
      const n = (data[i]-128)/128;
      sum += n*n;
    }
    return Math.sqrt(sum/data.length);
  }


  async function enableMic(){
    if(blown || listening) return;
    ensureMeter();
    if(!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
      setStatus('For microphone access, run this folder on localhost (example: python -m http.server 8000).','error');
      return;
    }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      setStatus('This browser does not expose microphone access here. Open the site on localhost or HTTPS.','error');
      return;
    }

    try{
      setStatus('Requesting microphone permission…','working');
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1
        }
      });

      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) throw new Error('AudioContext unsupported');
      audioCtx = audioCtx || new AC();
      if(audioCtx.state === 'suspended') await audioCtx.resume();

      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.05;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);

      listening = true;
      baseline = 0.012;
      blowFrames = 0;
      setStatus('Calibrating room noise… stay quiet for one second.','working');

      const timeData = new Uint8Array(analyser.fftSize);
      const samples = [];
      const started = performance.now();

      const calibrate = () => {
        if(!listening || !analyser) return;
        analyser.getByteTimeDomainData(timeData);
        samples.push(rmsFrom(timeData));
        const elapsed = performance.now()-started;
        if(elapsed < 900){
          setMeter(samples[samples.length-1], .08);
          raf = requestAnimationFrame(calibrate);
          return;
        }

        samples.sort((a,b)=>a-b);
        const quiet = samples.slice(0, Math.max(1, Math.floor(samples.length*.7)));
        baseline = quiet.reduce((a,b)=>a+b,0)/quiet.length;
        baseline = Math.max(.004, Math.min(.06, baseline));
        setStatus('Microphone ready — blow steadily toward your microphone.','ready');
        detect();
      };

      const detect = () => {
        if(!listening || !analyser || blown) return;
        analyser.getByteTimeDomainData(timeData);
        const rms = rmsFrom(timeData);
        // Adaptive threshold: deliberately forgiving because laptop microphones
        // can report very different RMS levels.
        const threshold = Math.max(.035, baseline*1.9 + .012);
        setMeter(rms, threshold);

        // A real blow must stay above the adaptive threshold for several frames.
        // This is much more reliable than waiting for one loud sample.
        const strongEnough = rms > threshold;
        if(strongEnough) blowFrames += 1;
        else blowFrames = Math.max(0, blowFrames-2);

        // At ~60fps this is roughly 250ms of sustained blowing.
        if(blowFrames >= 15){
          extinguish();
          return;
        }
        raf = requestAnimationFrame(detect);
      };

      raf = requestAnimationFrame(calibrate);
    }catch(error){
      console.error('Microphone error:', error);
      cleanup();
      let message = 'Microphone could not be started.';
      if(error?.name === 'NotAllowedError') message = 'Microphone permission was blocked. Allow microphone access for this site, then try again.';
      else if(error?.name === 'NotFoundError') message = 'No microphone was found. Connect a microphone or use Hold to Blow.';
      else if(error?.name === 'NotReadableError') message = 'The microphone is busy in another app. Close that app and try again.';
      setStatus(message,'error');
    }
  }

  function holdStart(){
    if(blown) return;
    holdBtn?.setAttribute('aria-pressed','true');
    cakeWrap?.classList.add('windy');
  }
  function holdEnd(){
    if(blown) return;
    holdBtn?.setAttribute('aria-pressed','false');
    cakeWrap?.classList.remove('windy');
  }

  window.Cake={enter,cleanup,extinguish,enableMic,holdStart,holdEnd};
  micBtn?.addEventListener('click', enableMic);
  manualBtn?.addEventListener('click', extinguish);
  holdBtn?.addEventListener('pointerdown', holdStart);
  ['pointerup','pointercancel','pointerleave'].forEach(ev => holdBtn?.addEventListener(ev, holdEnd));
})();
