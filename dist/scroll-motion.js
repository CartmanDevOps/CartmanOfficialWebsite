/* One-shot section reveals and optional smooth wheel scrolling. */
(() => {
  'use strict';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const ease='cubic-bezier(.16,1,.3,1)';
  const selector='.section-head,.service-card,.step,.web-order-panel,.together-item,.app-reminder,.faq-layout>div:first-child,.faq details,.footer-grid>div,.footer-bottom,.page-intro,.editorial-copy,.app-copy,.partner-story,.form-side,.store-card,.menu-card,.order-card,.service-layout>section,.story-section,.page-value,.story-card,.journey-row,.request-prep,.guide-faq>div:first-child,.page-next,.partner-hero-copy,.partner-value,.partner-section-heading,.partner-journey>li,.partner-prep,.partner-interest';
  let observer,headerObserver,ambientObserver,scope,seen=new WeakSet(),opened=false;
  const pending=new Set(),animations=new Set(),loading=new Set();
  const finePointer=matchMedia('(pointer: fine)');
  let smoothScroll,lenisLoading;
  function configureScrolling(){
    smoothScroll?.destroy();smoothScroll=null;
    document.documentElement.dataset.scrollMode='native';
    if(preference.matches||!finePointer.matches||document.body.classList.contains('order-site'))return;
    if(!window.Lenis){
      document.documentElement.dataset.scrollMode='loading-wheel';
      if(!lenisLoading)lenisLoading=new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=new URL('assets/vendor/lenis-1.3.27.min.js',document.baseURI).href;script.async=true;
        script.onload=()=>{if(typeof window.Lenis==='function')resolve();else{script.remove();reject(new Error('Scroll library is not supported'))}};
        script.onerror=()=>{script.remove();reject(new Error('Scroll library could not load'))};document.head.append(script);
      })
        .then(()=>{lenisLoading=null;configureScrolling()}).catch(error=>{lenisLoading=null;document.documentElement.dataset.scrollMode='native-fallback';console.warn('Optional wheel smoothing unavailable:',error.message)});
      return;
    }
    document.documentElement.dataset.scrollMode='smooth-wheel';
    smoothScroll=new window.Lenis({autoRaf:true,lerp:.13,smoothWheel:true,syncTouch:false,
      prevent:node=>node.matches?.('dialog,.navlinks,.theme-panel,textarea,select,[data-native-scroll]')||false});
  }
  configureScrolling();
  finePointer.addEventListener('change',configureScrolling);
  addEventListener('hashchange',()=>smoothScroll?.scrollTo(0,{immediate:true,force:true}));
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
    const compact=innerWidth<768;
    const group=node.closest('.photo-services,.steps,.store-grid,.menu-grid,.footer-grid,.partner-value-grid,.partner-journey');
    const index=group?Math.max(0,[...group.children].indexOf(node)):0;
    const delay=(index%(compact?2:3))*(compact?35:55);
    animate(node,[{opacity:0,translate:`0 ${compact?14:22}px`},{opacity:1,translate:'0 0'}],{duration:compact?580:740,delay,fill:'backwards'});
    const photo=node.querySelector('.service-photo img,.store-photo img,.web-order-preview>img');
    if(photo?.complete&&photo.naturalWidth)animate(photo,[{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:900,delay});
    if(node.matches('.app-reminder'))node.dataset.motionAccent='play';
  }
  function prepareImages(root){
    root.querySelectorAll('.service-photo img,.store-photo img,.web-order-preview>img,.partner-story>img,.intro-scene>img,.story-card>img,.journey-image>img,.menu-product-image>img,.partner-photo img').forEach(img=>{
      if(img.complete||img.dataset.motionImage)return;
      img.dataset.motionImage='waiting';
      const host=img.parentElement;host.classList.add('media-loading');loading.add(host);
      const finish=()=>{
        host.classList.remove('media-loading');loading.delete(host);img.dataset.motionImage='ready';
        const rect=img.getBoundingClientRect();
        if(img.naturalWidth&&rect.bottom>0&&rect.top<innerHeight)animate(img,[{opacity:.35},{opacity:1}],{duration:480});
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
  function opening(){
    const hero=document.querySelector('.campaign-hero');
    if(opened||!hero||scrollY>40||preference.matches)return;
    opened=true;
    const entries=[];
    const entranceEase='cubic-bezier(.22,.61,.36,1)';
    const enter=(node,delay=0,distance=10,duration=1150)=>{
      const animation=animate(node,[{opacity:.72,translate:`0 ${distance}px`},{opacity:1,translate:'0 0'}],{duration,delay,easing:entranceEase,fill:'backwards'});
      if(animation)entries.push(animation);
    };
    hero.dataset.opening='entering';
    document.dispatchEvent(new Event('cartman-opening-change'));
    enter(hero.querySelector('.hero-content>.eyebrow'),0,5,900);
    enter(hero.querySelector('.hero-content h1'),80,12,1150);
    enter(hero.querySelector('.hero-content h1>span'),160,4,1250);
    enter(hero.querySelector('.hero-description'),240,10,1150);
    hero.querySelectorAll('.download-badge').forEach((badge,index)=>enter(badge,360+index*90,8,1000));
    enter(hero.querySelector('.hero-web-entry'),520,6,1000);
    // A solid device settles within its existing safe frame; it never becomes translucent.
    const phone=animate(hero.querySelector('.hero-phone'),[{translate:'0 8px'},{translate:'0 0'}],{duration:1250,delay:280,easing:entranceEase,fill:'backwards'});
    if(phone)entries.push(phone);
    Promise.all(entries.map(animation=>animation.finished.catch(()=>{}))).then(()=>{if(hero.isConnected){hero.dataset.opening='ready';document.dispatchEvent(new Event('cartman-opening-change'))}});
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
      },{threshold:.04,rootMargin:'0px 0px 40px 0px'});
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
    requestAnimationFrame(()=>{smoothScroll?.resize();smoothScroll?.scrollTo(scrollY,{immediate:true,force:true})});
  }
  preference.addEventListener('change',()=>{configureScrolling();mount(document)});
  function scrollToElement(target){
    if(!target)return;
    if(smoothScroll)smoothScroll.scrollTo(target,{offset:0,lerp:0,duration:1.05});
    else target.scrollIntoView({behavior:preference.matches?'instant':'smooth',block:'start'});
  }
  function closeDialog(dialog){
    if(!dialog?.open||dialog.dataset.closing==='true')return;
    if(preference.matches||!dialog.animate){dialog.close();return;}
    dialog.dataset.closing='true';
    const exit=animate(dialog,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(6px) scale(.985)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
    exit.finished.catch(()=>{}).finally(()=>{if(dialog.open)dialog.close();delete dialog.dataset.closing;exit.cancel()});
  }
  window.CartmanMotion={mount,refresh,scrollTo:scrollToElement,closeDialog};
})();
