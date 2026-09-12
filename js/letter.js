(function(){const scene=document.getElementById('letterScene'),envelope=document.getElementById('envelope'),modal=document.getElementById('letterModal'),body=document.getElementById('letterBody'),close=document.getElementById('letterCloseBtn'),finish=document.getElementById('finishLetterBtn');
  function enter(){scene.hidden=false;scene.classList.add('active');Particles?.setMode('letter');}
  let opening=false;
  function open(){if(opening||!modal.hidden)return;opening=true;envelope.classList.add('opened');AudioSystem.letter();setTimeout(()=>{modal.hidden=false;modal.classList.add('visible');opening=false;typeLetter()},CONFIG.timings.letterHold)}
  async function typeLetter(){body.innerHTML='';const name=CONFIG.sisterName;for(const raw of CONFIG.letter.paragraphs){const p=document.createElement('p');p.textContent=raw.replaceAll('[Sister Name]',name);if(raw.trim().startsWith('while (life.isRunning())'))p.classList.add('letter-code');if(raw.includes('Zindagi ki coding'))p.classList.add('letter-shayari');body.appendChild(p);requestAnimationFrame(()=>p.classList.add('reveal'));await new Promise(r=>setTimeout(r,650))}document.getElementById('letterSignoff').textContent=CONFIG.letter.signoff.replaceAll('[Sister Name]',name);ACCESSIBILITY.announce('Birthday letter opened.')}
  function closeModal(){modal.classList.remove('visible');setTimeout(()=>modal.hidden=true,350)}
  function finishLetter(){closeModal();envelope.classList.remove('opened');setTimeout(()=>window.dispatchEvent(new CustomEvent('birthday:letter-finished')),420)}
  function reset(){closeModal();envelope.classList.remove('opened');body.innerHTML='';}
  envelope?.addEventListener('click',open);close?.addEventListener('click',closeModal);finish?.addEventListener('click',finishLetter);document.body.addEventListener('birthday:escape',()=>{if(!modal.hidden)closeModal()});
  window.Letter={enter,open,reset};
})();
