const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const screens={}; $$('.screen').forEach(s=>screens[s.id]=s); let current='intro';
let audioCtx=null;
function tone(freq=520,dur=.16,type='sine'){try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.055,audioCtx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur+.02)}catch(e){}}
function show(id){if(!screens[id])return;screens[current]?.classList.remove('active');current=id;screens[id].classList.add('active');if(id==='intro')startIntroGalaxy();if(id==='fall')startWarp();if(id==='galaxy')startGalaxy();if(id==='finale')startBurst();if(id==='ending')startEndingUniverse()}

// A abertura já começa viva assim que o link é carregado.
requestAnimationFrame(()=>startIntroGalaxy());
$$('[data-action]').forEach(b=>b.addEventListener('click',()=>{tone();const a=b.dataset.action;if(a==='enter'){show('fall');setTimeout(()=>show('galaxy'),2900)}else if(a==='story')show('story');else if(a==='nextStory')nextStory();else if(a==='finale')show('finale');else if(a==='ending')show('ending');else if(a==='replay'){si=0;setStory(0);show('intro')}}));

// fundo de estrelas
const bg=document.createElement('canvas');bg.width=innerWidth;bg.height=innerHeight;bg.id='bgStars';$('#space').appendChild(bg);const bc=bg.getContext('2d');let bgStars=[];
function resizeBg(){const d=Math.min(devicePixelRatio||1,1.5);bg.width=innerWidth*d;bg.height=innerHeight*d;bc.setTransform(d,0,0,d,0,0);bgStars=Array.from({length:Math.min(260,Math.floor(innerWidth*innerHeight/4800))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.2+Math.random()*1.1,a:.15+Math.random()*.7,s:.2+Math.random()*.45}))}resizeBg();addEventListener('resize',resizeBg);
(function bgLoop(t){bc.clearRect(0,0,innerWidth,innerHeight);for(const s of bgStars){s.y+=s.s*.06;if(s.y>innerHeight)s.y=-2;bc.globalAlpha=s.a*(.65+.35*Math.sin(t*.001+s.x));bc.fillStyle='#fff';bc.beginPath();bc.arc(s.x,s.y,s.r,0,Math.PI*2);bc.fill()}requestAnimationFrame(bgLoop)})();

