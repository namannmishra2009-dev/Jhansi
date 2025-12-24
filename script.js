// Template message (use %%NAME%% where the recipient's name should appear)
let messageTemplate = [
`My dearest %%NAME%%,`,
``,
`Every day I find a new reason to love you. Your laugh, the way you think, the warmth of your hand — they make every ordinary moment feel like a beautiful memory.`,
``,
`I promise to listen, to hold you close in storms and sunshine, to cheer for your dreams and build ours together.`,
``,
`Forever isn't long enough with you.`,
``,
`Always yours,`,
`[Your Name] ❤️`
].join('\n');

const messageEl = document.getElementById('message');
const openBtn = document.getElementById('openBtn');
const replayBtn = document.getElementById('replayBtn');
const confettiBtn = document.getElementById('confettiBtn');
const confettiCanvas = document.getElementById('confetti');
const heartBtn = document.getElementById('heartBtn');
const floatingHearts = document.getElementById('floating-hearts');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

const nameInput = document.getElementById('nameInput');
const nameOkBtn = document.getElementById('nameOkBtn');
const toNameEl = document.getElementById('toName');

let typed = false;
let typingTimer = null;

// Helper: escape HTML to avoid XSS when inserting names
function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// Typewriter effect
function typeMessage(text, el, speed = 24) {
  el.textContent = '';
  let i = 0;
  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    if (i >= text.length) {
      clearInterval(typingTimer);
      typed = true;
      return;
    }
    el.textContent += text[i++];
  }, speed);
}

// Make confetti (simple particles)
function makeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const ctx = confettiCanvas.getContext('2d');
  const pieces = [];
  const colors = ['#ff7aa2','#ffd166','#9ee493','#8bd3ff','#d6a9ff'];
  for (let i=0;i<120;i++){
    pieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      w: 6+Math.random()*10,
      h: 6+Math.random()*10,
      vx: -2 + Math.random()*4,
      vy: 2 + Math.random()*6,
      r: Math.random()*360,
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }
  let t=0;
  function draw(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    for (let p of pieces){
      p.x += p.vx;
      p.y += p.vy;
      p.r += 5;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.r * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      if(p.y > confettiCanvas.height + 50){ p.y = -10 - Math.random()*confettiCanvas.height; p.x = Math.random()*confettiCanvas.width; }
    }
    t++;
    if (t < 300) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  }
  draw();
}

// Floating hearts
function createHeart(x, y){
  const el = document.createElement('div');
  el.className = 'floating-heart';
  el.style.position = 'absolute';
  el.style.left = (x - 12) + 'px';
  el.style.top = (y - 12) + 'px';
  el.style.pointerEvents = 'none';
  el.style.fontSize = '22px';
  el.style.zIndex = 90;
  el.style.opacity = 1;
  el.textContent = '💗';
  floatingHearts.appendChild(el);
  const duration = 3000 + Math.random()*1500;
  const dx = (Math.random()-0.5)*80;
  el.animate([
    { transform: `translate(0,0) scale(1)`, opacity: 1 },
    { transform: `translate(${dx}px,-140px) scale(1.2)`, opacity: 0.0 }
  ], { duration, easing: 'ease-out', fill: 'forwards' });
  setTimeout(()=> el.remove(), duration+50);
}

function burstHearts(count=8, x=null, y=null){
  for (let i=0;i<count;i++){
    const cx = x ?? (window.innerWidth/2 + (Math.random()-0.5)*200);
    const cy = y ?? (window.innerHeight/2 + (Math.random()-0.5)*200);
    setTimeout(()=> createHeart(cx + (Math.random()-0.5)*60, cy + (Math.random()-0.5)*60), i*60);
  }
}

// Photo click to add image
photoPlaceholder.addEventListener('click', async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photoPlaceholder.innerHTML = '';
      const img = document.createElement('img');
      img.src = reader.result;
      photoPlaceholder.appendChild(img);
    };
    reader.readAsDataURL(file);
  };
  input.click();
});

// Name input handling
function setRecipientName(name) {
  if (!name) return;
  const safe = escapeHtml(name.trim());
  // update header
  toNameEl.innerHTML = `To: <strong>${safe}</strong>`;
  // replace in message
  const replaced = messageTemplate.replace(/%%NAME%%/g, safe);
  // save to localStorage
  try { localStorage.setItem('recipientName', safe); } catch(e) {}
  // show a short animated heart-burst and try to play music
  burstHearts(10);
  musicToggle.checked = true;
  // Try to play music (this is a result of a user gesture — allowed)
  bgMusic.play().catch(()=>{ /* ignore play errors */ });
  return replaced;
}

nameOkBtn.addEventListener('click', () => {
  const name = nameInput.value;
  if (!name) return;
  const message = setRecipientName(name);
  // type short confirmation
  typeMessage(`Hello ${escapeHtml(name)}! Click "Open Your Letter" to see your message ❤️`, messageEl, 20);
});

nameInput.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    nameOkBtn.click();
  }
});

// Buttons
openBtn.addEventListener('click', () => {
  // if a name is stored, inject it; otherwise use template with placeholder text
  const stored = localStorage.getItem('recipientName');
  let finalMessage;
  if (stored) finalMessage = messageTemplate.replace(/%%NAME%%/g, stored);
  else finalMessage = messageTemplate.replace(/%%NAME%%/g, '[Her Name]');
  typeMessage(finalMessage, messageEl, 18);
  makeConfetti();
  burstHearts(12);
  if (musicToggle.checked) bgMusic.play().catch(()=>{});
});
replayBtn.addEventListener('click', () => {
  const stored = localStorage.getItem('recipientName');
  let finalMessage;
  if (stored) finalMessage = messageTemplate.replace(/%%NAME%%/g, stored);
  else finalMessage = messageTemplate.replace(/%%NAME%%/g, '[Her Name]');
  typeMessage(finalMessage, messageEl, 12);
  burstHearts(8);
});

// confetti button
confettiBtn.addEventListener('click', () => {
  makeConfetti();
});

// heart button
heartBtn.addEventListener('click', (e) => {
  const rect = heartBtn.getBoundingClientRect();
  burstHearts(6, rect.left+rect.width/2, rect.top+rect.height/2);
});

// click anywhere to drop a heart
document.addEventListener('click', (ev) => {
  // ignore if clicking buttons or photo (we have separate handlers)
  const tag = ev.target.tagName ? ev.target.tagName.toLowerCase() : '';
  if (['button','input','img'].includes(tag)) return;
  createHeart(ev.clientX, ev.clientY);
});

// music toggle
musicToggle.addEventListener('change', () => {
  if (musicToggle.checked) bgMusic.play().catch(()=>{});
  else bgMusic.pause();
});

// initial auto-type briefly after load
window.addEventListener('load', () => {
  // restore name if present
  try {
    const stored = localStorage.getItem('recipientName');
    if (stored) {
      toNameEl.innerHTML = `To: <strong>${escapeHtml(stored)}</strong>`;
      nameInput.value = stored;
    }
  } catch(e){}
  setTimeout(()=> typeMessage("Write your name above and click OK to make this letter just for you \u2764\uFE0F", messageEl, 30), 700);
});

// handle resize for confetti canvas
window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
