(()=>{'use strict';
const root=document.documentElement;
let lang='en',ready=false,pending=null,target='home',styleTask=null,scriptTask=null;
try{lang=localStorage.getItem('mr-language')==='fa'?'fa':'en'}catch{}
function translate(){root.lang=lang;root.dir=lang==='fa'?'rtl':'ltr';document.body.classList.toggle('lang-rtl',lang==='fa');document.querySelectorAll('#chooser [data-en]').forEach(el=>el.innerHTML=el.dataset[lang]);document.querySelectorAll('#chooser .lang').forEach(el=>el.textContent=lang==='fa'?'English':'فارسی')}
translate();document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
const anchors=['about','activity','journey','work','builds','writing','contact'];
const modeFor=hash=>anchors.includes(hash)?'classic':['classic','windows','linux'].includes(hash)?hash:'home';
function busy(active){document.querySelector('#chooser').setAttribute('aria-busy',String(active));document.querySelector('#entry-status').textContent=active?(lang==='fa'?'در حال بازکردن محیط…':'Opening your environment…'):'';}
function load(){
 if(pending)return pending;
 pending=Promise.all([
 styleTask||(styleTask=new Promise((resolve,reject)=>{const el=document.createElement('link');el.rel='stylesheet';el.href='portfolio-experience.css?v=20261108';el.onload=resolve;el.onerror=()=>{el.remove();styleTask=null;reject(Error('css'))};document.head.append(el)})),
 scriptTask||(scriptTask=new Promise((resolve,reject)=>{const el=document.createElement('script');el.src='portfolio-experience.js?v=20261108';el.onload=resolve;el.onerror=()=>{el.remove();scriptTask=null;reject(Error('script'))};document.body.append(el)}))
 ]).then(()=>{ready=true;busy(false);window.__portfolioNavigate(target,false);document.dispatchEvent(new Event('portfolio:ready'));}).catch(()=>{pending=null;busy(false);document.querySelector('#entry-status').textContent=lang==='fa'?'بارگذاری کامل نشد. دوباره روی محیط بزن.':'Could not load the environment. Select it to retry.'});
 return pending;
}
document.addEventListener('click',event=>{
 if(ready)return;
 const button=event.target.closest('[data-mode]'),language=event.target.closest('.lang');
 if(language){event.preventDefault();event.stopImmediatePropagation();lang=lang==='en'?'fa':'en';try{localStorage.setItem('mr-language',lang)}catch{}translate();return;}
 if(button){event.preventDefault();event.stopImmediatePropagation();target=button.dataset.mode;window.__portfolioTarget=target;history.pushState({},'','#'+target);busy(true);load();}
},true);
document.addEventListener('keydown',event=>{if(ready||event.target.matches('input,textarea'))return;if(['1','2','3'].includes(event.key)){event.preventDefault();document.querySelectorAll('#chooser [data-mode]')[Number(event.key)-1].click();}if(event.key==='Escape'){target='home';window.__portfolioTarget='home';history.pushState({},'',location.pathname);busy(false);}},true);
window.addEventListener('popstate',()=>{if(ready)return;target=modeFor(location.hash.slice(1));window.__portfolioTarget=target;if(target!=='home'){busy(true);load()}else busy(false)});
target=modeFor(location.hash.slice(1));window.__portfolioTarget=target;
if(target!=='home'){busy(true);load();}
// Expose only anonymous browser timings in the DOM for on-device verification; nothing is sent.
try{new PerformanceObserver(list=>{for(const e of list.getEntries())root.dataset[e.name==='first-contentful-paint'?'fcpMs':'paintMs']=String(Math.round(e.startTime))}).observe({type:'paint',buffered:true});new PerformanceObserver(list=>{const e=list.getEntries().at(-1);if(e)root.dataset.lcpMs=String(Math.round(e.startTime))}).observe({type:'largest-contentful-paint',buffered:true});window.addEventListener('load',()=>{const n=performance.getEntriesByType('navigation')[0];if(n)root.dataset.ttfbMs=String(Math.round(n.responseStart));});}catch{}
// Pointer-only depth effect; touch and reduced-motion keep a stable interface.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const entrance=document.querySelector('#chooser');
entrance.addEventListener('pointermove',event=>{
 if(motionPreference.matches||!finePointer.matches)return;
 const box=entrance.getBoundingClientRect();
 entrance.style.setProperty('--scene-x',`${(event.clientX-box.left-box.width/2)*-.007}px`);
 entrance.style.setProperty('--scene-y',`${(event.clientY-box.top-box.height/2)*-.007}px`);
});
entrance.addEventListener('pointerleave',()=>{entrance.style.setProperty('--scene-x','0px');entrance.style.setProperty('--scene-y','0px')});
for(const card of document.querySelectorAll('.env')){
 card.addEventListener('pointermove',event=>{
  if(motionPreference.matches||!finePointer.matches)return;
  const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height;
  card.style.setProperty('--rx',`${(0.5-y)*9}deg`);card.style.setProperty('--ry',`${(x-0.5)*11}deg`);
  card.style.setProperty('--glow-x',`${x*100}%`);card.style.setProperty('--glow-y',`${y*100}%`);
 });
 card.addEventListener('pointerleave',()=>{for(const key of ['--rx','--ry','--glow-x','--glow-y'])card.style.removeProperty(key)});
}

})();