let introRAF;
function startIntroGalaxy(){
 const c=$('#introGalaxy'); if(!c)return;
 cancelAnimationFrame(introRAF);
 const x=c.getContext('2d');
 const d=Math.min(devicePixelRatio||1,1.5);
 c.width=innerWidth*d; c.height=innerHeight*d; x.setTransform(d,0,0,d,0,0);
 const W=innerWidth,H=innerHeight,mobile=W<700;
 const cx=W*.5, cy=H*(mobile?.245:.255), R=Math.min(W,H);

 const stars=Array.from({length:mobile?520:900},()=>({
   a:Math.random()*Math.PI*2,
   r:Math.pow(Math.random(),.58)*R*.78,
   s:.18+Math.random()*1.35,
   b:.18+Math.random()*.82,
   p:Math.random()*6.28,
   z:.2+Math.random()*.8
 }));
 const dust=Array.from({length:mobile?180:340},()=>({
   a:Math.random()*6.28,r:R*(.10+Math.random()*.68),s:.4+Math.random()*1.4,p:Math.random()*6.28
 }));
 const meteors=Array.from({length:5},()=>({
   x:Math.random()*W,y:Math.random()*H*.55,v:75+Math.random()*125,delay:Math.random()*4
 }));
 const rings=[
   {rx:.18,ry:.060,rot:-.08,s:.14,gap:.54,a:.46,w:1.15},
   {rx:.27,ry:.092,rot:.17,s:-.105,gap:.62,a:.38,w:1.0},
   {rx:.39,ry:.132,rot:-.10,s:.075,gap:.72,a:.29,w:.85},
   {rx:.53,ry:.176,rot:.12,s:-.045,gap:.56,a:.22,w:.72},
   {rx:.67,ry:.222,rot:-.045,s:.027,gap:.66,a:.15,w:.58}
 ];
 const satellites=Array.from({length:10},(_,i)=>({
   ring:i%5,phase:i*2.17,s:(i%2?-.075:.055)*(1+i*.035),size:i%4===0?2.2:1.05
 }));

 function ellipsePoint(rx,ry,rot,a){
   const ca=Math.cos(a),sa=Math.sin(a),cr=Math.cos(rot),sr=Math.sin(rot);
   return [cx+ca*rx*cr-sa*ry*sr, cy+ca*rx*sr+sa*ry*cr];
 }
 function arc(rx,ry,rot,start,end,color,width,dash=0){
   x.save(); x.translate(cx,cy); x.rotate(rot); x.beginPath();
   if(dash) x.setLineDash([dash,dash*.65]);
   x.ellipse(0,0,rx,ry,0,start,end); x.strokeStyle=color; x.lineWidth=width; x.stroke();
   x.restore();
 }
 function glowDot(px,py,r,color){
   const g=x.createRadialGradient(px,py,0,px,py,r);
   g.addColorStop(0,color);g.addColorStop(.18,color.replace('1)','0.55)'));g.addColorStop(1,'rgba(255,100,190,0)');
   x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,6.28);x.fill();
 }
 function loop(ms){
   if(current!=='intro'){cancelAnimationFrame(introRAF);return}
   const e=ms*.001;
   x.clearRect(0,0,W,H);

   // Fundo cósmico profundo
   const bg=x.createRadialGradient(cx,cy,0,cx,cy,R*.9);
   bg.addColorStop(0,'rgba(255,78,170,.18)');
   bg.addColorStop(.12,'rgba(213,57,157,.11)');
   bg.addColorStop(.30,'rgba(104,53,142,.075)');
   bg.addColorStop(.58,'rgba(36,20,55,.035)');
   bg.addColorStop(1,'transparent');
   x.fillStyle=bg;x.fillRect(0,0,W,H);

   // Nebulosas curvas para dar profundidade
   for(let i=0;i<3;i++){
     x.save();x.translate(cx,cy);x.rotate(-.32+i*.27+Math.sin(e*.03+i)*.015);
     const ng=x.createLinearGradient(-R,0,R,0);
     ng.addColorStop(0,'transparent');
     ng.addColorStop(.30,'rgba(101,56,150,.018)');
     ng.addColorStop(.48,`rgba(255,${72+i*15},${169+i*8},${.055-i*.01})`);
     ng.addColorStop(.58,'rgba(151,72,166,.035)');
     ng.addColorStop(1,'transparent');
     x.fillStyle=ng;x.scale(1,.11+i*.035);x.fillRect(-R,-R*.4,R*2,R*.8);x.restore();
   }

   // Campo estelar em várias profundidades
   for(const s of stars){
     const a=s.a+e*(.003+s.z*.002);
     const px=cx+Math.cos(a)*s.r;
     const py=cy+Math.sin(a)*s.r*.47 + H*.006;
     const tw=.45+.55*Math.sin(e*(.65+s.b*2)+s.p);
     x.globalAlpha=s.b*.72*tw;
     x.fillStyle=s.b>.91?'#fff':'#d9cde8';
     x.beginPath();x.arc(px,py,s.s,0,6.28);x.fill();
     if(s.b>.94 && s.s>1){x.globalAlpha*=.25;x.beginPath();x.arc(px,py,s.s*3.8,0,6.28);x.fill()}
   }

   // Poeira orbitando o sistema
   x.globalCompositeOperation='lighter';
   for(const p of dust){
     const a=p.a+e*(.012+p.s*.002);
     const rr=p.r+Math.sin(e*.55+p.p)*R*.012;
     const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr*.26;
     x.globalAlpha=.025+p.s*.018;
     x.fillStyle='#ff73b6';x.beginPath();x.arc(px,py,p.s*2.4,0,6.28);x.fill();
   }
   x.globalCompositeOperation='source-over';

   // Anel externo luminoso, quase como uma estrutura energética
   const outer=.74*R;
   arc(outer,outer*.255,-.08,e*.018,e*.018+Math.PI*1.25,'rgba(255,172,217,.10)',.75,7);
   arc(outer*.93,outer*.30,.13,-e*.024+1.1,-e*.024+4.15,'rgba(255,110,188,.075)',.65,5);

   // Sistema de anéis e arcos giratórios
   rings.forEach((r,i)=>{
     const rx=r.rx*R,ry=r.ry*R,rot=r.rot+Math.sin(e*.12+i)*.018,spin=r.s*e+i*.9;
     // anel base
     arc(rx,ry,rot,0,Math.PI*2,`rgba(255,211,232,${r.a*.42})`,r.w*.55);
     // arcos interrompidos
     arc(rx,ry,rot,spin+r.gap,spin+Math.PI*2-r.gap,`rgba(255,${183-i*7},${222-i*4},${r.a})`,r.w);
     arc(rx*1.035,ry*1.035,rot,spin-.7,spin-.7+.38,'rgba(255,242,250,.82)',r.w*1.7);
     arc(rx*.96,ry*.96,rot,spin+2.1,spin+2.1+.22,'rgba(255,132,195,.42)',r.w*1.3);

     // energia viajando pelo arco
     const a=spin+r.gap+.18;
     const [px,py]=ellipsePoint(rx,ry,rot,a);
     glowDot(px,py,7+i*1.5,'rgba(255,255,255,1)');
     x.fillStyle='#fff';x.globalAlpha=.95;x.beginPath();x.arc(px,py,1.2+i*.15,0,6.28);x.fill();
   });
   x.globalAlpha=1;

   // Satélites e pequenas luas
   satellites.forEach((p,i)=>{
     const r=rings[p.ring],rx=r.rx*R*1.02,ry=r.ry*R*1.02,rot=r.rot;
     const a=p.phase+e*p.s;
     const [px,py]=ellipsePoint(rx,ry,rot,a);
     x.globalAlpha=.42+(i%3)*.16;x.fillStyle=i%3===0?'#fff':'#ffc3df';
     x.beginPath();x.arc(px,py,p.size,0,6.28);x.fill();
     if(i%3===0){x.globalAlpha=.12;x.beginPath();x.arc(px,py,p.size*5,0,6.28);x.fill()}
   });
   x.globalAlpha=1;

   // Linhas diagonais de energia atravessando o sistema
   for(let i=0;i<2;i++){
     const ang=-.48+i*.92+e*.035*(i?1:-1);
     x.save();x.translate(cx,cy);x.rotate(ang);
     const lg=x.createLinearGradient(-R*.7,0,R*.7,0);
     lg.addColorStop(0,'transparent');lg.addColorStop(.46,'rgba(255,120,190,.0)');
     lg.addColorStop(.50,'rgba(255,226,242,.20)');lg.addColorStop(.54,'rgba(255,110,184,.0)');lg.addColorStop(1,'transparent');
     x.strokeStyle=lg;x.lineWidth=.7;x.beginPath();x.moveTo(-R*.75,0);x.lineTo(R*.75,0);x.stroke();x.restore();
   }

   // Halo pulsante do núcleo
   const pulse=1+Math.sin(e*1.7)*.045;
   const coreR=R*(mobile?.060:.071)*pulse;
   const halo=x.createRadialGradient(cx,cy,coreR*.15,cx,cy,coreR*5.4);
   halo.addColorStop(0,'rgba(255,255,255,.42)');
   halo.addColorStop(.09,'rgba(255,230,242,.30)');
   halo.addColorStop(.24,'rgba(255,90,172,.18)');
   halo.addColorStop(.55,'rgba(183,51,137,.055)');
   halo.addColorStop(1,'transparent');
   x.fillStyle=halo;x.beginPath();x.arc(cx,cy,coreR*5.4,0,6.28);x.fill();

   // Corona múltipla
   [1.28,1.52,1.85].forEach((mul,i)=>{
     x.strokeStyle=`rgba(255,${198-i*20},${225-i*15},${.22-i*.05})`;
     x.lineWidth=i===0?1.1:.55;
     x.beginPath();x.arc(cx,cy,coreR*mul,0,6.28);x.stroke();
   });

   // Planeta / estrela central com relevo e sombra
   const core=x.createRadialGradient(cx-coreR*.46,cy-coreR*.52,coreR*.04,cx+coreR*.27,cy+coreR*.34,coreR*1.13);
   core.addColorStop(0,'#ffffff');core.addColorStop(.15,'#fff8fc');core.addColorStop(.38,'#ffd0e5');
   core.addColorStop(.62,'#f46cae');core.addColorStop(.84,'#b93479');core.addColorStop(1,'#431329');
   x.fillStyle=core;x.beginPath();x.arc(cx,cy,coreR,0,6.28);x.fill();
   x.strokeStyle='rgba(255,243,249,.65)';x.lineWidth=.9;x.stroke();

   // reflexo especular
   x.globalAlpha=.38;x.fillStyle='#fff';x.beginPath();x.ellipse(cx-coreR*.32,cy-coreR*.42,coreR*.22,coreR*.10,-.5,0,6.28);x.fill();x.globalAlpha=1;

   // Lua minúscula cruzando o planeta
   const moonA=e*.42+2.8,moonR=coreR*1.95;
   const [mx,my]=ellipsePoint(moonR,moonR*.35,.12,moonA);
   x.fillStyle='#f8dced';x.beginPath();x.arc(mx,my,1.7,0,6.28);x.fill();

   // Meteoros ocasionais
   for(const q of meteors){
     q.x+=q.v*.016;
     if(q.x>W+140){q.x=-160;q.y=20+Math.random()*H*.48;q.v=75+Math.random()*125}
     const len=28+q.v*.17;
     x.strokeStyle='rgba(255,221,239,.42)';x.lineWidth=.65;x.globalAlpha=.42;
     x.beginPath();x.moveTo(q.x,q.y);x.lineTo(q.x-len,q.y-len*.12);x.stroke();
   }
   x.globalAlpha=1;
   introRAF=requestAnimationFrame(loop);
 }
 loop(0);
}
let warpRAF;function startWarp(){const c=$('#warp'),x=c.getContext('2d'),d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;x.setTransform(d,0,0,d,0,0);const W=innerWidth,H=innerHeight,cx=W/2,cy=H/2;const ps=Array.from({length:Math.min(900,Math.floor(W*H/700))},()=>({a:Math.random()*6.28,r:Math.random()*20,z:Math.random(),v:2+Math.random()*7}));const t0=performance.now();function loop(t){if(current!=='fall'){cancelAnimationFrame(warpRAF);return}const e=(t-t0)/1000;x.fillStyle='rgba(1,1,6,.25)';x.fillRect(0,0,W,H);for(const p of ps){p.r+=p.v*(1+e*.9);if(p.r>Math.max(W,H)){p.r=2+Math.random()*20;p.a=Math.random()*6.28;p.v=2+Math.random()*7}const px=cx+Math.cos(p.a)*p.r,py=cy+Math.sin(p.a)*p.r*.72,len=3+p.r*.025;x.globalAlpha=.12+p.z*.75;x.strokeStyle=p.z>.84?'#fff':'#ff9bc9';x.lineWidth=.4+p.z*1.1;x.beginPath();x.moveTo(px-Math.cos(p.a)*len,py-Math.sin(p.a)*len*.72);x.lineTo(px,py);x.stroke()}x.globalAlpha=1;const g=x.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*.3);g.addColorStop(0,'rgba(255,255,255,.12)');g.addColorStop(.1,'rgba(255,102,180,.1)');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,W,H);warpRAF=requestAnimationFrame(loop)}loop(t0)}

