"""Rebuild the on-demand experience from readable sources. Requires Node/npm."""
from pathlib import Path
import shutil
import subprocess
import os

root=Path(__file__).resolve().parent
scripts=['portfolio-core.js','desktop.js','games-core.js','games-extra.js','services.js','showcase.js','editorial-data.js','editorial.js']
tail="""\n;window.__portfolioNavigate=function(next,push=true){setMode(next,push);if(next==='classic'){renderContent();restoreEditorialAnchor();}};
window.addEventListener('popstate',()=>{const hash=location.hash.slice(1);setMode(['classic','linux','windows'].includes(hash)?hash:['about','activity','journey','work','builds','writing','contact'].includes(hash)?'classic':'home',false);restoreEditorialAnchor();});
applyLanguage();const idle=window.requestIdleCallback||((callback)=>setTimeout(callback,500));idle(()=>syncProjects(),{timeout:2000});
"""
npx=shutil.which('npx.cmd' if os.name=='nt' else 'npx')
if not npx: raise SystemExit('Install Node.js/npm to rebuild; no dependencies are required to serve this site.')
prefix=['cmd.exe','/c',npx] if os.name=='nt' else [npx]
js=root/'.portfolio-build.js';css=root/'.portfolio-build.css'
try:
    sources=[]
    for file in scripts:
        source=(root/file).read_text(encoding='utf-8')
        if file=='games-core.js':
            source=source.replace("if(typeof module!=='undefined')module.exports=api;else root.PortfolioGames=api;",'root.PortfolioGames=api;')
        sources.append(source)
    js.write_text('\n;\n'.join(sources)+tail,encoding='utf-8')
    css.write_text('\n'.join((root/f).read_text(encoding='utf-8') for f in ['desktop.css','games-extra.css','showcase.css','editorial.css']),encoding='utf-8')
    subprocess.run(prefix+['--yes','esbuild@0.27.2',str(js),'--minify','--format=iife','--target=es2020','--charset=utf8','--outfile='+str(root/'portfolio-experience.js')],check=True)
    subprocess.run(prefix+['--yes','esbuild@0.27.2',str(css),'--minify','--outfile='+str(root/'portfolio-experience.css')],check=True)
    index=(root/'index.html').read_text(encoding='utf-8')
    start=index.rindex('<script>');end=index.index('</script>',start)
    index=index[:start]+'<script>'+(root/'portfolio-entry.js').read_text(encoding='utf-8')+index[end:]
    (root/'index.html').write_text(index,encoding='utf-8')
finally:
    js.unlink(missing_ok=True);css.unlink(missing_ok=True)
