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

// === 자기주도학습 네비게이션 자동 생성 ===
// lessons-data.js의 LESSONS 객체를 사용하여 5가지 네비게이션 요소를 자동 삽입합니다.
(function(){
  if(typeof LESSONS==='undefined') return; // lessons-data.js 미로드 시 무시

  // 현재 페이지 감지
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  let currentTool = null, currentLevel = null;

  for(const [toolId, tool] of Object.entries(LESSONS.tools)){
    for(const level of ['beginner','intermediate','developer']){
      if(tool[level] && tool[level].url === currentFile){
        currentTool = toolId;
        currentLevel = level;
        break;
      }
    }
    if(currentTool) break;
  }

  // 특별 페이지 감지
  let currentSpecial = null;
  if(!currentTool){
    currentSpecial = LESSONS.special.find(s => s.url === currentFile);
  }

  // index.html이면 네비게이션 생성하지 않음
  if(currentFile === 'index.html') return;

  const tool = currentTool ? LESSONS.tools[currentTool] : null;
  const levelNames = LESSONS.levelNames;

  // 1. 브레드크럼 생성 (topnav 바로 아래)
  function createBreadcrumb(){
    const nav = document.querySelector('.topnav');
    if(!nav) return;
    const bc = document.createElement('nav');
    bc.className = 'breadcrumb';
    bc.setAttribute('aria-label','Breadcrumb');
    let html = '<a href="index.html">🏠 홈</a>';
    if(tool){
      html += '<span class="sep">›</span>';
      html += '<a href="'+tool.beginner.url+'">'+tool.icon+' '+tool.name+'</a>';
      html += '<span class="sep">›</span>';
      html += '<span class="current">'+levelNames[currentLevel]+'</span>';
    } else if(currentSpecial){
      html += '<span class="sep">›</span>';
      html += '<span class="current">'+currentSpecial.icon+' '+currentSpecial.title+'</span>';
    }
    bc.innerHTML = html;
    nav.insertAdjacentElement('afterend', bc);
  }

  // 2. 선수 학습 배너 생성 (hero 아래)
  function createPrereqBanner(){
    if(!tool || !tool.prereqs || !tool.prereqs[currentLevel] || tool.prereqs[currentLevel].length===0) return;
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const prereqs = tool.prereqs[currentLevel];
    let links = prereqs.map(function(p){
      const parts = p.split('-');
      const pLevel = parts.pop();
      const pToolId = parts.join('-');
      const pTool = LESSONS.tools[pToolId];
      if(!pTool || !pTool[pLevel]) return '';
      return '<a href="'+pTool[pLevel].url+'">'+pTool.icon+' '+pTool[pLevel].title+'</a>';
    }).filter(Boolean);
    if(links.length===0) return;
    const banner = document.createElement('div');
    banner.className = 'prereq-banner';
    banner.innerHTML = '<strong>📋 이 교안을 시작하기 전에</strong><br>'+links.join(', ')+' 을(를) 먼저 읽으면 더 잘 이해할 수 있어요!';
    hero.insertAdjacentElement('afterend', banner);
  }

  // 3. 학습 경로 배너 생성
  function createLearningPath(){
    if(!currentTool || !currentLevel) return;
    const layout = document.querySelector('.layout');
    if(!layout) return;
    // 현재 페이지가 포함된 경로 찾기
    let matchedPath = null, matchedPathName = '';
    for(const [pathName, steps] of Object.entries(LESSONS.paths)){
      for(const step of steps){
        if(step.tool === currentTool && step.level === currentLevel){
          matchedPath = steps;
          matchedPathName = pathName === 'beginner' ? '입문자 경로' : pathName === 'intermediate' ? '중급자 경로' : '개발자 경로';
          break;
        }
      }
      if(matchedPath) break;
    }
    if(!matchedPath) return;
    const wrap = document.createElement('div');
    wrap.className = 'learning-path-wrap';
    let html = '<div class="learning-path"><span class="path-label">📍 '+matchedPathName+'</span>';
    matchedPath.forEach(function(step, i){
      const sTool = LESSONS.tools[step.tool];
      if(!sTool) return;
      const sLesson = sTool[step.level];
      if(!sLesson) return;
      if(i>0) html += '<span class="arrow">→</span>';
      const isCurrent = step.tool === currentTool && step.level === currentLevel;
      html += '<span class="step'+(isCurrent?' current':'')+'">';
      if(isCurrent){
        html += '<span>'+sTool.icon+' '+sLesson.title+'</span>';
      } else {
        html += '<a href="'+sLesson.url+'">'+sTool.icon+' '+sLesson.title+'</a>';
      }
      html += '</span>';
    });
    html += '</div>';
    wrap.innerHTML = html;
    layout.insertAdjacentElement('beforebegin', wrap);
  }

  // 4. 관련 교안 카드 생성 (main 하단)
  function createRelatedCards(){
    if(!tool || !tool.related) return;
    const main = document.querySelector('main.content') || document.querySelector('.content');
    if(!main) return;
    const section = document.createElement('div');
    section.className = 'related-section';
    let html = '<h2 id="related">📚 관련 교안</h2><div class="related-grid">';
    tool.related.forEach(function(relId){
      const rel = LESSONS.tools[relId];
      if(!rel) return;
      // 현재 레벨과 같은 레벨의 교안으로 링크 (없으면 beginner)
      const targetLevel = rel[currentLevel] ? currentLevel : 'beginner';
      const target = rel[targetLevel];
      if(!target) return;
      html += '<a href="'+target.url+'" class="related-card">';
      html += '<div class="rc-icon">'+rel.icon+'</div>';
      html += '<div class="rc-name">'+rel.name+'</div>';
      html += '<div class="rc-desc">'+(target.desc || target.title)+'</div>';
      html += '</a>';
    });
    html += '</div>';
    section.innerHTML = html;
    // "출처" 섹션 전에 삽입, 없으면 main 끝에
    const sourcesH2 = main.querySelector('#sources');
    if(sourcesH2){
      sourcesH2.insertAdjacentElement('beforebegin', section);
    } else {
      main.appendChild(section);
    }
    // sidebar에 관련 교안 링크 추가
    const sidebar = document.querySelector('.sidebar');
    if(sidebar){
      const link = document.createElement('a');
      link.href = '#related';
      link.textContent = '📚 관련 교안';
      const sourcesLink = sidebar.querySelector('a[href="#sources"]');
      if(sourcesLink) sourcesLink.insertAdjacentElement('beforebegin', link);
      else sidebar.appendChild(link);
    }
  }

  // 5. Footer 네비게이션 바 생성
  function createFooterNav(){
    if(!tool) return;
    const levels = ['beginner','intermediate','developer'];
    const idx = levels.indexOf(currentLevel);
    const prev = idx > 0 && tool[levels[idx-1]] ? tool[levels[idx-1]] : null;
    const next = idx < 2 && tool[levels[idx+1]] ? tool[levels[idx+1]] : null;
    const content = document.querySelector('main.content') || document.querySelector('.content');
    if(!content) return;
    const nav = document.createElement('div');
    nav.className = 'lesson-nav';
    let html = '';
    if(prev){
      html += '<a href="'+prev.url+'" class="nav-prev">← '+prev.title+'</a>';
    } else {
      html += '<span class="nav-placeholder">placeholder</span>';
    }
    html += '<a href="index.html" class="nav-home">🏠 전체 교안</a>';
    if(next){
      html += '<a href="'+next.url+'" class="nav-next">'+next.title+' →</a>';
    } else {
      html += '<span class="nav-placeholder">placeholder</span>';
    }
    nav.innerHTML = html;
    content.appendChild(nav);
  }

  // 실행
  createBreadcrumb();
  createPrereqBanner();
  createLearningPath();
  createRelatedCards();
  createFooterNav();
})();
