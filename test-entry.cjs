const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/portfolio-entry.js','utf8');
const tick=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
function harness({hash='',fetcher}={}){
 const elements={};const handlers={};const navigations=[];
 function element(id){return elements[id]||=( {hidden:['classic','desktop','entry-retry'].includes(id),dataset:{},textContent:'',style:{setProperty(){},removeProperty(){}},classList:{toggle(){}},setAttribute(){},addEventListener(){},scrollIntoView(){},getBoundingClientRect(){return {left:0,top:0,width:100,height:100}}} );}
 let context;
 const document={documentElement:{dataset:{}},body:element('body'),querySelector:s=>element(s==='.skip'?'skip':s.replace('#','')),querySelectorAll:()=>[],getElementById:element,createElement:tag=>({tag,dataset:{}}),addEventListener:(name,fn)=>handlers[name]=fn,dispatchEvent(){},head:{append(){} }};
 document.body.append=el=>{if(el.tag==='script')vm.runInContext(el.textContent,context);};
 const location={hash,pathname:'/',reload(){navigations.push('reload')}};
 const window={addEventListener:(name,fn)=>handlers['window:'+name]=fn};
 const history={pushState(a,b,url){location.hash=url.includes('#')?'#'+url.split('#')[1]:'';}};
 let requests=0;
 context=vm.createContext({document,window,location,history,localStorage:{getItem(){return null},setItem(){}},fetch:(...args)=>{requests++;return fetcher?fetcher(...args):new Promise(()=>{});},AbortController,matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>fn(),setTimeout:()=>1,clearTimeout(){},Event:class{},Date,console});
 vm.runInContext(source,context);
 function click(kind='classic'){
  const button={dataset:{mode:kind}};
  handlers.click({target:{closest(selector){return selector==='[data-mode]'?button:null}},preventDefault(){},stopImmediatePropagation(){}});
 }
 function retry(){handlers.click({target:{closest(selector){return selector==='#entry-retry'?{}:null}},preventDefault(){},stopImmediatePropagation(){}});}
 return {elements,context,click,retry,navigations,requests:()=>requests,back(){location.hash='';handlers['window:popstate']();}};
}
test('portfolio is visible immediately even when both downloads hang',()=>{const h=harness();h.click();assert.equal(h.elements.classic.hidden,false);assert.equal(h.elements.chooser.hidden,true);assert.equal(h.requests(),2);});
test('offline downloads leave content visible and permit another attempt',async()=>{const h=harness({fetcher:()=>Promise.reject(Error('offline'))});h.click();await tick();assert.equal(h.elements.classic.hidden,false);assert.equal(h.elements['entry-retry'].hidden,false);assert.equal(h.requests(),4);h.retry();await tick();assert.equal(h.requests(),8);assert.equal(h.elements.classic.hidden,false);});
test('an incomplete JavaScript response cannot mark the interface ready',async()=>{const h=harness({fetcher:()=>Promise.resolve({ok:true,text:()=>Promise.resolve('/* truncated application */')})});h.click();await tick();assert.equal(h.elements.classic.hidden,false);assert.equal(h.elements['entry-retry'].hidden,false);h.retry();assert.deepEqual(h.navigations,['reload']);});
test('a successful enhancement navigates once and removes basic styling',async()=>{const h=harness({fetcher:url=>Promise.resolve({ok:true,text:()=>Promise.resolve(url.includes('.js')?'window.__portfolioNavigate=(mode)=>{document.documentElement.dataset.entered=mode};':'body{}')})});h.click();await tick();assert.equal(h.context.document.documentElement.dataset.entered,'classic');assert.equal(h.elements.classic.dataset.basic,undefined);assert.equal(h.elements['entry-status'].textContent,'');});
test('a direct project-section link opens without waiting for JavaScript',()=>{const h=harness({hash:'#work'});assert.equal(h.elements.classic.hidden,false);assert.equal(h.elements.chooser.hidden,true);});
test('a fast script cannot reset the visible portfolio while CSS is still downloading',async()=>{let finishCSS;const h=harness({fetcher:url=>url.includes('.css')?new Promise(resolve=>finishCSS=()=>resolve({ok:true,text:()=>Promise.resolve('body{}')})):Promise.resolve({ok:true,text:()=>Promise.resolve('window.__portfolioNavigate=(mode)=>{document.documentElement.dataset.entered=mode};')})});h.click();await tick();assert.equal(h.elements.classic.hidden,false);assert.equal(h.context.window.__portfolioNavigate,undefined);finishCSS();await tick();assert.equal(h.context.document.documentElement.dataset.entered,'classic');});
test('back to the chooser during loading is respected when downloads finish',async()=>{const resolvers=[];const h=harness({fetcher:url=>new Promise(resolve=>resolvers.push(()=>resolve({ok:true,text:()=>Promise.resolve(url.includes('.js')?'window.__portfolioNavigate=(mode)=>{document.documentElement.dataset.entered=mode};':'body{}')})))});h.click();h.back();resolvers.forEach(fn=>fn());await tick();assert.equal(h.context.document.documentElement.dataset.entered,'home');assert.equal(h.elements.chooser.hidden,false);});
