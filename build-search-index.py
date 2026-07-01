#!/usr/bin/env python3
# build-search-index.py — 전 교안 본문을 추출해 search-content.json 생성 (정적 전문검색용)
# 사용: python3 build-search-index.py  (커밋 전 실행. 콘텐츠 변경 시 재실행)
import os, re, json, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
CAP = 16000  # 페이지당 본문 최대 글자 수 (인덱스 크기 제한)

def md_to_text(md):
    md = re.sub(r'```.*?```', lambda m: re.sub(r'```[a-zA-Z]*', ' ', m.group(0)), md, flags=re.S)  # 코드펜스 마커만 제거, 내용 유지
    md = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', md)          # 이미지 제거
    md = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', md)       # 링크 → 텍스트만
    md = re.sub(r'^\s*#{1,6}\s*', ' ', md, flags=re.M)     # 헤딩 마커
    md = re.sub(r'[>*_`|]', ' ', md)                        # 마크다운 기호
    md = re.sub(r'^\s*[-–]\s+', ' ', md, flags=re.M)       # 리스트 불릿
    md = re.sub(r'\s+', ' ', md)                            # 공백 축소
    return md.strip()

def html_to_text(html):
    html = re.sub(r'<style[^>]*>.*?</style>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<[^>]+>', ' ', html)
    for a, b in [('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>'), ('&quot;', '"'), ('&#39;', "'"), ('&nbsp;', ' ')]:
        html = html.replace(a, b)
    html = re.sub(r'\s+', ' ', html)
    return html.strip()

def url_from_md(fname):
    base = os.path.basename(fname)[:-3]          # .md 제거
    if base.startswith('교안_'):
        base = base[len('교안_'):]
    return base.replace('_', '-') + '.html'

index = {}

# 1) MD 기반 페이지 (교안_*.md + ai-compare.md + compare.md)
md_files = glob.glob(os.path.join(ROOT, '교안_*.md')) + \
           [os.path.join(ROOT, 'ai-compare.md'), os.path.join(ROOT, 'compare.md')]
for f in md_files:
    if not os.path.isfile(f):
        continue
    url = url_from_md(f)
    if not os.path.isfile(os.path.join(ROOT, url)):
        continue  # 대응 HTML이 없으면 스킵
    with open(f, encoding='utf-8') as fh:
        index[url] = md_to_text(fh.read())[:CAP]

# 2) MD 없는 HTML 단독 콘텐츠 페이지
HTML_ONLY = ['claude-skills.html', 'software-engineering.html',
             'claude-code-roadmap.html', 'nvidia-gtc-2025.html']
for url in HTML_ONLY:
    p = os.path.join(ROOT, url)
    if os.path.isfile(p) and url not in index:
        with open(p, encoding='utf-8') as fh:
            index[url] = html_to_text(fh.read())[:CAP]

out = os.path.join(ROOT, 'search-content.json')
with open(out, 'w', encoding='utf-8') as fh:
    json.dump(index, fh, ensure_ascii=False, separators=(',', ':'))

size = os.path.getsize(out)
print(f'search-content.json 생성: {len(index)}개 페이지, {size/1024:.0f} KB')
for u in sorted(index):
    print(f'  {u}: {len(index[u])}자')
