// search.js — 사이트 전체 교안 전문(full-text) 검색 (클라이언트 사이드)
// 메타데이터: lessons-data.js(LESSONS). 본문: search-content.json (build-search-index.py로 생성).
// 홈(index.html) 구글형 자동완성 + 검색 결과 페이지(search.html)를 함께 구동한다.
(function () {
  'use strict';

  var CONTENT = null;              // { url: "본문 텍스트" }
  var contentPromise = null;       // 지연 로딩: 사용자가 검색을 시작할 때만 1.1MB 인덱스를 받는다
  function loadContent() {
    if (!contentPromise) {
      contentPromise = fetch('search-content.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (d) { CONTENT = d || {}; return CONTENT; })
        .catch(function () { CONTENT = {}; return CONTENT; });
    }
    return contentPromise;
  }

  // lessons-data.js(LESSONS)에 없는 단독 페이지 보충
  var EXTRA = [
    { title: 'Claude Code 마스터 로드맵', desc: '탭 기반 학습 로드맵', url: 'claude-code-roadmap.html', icon: '⚡', color: '#FF9800', badge: '심화·리포트', kw: 'claude code roadmap 로드맵 클로드코드' },
    { title: 'NVIDIA GTC 2025 리포트', desc: '컨퍼런스 완전 리포트', url: 'nvidia-gtc-2025.html', icon: '🎯', color: '#76B900', badge: '심화·리포트', kw: 'nvidia gtc 2025 리포트 엔비디아' }
  ];

  var SYN = {
    '터미널': 'devinterface 터미널 cli', 'cli': 'devinterface', '명령어': 'devinterface',
    '깃': 'github git', '깃허브': 'github', '버전관리': 'github',
    '배포': 'deployment vercel supabase replit', '호스팅': 'deployment',
    '디자인': 'claude-design', '에이전트': 'claude-cowork claude-code antigravity',
    '트렌드': 'trend-report', '비교': 'compare ai-compare', '프롬프트': 'prompt',
    '데이터베이스': 'deployment supabase', 'db': 'deployment supabase',
    '웹': 'webdev', '앱': 'webdev lovable', '기초': 'webdev devinterface'
  };

  function levelNames() {
    return (typeof LESSONS !== 'undefined' && LESSONS.levelNames) ||
      { beginner: '초보자편', intermediate: '중급자편', developer: '개발자편' };
  }

  function buildIndex() {
    var idx = [];
    if (typeof LESSONS !== 'undefined' && LESSONS.tools) {
      var lv = levelNames();
      Object.keys(LESSONS.tools).forEach(function (tid) {
        var t = LESSONS.tools[tid];
        ['beginner', 'intermediate', 'developer'].forEach(function (level) {
          if (!t[level]) return;
          idx.push({
            title: t[level].title, desc: t[level].desc || '', url: t[level].url,
            icon: t.icon, color: t.color,
            badge: t.name + ' · ' + (lv[level] || level),
            kw: (tid + ' ' + t.name + ' ' + level).toLowerCase()
          });
        });
      });
      (LESSONS.special || []).forEach(function (s) {
        idx.push({ title: s.title, desc: '', url: s.url, icon: s.icon, color: s.color, badge: '심화·리포트', kw: (s.id || '').toLowerCase() });
      });
    }
    EXTRA.forEach(function (e) { idx.push(e); });
    return idx;
  }

  // 오타 허용(퍼지): 바이그램 Dice 유사도 — "러벝블"→"러버블", "lovabel"→"lovable"
  function bigrams(s) { var r = []; for (var i = 0; i < s.length - 1; i++) r.push(s.substr(i, 2)); return r; }
  function dice(a, b) {
    if (a.length < 2 || b.length < 2) return 0;
    var A = bigrams(a), B = bigrams(b), used = new Array(B.length), hit = 0;
    for (var i = 0; i < A.length; i++) for (var j = 0; j < B.length; j++) {
      if (!used[j] && A[i] === B[j]) { used[j] = true; hit++; break; }
    }
    return (2 * hit) / (A.length + B.length);
  }
  function jamo(s) { try { return s.normalize('NFD'); } catch (e) { return s; } } // 한글 자모 분해("러벝블"↔"러버블" 근사 매칭용)
  function fuzzyScore(it, q) {
    var words = (it.title + ' ' + it.kw).toLowerCase().split(/[\s·—-]+/);
    var qj = jamo(q), best = 0;
    for (var i = 0; i < words.length; i++) { var d = dice(qj, jamo(words[i])); if (d > best) best = d; }
    return best;
  }

  function scoreItem(it, q, synTerm) {
    var title = it.title.toLowerCase();
    var meta = (it.title + ' ' + it.desc + ' ' + it.badge + ' ' + it.kw).toLowerCase();
    var body = (CONTENT && CONTENT[it.url]) ? CONTENT[it.url].toLowerCase() : '';
    var s = 0, where = '';
    if (title.indexOf(q) === 0) { s = 100; }
    else if (title.indexOf(q) !== -1) { s = 70; }
    else if (meta.indexOf(q) !== -1) { s = 45; }
    else if (body.indexOf(q) !== -1) { s = 25; where = 'body'; }   // 본문 일치
    else if (synTerm && (meta.indexOf(synTerm) !== -1 || body.indexOf(synTerm) !== -1)) { s = 15; }
    else if (q.length >= 3 && fuzzyScore(it, q) >= 0.55) { s = 10; } // 오타 근사 일치
    return { score: s, inBody: where === 'body' };
  }

  function makeSnippet(url, q) {
    var text = (CONTENT && CONTENT[url]) ? CONTENT[url] : '';
    if (!text) return '';
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return '';
    var start = Math.max(0, i - 45), end = Math.min(text.length, i + q.length + 75);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  window.searchLessons = function (query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return [];
    var synTerm = SYN[q] ? SYN[q].split(' ')[0] : null;
    return buildIndex()
      .map(function (it) {
        var r = scoreItem(it, q, synTerm);
        if (r.score > 0 && r.inBody) it._snippet = makeSnippet(it.url, q);
        return { it: it, sc: r.score };
      })
      .filter(function (x) { return x.sc > 0; })
      .sort(function (a, b) { return b.sc - a.sc || a.it.title.localeCompare(b.it.title); })
      .map(function (x) { return x.it; });
  };

  // 콘텐츠가 늦게 로드되어도 현재 검색을 다시 반영할 수 있게 콜백 등록 (호출 시 로딩 시작)
  window.onSearchContentReady = function (cb) { loadContent().then(cb); };

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function highlight(escaped, q) {
    if (!q) return escaped;
    var qEsc = esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try { return escaped.replace(new RegExp('(' + qEsc + ')', 'ig'), '<mark>$1</mark>'); }
    catch (e) { return escaped; }
  }

  // ===== 홈(index) hero 검색창 자동완성 =====
  function initHeroSearch() {
    var input = document.getElementById('heroSearchInput');
    var box = document.getElementById('heroSearchSuggest');
    var form = document.getElementById('heroSearchForm');
    if (!input || !box || !form) return;

    function go(q) { if (q && q.trim()) location.href = 'search.html?q=' + encodeURIComponent(q.trim()); }
    form.addEventListener('submit', function (e) { e.preventDefault(); go(input.value); });

    function renderSuggest() {
      var q = input.value.trim();
      if (!q) { box.style.display = 'none'; box.innerHTML = ''; return; }
      var results = window.searchLessons(q).slice(0, 7);
      if (!results.length) {
        box.innerHTML = '<div class="hs-empty">검색 결과가 없어요. 이런 검색어는 어때요?<br>' +
          ['러버블', '터미널', '배포', '프롬프트', '에이전트'].map(function (w) {
            return '<a class="hs-chip" href="search.html?q=' + encodeURIComponent(w) + '">' + w + '</a>';
          }).join(' ') +
          '</div><a class="hs-all" href="index.html#all-cards" style="display:block;text-align:center;text-decoration:none">📚 전체 교안 보기</a>';
        box.style.display = 'block'; return;
      }
      box.innerHTML = results.map(function (r) {
        var sub = r._snippet ? '<span class="hs-badge">본문: ' + highlight(esc(r._snippet), q) + '</span>' : '<span class="hs-badge">' + esc(r.badge) + '</span>';
        return '<a class="hs-item" href="' + esc(r.url) + '">' +
          '<span class="hs-icon" style="color:' + esc(r.color || '#5A4ED9') + '">' + esc(r.icon || '📄') + '</span>' +
          '<span class="hs-text"><span class="hs-title">' + esc(r.title) + '</span>' + sub + '</span></a>';
      }).join('') + '<button type="button" class="hs-all" id="hsAllBtn">"' + esc(q) + '" 전체 검색 결과 보기 →</button>';
      var allBtn = document.getElementById('hsAllBtn');
      if (allBtn) allBtn.addEventListener('click', function () { go(q); });
      box.style.display = 'block';
    }
    // 지연 로딩: 검색을 실제로 시작할 때만 본문 인덱스 fetch
    input.addEventListener('focus', function () { loadContent(); }, { once: true });
    input.addEventListener('input', function () {
      loadContent().then(function () { if (document.activeElement === input && input.value.trim()) renderSuggest(); });
      renderSuggest();
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) box.style.display = 'none'; });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.style.display = 'none'; });
  }

  // ===== 검색 결과 페이지(search.html) =====
  function initSearchPage() {
    var results = document.getElementById('searchResults');
    var input = document.getElementById('searchPageInput');
    var countEl = document.getElementById('searchCount');
    if (!results) return;

    function render(q) {
      q = (q || '').trim();
      if (!q) {
        if (countEl) countEl.textContent = '';
        results.innerHTML = '<p class="search-hint">도구 이름(러버블·커서·Claude Code…), 주제(터미널·배포·프롬프트…), 또는 <b>본문 속 키워드</b>로 검색해 보세요.</p>';
        return;
      }
      var list = window.searchLessons(q);
      var loading = (CONTENT === null) ? ' (본문 인덱스 불러오는 중…)' : '';
      if (countEl) countEl.textContent = '"' + q + '" 검색 결과 ' + list.length + '건' + loading;
      if (!list.length) {
        var chips = ['러버블', '터미널', '배포', '프롬프트', '에이전트', 'Supabase'].map(function (w) {
          return '<button type="button" class="sp-chip" data-q="' + esc(w) + '">' + esc(w) + '</button>';
        }).join(' ');
        results.innerHTML = '<p class="search-hint">"' + esc(q) + '"에 대한 결과가 없습니다.' +
          (CONTENT === null ? ' 본문 인덱스를 불러오는 중이니 잠시 후 다시 표시됩니다.' : '') +
          '</p><p class="search-hint">이런 검색어는 어때요?<br>' + chips +
          '</p><p class="search-hint"><a href="index.html#all-cards">📚 전체 교안 보기 →</a></p>';
        results.querySelectorAll('.sp-chip').forEach(function (b) {
          b.addEventListener('click', function () {
            if (input) { input.value = b.getAttribute('data-q'); input.dispatchEvent(new Event('input', { bubbles: true })); }
          });
        });
        return;
      }
      var ql = q.toLowerCase();
      results.innerHTML = list.map(function (r) {
        var snip = r._snippet ? '<span class="sr-snippet">' + highlight(esc(r._snippet), ql) + '</span>' : '';
        return '<a class="search-result" href="' + esc(r.url) + '">' +
          '<span class="sr-icon" style="background:' + esc(r.color || '#5A4ED9') + '22;color:' + esc(r.color || '#5A4ED9') + '">' + esc(r.icon || '📄') + '</span>' +
          '<span class="sr-body"><span class="sr-title">' + highlight(esc(r.title), ql) + '</span>' +
          (r.desc ? '<span class="sr-desc">' + esc(r.desc) + '</span>' : '') + snip +
          '<span class="sr-badge">' + esc(r.badge) + '</span></span>' +
          '<span class="sr-arrow">→</span></a>';
      }).join('');
    }

    var params = new URLSearchParams(location.search);
    var q0 = params.get('q') || '';
    if (input) {
      input.value = q0;
      input.addEventListener('input', function () {
        render(input.value);
        history.replaceState(null, '', input.value.trim() ? ('?q=' + encodeURIComponent(input.value.trim())) : location.pathname);
      });
      var f = document.getElementById('searchPageForm');
      if (f) f.addEventListener('submit', function (e) { e.preventDefault(); render(input.value); });
      input.focus();
    }
    render(q0);
    // 검색 페이지는 검색이 목적이므로 즉시 본문 인덱스 로드 → 로드 후 재검색
    loadContent().then(function () { render(input ? input.value : q0); });
  }

  function init() { initHeroSearch(); initSearchPage(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
