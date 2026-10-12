'use strict';
(() => {
  const DATA = JSON.parse(document.getElementById('atlas-data').textContent);
  const MAP = DATA.map;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nodes = new Map(MAP.nodes.map(n => [n.id,n]));
  const sources = new Map(MAP.sources.map(s => [s.id,s]));
  const groups = new Map(MAP.groups.map(g => [g.id,g]));
  const internalHTML = n => (n.internalDetails?.length || n.internalQuestions?.length) ? `<details class="internal"><summary>Internal professional context</summary>${(n.internalDetails || []).map(d=>`<p>${esc(d)}</p>`).join('')}${(n.internalQuestions || []).map(q=>`<div class="question">Internal check: ${esc(q)}</div>`).join('')}</details>` : '';
  const state = {query:'',group:'',selected:null,view:'map',scale:1,width:0,height:0};
  let visible = [], resizeTimer, fitted = false;
  const sourceHTML = ids => ids.map(id => {
    const s = sources.get(id);
    if (!s) return '';
    return `<div class="source"><b>${esc(id)}</b> · ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>` : esc(s.title)}<small>${esc(s.date || 'Date not supplied')}${s.locator ? ' · ' + esc(s.locator) : ''}</small></div>`;
  }).join('');
  const match = n => (!state.group || n.group === state.group) && (!state.query || [n.label,n.summary,n.kind,n.status,groups.get(n.group)?.title,...n.details,...n.questions,...(n.internalDetails || []),...(n.internalQuestions || [])].join(' ').toLocaleLowerCase().includes(state.query));
  const card = n => `<button class="node" data-node="${esc(n.id)}" aria-label="${esc(n.label)}: ${esc(n.status)}. Open details"><strong>${esc(n.label)}</strong><span class="node-meta">${esc(n.kind)} · ${esc(n.status)} · ${esc(n.asOf)}</span><span class="node-summary">${esc(n.summary)}</span>${n.questions.length ? `<span class="node-question">? ${esc(n.questions[0])}${n.questions.length > 1 ? `<span class="question-more"> · +${n.questions.length-1} open ${n.questions.length === 2 ? 'check' : 'checks'}</span>` : ''}</span>` : ''}${n.related?.length ? `<span class="question-more">↗ ${n.related.length} related ${n.related.length === 1 ? 'map link' : 'map links'}</span>` : ''}</button>`;
  function renderList() {
    $('list').innerHTML = MAP.groups.map(g => {
      const members = visible.filter(n => n.group === g.id);
      if (!members.length) return '';
      return `<h2 class="list-group" style="color:${esc(g.color)}">${esc(g.title)}</h2>` + members.map(n => `<article id="list-${esc(n.id)}" style="--group:${esc(g.color)}"><h3>${esc(n.label)}</h3><p class="meta">${esc(n.kind)} · ${esc(n.status)} · ${esc(n.asOf)}</p><p>${esc(n.summary)}</p>${n.questions.length ? '<ul>' + n.questions.map(q => `<li>Open: ${esc(q)}</li>`).join('') + '</ul>' : ''}<button data-node="${esc(n.id)}">Details &amp; connections</button></article>`).join('');
    }).join('');
  }
  function renderMap() {
    const shownGroups = MAP.groups.filter(g => visible.some(n => n.group === g.id));
    $('panels').innerHTML = shownGroups.map(g => `<section class="group-panel" data-group="${esc(g.id)}" style="--group:${esc(g.color)};width:480px"><div class="group-header"><h2>${esc(g.title)}</h2><p>${esc(g.description || '')}</p></div><div class="group-nodes">${visible.filter(n => n.group === g.id).map(card).join('')}</div></section>`).join('');
    // Compact panels preserve all objects. Their placement is reading order, not a reporting hierarchy.
    const cols = shownGroups.length > 4 ? 3 : shownGroups.length > 1 ? 2 : 1;
    const heights = Array(cols).fill(20), panelWidth = 480, gutter = 26;
    for (const panel of $('panels').children) {
      const column = heights.indexOf(Math.min(...heights));
      panel.style.left = `${20 + column * (panelWidth+gutter)}px`;
      panel.style.top = `${heights[column]}px`;
      heights[column] += panel.offsetHeight + gutter;
    }
    state.width = 40 + cols*panelWidth + (cols-1)*gutter;
    state.height = Math.max(...heights) + 4;
    $('canvas').style.width = `${state.width}px`;
    $('canvas').style.height = `${state.height}px`;
    drawEdges();
    applyScale();
    if (!fitted) { fit(true); fitted = true; }
    highlight();
  }
  function position(id) {
    const el = $('panels').querySelector(`[data-node="${CSS.escape(id)}"]`);
    if (!el) return null;
    const panel = el.closest('.group-panel');
    return {x:parseFloat(panel.style.left)+el.offsetLeft,y:parseFloat(panel.style.top)+el.offsetTop,w:el.offsetWidth,h:el.offsetHeight};
  }
  function drawEdges() {
    const ids = new Set(visible.map(n => n.id));
    const edges = MAP.edges.filter(e => ids.has(e.from) && ids.has(e.to));
    const svg = $('edges');
    svg.setAttribute('width',state.width);svg.setAttribute('height',state.height);
    svg.innerHTML = edges.map((e,index) => {
      const a = position(e.from), b = position(e.to);
      const horizontal = Math.abs(a.x-b.x) > 100;
      const forward = horizontal ? b.x > a.x : b.y > a.y;
      const sx = horizontal ? a.x+(forward?a.w:0) : a.x+a.w/2;
      const sy = horizontal ? a.y+a.h/2 : a.y+(forward?a.h:0);
      const ex = horizontal ? b.x+(forward?0:b.w) : b.x+b.w/2;
      const ey = horizontal ? b.y+b.h/2 : b.y+(forward?0:b.h);
      const bend = horizontal ? (sx+ex)/2 : (sy+ey)/2;
      const path = horizontal ? `M${sx},${sy} C${bend},${sy} ${bend},${ey} ${ex},${ey}` : `M${sx},${sy} C${sx},${bend} ${ex},${bend} ${ex},${ey}`;
      const active = state.selected && (e.from === state.selected || e.to === state.selected);
      const label = active ? `<text class="edge-label" x="${(sx+ex)/2}" y="${(sy+ey)/2-5}" text-anchor="middle">${esc(e.label)}</text>` : '';
      return `<path class="edge${e.status === 'unknown' ? ' unknown' : ''}${active ? ' active' : state.selected ? ' dim' : ''}" d="${path}" data-edge="${index}"><title>${esc(nodes.get(e.from).label)} → ${esc(nodes.get(e.to).label)}: ${esc(e.label)} (${esc(e.status)})</title></path>${label}`;
    }).join('');
  }
  function applyScale() {
    $('canvas').style.transform = `scale(${state.scale})`;
    $('sizer').style.width = `${state.width*state.scale}px`;
    $('sizer').style.height = `${state.height*state.scale}px`;
    $('scale').value = `${Math.round(state.scale*100)}%`;
  }
  function fit(reading=false) {
    const available = $('viewport').clientWidth-4;
    // The opening view fits the width at desktop size; phones start with readable node text.
    state.scale = Math.max(reading ? .85 : .02, Math.min(1,available/state.width,reading ? 1 : ($('viewport').clientHeight-4)/state.height));
    applyScale();$('viewport').scrollTo(0,0);
  }
  function zoom(factor) {
    const viewport = $('viewport'), old = state.scale;
    state.scale = Math.max(.3,Math.min(2,old*factor));
    const x = (viewport.scrollLeft+viewport.clientWidth/2)/old;
    const y = (viewport.scrollTop+viewport.clientHeight/2)/old;
    applyScale();viewport.scrollTo(x*state.scale-viewport.clientWidth/2,y*state.scale-viewport.clientHeight/2);
  }
  function highlight() {
    const connected = new Set(MAP.edges.filter(e => e.from === state.selected || e.to === state.selected).flatMap(e => [e.from,e.to]));
    $('panels').querySelectorAll('[data-node]').forEach(el => {
      el.classList.toggle('selected',el.dataset.node===state.selected);
      el.classList.toggle('connected',connected.has(el.dataset.node) && el.dataset.node!==state.selected);
      el.classList.toggle('dim',!!state.selected && !connected.has(el.dataset.node) && el.dataset.node!==state.selected);
    });
    drawEdges();
  }
  function showNode(id,center=false) {
    const n = nodes.get(id);if(!n) return;
    if(center && !match(n)) {state.query='';state.group='';$('search').value='';$('group').value='';render();}
    state.selected = id;
    const relatedEdges = MAP.edges.filter(e => e.from===id || e.to===id);
    $('detail-content').innerHTML = `<span class="meta">${esc(groups.get(n.group)?.title)} · ${esc(n.kind)} · ${esc(n.status)}<br>As of ${esc(n.asOf)}</span><h2>${esc(n.label)}</h2><p>${esc(n.summary)}</p>${n.details.map(d => `<p>${esc(d)}</p>`).join('')}${n.questions.length ? '<h3>Open on this node</h3>' + n.questions.map(q => `<div class="question">${esc(q)}</div>`).join('') : ''}${relatedEdges.length ? '<h3>Recorded connections</h3>' + relatedEdges.map(e => {
      const target = e.from===id ? e.to : e.from;
      return `<button class="relation" data-follow="${esc(target)}">${esc(nodes.get(target).label)}<small>${e.from===id ? '→ ' : '← '}${esc(e.label)} · ${esc(e.status)}${e.sources?.length ? ' · '+esc(e.sources.join(', ')) : ''}</small></button>`;
    }).join('') : ''}${n.related?.length ? '<h3>Across the atlas</h3>' + n.related.map(r => `<a class="relation" href="${esc(r.map)}.html${r.node ? '#'+encodeURIComponent(r.node) : ''}">${esc(r.label || r.map)}<small>${esc(r.map.replaceAll('-',' '))}</small></a>`).join('') : ''}<h3>Dated evidence</h3>${sourceHTML(n.sources) || '<p>No shareable source citation supplied.</p>'}`;
    const additionalSources = [...new Set(relatedEdges.flatMap(e => e.sources || []))].filter(id => !n.sources.includes(id));
    if (additionalSources.length) $('detail-content').insertAdjacentHTML('beforeend', `<h3>Connection evidence</h3>${sourceHTML(additionalSources)}`);
    if (internalHTML(n)) $('detail-content').insertAdjacentHTML('beforeend', internalHTML(n));
    $('detail').hidden=false;highlight();
    history.replaceState(null,'','#'+encodeURIComponent(id));
    if(center) {const p = position(id);if(p) $('viewport').scrollTo({left:Math.max(0,(p.x+p.w/2)*state.scale-$('viewport').clientWidth/2),top:Math.max(0,p.y*state.scale-35),behavior:'smooth'});}
  }
  function closeDetail() {
    const old = state.selected;state.selected=null;$('detail').hidden=true;highlight();
    history.replaceState(null,'',location.pathname+location.search);
    if(old) $('panels').querySelector(`[data-node="${CSS.escape(old)}"]`)?.focus({preventScroll:true});
  }
  function render() {
    visible = MAP.nodes.filter(match);
    $('count').textContent = `${visible.length} / ${MAP.nodes.length} nodes · ${MAP.edges.length} recorded connections`;
    $('empty').hidden=visible.length!==0;
    renderList();renderMap();
  }
  function setView(view) {
    state.view=view;$('viewport').hidden=view!=='map';$('list').hidden=view!=='list';
    $('map-view').setAttribute('aria-pressed',view==='map');$('list-view').setAttribute('aria-pressed',view==='list');
    if(view==='map') {renderMap();fit(true);}
  }
  $('group').innerHTML += MAP.groups.map(g => `<option value="${esc(g.id)}">${esc(g.title)}</option>`).join('');
  document.querySelector(`nav [data-map="${MAP.id}"]`)?.setAttribute('aria-current','page');
  $('search').addEventListener('input',()=>{state.query=$('search').value.trim().toLocaleLowerCase();render();fit(true);});
  $('group').addEventListener('change',()=>{state.group=$('group').value;render();fit(true);});
  $('clear').onclick=()=>{state.query='';state.group='';$('search').value='';$('group').value='';render();fit(true);};
  $('map-view').onclick=()=>setView('map');$('list-view').onclick=()=>setView('list');
  $('zoom-in').onclick=()=>zoom(1.2);$('zoom-out').onclick=()=>zoom(1/1.2);$('fit').onclick=()=>fit();
  $('readable').onclick=()=>{state.scale=1;applyScale();};$('close-detail').onclick=closeDetail;
  document.addEventListener('click',event=>{const node = event.target.closest('[data-node]');const follow=event.target.closest('[data-follow]');if(node) showNode(node.dataset.node);if(follow) showNode(follow.dataset.follow,true);});
  $('about').onclick=()=>{
    state.selected=null;highlight();$('detail').hidden=false;
    $('detail-content').innerHTML=`<span class="meta">${esc(DATA.edition)} · v5.1 · Updated ${esc(MAP.updated)}</span><h2>Read the connections</h2><p>${esc(MAP.intro)}</p><p>Panels group related work. Their positions do not assert hierarchy. Lines show only relationships retained in the sources; a dashed line labels a specific unknown connection. Disconnected clusters remain separate.</p><p>Select a node to read its dated evidence, follow a connected object, or move to another map. Search includes summaries and open questions. Drag blank space or scroll to pan. Use + / −, Fit or 1:1 to zoom. Keyboard arrows scroll the map; the readable list offers the same nodes.</p><p>Observed means an inspected record or system, reported means an attributed account, listed means a published listing, historical means older context, proposed means an option, and unknown means the source leaves a gap.</p>${MAP.checks.length ? '<details><summary>Useful checks ('+MAP.checks.length+')</summary>'+MAP.checks.map(c=>`<p><b>${esc(c.question)}</b><br>${esc(c.who)} · Evidence: ${esc(c.result)}${c.node ? `<br><button data-follow="${esc(c.node)}">See relevant node</button>` : ''}</p>`).join('')+'</details>' : ''}<h3>Sources and dates</h3>${sourceHTML(MAP.sources.map(s=>s.id))}`;
  };
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeDetail();});
  // Native touch scrolling supports phone panning. Mouse drag starts only on blank map space.
  let drag=null;
  $('viewport').addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button')) return;drag={x:e.clientX,y:e.clientY,left:$('viewport').scrollLeft,top:$('viewport').scrollTop};$('viewport').setPointerCapture(e.pointerId);$('viewport').classList.add('dragging');});
  $('viewport').addEventListener('pointermove',e=>{if(drag) {$('viewport').scrollLeft=drag.left-(e.clientX-drag.x);$('viewport').scrollTop=drag.top-(e.clientY-drag.y);}});
  const stopDrag=()=>{drag=null;$('viewport').classList.remove('dragging');};
  $('viewport').addEventListener('pointerup',stopDrag);$('viewport').addEventListener('pointercancel',stopDrag);
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.view==='map') fit(true);},100);});
  window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(nodes.has(id)) showNode(id,true);});
  render();const initial=decodeURIComponent(location.hash.slice(1));if(nodes.has(initial)) showNode(initial,true);
})();