let galaxyRAF;function startGalaxy(){const c=$('#galaxyCanvas'),x=c.getContext('2d'),d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;x.setTransform(d,0,0,d,0,0);const W=innerWidth,H=innerHeight,cx=W*.67,cy=H*.43,R=Math.min(W,H);const stars=Array.from({length:W<700?2600:4300},()=>({a:Math.random()*6.28,r:Math.pow(Math.random(),.6)*R*.62,s:.2+Math.random()*1.4,q:Math.random()}));let rot=0;function loop(){if(current!=='galaxy'){cancelAnimationFrame(galaxyRAF);return}x.fillStyle='rgba(2,1,7,.25)';x.fillRect(0,0,W,H);const glow=x.createRadialGradient(cx,cy,0,cx,cy,R*.65);glow.addColorStop(0,'rgba(255,105,181,.16)');glow.addColorStop(.25,'rgba(148,63,155,.08)');glow.addColorStop(1,'transparent');x.fillStyle=glow;x.fillRect(0,0,W,H);rot+=.0015;for(const p of stars){const a=p.a+rot*(1.1-p.r/(R*.7));const arm=Math.sin(a*3.2+p.r*.025)*p.r*.085;const px=cx+Math.cos(a)*(p.r+arm),py=cy+Math.sin(a)*(p.r+arm)*.43;x.globalAlpha=.07+p.q*.72;x.fillStyle=p.q>.9?'#fff':'#efb5dc';x.beginPath();x.arc(px,py,p.s,0,6.28);x.fill()}x.save();x.translate(cx,cy);x.rotate(-.08);for(let i=0;i<700;i++){const a=i*.37+rot*2,r=(i/700)*R*.38;const X=16*Math.pow(Math.sin(a),3),Y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);const px=X*5.5+(Math.random()-.5)*r*.025,py=-Y*5.5+(Math.random()-.5)*r*.025;x.globalAlpha=.12+.3*Math.random();x.fillStyle=i%7===0?'#fff':'#ff78b8';x.beginPath();x.arc(px,py,.5+Math.random()*1,0,6.28);x.fill()}x.restore();x.globalAlpha=1;galaxyRAF=requestAnimationFrame(loop)}loop()}

