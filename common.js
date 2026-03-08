// common.js - 바이브코딩 가이드 교안 공통 스크립트

// Mobile TOC
(function(){
  var btn=document.getElementById('mobileTocBtn'),overlay=document.getElementById('mobileTocOverlay'),panel=document.getElementById('mobileTocPanel');
  document.querySelectorAll('.sidebar a').forEach(function(a){var c=a.cloneNode(true);c.addEventListener('click',function(){panel.classList.remove('open');overlay.style.display='none'});panel.appendChild(c)});
  btn.addEventListener('click',function(){overlay.style.display='block';panel.classList.add('open')});
  overlay.addEventListener('click',function(){panel.classList.remove('open');overlay.style.display='none'});
})();

// Back to Top
(function(){
  var b=document.getElementById('backToTop');
  window.addEventListener('scroll',function(){b.classList.toggle('visible',window.scrollY>400)});
  b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();

// Scroll Spy
(function(){
  var links=document.querySelectorAll('.sidebar a');
  var sections=[];
  links.forEach(function(a){var id=a.getAttribute('href');if(id&&id.startsWith('#')){var el=document.querySelector(id);if(el)sections.push({el:el,link:a})}});
  function update(){
    var current=sections[0];
    for(var i=0;i<sections.length;i++){if(sections[i].el.getBoundingClientRect().top<=100)current=sections[i]}
    links.forEach(function(a){a.classList.remove('active')});
    if(current)current.link.classList.add('active');
  }
  window.addEventListener('scroll',update);update();
})();

// Copy Button for Code Blocks
(function(){
  document.querySelectorAll('pre code').forEach(function(block){
    var btn=document.createElement('button');btn.className='copy-btn';btn.textContent='\uBCF5\uC0AC';
    btn.addEventListener('click',function(){
      navigator.clipboard.writeText(block.textContent).then(function(){btn.textContent='\uC644\uB8CC!';btn.classList.add('copied');setTimeout(function(){btn.textContent='\uBCF5\uC0AC';btn.classList.remove('copied')},2000)});
    });
    block.parentElement.appendChild(btn);
  });
})();
