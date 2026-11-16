(()=>{'use strict';
const root=document.documentElement;
let lang='en',ready=false,pending=null,target='home',styleTask=null,scriptTask=null,styled=false,initializationFailed=false,slowTimer=null;
try{lang=localStorage.getItem('mr-language')==='fa'?'fa':'en'}catch{}
const classic=document.querySelector('#classic'),chooser=document.querySelector('#chooser'),desktop=document.querySelector('#desktop'),status=document.querySelector('#entry-status'),retry=document.querySelector('#entry-retry');
function translate(){root.lang=lang;root.dir=lang==='fa'?'rtl':'ltr';document.body.classList.toggle('lang-rtl',lang==='fa');document.querySelectorAll('[data-en]').forEach(el=>el.innerHTML=el.dataset[lang]);document.querySelectorAll('.lang').forEach(el=>el.textContent=lang==='fa'?'English':'فارسی');retry.textContent=lang==='fa'?'تلاش دوباره':'Retry interactive features';}
translate();document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
const anchors=['about','activity','journey','work','builds','writing','contact'];
const modeFor=hash=>anchors.includes(hash)?'classic':['classic','windows','linux'].includes(hash)?hash:'home';
function showBasic(next){
 if(next==='classic'){chooser.hidden=true;desktop.hidden=true;classic.hidden=false;classic.dataset.basic='true';document.title='Morteza Rajabi — Portfolio';document.querySelector('.skip').href='#classic';const anchor=location.hash.slice(1);if(anchors.includes(anchor))requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView());}
 else if(next==='home'){chooser.hidden=false;classic.hidden=true;desktop.hidden=true;document.title='Morteza Rajabi — Choose your environment';document.querySelector('.skip').href='#main';}
}
function busy(active){chooser.setAttribute('aria-busy',String(active));clearTimeout(slowTimer);retry.hidden=true;status.textContent=active?(lang==='fa'?(target==='classic'?'پورتفولیو آماده است؛ امکانات تعاملی در حال بارگیری…':'در حال بازکردن محیط…'):(target==='classic'?'Portfolio ready. Loading interactive features…':'Opening your environment…')):'';if(active)slowTimer=setTimeout(()=>{status.textContent=lang==='fa'?'اتصال کند است؛ محتوای پورتفولیو و لینک پروژه‌ها قابل استفاده‌اند.':'The connection is slow. Portfolio content and project links remain available.';},6000);}
function getText(url,attempt=0){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 return fetch(url,{signal:controller.signal,cache:'default'}).then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.text();}).finally(()=>clearTimeout(timer)).catch(error=>{if(attempt===0)return getText(url,1);throw error;});
}
function load(){
 if(pending)return pending;
 if(initializationFailed){location.reload();return Promise.resolve();}
 const css=styleTask||(styleTask=getText('portfolio-experience.css?v=20261116').then(text=>{const el=document.createElement('style');el.dataset.portfolioStyle='true';el.textContent=text;document.head.append(el);styled=true;}).catch(()=>{styleTask=null;return false;}));
 const script=scriptTask||(scriptTask=getText('portfolio-experience.js?v=20261116').catch(error=>{scriptTask=null;throw error;}));
 pending=Promise.all([css,script]).then(([,text])=>{
  if(typeof window.__portfolioNavigate!=='function'){const el=document.createElement('script');el.dataset.portfolioScript='true';el.textContent=text;document.body.append(el);if(typeof window.__portfolioNavigate!=='function'){initializationFailed=true;throw Error('Initialization failed');}}
  window.__portfolioNavigate(target,false);ready=true;if(styled)delete classic.dataset.basic;busy(false);document.dispatchEvent(new Event('portfolio:ready'));
 }).catch(()=>{
  ready=false;pending=null;showBasic(target);busy(false);status.textContent=lang==='fa'?'امکانات تعاملی بارگیری نشدند. محتوای پورتفولیو و لینک پروژه‌ها فعال‌اند.':'Interactive features could not load. Portfolio content and project links are available.';retry.hidden=false;
 });
 return pending;
}
function go(next,push=true){target=next;window.__portfolioTarget=target;if(push)history.pushState({},'',next==='home'?location.pathname:'#'+next);showBasic(next);if(next==='home'){busy(false);return;}busy(true);load();}
document.addEventListener('click',event=>{
 if(ready)return;
 const button=event.target.closest('[data-mode]'),language=event.target.closest('.lang'),home=event.target.closest('[data-home]');
 if(event.target.closest('#entry-retry')){event.preventDefault();event.stopImmediatePropagation();busy(true);load();return;}
 if(language){event.preventDefault();event.stopImmediatePropagation();lang=lang==='en'?'fa':'en';try{localStorage.setItem('mr-language',lang)}catch{}translate();return;}
 if(button||home){event.preventDefault();event.stopImmediatePropagation();go(home?'home':button.dataset.mode);}
},true);
document.addEventListener('keydown',event=>{if(ready||event.target.matches('input,textarea'))return;if(['1','2','3'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();go(['linux','windows','classic'][Number(event.key)-1]);}if(event.key==='Escape')go('home');},true);
window.addEventListener('popstate',()=>{if(!ready)go(modeFor(location.hash.slice(1)),false);});
target=modeFor(location.hash.slice(1));window.__portfolioTarget=target;if(target!=='home')go(target,false);
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