const stories=[
 ['✦','CAPÍTULO 02 · 01','O jeito de chegar','Tem gente que chega sem fazer esforço e, mesmo assim, deixa uma impressão diferente. Você tem um pouco disso.','fotos/foto1.jpg'],
 ['☾','CAPÍTULO 02 · 02','Alguns detalhes','Tem coisas que a gente percebe sem procurar: o sorriso, o olhar, o jeito de falar. São detalhes que fazem diferença.','fotos/foto2.jpg'],
 ['✧','CAPÍTULO 02 · 03','A beleza nos detalhes','Uma foto mostra um momento. Mas o que chama atenção mesmo é tudo aquilo que aparece sem precisar ser explicado.','fotos/foto3.jpg'],
 ['∞','CAPÍTULO 02 · 04','Uma luz diferente','Você tem um jeito de deixar o ambiente mais bonito. Talvez seja a energia, talvez seja simplesmente você sendo você.','fotos/foto4.jpg'],
 ['✦','CAPÍTULO 02 · 05','Ainda tem muito por descobrir','Cinco fotos passam rápido. E talvez essa seja a melhor parte: ainda existem muitos detalhes seus que eu nem conheço.','fotos/foto5.jpg']
];let si=0;
function setStory(i){const [ic,ch,ti,tx,img]=stories[i];$('#storyIcon').textContent=ic;$('#storyChapter').textContent=ch;$('#storyTitle').textContent=ti;$('#storyText').textContent=tx;$('#storyPhoto').src=img;$('#storyCount').textContent=`${i+1} / 5`;$('.story-progress i').style.width=`${(i+1)*20}%`}
function nextStory(){if(si>=stories.length-1){tone(880,.25,'triangle');setTimeout(()=>show('constellation'),240);return}si++;const card=$('#storyCard');card.style.opacity='0';card.style.transform='translateY(12px) scale(.985)';setTimeout(()=>{setStory(si);card.style.opacity='1';card.style.transform='none'},220);tone(620+si*80,.16)}setStory(0);

