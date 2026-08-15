(function(){
"use strict";

/* ============================== DATA ============================== */

const DESTINATIONS = {
  paris:  { name:"Paris", flag:"🇫🇷", landmark:"🗼",
    obstacles:[{e:"🗼",l:"Eyfel Kulesi"},{e:"🥐",l:"kaçak kruvasan"},{e:"🧀",l:"uçan peynir tekeri"}],
    jokes:["Paris'e indi inmesine ama valizinde artık bir kruvasan var.","Eyfel Kulesi'ne çok yaklaştı, tüyleri hâlâ diken diken."],
    confetti:["#5b8def","#ffffff","#ff6f91"] },
  italy:  { name:"İtalya", flag:"🇮🇹", landmark:"🍕",
    obstacles:[{e:"🍍",l:"ananaslı pizza"},{e:"🍝",l:"uçan spagetti"},{e:"🛶",l:"başıboş gondol"}],
    jokes:["İtalya'ya vardı ve ilk sözü 'ananas pizzaya konur mu' oldu.","Gondolun içine düşmemek için son anda kanat çırptı."],
    confetti:["#4caf50","#ffffff","#e53935"] },
  japan:  { name:"Japonya", flag:"🇯🇵", landmark:"🗻",
    obstacles:[{e:"🍣",l:"fırlayan suşi"},{e:"🎏",l:"koi bayrağı"},{e:"🗻",l:"Fuji Dağı"}],
    jokes:["Fuji Dağı'nı sıyırarak geçti, suşi tabağını devirmeden indi.","İniş anonsunu miyavlayarak dinledi."],
    confetti:["#ffffff","#e53935","#ffc93c"] },
  egypt:  { name:"Mısır", flag:"🇪🇬", landmark:"🐫",
    obstacles:[{e:"🔺",l:"piramit"},{e:"🐫",l:"aceleci deve"},{e:"🧻",l:"mumya sargısı"}],
    jokes:["Piramidin gölgesine kondu, deveyle göz göze geldi.","Mumya sargısına dolaşmadan indi, gurur duyulası bir iniş."],
    confetti:["#ffc93c","#e0a015","#8a6d3b"] },
  mexico: { name:"Meksika", flag:"🇲🇽", landmark:"🌵",
    obstacles:[{e:"🌮",l:"uçan taco"},{e:"🌵",l:"kaktüs"},{e:"🎉",l:"konfeti patlaması"}],
    jokes:["Taco'ya çarpmadan sıyırdı, kaktüse selam çaktı.","Konfetilerin arasından süzülerek indi."],
    confetti:["#4caf50","#e53935","#ffc93c"] },
  usa:    { name:"Amerika", flag:"🇺🇸", landmark:"🍔",
    obstacles:[{e:"🍔",l:"dev hamburger"},{e:"🗽",l:"Özgürlük Heykeli"},{e:"⚾",l:"beyzbol topu"}],
    jokes:["Özgürlük Heykeli'ni turlayıp hamburgeri ıskaladı.","Beyzbol topundan son anda kaçtı, alkışları hak etti."],
    confetti:["#3c5bdb","#e53935","#ffffff"] }
};

const CATS = [
  { name:"Pamuk", dest:"paris",  fur:["#fff8ec","#f3e6cf"], stripes:false, seat:"3B",
    greet:"Miyav! Ben hazırım, sadece biraz mama fazlam var galiba…",
    excuse:"Valizime şeyyy... 17 kilo mama koymuştum da, gerekli olur diye düşündüm." },
  { name:"Zeytin", dest:"italy", fur:["#4a4a4a","#232323"], stripes:false,
    greet:"Ciao! Valizimde sadece lazanya var, inan bana hiç fazlası yok.",
    excuse:"Aslında iki tane lazanya tepsisi ve bir de yedek çatal koydum, ihtiyaç olabilir diye." },
  { name:"Boncuk", dest:"japan", fur:["#eab06e","#c98846"], stripes:true, seat:"7A",
    greet:"Merhaba, uçuş yorar mı bilmiyorum ama origami kağıtlarımı yanımdan ayırmam.",
    excuse:"14 paket origami kağıdı, 3 tane de yastık koydum, uçakta sıkılırım diye." },
  { name:"Sarman", dest:"egypt", fur:["#e5983e","#c47624"], stripes:true, seat:"12C",
    greet:"Piramitleri görmeye can atıyorum, valizimi de ona göre hazırladım.",
    excuse:"Güneş kremi, şapka, bir de tam 9 kilo kum... kum torbası gibi bir şey, sorma." },
  { name:"Minnoş", dest:"mexico", fur:["#f7dcb0","#e8bd82"], stripes:false,
    greet:"¡Hola! Taco denemeden dönmem, o yüzden acil durum atıştırmalığı getirdim.",
    excuse:"Yanımda 6 paket taco cipsi var, uçakta acıkırsam diye tabii ki." },
  { name:"Duman", dest:"usa", fur:["#9aa4b0","#707c88"], stripes:false, seat:"1A",
    greet:"Uçmaya bayılırım! Valizim de benim kadar heyecanlı, biraz ağır oldu belki.",
    excuse:"Beyzbol kartlarım, bir kedi maması yığını, bir de neden bilmiyorum ama bir tuğla koymuşum." }
];

const PLANES = [
  { id:"classic",  name:"Klasik Kanat", price:0,   desc:"Filomuzun güvenilir başlangıç uçağı.",
    body:["#7fc4ec","#3f8fc4"], accent:"#ffffff" },
  { id:"catEars",  name:"Kedi Kulaklı Yıldız", price:250, desc:"Burnunda kedi suratı olan şirin bir jet.",
    body:["#ffc2d3","#ff8fab"], accent:"#fff3f6" },
  { id:"eagle",    name:"Kartal Kanat", price:400, desc:"Sivri kanatlı, gaga burunlu yırtıcı model.",
    body:["#e0a556","#a86a24"], accent:"#f6dfa4" },
  { id:"rocketCat",name:"Roket Mırnav", price:600, desc:"Kedi suratlı, alev kuyruklu roket-uçak.",
    body:["#f2705f","#c33322"], accent:"#ffdca0" }
];

const OVERWEIGHT_LIMIT = 10;
const FLIGHT_DURATION = 34;
const SAVE_KEY = "whiskerairport_save_v2";

/* ============================== STATE ============================== */

let state = {
  wallet:0, owned:["classic"], selected:"classic",
  queueIndex:0, currentCat:null, overweightFeeBanked:0, soundOn:true
};

async function loadSave(){
  try{
    const res = await window.storage.get(SAVE_KEY);
    if(res && res.value){
      const p = JSON.parse(res.value);
      state.wallet = p.wallet || 0;
      state.owned = (p.owned && p.owned.length) ? p.owned : ["classic"];
      state.selected = p.selected || "classic";
      state.soundOn = p.soundOn !== undefined ? p.soundOn : true;
    }
  }catch(e){}
  updateWalletDisplay();
  updateSoundBtn();
}
async function saveGame(){
  try{
    await window.storage.set(SAVE_KEY, JSON.stringify({
      wallet:state.wallet, owned:state.owned, selected:state.selected, soundOn:state.soundOn
    }));
  }catch(e){ console.warn("Kaydedilemedi:", e); }
}

/* ============================== HELPERS ============================== */

function $(id){ return document.getElementById(id); }
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); $(id).classList.add("active"); }
function rand(a,b){ return Math.random()*(b-a)+a; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

function toast(msg){
  const wrap = $("toastWrap");
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(), 1750);
}

