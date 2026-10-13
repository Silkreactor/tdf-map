'use strict';
(() => {
  const DATA = JSON.parse(document.getElementById('atlas-data').textContent), MAP = DATA.map;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nodes = new Map(MAP.nodes.map(n=>[n.id,n])), sources = new Map(MAP.sources.map(s=>[s.id,s])), groups = new Map(MAP.groups.map(g=>[g.id,g]));
  const state = {query:'',group:'',selected:null,view:'map',expanded:new Set(),all:false};
  let visible=[], lastFocus=null;
  const normalize = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
  const words = t => String(t).trim().split(/\s+/).filter(Boolean);
  const previewText = n => words(n.summary).slice(0,24).join(' ')+(words(n.summary).length>24?'…':'');
  const uncertain = n => n.status==='unknown'||n.questions.length>0||(n.internalQuestions||[]).length>0;
  const rootHTML = map => `<div class="start-root" id="start-root"><span class="root-kicker">Start here</span><strong>${esc(map.title)}</strong><span>Choose a branch, then a node.</span></div>`;
  const branchLabel = (g,members) => `<strong>${esc(g.title)}</strong><span class="branch-meta">${members.length} ${members.length===1?'node':'nodes'}${members.some(uncertain)?' · <span class="unknown-marker" title="Open questions in this branch" aria-label="Open questions in this branch">?</span>':''}</span>`;
  const branchButton = (g,members,open,prefix='branch',forced=false) => `<button class="branch-toggle" data-branch="${esc(g.id)}" aria-expanded="${open}" aria-controls="${prefix}-${esc(g.id)}"${forced?' disabled title="Clear filters to collapse this branch"':''}>${branchLabel(g,members)}<span class="toggle" aria-hidden="true">${open?'−':'+'}</span></button>`;
  const card = (n,prefix='map') => `<div class="node-wrap"><button class="node${state.selected===n.id?' selected':''}" data-node="${esc(n.id)}" aria-describedby="${prefix}-preview-${esc(n.id)}"><strong>${esc(n.label)}</strong><span class="node-meta">${esc(n.status)}${uncertain(n)?' · <span class="unknown-marker" aria-label="Open questions">?</span>':''}</span></button><span class="node-preview" id="${prefix}-preview-${esc(n.id)}" role="tooltip">${esc(previewText(n))}</span></div>`;
  const textFromHTML = html => html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
  function initialVisibleText(map=MAP) {
    return textFromHTML(rootHTML(map)+map.groups.map(g=>{const members=map.nodes.filter(n=>n.group===g.id);return members.length?branchButton(g,members,false):'';}).join(''));
  }
  // Exact former v5.1 map card wording, including first questions; excludes shared page chrome.
  function legacyCardText(map=MAP) {
    return map.groups.map(g=>[g.title,g.description||'',...map.nodes.filter(n=>n.group===g.id).map(n=>[n.label,`${n.kind} · ${n.status} · ${n.asOf}`,n.summary,n.questions.length?`? ${n.questions[0]}`:'',n.questions.length>1?`· +${n.questions.length-1} open ${n.questions.length===2?'check':'checks'}`:'',n.related?.length?`↗ ${n.related.length} related ${n.related.length===1?'map link':'map links'}`:''].join(' '))].join(' ')).join(' ');
  }
  const sourceHTML = ids => ids.map(id=>{
    const s=sources.get(id);if(!s)return '';
    return `<div class="source" id="source-${esc(id)}"><b>${esc(id)}</b> · ${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`:esc(s.title)}<small>${esc(s.date||'Date not supplied')}${s.locator?' · '+esc(s.locator):''}</small></div>`;
  }).join('');
  const match = n => (!state.group||n.group===state.group)&&(!state.query||normalize([n.label,n.summary,n.kind,n.status,groups.get(n.group)?.title,...n.details,...n.questions,...(n.internalDetails||[]),...(n.internalQuestions||[])].join(' ')).includes(state.query));
  function branchesHTML(prefix) {
    const forced=!!(state.query||state.group);
    return MAP.groups.map(g=>{
      const members=visible.filter(n=>n.group===g.id);if(!members.length)return '';
      const open=forced||state.expanded.has(g.id);
      return `<section class="group-panel" data-group="${esc(g.id)}" style="--group:${esc(g.color)}">${branchButton(g,members,open,prefix,forced)}<div id="${prefix}-${esc(g.id)}" class="branch-content"${open?'':' hidden'}>${open?`<p class="branch-description">${esc(g.description||'')}</p><div class="group-nodes">${members.map(n=>card(n,prefix)).join('')}</div>`:''}</div></section>`;
    }).join('');
  }
  function render() {
    visible=MAP.nodes.filter(match);
    $('count').textContent=`${visible.length} / ${MAP.nodes.length} nodes · ${MAP.edges.length} recorded connections`;
    $('empty').hidden=visible.length!==0;
    $('panels').innerHTML=rootHTML(MAP)+`<div class="map-branches">${branchesHTML('branch')}</div>`;
    $('list').innerHTML=`<p class="list-guide">Choose a branch, then a label for its complete details and evidence.</p>${branchesHTML('list-branch')}`;
    $('viewport').hidden=state.view!=='map';$('list').hidden=state.view!=='list';
    $('map-view').setAttribute('aria-pressed',String(state.view==='map'));$('list-view').setAttribute('aria-pressed',String(state.view==='list'));
    $('expand-all').textContent=state.all?'Collapse all branches':'Expand all branches';$('expand-all').setAttribute('aria-pressed',String(state.all));$('expand-all').disabled=!!(state.query||state.group);
    drawEdges();
  }
  function drawEdges() {
    const svg=$('edges'), canvas=$('canvas');svg.setAttribute('width',canvas.clientWidth);svg.setAttribute('height',canvas.scrollHeight);
    const origin=canvas.getBoundingClientRect();
    const position=id=>{const el=$('panels').querySelector(`[data-node="${CSS.escape(id)}"]`);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left-origin.left+r.width/2,y:r.top-origin.top+r.height/2};};
    // Reading branches are CSS connectors. SVG shows only recorded selected-node relationships.
    svg.innerHTML=state.selected&&state.view==='map'?MAP.edges.filter(e=>e.from===state.selected||e.to===state.selected).map(e=>{
      const a=position(e.from),b=position(e.to);if(!a||!b)return '';
      return `<path class="edge${e.status==='unknown'?' unknown':''}" d="M${a.x},${a.y} C${a.x},${(a.y+b.y)/2} ${b.x},${(a.y+b.y)/2} ${b.x},${b.y}"><title>${esc(nodes.get(e.from).label)} → ${esc(nodes.get(e.to).label)}: ${esc(e.label)} (${esc(e.status)})</title></path>`;
    }).join(''):'';
  }
  function revealPath(id) {
    const n=nodes.get(id);if(!n)return false;
    if(!match(n)){state.query='';state.group='';$('search').value='';$('group').value='';}
    if(!state.all)state.expanded.clear();state.expanded.add(n.group);render();return true;
  }
  function showNode(id,focus=true) {
    const n=nodes.get(id);if(!n)return false;
    lastFocus=document.activeElement;state.selected=id;revealPath(id);
    const relatedEdges=MAP.edges.filter(e=>e.from===id||e.to===id);
    $('detail-content').innerHTML=`<span class="meta">${esc(groups.get(n.group)?.title)} · ${esc(n.kind)} · ${esc(n.status)}<br>As of ${esc(n.asOf)}</span><h2 id="detail-title">${esc(n.label)}</h2><p>${esc(n.summary)}</p>${n.details.map(d=>`<p>${esc(d)}</p>`).join('')}${n.questions.length?'<h3>Open on this node</h3>'+n.questions.map(q=>`<div class="question">${esc(q)}</div>`).join(''):''}${relatedEdges.length?'<h3>Recorded connections</h3>'+relatedEdges.map(e=>{
      const target=e.from===id?e.to:e.from;
      return `<button class="relation" data-follow="${esc(target)}">${esc(nodes.get(target).label)}<small>${e.from===id?'→ ':'← '}${esc(e.label)} · ${esc(e.status)}${e.kind?' · '+esc(e.kind):''}${e.sources?.length?' · '+esc(e.sources.join(', ')):''}</small></button>`;
    }).join(''):''}${n.related?.length?'<h3>Across the atlas</h3>'+n.related.map(r=>`<a class="relation" href="${esc(r.map)}.html${r.node?'#'+encodeURIComponent(r.node):''}">${esc(r.label||r.map)}<small>${esc(r.map.replaceAll('-',' '))}</small></a>`).join(''):''}<h3>Dated evidence</h3>${sourceHTML(n.sources)||'<p>No shareable source citation supplied.</p>'}`;
    const additionalSources=[...new Set(relatedEdges.flatMap(e=>e.sources||[]))].filter(s=>!n.sources.includes(s));
    if(additionalSources.length)$('detail-content').insertAdjacentHTML('beforeend',`<h3>Connection evidence</h3>${sourceHTML(additionalSources)}`);
    if(n.internalDetails?.length||n.internalQuestions?.length)$('detail-content').insertAdjacentHTML('beforeend',`<details class="internal"><summary>Internal professional context</summary>${(n.internalDetails||[]).map(d=>`<p>${esc(d)}</p>`).join('')}${(n.internalQuestions||[]).map(q=>`<div class="question">Internal check: ${esc(q)}</div>`).join('')}</details>`);
    $('detail').hidden=false;$('detail').scrollTop=0;history.replaceState(null,'','#'+encodeURIComponent(id));drawEdges();if(focus)$('close-detail').focus({preventScroll:true});return true;
  }
  function closeDetail(restoreFocus=true) {
    const old=state.selected;state.selected=null;$('detail').hidden=true;history.replaceState(null,'',location.pathname+location.search);render();
    if(restoreFocus){const owner=state.view==='map'?$('panels'):$('list');(old?owner.querySelector(`[data-node="${CSS.escape(old)}"]`):lastFocus)?.focus({preventScroll:true});}
  }
  function overview() {
    state.query='';state.group='';state.all=false;state.expanded.clear();$('search').value='';$('group').value='';closeDetail(false);$('viewport').scrollTop=0;$('list').scrollTop=0;
    const owner=state.view==='map'?$('panels'):$('list');owner.querySelector('[data-branch]')?.focus({preventScroll:true});
  }
  function parseHash(hash) {const raw=String(hash||'').replace(/^#/,'');try{return raw.startsWith('node=')?new URLSearchParams(raw).get('node'):decodeURIComponent(raw);}catch{return '';}}
  function applyHash(){const id=parseHash(location.hash);if(nodes.has(id))showNode(id);else if(!id&&state.selected)closeDetail();}
  $('group').innerHTML+=MAP.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.title)}</option>`).join('');
  document.querySelector(`nav [data-map="${MAP.id}"]`)?.setAttribute('aria-current','page');
  $('search').addEventListener('input',()=>{state.query=normalize($('search').value.trim());render();});$('group').addEventListener('change',()=>{state.group=$('group').value;render();});
  $('clear').onclick=overview;$('overview').onclick=overview;
  $('map-view').onclick=()=>{state.view='map';render();};$('list-view').onclick=()=>{state.view='list';render();};
  $('expand-all').onclick=()=>{state.all=!state.all;state.expanded=state.all?new Set(MAP.groups.map(g=>g.id)):new Set();render();};$('close-detail').onclick=()=>closeDetail();
  document.addEventListener('click',event=>{
    const branch=event.target.closest('[data-branch]');
    if(branch){
      if(state.query||state.group)return;
      const id=branch.dataset.branch,wasOpen=state.expanded.has(id);if(!state.all)state.expanded.clear();if(wasOpen)state.expanded.delete(id);else state.expanded.add(id);if(state.all&&wasOpen)state.all=false;
      render();const owner=state.view==='map'?$('panels'):$('list');owner.querySelector(`[data-branch="${CSS.escape(id)}"]`)?.focus({preventScroll:true});
    }
    const node=event.target.closest('[data-node]'),follow=event.target.closest('[data-follow]');if(node)showNode(node.dataset.node);if(follow)showNode(follow.dataset.follow);
  });
  $('about').onclick=()=>{
    lastFocus=document.activeElement;state.selected=null;render();$('detail').hidden=false;history.replaceState(null,'',location.pathname+location.search);
    $('detail-content').innerHTML=`<span class="meta">${esc(DATA.edition)} · v5.2 · Updated ${esc(MAP.updated)}</span><h2 id="detail-title">Read the connections</h2><p>${esc(MAP.intro)}</p><p>Start here → coloured branch → node → evidence. Branch connectors organise reading; they do not assert physical connections, authority or financial flows. Recorded relationships appear in each node's details, with a line when both endpoints are exposed.</p><p>Open one branch at a time or choose Expand all. Hover or focus a node for a brief preview; select it for the same information in full. Search includes details and open questions. Back to overview clears filters and closes branches.</p><p>Observed means an inspected record or system; reported means an attributed account; listed means a published listing; historical means older context; proposed means an option; unknown means a gap. A ? marker identifies questions to check, not an absent system or person.</p>${MAP.checks.length?'<details><summary>Useful checks ('+MAP.checks.length+')</summary>'+MAP.checks.map(c=>`<p><b>${esc(c.question)}</b><br>${esc(c.who)} · Evidence: ${esc(c.result)}${c.node?`<br><button data-follow="${esc(c.node)}">See relevant node</button>`:''}</p>`).join('')+'</details>':''}<h3>Sources and dates</h3>${sourceHTML(MAP.sources.map(s=>s.id))}`;
    $('detail').scrollTop=0;$('close-detail').focus({preventScroll:true});
  };
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('detail').hidden)closeDetail();});
  window.addEventListener('hashchange',applyHash);window.addEventListener('resize',drawEdges);
  // Simulated checks only. This hook does not claim browser or reader acceptance.
  window.AtlasDisclosureTest={initialVisibleText,legacyCardText,previewText,parseHash,selectNode:showNode,revealPath,renderedNodeIds:()=>[...$('panels').querySelectorAll('[data-node]')].map(el=>el.dataset.node),stateSnapshot:()=>({...state,expanded:[...state.expanded]}),diagnostics:()=>({mapId:MAP.id,nodeIds:[...nodes.keys()],sourceIds:[...sources.keys()],edgeCount:MAP.edges.length,initialText:initialVisibleText(),initialWords:words(initialVisibleText()).length,legacyWords:words(legacyCardText()).length,ratio:words(initialVisibleText()).length/words(legacyCardText()).length})};
  render();applyHash();
})();
