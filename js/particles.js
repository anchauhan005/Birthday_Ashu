(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // One lightweight canvas runs behind every scene, so the experience always
  // has movement without adding dozens of DOM elements. The motion uses
  // requestAnimationFrame, which is a standard approach for smooth canvas
  // animation. See MDN's Canvas animation guidance. citeturn0search11
  const palettes = {
    opening: ['#fff8df', '#ffd76a', '#d9c9ff', '#b9a8ff', '#ffffff'],
    cake: ['#ffd76a', '#fff3c4', '#f8b7d8', '#d9c9ff', '#ffffff'],
    celebration: ['#ffd76a', '#ff9ecb', '#c7a6ff', '#ffffff', '#fff3c4'],
    gift: ['#ffd76a', '#ffc9e6', '#ba9bff', '#ffffff'],
    surprise: ['#ffd76a', '#ffb8d9', '#ded2ff', '#ffffff', '#f9e6b3'],
    letter: ['#ffd76a', '#f6cadf', '#e5ddff', '#fff6df'],
    final: ['#ffd76a', '#ff9ecb', '#d9c9ff', '#ffffff']
  };

  let dpr = 1, w = 0, h = 0, last = performance.now();
  let hidden = false;
  let mode = 'opening';
  let particles = [];
  let pointer = { x: 0, y: 0, active: false };
  let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const mobile = () => Math.min(innerWidth, innerHeight) < 700;
  const maxForViewport = () => reducedMotion ? 28 : (mobile() ? 78 : 170);

  function rand(min, max) { return min + Math.random() * (max - min); }
  function choose(list) { return list[(Math.random() * list.length) | 0]; }
  function color() { return choose(palettes[mode] || palettes.opening); }

  function spawn(p, initial = false) {
    const types = mode === 'surprise'
      ? ['dust', 'dust', 'spark', 'petal', 'star']
      : ['dust', 'dust', 'spark', 'petal', 'star', 'heart'];

    p.x = rand(-20, w + 20);
    p.y = initial ? rand(-10, h + 10) : rand(h * .72, h + 30);
    p.vx = rand(-0.18, 0.18);
    p.vy = rand(-0.10, -0.025);
    p.size = rand(.65, mobile() ? 1.7 : 2.25);
    p.alpha = rand(.12, .58);
    p.baseAlpha = p.alpha;
    p.color = color();
    p.type = choose(types);
    p.rot = rand(0, Math.PI * 2);
    p.spin = rand(-0.006, 0.006);
    p.phase = rand(0, Math.PI * 2);
    p.twinkle = rand(.8, 2.1);
    p.drift = rand(.15, .8);
  }

  function seed() {
    const target = maxForViewport();
    while (particles.length < target) {
      const p = {};
      spawn(p, true);
      particles.push(p);
    }
    if (particles.length > target) particles.length = target;
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function setMode(next) {
    mode = next || 'opening';
    // Re-seed colors/shapes immediately when the scene changes.
    particles.forEach(p => { p.color = color(); });
    seed();
  }

  function burst(x, y, count = 34, burstMode = mode) {
    const list = palettes[burstMode] || palettes.celebration;
    for (let i = 0; i < count; i++) {
      const p = {};
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(.8, 3.1);
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = rand(1, 3.2);
      p.alpha = .95;
      p.baseAlpha = p.alpha;
      p.color = choose(list);
      p.type = Math.random() < .22 ? 'heart' : (Math.random() < .45 ? 'spark' : 'star');
      p.rot = rand(0, Math.PI * 2);
      p.spin = rand(-.025, .025);
      p.ttl = rand(45, 95);
      p.life = 0;
      particles.push(p);
    }
    const max = maxForViewport() + 80;
    if (particles.length > max) particles.splice(0, particles.length - max);
  }

  function draw(p, now) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const twinkle = .72 + Math.sin(now * .001 * p.twinkle + p.phase) * .28;
    ctx.globalAlpha = Math.max(0, p.alpha * twinkle);
    ctx.fillStyle = p.color;

    if (p.type === 'heart') {
      const s = p.size * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, s * .9);
      ctx.bezierCurveTo(-s, 0, -s, -s * .65, 0, -s * .15);
      ctx.bezierCurveTo(s, -s * .65, s, 0, 0, s * .9);
      ctx.fill();
    } else if (p.type === 'petal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.05, p.size * 2.3, .55, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'star') {
      const s = p.size * 2.8;
      ctx.beginPath();
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.lineWidth = Math.max(.5, p.size * .55);
      ctx.strokeStyle = p.color;
      ctx.stroke();
    } else if (p.type === 'spark') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.globalAlpha *= .18;
      ctx.beginPath(); ctx.arc(0, 0, p.size * 4.5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) { last = now; return; }

    const dt = Math.min((now - last) / 16.667, 2);
    last = now;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      if (p.ttl != null) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += .018 * dt;
        p.alpha *= .985;
        p.rot += p.spin * dt;
        if (p.life > p.ttl || p.alpha < .025) spawn(p, false);
      } else {
        const wave = Math.sin(now * .00045 + p.phase) * p.drift;
        p.x += (p.vx + wave * .035) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;

        // Very subtle cursor interaction on desktop; particles drift away from
        // the pointer instead of becoming a distracting network effect.
        if (pointer.active && !mobile()) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150 && d2 > 20) {
            const force = .018 / d2 * 15000;
            p.x += dx * force * dt;
            p.y += dy * force * dt;
          }
        }

        if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) spawn(p, false);
      }
      draw(p, now);
    }
  }

  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', e => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }, { passive: true });
  addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  motionQuery?.addEventListener?.('change', e => {
    reducedMotion = e.matches;
    resize();
  });

  window.Particles = { setMode, burst };
  resize();
  requestAnimationFrame(frame);
})();
