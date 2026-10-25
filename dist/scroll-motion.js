/* One-shot, compositor-friendly reveals. Native scrolling remains in control. */
(() => {
  'use strict';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const ease='cubic-bezier(.16,1,.3,1)';
  const selector='.section-head,.service-card,.step,.web-order-panel,.together-item,.app-reminder,.faq-layout>div:first-child,.faq details,.footer-grid>div,.footer-bottom,.page-intro,.editorial-copy,.app-copy,.partner-story,.form-side,.store-card,.menu-card,.order-card,.service-layout>section,.story-section,.page-value,.story-card,.journey-row,.request-prep,.guide-faq>div:first-child,.page-next,.partner-hero-copy,.partner-value,.partner-section-heading,.partner-journey>li,.partner-prep,.partner-interest';
  let observer,headerObserver,ambientObserver,scope,seen=new WeakSet(),opened=false;
  const pending=new Set(),animations=new Set(),loading=new Set();
  function animate(node,frames,options){
    if(!node||preference.matches||!node.isConnected||!node.animate)return;
    const animation=node.animate(frames,{easing:ease,...options});
    animations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
    return animation;
  }
  function reveal(node,immediate=false){
    observer?.unobserve(node);pending.delete(node);node.dataset.motionState='entered';
    if(immediate||preference.matches)return;
    const group=node.closest('.photo-services,.steps,.store-grid,.menu-grid,.together-grid,.footer-grid,.page-values,.story-grid,.faq,.partner-value-grid,.partner-journey');
    const index=group?[...group.children].indexOf(node):0;
    const compact=innerWidth<768;
    const delay=compact?0:Math.max(0,index%3)*65;
    const approach=document.documentElement.dataset.appearance;
    const distance=node.matches('.footer-bottom')?0:({white:14,black:12}[approach]||18);
    animate(node,[{opacity:compact ? .7 : 0,translate:`0 ${compact?6:distance}px`},{opacity:1,translate:'0 0'}],{duration:compact?280:approach==='black'?640:760,delay,fill:'backwards'});
    if(node.matches('.app-reminder')&&!compact){
      node.dataset.motionAccent='play';
      // Reveal real content in reading order; no artificial loading delay.
      ['.app-launch-icon','.app-launch-meta','.app-launch-copy h2','.app-launch-copy p','.btn'].forEach((query,index)=>{
        const item=node.querySelector(query);
        const frames=query==='.app-launch-icon'?[{opacity:0,transform:'translateY(10px) scale(.9)'},{opacity:1,transform:'translateY(0) scale(1)'}]:[{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}];
        animate(item,frames,{duration:600,delay:70+index*55,fill:'backwards'});
      });
    }
  }
  function prepareImages(root){
    root.querySelectorAll('.service-photo img,.store-photo img,.web-order-preview>img,.partner-story>img,.intro-scene>img,.story-card>img,.journey-image>img,.menu-product-image>img,.partner-photo img').forEach(img=>{
      if(img.complete||img.dataset.motionImage)return;
      img.dataset.motionImage='waiting';
      const host=img.parentElement;host.classList.add('media-loading');loading.add(host);
      const finish=()=>{
        host.classList.remove('media-loading');loading.delete(host);img.dataset.motionImage='ready';
        const rect=img.getBoundingClientRect();
        if(img.naturalWidth&&rect.bottom>0&&rect.top<innerHeight)animate(img,[{opacity:.3},{opacity:1}],{duration:420});
      };
      img.addEventListener('load',finish,{once:true,signal:scope.signal});
      img.addEventListener('error',finish,{once:true,signal:scope.signal});
    });
  }
  function refresh(root=document){
    if(!scope)return;
    prepareImages(root);
    if(!observer||preference.matches)return;
    root.querySelectorAll(selector).forEach(node=>{
      if(seen.has(node)||node.parentElement.closest(selector))return;
      seen.add(node);
      const rect=node.getBoundingClientRect();
      // Never conceal content already on screen, restored positions, or hidden controls.
      if(rect.width===0||rect.height===0||rect.bottom<=0||rect.top<innerHeight-8){node.dataset.motionState='entered';return;}
      node.dataset.motionState='pending';pending.add(node);observer.observe(node);
    });
  }
  function brandIntro(){
    if(preference.matches||scrollY>40)return;
    try{if(sessionStorage.getItem('cartman-intro-seen'))return;sessionStorage.setItem('cartman-intro-seen','1')}catch{/* Animation remains optional when storage is unavailable. */}
    const intro=document.createElement('div');
    intro.className='brand-intro';intro.setAttribute('aria-hidden','true');
    intro.innerHTML='<div class="brand-intro-lockup"><div class="brand-intro-orbit"><i></i><img src="assets/brand/icon-dark.webp" width="80" height="80" alt=""></div><strong>CARTMAN<span>PH</span></strong><p>EVERYTHING. <span>DELIVERED.</span></p><div class="brand-intro-track"><i></i></div></div>';
    document.body.append(intro);
    const controls=new AbortController();
    const animation=intro.animate([{opacity:0},{opacity:1,offset:.1},{opacity:1,offset:.58},{opacity:0}],{duration:1050,easing:'ease-in-out',fill:'forwards'});
    const dismiss=()=>{animation.cancel();intro.remove();controls.abort()};
    animation.finished.then(dismiss).catch(()=>{intro.remove();controls.abort()});
    for(const event of ['pointerdown','keydown','wheel','touchstart','pagehide'])addEventListener(event,dismiss,{once:true,passive:true,signal:controls.signal});
    preference.addEventListener('change',dismiss,{once:true,signal:controls.signal});
  }
  function opening(){
    const hero=document.querySelector('.campaign-hero');
    if(opened||!hero||scrollY>40||preference.matches)return;
    opened=true;
    brandIntro();
    const steps=[['.hero-content>.eyebrow',0,8],['.hero-content h1',65,18],['.hero-description',145,12],['.download-badges',210,10],['.hero-web-entry',270,8]];
    for(const [query,delay,y] of steps)animate(hero.querySelector(query),[{opacity:.12,translate:`0 ${y}px`},{opacity:1,translate:'0 0'}],{duration:760,delay,fill:'backwards'});
    // Opacity only: protected faces, branding and device bounds never drift or zoom.
    animate(hero.querySelector('#hero-image'),[{opacity:.45},{opacity:1}],{duration:1000});
    animate(hero.querySelector('.hero-phone'),[{opacity:.15},{opacity:1}],{duration:720,delay:180,fill:'backwards'});
    animate(document.querySelector('#header .nav'),[{opacity:.4},{opacity:1}],{duration:580});
  }
  function cleanup(){
    observer?.disconnect();headerObserver?.disconnect();ambientObserver?.disconnect();scope?.abort();
    document.querySelectorAll('[data-in-view]').forEach(node=>delete node.dataset.inView);
    pending.forEach(node=>{node.dataset.motionState='entered'});pending.clear();
    animations.forEach(animation=>animation.cancel());animations.clear();
    loading.forEach(host=>host.classList.remove('media-loading'));loading.clear();
    document.querySelectorAll('[data-motion-image="waiting"]').forEach(img=>delete img.dataset.motionImage);
  }
  function mount(root=document,options={}){
    cleanup();scope=new AbortController();seen=new WeakSet();
    if(!preference.matches&&'IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=.04)reveal(entry.target)});
      },{threshold:.04,rootMargin:innerWidth<768?'0px 0px 100px 0px':'0px'});
    }else observer=null;
    if(!preference.matches&&'IntersectionObserver' in window){
      ambientObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.dataset.inView=String(entry.isIntersecting)),{threshold:.1});
      root.querySelectorAll('.partner-route').forEach(node=>ambientObserver.observe(node));
    }
    let sentinel=document.querySelector('#motion-scroll-sentinel');
    if(!sentinel){sentinel=document.createElement('span');sentinel.id='motion-scroll-sentinel';sentinel.setAttribute('aria-hidden','true');document.body.prepend(sentinel);}
    if('IntersectionObserver' in window){
      headerObserver=new IntersectionObserver(entries=>document.body.classList.toggle('has-scrolled',!entries[0].isIntersecting));
      headerObserver.observe(sentinel);
    }
    document.addEventListener('focusin',event=>{
      const node=event.target.closest('[data-motion-state="pending"]');if(node)reveal(node,true);
    },{signal:scope.signal});
    refresh(root);if(options.opening)opening();
  }
  preference.addEventListener('change',()=>mount(document));
  window.CartmanMotion={mount,refresh};
})();