let burstRAF;function startBurst(){const c=$('#burstCanvas'),x=c.getContext('2d'),d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;x.setTransform(d,0,0,d,0,0);const W=innerWidth,H=innerHeight,cx=W/2,cy=H*.48;const ps=Array.from({length:W<700?700:1100},()=>({a:Math.random()*6.28,r:Math.random()*18,v:1.5+Math.random()*6,max:Math.max(W,H)*(.45+Math.random()),s:.3+Math.random()*1.6,b:Math.random()}));function loop(t){if(current!=='finale'){cancelAnimationFrame(burstRAF);return}x.fillStyle='rgba(2,1,7,.12)';x.fillRect(0,0,W,H);for(const p of ps){p.r+=p.v;if(p.r>p.max){p.r=2+Math.random()*20;p.a=Math.random()*6.28}const px=cx+Math.cos(p.a)*p.r,py=cy+Math.sin(p.a)*p.r*.72;x.globalAlpha=.15+p.b*.7;x.fillStyle=p.b>.85?'#fff':'#ff84bd';x.beginPath();x.arc(px,py,p.s,0,6.28);x.fill()}x.globalAlpha=1;burstRAF=requestAnimationFrame(loop)}loop(0)}

let endingRAF;function startEndingUniverse(){const c=$('#endingCanvas'),x=c.getContext('2d'),d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;x.setTransform(d,0,0,d,0,0);const W=innerWidth,H=innerHeight,cx=W/2,cy=H*.49;const mobile=W<700,count=mobile?520:900;const ps=Array.from({length:count},()=>({a:Math.random()*6.28,r:Math.random()*20,v:.5+Math.random()*(mobile?3.7:5),max:Math.max(W,H)*(.4+Math.random()*1.05),s:.3+Math.random()*(mobile?1.3:1.7),q:Math.random(),ph:Math.random()*6.28}));function loop(t){if(current!=='ending'){cancelAnimationFrame(endingRAF);return}const e=t*.001;x.fillStyle='rgba(2,1,7,.18)';x.fillRect(0,0,W,H);const g=x.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*.58);g.addColorStop(0,'rgba(255,125,190,.09)');g.addColorStop(.18,'rgba(200,65,150,.035)');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,W,H);for(const p of ps){p.r+=p.v;if(p.r>p.max){p.r=3+Math.random()*20;p.a=Math.random()*6.28}const a=p.a+Math.sin(e*.7+p.ph)*.04,px=cx+Math.cos(a)*p.r,py=cy+Math.sin(a)*p.r*.72,tw=.35+.65*(.5+.5*Math.sin(e*2+p.ph));x.globalAlpha=(.1+p.q*.6)*tw;x.fillStyle=p.q>.88?'#fff':'#ff78b8';x.beginPath();x.arc(px,py,p.s,0,6.28);x.fill();if(p.q>.82){x.globalAlpha*=.3;x.beginPath();x.arc(px,py,p.s*3.5,0,6.28);x.fill()}}x.globalAlpha=1;endingRAF=requestAnimationFrame(loop)}loop(0)}
