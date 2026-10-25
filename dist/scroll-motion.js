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
    // Content stays readable throughout scrolling; motion is a small one-shot settle.
    animate(node,[{opacity:.94,translate:'0 4px'},{opacity:1,translate:'0 0'}],{duration:320});
  }
  function prepareImages(root){
    root.querySelectorAll('.service-photo img,.store-photo img,.web-order-preview>img,.partner-story>img,.intro-scene>img,.story-card>img,.journey-image>img,.menu-product-image>img,.partner-photo img').forEach(img=>{
      if(img.complete||img.dataset.motionImage)return;
      img.dataset.motionImage='waiting';
      const host=img.parentElement;host.classList.add('media-loading');loading.add(host);
      const finish=()=>{
        host.classList.remove('media-loading');loading.delete(host);img.dataset.motionImage='ready';
        const rect=img.getBoundingClientRect();
        if(img.naturalWidth&&rect.bottom>0&&rect.top<innerHeight)animate(img,[{opacity:.9},{opacity:1}],{duration:220});
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
    try{if(sessionStorage.getItem('cartman-intro-seen-v2'))return;sessionStorage.setItem('cartman-intro-seen-v2','1')}catch{/* Animation remains optional when storage is unavailable. */}
    const intro=document.createElement('div');
    intro.className='brand-intro';intro.setAttribute('aria-hidden','true');
    intro.innerHTML='<div class="brand-intro-lockup"><span class="brand-intro-prelude">YOUR DAY IS ABOUT TO MOVE.</span><div class="brand-intro-orbit"><svg viewBox="0 0 140 140" class="brand-intro-route"><circle cx="70" cy="70" r="62" pathLength="1"/></svg><i></i><img src="assets/brand/icon-dark.webp" width="80" height="80" alt=""></div><strong>CARTMAN<span>PH</span></strong><p>EVERYTHING. <span>DELIVERED.</span></p><span class="brand-intro-services">DELIVERIES <i>·</i> LIFT <i>·</i> ERRANDS</span></div>';
    document.body.append(intro);
    document.dispatchEvent(new Event('cartman-intro-change'));
    const controls=new AbortController();
    const animation=intro.animate([{opacity:1},{opacity:1,offset:.81},{opacity:0}],{duration:2600,easing:'ease-in-out',fill:'forwards'});
    let dismissed=false;
    const dismiss=()=>{if(dismissed)return;dismissed=true;intro.remove();controls.abort();animation.cancel();document.dispatchEvent(new Event('cartman-intro-change'))};
    animation.finished.then(dismiss).catch(dismiss);
    for(const event of ['pointerdown','keydown','wheel','touchstart','pagehide'])addEventListener(event,dismiss,{once:true,passive:true,signal:controls.signal});
    preference.addEventListener('change',dismiss,{once:true,signal:controls.signal});
  }
  function opening(){
    const hero=document.querySelector('.campaign-hero');
    if(opened||!hero||scrollY>40||preference.matches)return;
    opened=true;
    // Reveal the complete UI immediately; never fade the phone chassis or its contents.
    animate(hero.querySelector('.hero-content'),[{translate:'0 4px'},{translate:'0 0'}],{duration:360});
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
      },{threshold:.04,rootMargin:'0px 0px 140px 0px'});
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