function updateWalletDisplay(){ $("walletNum").textContent = state.wallet; }
function addCoins(n){
  state.wallet += n; updateWalletDisplay();
  const w = $("walletDisplay");
  w.classList.remove("bump"); void w.offsetWidth; w.classList.add("bump");
  saveGame();
}

/* ============================== SOUND (WebAudio, no assets) ============================== */

let actx = null;
function ac(){ if(!actx){ try{ actx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return actx; }

function tone(freq, dur, type, gainVal, delay){
  if(!state.soundOn) return;
  const ctx = ac(); if(!ctx) return;
  delay = delay||0;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainVal||0.14, t0+0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t0); osc.stop(t0+dur+0.02);
}
function sfxCoin(){ tone(880,.12,"triangle",.13); tone(1320,.14,"triangle",.1,.05); }
function sfxHit(){ tone(160,.18,"sawtooth",.16); tone(90,.22,"sawtooth",.1,.03); }
function sfxStamp(){ tone(220,.09,"square",.1); tone(440,.09,"square",.08,.06); }
function sfxWhoosh(){ tone(300,.35,"sine",.08); tone(180,.4,"sine",.06,.08); }
function sfxClick(){ tone(600,.06,"triangle",.08); }
function sfxCoinBuy(){ tone(660,.1,"triangle",.12); tone(990,.12,"triangle",.1,.06); tone(1320,.16,"triangle",.09,.12); }

function updateSoundBtn(){ $("soundBtn").textContent = state.soundOn ? "🔊" : "🔇"; }
$("soundBtn").addEventListener("click", ()=>{
  state.soundOn = !state.soundOn;
  updateSoundBtn(); saveGame();
  if(state.soundOn) sfxClick();
});

document.querySelectorAll(".btn, .icon-btn").forEach(b=>{
  b.addEventListener("click", ()=>{ if(b.id!=="soundBtn") sfxClick(); });
});

/* ============================== CAT SVG ============================== */

let catSvgUid = 0;
function catSVG(cat, opts){
  opts = opts || {};
  const size = opts.size || 104;
  const [furA, furB] = cat.fur;
  const uid = "cat"+(catSvgUid++);
  const stripes = cat.stripes ? `
    <g clip-path="url(#clip-${uid})" opacity="0.28">
      <path d="M14 34 L34 24 M20 46 L44 32 M18 58 L46 46 M26 70 L54 58" stroke="#000" stroke-width="4" stroke-linecap="round"/>
    </g>` : "";
  return `
  <svg viewBox="0 0 104 104" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="furGrad-${uid}" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${furA}"/>
        <stop offset="100%" stop-color="${furB}"/>
      </radialGradient>
      <clipPath id="clip-${uid}"><circle cx="52" cy="58" r="34"/></clipPath>
    </defs>
    <ellipse cx="52" cy="96" rx="30" ry="6" fill="#1c3144" opacity="0.12"/>
    <path class="tail-sway" d="M78 78 C 96 76, 100 58, 88 48" fill="none" stroke="url(#furGrad-${uid})" stroke-width="9" stroke-linecap="round"/>
    <path d="M24 40 L14 12 L38 30 Z" fill="url(#furGrad-${uid})"/>
    <path d="M80 40 L90 12 L66 30 Z" fill="url(#furGrad-${uid})"/>
    <path d="M24 38 L19 20 L34 30 Z" fill="#ffd3de" opacity="0.85"/>
    <path d="M80 38 L85 20 L70 30 Z" fill="#ffd3de" opacity="0.85"/>
    <circle cx="52" cy="58" r="34" fill="url(#furGrad-${uid})"/>
    ${stripes}
    <ellipse cx="38" cy="70" rx="7" ry="4.5" fill="#fff" opacity="0.55"/>
    <ellipse cx="66" cy="70" rx="7" ry="4.5" fill="#fff" opacity="0.55"/>
    <g class="blink">
      <ellipse cx="42" cy="56" rx="4.2" ry="5.6" fill="#1c3144"/>
      <ellipse cx="62" cy="56" rx="4.2" ry="5.6" fill="#1c3144"/>
      <circle cx="43.3" cy="53.5" r="1.3" fill="#fff"/>
      <circle cx="63.3" cy="53.5" r="1.3" fill="#fff"/>
    </g>
    <path d="M48 65 Q52 68 56 65" stroke="#1c3144" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52 62 L48 65 M52 62 L56 65" stroke="#1c3144" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 60 L52 63 L54 60 Z" fill="#ff6f91"/>
    <g stroke="#1c3144" stroke-width="1.6" opacity="0.55" stroke-linecap="round">
      <path d="M20 60 L34 58 M18 66 L34 64 M70 58 L84 60 M70 64 L86 66"/>
    </g>
  </svg>`;
}

function mountCat(container, cat){
  container.innerHTML = catSVG(cat, {});
}

/* ============================== PARALLAX CLOUDS ============================== */
function spawnClouds(){
  const layer = $("cloudLayer");
  for(let i=0;i<6;i++){
    const c = document.createElement("div");
    c.className = "cloud";
    const w = rand(80,170), h = w*0.55;
    c.style.width = w+"px"; c.style.height=h+"px";
    c.style.top = rand(3,42)+"vh";
    c.style.animationDuration = rand(34,68)+"s";
    c.style.animationDelay = "-"+rand(0,60)+"s";
    c.innerHTML = `<svg viewBox="0 0 100 55"><ellipse cx="30" cy="35" rx="28" ry="18" fill="#fff" opacity="0.95"/><ellipse cx="58" cy="25" rx="26" ry="22" fill="#fff" opacity="0.95"/><ellipse cx="78" cy="38" rx="20" ry="15" fill="#fff" opacity="0.95"/></svg>`;
    layer.appendChild(c);
  }
}

/* ============================== PLANE DRAWING (canvas, gradient-shaded) ============================== */

function drawPlane(ctx, cx, cy, scale, skinId, opts){
  opts = opts || {};
  const skin = PLANES.find(p=>p.id===skinId) || PLANES[0];
  const [bodyA, bodyB] = skin.body, accent = skin.accent;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  if(opts.tilt) ctx.rotate(opts.tilt);

  // shadow
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#0b1f2c";
  ctx.beginPath(); ctx.ellipse(0, 48, 26, 7, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  const bodyGrad = ctx.createLinearGradient(-16,-46,16,42);
  bodyGrad.addColorStop(0, bodyA);
  bodyGrad.addColorStop(1, bodyB);

  // wings
  ctx.fillStyle = bodyGrad;
  if(skin.id === "eagle"){
    ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(-30,4); ctx.lineTo(-54,10); ctx.lineTo(-48,18); ctx.lineTo(-38,16); ctx.lineTo(-14,10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(30,4); ctx.lineTo(54,10); ctx.lineTo(48,18); ctx.lineTo(38,16); ctx.lineTo(14,10); ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(-6,-2); ctx.lineTo(-40,16); ctx.lineTo(-30,22); ctx.lineTo(-2,8); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6,-2); ctx.lineTo(40,16); ctx.lineTo(30,22); ctx.lineTo(2,8); ctx.closePath(); ctx.fill();
  }
  // wing shading
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  if(skin.id === "eagle"){
    ctx.beginPath(); ctx.moveTo(-14,10); ctx.lineTo(-38,16); ctx.lineTo(-30,18); ctx.lineTo(-14,13); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(14,10); ctx.lineTo(38,16); ctx.lineTo(30,18); ctx.lineTo(14,13); ctx.closePath(); ctx.fill();
  }

  // rocket flame
  if(skin.id === "rocketCat"){
    const flick = Math.sin(Date.now()/55)*3;
    const flameGrad = ctx.createLinearGradient(0,44,0,64+flick);
    flameGrad.addColorStop(0,"#ffd166"); flameGrad.addColorStop(1,"rgba(255,140,90,0)");
    ctx.fillStyle = flameGrad;
    ctx.beginPath(); ctx.moveTo(-9,44); ctx.lineTo(0,62+flick); ctx.lineTo(9,44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff4d1";
    ctx.beginPath(); ctx.moveTo(-4,44); ctx.lineTo(0,52+flick*0.6); ctx.lineTo(4,44); ctx.closePath(); ctx.fill();
  }

  // fuselage
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  if(skin.id === "rocketCat"){
    ctx.moveTo(0,-46);
    ctx.quadraticCurveTo(16,-10,13,38);
    ctx.quadraticCurveTo(0,48,-13,38);
    ctx.quadraticCurveTo(-16,-10,0,-46);
  } else {
    ctx.moveTo(0,-42);
    ctx.quadraticCurveTo(13,-8,10,34);
    ctx.quadraticCurveTo(0,42,-10,34);
    ctx.quadraticCurveTo(-13,-8,0,-42);
  }
  ctx.closePath(); ctx.fill();

  // highlight sheen
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(-4,-14,3.4,22,0.15,0,Math.PI*2);
  ctx.fill();

  // accent stripe
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.ellipse(0, 6, 6, 26, 0, 0, Math.PI*2); ctx.fill();

  // tail fin
  ctx.fillStyle = bodyB;
  ctx.beginPath(); ctx.moveTo(0,30); ctx.lineTo(-4,52); ctx.lineTo(4,52); ctx.closePath(); ctx.fill();

  // cockpit window
  const cockGrad = ctx.createRadialGradient(-1,-22,1,0,-20,6);
  cockGrad.addColorStop(0,"#bfe3f5"); cockGrad.addColorStop(1,"#274b5e");
  ctx.fillStyle = cockGrad;
  ctx.beginPath(); ctx.ellipse(0,-20,5,7,0,0,Math.PI*2); ctx.fill();

  // nose accessories
  if(skin.id === "catEars" || skin.id === "rocketCat"){
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.moveTo(-9,-38); ctx.lineTo(-16,-58); ctx.lineTo(-2,-42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9,-38); ctx.lineTo(16,-58); ctx.lineTo(2,-42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffd6e0";
    ctx.beginPath(); ctx.moveTo(-9,-40); ctx.lineTo(-13,-52); ctx.lineTo(-5,-42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9,-40); ctx.lineTo(13,-52); ctx.lineTo(5,-42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1c3144";
    ctx.beginPath(); ctx.ellipse(-5,-30,2,2.6,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5,-30,2,2.6,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ff6f91";
    ctx.beginPath(); ctx.moveTo(-2,-22); ctx.lineTo(2,-22); ctx.lineTo(0,-19); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(28,49,68,.4)"; ctx.lineWidth = 1;
    [[-14,-24,-24,-22],[-14,-20,-24,-20],[14,-24,24,-22],[14,-20,24,-20]].forEach(w=>{
      ctx.beginPath(); ctx.moveTo(w[0],w[1]); ctx.lineTo(w[2],w[3]); ctx.stroke();
    });
  }
  if(skin.id === "eagle"){
    ctx.fillStyle = "#ffcf4d";
    ctx.beginPath(); ctx.moveTo(-6,-40); ctx.lineTo(6,-40); ctx.lineTo(0,-54); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff8e6";
    ctx.beginPath(); ctx.ellipse(-5,-30,3,4,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5,-30,3,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = "#1c3144";
    ctx.beginPath(); ctx.ellipse(-5,-30,1.4,1.8,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5,-30,1.4,1.8,0,0,Math.PI*2); ctx.fill();
  }

  ctx.restore();
}

function renderPlanePreview(canvas, skinId){
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawPlane(ctx, canvas.width/2, canvas.height/2+14, canvas.width/150, skinId, {});
}

let previewRAF = null;
function animatePreview(){
  const canvas = $("previewCanvas");
  function tick(){
    renderPlanePreview(canvas, state.selected);
    previewRAF = requestAnimationFrame(tick);
  }
  cancelAnimationFrame(previewRAF);
  tick();
}

/* ============================== CHECK-IN FLOW ============================== */

function startShift(){
  state.queueIndex = 0;
  const slot = $("heroCatSlot");
  nextCatCheckin();
  show("screen-checkin");
}

function nextCatCheckin(){
  if(state.queueIndex >= CATS.length){
    state.queueIndex = 0;
    toast("Vardiya tamamlandı! Yeni kediler geldi 🐾");
  }
  state.currentCat = Object.assign({}, CATS[state.queueIndex]);
  state.currentCat.flight = "WA" + Math.floor(100+Math.random()*899);
  state.currentCat.seat = state.currentCat.seat || (Math.ceil(Math.random()*20)+String.fromCharCode(65+Math.floor(Math.random()*5)));
  state.currentCat.gate = "G" + Math.ceil(Math.random()*9);
  state.currentCat.weight = +(rand(4,15)).toFixed(1);
  state.overweightFeeBanked = 0;

  $("queueNote").textContent = "Sıradaki yolcu — " + (state.queueIndex+1) + " / " + CATS.length;
  $("ciName").textContent = state.currentCat.name;
  const dest = DESTINATIONS[state.currentCat.dest];
  $("ciDest").textContent = dest.flag + " " + dest.name + " uçuşu";
  $("ciGreeting").textContent = "\u201C" + state.currentCat.greet + "\u201D";
  mountCat($("ciAvatar"), state.currentCat);

  $("stampEl").classList.remove("show");
  $("ticketDetails").style.display = "none";
  $("stepLuggage").style.display = "none";
  $("stepBoard").style.display = "none";
  $("luggageResult").innerHTML = "";
  $("scaleNum").textContent = "0.0 kg";
  $("limitVal").textContent = OVERWEIGHT_LIMIT;
  $("scaleNeedle").style.transform = "translate(-50%,-100%) rotate(-60deg)";
  $("btnCheckTicket").disabled = false;
  $("btnWeigh").disabled = false;

  show("screen-checkin");
}

$("btnCheckTicket").addEventListener("click", ()=>{
  const cat = state.currentCat, dest = DESTINATIONS[cat.dest];
  $("fFlight").textContent = cat.flight;
  $("fSeat").textContent = cat.seat;
  $("fGate").textContent = cat.gate;
  $("fDest").textContent = dest.flag + " " + dest.name;
  $("ticketDetails").style.display = "block";
  $("stampEl").classList.add("show");
  sfxStamp();
  $("btnCheckTicket").disabled = true;
  $("stepLuggage").style.display = "block";
  toast("Bilet onaylandı 🎫");
});

$("btnWeigh").addEventListener("click", ()=>{
  $("btnWeigh").disabled = true;
  const target = state.currentCat.weight;
  const dur = 900, start = performance.now();
  function tick(t){
    const p = clamp((t-start)/dur, 0, 1);
    const eased = 1 - Math.pow(1-p, 3);
    const cur = target*eased;
    $("scaleNum").textContent = cur.toFixed(1) + " kg";
    const deg = -60 + (cur/20)*120;
    $("scaleNeedle").style.transform = `translate(-50%,-100%) rotate(${deg}deg)`;
    if(p<1){ requestAnimationFrame(tick); } else finishWeigh();
  }
  requestAnimationFrame(tick);

  function finishWeigh(){
    const over = target - OVERWEIGHT_LIMIT;
    const box = $("luggageResult");
    if(over > 0){
      const fee = Math.ceil(over*8);
      box.innerHTML = `
        <div class="over-box">
          <b>🚨 ${over.toFixed(1)} kg fazla!</b>
          <div class="speech" style="margin-top:8px;">"${state.currentCat.excuse}"</div>
          <div class="actions"><button class="btn pink" id="btnFee">Fazladan Ücret Al (+${fee} 🪙)</button></div>
        </div>`;
      $("btnFee").addEventListener("click", ()=>{
        addCoins(fee); sfxCoinBuy();
        state.overweightFeeBanked = fee;
        box.innerHTML = `<div class="ok-box">✅ Ücret alındı, valiz kabul edildi.</div>`;
        revealBoardStep();
      }, {once:true});
    } else {
      box.innerHTML = `<div class="ok-box">✅ Valiz uygun ağırlıkta, sorun yok.</div>`;
      revealBoardStep();
    }
  }
});

function revealBoardStep(){ $("stepBoard").style.display = "block"; }

$("btnBoard").addEventListener("click", ()=>{
  show("screen-boarding");
  sfxWhoosh();
  const dest = DESTINATIONS[state.currentCat.dest];
  $("boardDestText").textContent = state.currentCat.name + " " + dest.flag + " " + dest.name + " uçuşuna bindiriliyor…";
  animatePreview();
  let n = 3;
  $("countdownEl").textContent = n;
  $("countdownEl").style.animation = "none"; void $("countdownEl").offsetWidth; $("countdownEl").style.animation = "";
  const iv = setInterval(()=>{
    n--;
    if(n<=0){
      clearInterval(iv);
      cancelAnimationFrame(previewRAF);
      startFlight();
    } else {
      $("countdownEl").textContent = n;
      $("countdownEl").style.animation = "none"; void $("countdownEl").offsetWidth; $("countdownEl").style.animation = "countPulse .7s ease";
    }
  },700);
});

/* ============================== FLIGHT GAME ============================== */

let game = null;

function startFlight(){
  show("screen-flight");
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  fitCanvas(canvas);

  game = {
    canvas, ctx, laneCount:3,
    laneWidth: canvas.width/3,
    planeLane:1, planeLaneTarget:1,
    obstacles:[], coins:[], particles:[], trail:[],
    elapsed:0, lastTime:null,
    lives:3, hits:0, coinsCollected:0,
    paused:false, ended:false,
    obstacleTimer:0.4, coinTimer:0.6,
    dragging:false,
    dest: DESTINATIONS[state.currentCat.dest]
  };
  renderLives();
  $("progressFill").style.width = "0%";
  $("progressPlane").style.left = "0%";
  sfxWhoosh();
  requestAnimationFrame(loop);
}

function fitCanvas(canvas){
  const cssWidth = canvas.clientWidth || 340;
  canvas.width = Math.min(600, Math.round(cssWidth));
  canvas.height = Math.round(canvas.width * 1.55);
}

function renderLives(){
  $("livesEl").innerHTML = Array.from({length:3}).map((_,i)=>
    `<span class="${i < game.lives ? 'alive':''}">🐾</span>`).join("");
}

function laneCenter(i){ return game.laneWidth*(i+0.5); }

function loop(now){
  if(!game || game.ended) return;
  if(game.lastTime === null) game.lastTime = now;
  const dt = Math.min(0.05, (now - game.lastTime)/1000);
  game.lastTime = now;
  if(!game.paused) update(dt, now);
  render(now);
  if(!game.ended) requestAnimationFrame(loop);
}

function update(dt, now){
  game.elapsed += dt;
  const progress = clamp(game.elapsed / FLIGHT_DURATION, 0, 1);
  const speed = 190 + progress*260;

  game.planeLane += (game.planeLaneTarget - game.planeLane) * Math.min(1, dt*10);

  // exhaust trail
  const planeY0 = game.canvas.height - 90;
  game.trail.push({x:laneCenter(game.planeLane)+rand(-3,3), y:planeY0+30, life:0.5, r:rand(2,4)});
  game.trail.forEach(p=>{ p.y += 60*dt; p.life -= dt; });
  game.trail = game.trail.filter(p=>p.life>0);

  game.obstacleTimer -= dt;
  if(game.obstacleTimer <= 0){
    const lane = Math.floor(Math.random()*game.laneCount);
    const o = pick(game.dest.obstacles);
    game.obstacles.push({lane, y:-40, emoji:o.e, label:o.l, hit:false, rot:rand(-0.15,0.15), rotDir:pick([-1,1])});
    game.obstacleTimer = Math.max(0.55, 1.35 - progress*0.7) + Math.random()*0.3;
  }
  game.coinTimer -= dt;
  if(game.coinTimer <= 0){
    const lane = Math.floor(Math.random()*game.laneCount);
    game.coins.push({lane, y:-30, taken:false, bob:rand(0,6.28)});
    game.coinTimer = 0.9 + Math.random()*0.7;
  }

  const planeY = game.canvas.height - 90;

  game.obstacles.forEach(o=>{
    o.y += speed*dt;
    o.rot += o.rotDir*dt*0.6;
    if(!o.hit && Math.abs(o.y - planeY) < 30 && o.lane === Math.round(game.planeLane)){
      o.hit = true; game.hits++;
      if(game.lives>0){
        game.lives--;
        const spans = $("livesEl").children;
        if(spans[game.lives]) spans[game.lives].classList.add("lost");
      }
      const lost = Math.min(3, game.coinsCollected);
      game.coinsCollected -= lost;
      spawnPop(laneCenter(o.lane), planeY, "-"+lost+" 🪙", "#ff6f91");
      spawnBurst(laneCenter(o.lane), planeY, "#ff6f91", 10);
      toast((o.label.charAt(0).toUpperCase()+o.label.slice(1)) + " ile burun buruna geldi! 😾");
      sfxHit();
      screenShake();
    }
  });
  game.obstacles = game.obstacles.filter(o=>o.y < game.canvas.height+50);

  game.coins.forEach(c=>{
    c.y += speed*dt; c.bob += dt*6;
    if(!c.taken && Math.abs(c.y - planeY) < 30 && c.lane === Math.round(game.planeLane)){
      c.taken = true; game.coinsCollected++;
      spawnPop(laneCenter(c.lane), planeY, "+1 🪙", "#ffc93c");
      spawnBurst(laneCenter(c.lane), planeY, "#ffc93c", 6);
      sfxCoin();
    }
  });
  game.coins = game.coins.filter(c=>c.y < game.canvas.height+50 && !c.taken);

  game.particles.forEach(p=>{
    p.x += (p.vx||0)*dt; p.y += (p.vy!==undefined? p.vy : -40)*dt; p.life -= dt;
    if(p.vy!==undefined) p.vy += 60*dt;
  });
  game.particles = game.particles.filter(p=>p.life>0);

  const pct = (progress*100).toFixed(1);
  $("progressFill").style.width = pct+"%";
  $("progressPlane").style.left = pct+"%";

  if(progress >= 1) endFlight();
}

function spawnPop(x,y,text,color){ game.particles.push({type:"text", x,y,text,color,life:0.9,vy:-40}); }
function spawnBurst(x,y,color,n){
  for(let i=0;i<n;i++){
    const ang = rand(0,Math.PI*2), spd = rand(40,140);
    game.particles.push({type:"spark", x,y, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd, life:0.5, color, r:rand(1.5,3.5)});
  }
}
function screenShake(){
  const wrap = $("canvasWrap");
  wrap.classList.remove("shake"); void wrap.offsetWidth; wrap.classList.add("shake");
  $("flashOverlay").classList.add("hit");
  setTimeout(()=> $("flashOverlay").classList.remove("hit"), 110);
}

function render(now){
  const {ctx, canvas} = game;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // sky gradient
  const sky = ctx.createLinearGradient(0,0,0,canvas.height);
  sky.addColorStop(0,"#bfe9f5"); sky.addColorStop(1,"#eafaff");
  ctx.fillStyle = sky; ctx.fillRect(0,0,canvas.width,canvas.height);

  // lane dividers
  ctx.strokeStyle = "rgba(28,49,68,0.10)";
  ctx.lineWidth = 3; ctx.setLineDash([14,14]);
  const dashOffset = -(now/40)%28;
  ctx.lineDashOffset = dashOffset;
  for(let i=1;i<game.laneCount;i++){
    ctx.beginPath(); ctx.moveTo(game.laneWidth*i, 0); ctx.lineTo(game.laneWidth*i, canvas.height); ctx.stroke();
  }
  ctx.setLineDash([]);

  // exhaust trail
  game.trail.forEach(p=>{
    ctx.globalAlpha = clamp(p.life/0.5,0,1)*0.4;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // obstacles
  game.obstacles.forEach(o=>{
    ctx.save();
    ctx.translate(laneCenter(o.lane), o.y);
    ctx.rotate(o.rot);
    ctx.shadowColor = "rgba(28,49,68,0.25)";
    ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
    ctx.font = "36px serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(o.emoji, 0, 0);
    ctx.restore();
  });

  // coins
  game.coins.forEach(c=>{
    if(c.taken) return;
    const scaleY = 0.7+0.3*Math.abs(Math.sin(c.bob));
    ctx.save();
    ctx.translate(laneCenter(c.lane), c.y);
    ctx.scale(1, scaleY);
    ctx.shadowColor = "rgba(255,201,60,0.6)"; ctx.shadowBlur = 10;
    ctx.font = "28px serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("🪙", 0, 0);
    ctx.restore();
  });

  // particles
  game.particles.forEach(p=>{
    if(p.type === "text"){
      ctx.globalAlpha = clamp(p.life/0.9,0,1);
      ctx.font = "bold 16px 'Space Mono', monospace";
      ctx.fillStyle = p.color; ctx.textAlign="center";
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.globalAlpha = clamp(p.life/0.5,0,1);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  // plane
  const planeY = canvas.height - 90;
  const tilt = clamp((game.planeLaneTarget - game.planeLane) * 0.5, -0.5, 0.5);
  drawPlane(ctx, laneCenter(game.planeLane), planeY, 0.9, state.selected, {tilt});
}

function laneFromPointerX(x){
  const rect = game.canvas.getBoundingClientRect();
  const relX = x - rect.left;
  const scaleX = game.canvas.width / rect.width;
  const lane = Math.floor((relX*scaleX) / game.laneWidth);
  return clamp(lane, 0, game.laneCount-1);
}

function attachControls(){
  const canvas = $("gameCanvas");
  canvas.addEventListener("pointerdown", e=>{
    if(!game || game.ended) return;
    game.dragging = true;
    game.planeLaneTarget = laneFromPointerX(e.clientX);
  });
  window.addEventListener("pointermove", e=>{
    if(!game || !game.dragging || game.ended) return;
    game.planeLaneTarget = laneFromPointerX(e.clientX);
  });
  window.addEventListener("pointerup", ()=>{ if(game) game.dragging=false; });
  window.addEventListener("keydown", e=>{
    if(!game || game.ended || game.paused) return;
    if(e.key === "ArrowLeft"){ game.planeLaneTarget = Math.max(0, game.planeLaneTarget-1); }
    if(e.key === "ArrowRight"){ game.planeLaneTarget = Math.min(game.laneCount-1, game.planeLaneTarget+1); }
  });
  window.addEventListener("resize", ()=>{
    if(!game) return;
    fitCanvas(canvas);
    game.laneWidth = canvas.width/game.laneCount;
  });
}
attachControls();

$("pauseBtn").addEventListener("click", ()=>{
  if(!game || game.ended) return;
  game.paused = true;
  $("pauseModal").classList.add("show");
});
$("resumeBtn").addEventListener("click", ()=>{
  if(!game) return;
  game.paused = false; game.lastTime = null;
  $("pauseModal").classList.remove("show");
  requestAnimationFrame(loop);
});
$("endFlightBtn").addEventListener("click", ()=>{
  $("pauseModal").classList.remove("show");
  if(game){ game.paused = false; endFlight(); }
});

function endFlight(){
  if(!game || game.ended) return;
  game.ended = true;
  const coinsEarned = game.coinsCollected * 5;
  addCoins(coinsEarned);
  sfxWhoosh();

  const dest = game.dest;
  $("landLandmark").textContent = dest.landmark;
  $("landTitle").textContent = state.currentCat.name + " " + dest.flag + " " + dest.name + "'a indi!";
  $("landJoke").textContent = pick(dest.jokes);
  $("earnCoins").textContent = "+" + coinsEarned + " 🪙";
  $("earnHits").textContent = game.hits;

  show("screen-landing");
  launchConfetti(dest.confetti);
}

$("nextCatBtn").addEventListener("click", ()=>{ state.queueIndex++; nextCatCheckin(); });
$("shopFromLandBtn").addEventListener("click", openShop);

/* ============================== CONFETTI ============================== */
function launchConfetti(colors){
  const layer = $("confettiLayer");
  layer.innerHTML = "";
  const n = 42;
  for(let i=0;i<n;i++){
    const p = document.createElement("div");
    p.className = "confetti-piece";
    const w = rand(5,9), h = w*rand(1.4,2.4);
    p.style.width = w+"px"; p.style.height = h+"px";
    p.style.left = rand(0,100)+"%";
    p.style.background = pick(colors);
    p.style.animationDuration = rand(1.1,2.1)+"s";
    p.style.animationDelay = rand(0,0.4)+"s";
    layer.appendChild(p);
  }
  setTimeout(()=>{ layer.innerHTML=""; }, 2600);
}

/* ============================== SHOP ============================== */

function openShop(){ renderShop(); $("shopModal").classList.add("show"); }
$("shopBtn").addEventListener("click", openShop);
$("closeShop").addEventListener("click", ()=> $("shopModal").classList.remove("show"));
$("shopModal").addEventListener("click", e=>{ if(e.target.id==="shopModal") $("shopModal").classList.remove("show"); });

function renderShop(){
  const wrap = $("planeList");
  wrap.innerHTML = "";
  PLANES.forEach(p=>{
    const owned = state.owned.includes(p.id);
    const equipped = state.selected === p.id;
    const card = document.createElement("div");
    card.className = "plane-card" + (equipped ? " equipped" : "");
    card.innerHTML = `
      <canvas width="76" height="76"></canvas>
      <div class="pinfo"><h3>${p.name}</h3><p>${p.desc}</p></div>
      <div class="pact">
        ${owned
          ? `<button class="btn ${equipped ? 'ghost':'secondary'}" data-act="equip" data-id="${p.id}" ${equipped?'disabled':''}>${equipped ? 'Takılı ✓' : 'Seç'}</button>`
          : `<span class="price-tag">${p.price} 🪙</span><button class="btn" data-act="buy" data-id="${p.id}">Satın Al</button>`
        }
      </div>`;
    wrap.appendChild(card);
    renderPlanePreview(card.querySelector("canvas"), p.id);
  });

  wrap.querySelectorAll("button[data-act]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      if(btn.dataset.act === "buy"){
        const plane = PLANES.find(pl=>pl.id===id);
        if(state.wallet >= plane.price){
          state.wallet -= plane.price;
          state.owned.push(id);
          state.selected = id;
          updateWalletDisplay(); saveGame(); sfxCoinBuy();
          toast(plane.name + " hangara eklendi! 🎉");
          renderShop();
        } else { toast("Yeterli madeni paran yok 🪙"); }
      } else if(btn.dataset.act === "equip"){
        state.selected = id; saveGame(); renderShop();
        toast("Uçak değiştirildi ✈️");
      }
    });
  });
}

/* ============================== HERO CAT ============================== */
function mountHeroCat(){
  const slot = $("heroCatSlot");
  const demoCat = { name:"Pati", fur:["#f3e6cf","#e8d3ab"], stripes:true };
  const wrap = document.createElement("div");
  wrap.className = "avatar-frame";
  wrap.style.width = "128px"; wrap.style.height = "128px";
  wrap.innerHTML = catSVG(demoCat, {});
  slot.appendChild(wrap);
}

/* ============================== BOOT ============================== */

$("startBtn").addEventListener("click", startShift);

spawnClouds();
mountHeroCat();
loadSave();

})();
