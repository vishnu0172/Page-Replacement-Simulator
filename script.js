/**
 * Page Replacement Simulator - Main Script
 * Handles rendering, event handling, and UI state management
 */

let activeTab = 'fifo';

/**
 * Renders the section HTML for a given algorithm
 */
function renderSection(key, steps, nf) {
  const m = META[key];
  const faults = steps.filter(s => !s.hit).length;
  const hits   = steps.filter(s =>  s.hit).length;
  const rate   = ((hits / steps.length) * 100).toFixed(1);
  const frameThs = Array.from({length: nf}, (_, i) => '<th>Frame&nbsp;' + (i+1) + '</th>').join('');

  let rows = '';
  steps.forEach((s, idx) => {
    const fCells = Array.from({length: nf}, (_, fi) => {
      const v = s.frames[fi];
      if (v === undefined) return '<td><span class="frame-chip fc-empty">—</span></td>';
      const isNew = !s.hit && s.added === v && s.frames.indexOf(v) === fi;
      return '<td><span class="frame-chip ' + (isNew ? 'fc-new' : 'fc-hold') + '">' + v + '</span></td>';
    }).join('');
    const statusCell = s.hit
      ? '<td><span class="badge badge-hit"><span class="badge-dot"></span>Hit</span></td>'
      : '<td><span class="badge badge-fault"><span class="badge-dot"></span>Fault</span></td>';
    const evCell = s.evicted != null
      ? '<td><span class="evict-val">' + s.evicted + '</span><span class="evict-why">' + s.note + '</span></td>'
      : '<td><span class="evict-none">—</span></td>';
    rows += '<tr class="row-in ' + (s.hit ? 'hit-r' : 'fault-r') + '" style="animation-delay:' + Math.min(idx*12,280) + 'ms"><td><span class="step-lbl">' + s.step + '</span></td><td><span class="page-lbl">' + s.page + '</span></td>' + fCells + statusCell + evCell + '</tr>';
  });

  return '<div class="algo-title"><span class="algo-tag ' + m.tagClass + '">' + m.label + '</span>' + m.full + '</div>' +
    '<div class="desc-block ' + m.descClass + '">' + m.desc + '</div>' +
    '<div class="stats-strip">' +
      '<div class="stat-box"><div class="stat-val sv-blue">' + steps.length + '</div><div class="stat-lbl">References</div></div>' +
      '<div class="stat-box"><div class="stat-val sv-red">' + faults + '</div><div class="stat-lbl">Page Faults</div></div>' +
      '<div class="stat-box"><div class="stat-val sv-green">' + hits + '</div><div class="stat-lbl">Page Hits</div></div>' +
      '<div class="stat-box"><div class="stat-val sv-amber">' + rate + '%</div><div class="stat-lbl">Hit Rate</div></div>' +
    '</div>' +
    '<div class="table-card"><div class="table-scroll"><table><thead><tr><th>Step</th><th>Page</th>' + frameThs + '<th>Status</th><th>Evicted (Reason)</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="legend">' +
      '<div class="legend-item"><div class="lchip" style="background:var(--green-lt);border-color:var(--green-mid)"></div>Newly loaded page</div>' +
      '<div class="legend-item"><div class="lchip" style="background:var(--rule2);border-color:var(--rule)"></div>Resident page</div>' +
      '<div class="legend-item"><span class="badge badge-hit" style="font-size:10px"><span class="badge-dot"></span>Hit</span>Already in frames</div>' +
      '<div class="legend-item"><span class="badge badge-fault" style="font-size:10px"><span class="badge-dot"></span>Fault</span>Not in frames</div>' +
    '</div></div>';
}

/**
 * Renders the comparison section
 */
function renderCompare(ff, lf, of_, refs, nf) {
  const mn = Math.min(ff, lf, of_), mx = Math.max(ff, lf, of_);
  const pct = v => mx === 0 ? 100 : Math.round((v / mx) * 100);
  const winners = [];
  if (ff  === mn) winners.push('<span class="it it-blue">FIFO</span>');
  if (lf  === mn) winners.push('<span class="it it-green">LRU</span>');
  if (of_ === mn) winners.push('<span class="it it-amber">Optimal</span>');

  let insight = 'Across <strong>' + refs.length + ' references</strong> with <strong>' + nf + ' frame' + (nf!==1?'s':'') + '</strong>, ';
  insight += winners.join(' and ') + ' achieved the minimum of <strong>' + mn + ' page fault' + (mn!==1?'s':'') + '</strong>. ';
  insight += '<span class="it it-amber">Optimal</span> is the theoretical floor at <strong>' + of_ + ' faults</strong> — achievable only with future knowledge. ';
  if (lf === of_) insight += '<span class="it it-green">LRU</span> matched Optimal exactly, reflecting strong temporal locality in this reference pattern. ';
  else insight += '<span class="it it-green">LRU</span> produced <strong>' + lf + ' faults</strong>, using recency as an effective proxy for future access. ';
  if (ff === mn) insight += '<span class="it it-blue">FIFO</span> also performed best here — though note it can exhibit Bélády\'s Anomaly with different frame counts.';
  else insight += '<span class="it it-blue">FIFO</span> had the highest fault count at <strong>' + ff + '</strong>, as it disregards usage patterns entirely.';

  return '<div class="compare-wrap">' +
    '<div class="compare-heading"><h2>Algorithm Comparison</h2><div class="divider"></div></div>' +
    '<div class="compare-grid">' +
      '<div class="cmp-card ' + (ff===mn?'best':'') + '">' + (ff===mn?'<div class="best-badge">Best</div>':'') +
        '<div class="cmp-algo">FIFO</div><div class="cmp-num cn-blue">' + ff + '</div><div class="cmp-sub">page faults</div></div>' +
      '<div class="cmp-card ' + (lf===mn?'best':'') + '">' + (lf===mn?'<div class="best-badge">Best</div>':'') +
        '<div class="cmp-algo">LRU</div><div class="cmp-num cn-green">' + lf + '</div><div class="cmp-sub">page faults</div></div>' +
      '<div class="cmp-card ' + (of_===mn?'best':'') + '">' + (of_===mn?'<div class="best-badge">Best</div>':'') +
        '<div class="cmp-algo">Optimal</div><div class="cmp-num cn-amber">' + of_ + '</div><div class="cmp-sub">page faults</div></div>' +
    '</div>' +
    '<div class="bar-section"><div class="bar-section-title">Fault Count Comparison</div>' +
      '<div class="brow"><div class="blabel bl-blue">FIFO</div><div class="btrack"><div class="bfill bf-blue" id="bar-fifo" style="width:0%"></div></div><div class="bnum">' + ff + '</div></div>' +
      '<div class="brow"><div class="blabel bl-green">LRU</div><div class="btrack"><div class="bfill bf-green" id="bar-lru" style="width:0%"></div></div><div class="bnum">' + lf + '</div></div>' +
      '<div class="brow"><div class="blabel bl-amber">Optimal</div><div class="btrack"><div class="bfill bf-amber" id="bar-opt" style="width:0%"></div></div><div class="bnum">' + of_ + '</div></div>' +
    '</div>' +
    '<div class="insight-card"><div class="insight-label">Analysis</div><div class="insight-text">' + insight + '</div></div>' +
  '</div>';
}

/**
 * Switch between algorithm tabs
 */
function showTab(k) {
  activeTab = k;
  ['fifo','lru','opt'].forEach(id => {
    document.getElementById('sec-' + id).classList.toggle('visible', id === k);
    const btn = document.getElementById('tab-' + id);
    btn.className = 'tab t-' + id + (id === k ? ' active' : '');
  });
}

/**
 * Main simulation runner
 */
function runAll() {
  const refStr = document.getElementById('refInput').value;
  const nfStr  = document.getElementById('frameInput').value;
  const errBox = document.getElementById('errorBox');
  errBox.style.display = 'none';

  // Parse reference string
  const refs = refStr.split(/[\s,]+/).filter(s => s.trim() !== '').map(s => {
    const n = parseInt(s); 
    return isNaN(n) ? null : n;
  });
  
  if (!refs.length || refs.some(r => r === null)) {
    errBox.textContent = 'Invalid reference string. Enter integers separated by spaces or commas.';
    errBox.style.display = 'block'; 
    return;
  }
  
  const nf = parseInt(nfStr);
  if (isNaN(nf) || nf < 1 || nf > 8) {
    errBox.textContent = 'Number of frames must be between 1 and 8.';
    errBox.style.display = 'block'; 
    return;
  }

  // Hide empty state and show tabs
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('tabs').style.display = 'flex';

  // Run all algorithms
  const fs = runFIFO(refs, nf), 
        ls = runLRU(refs, nf), 
        os = runOptimal(refs, nf);
  const ff = fs.filter(s => !s.hit).length;
  const lf = ls.filter(s => !s.hit).length;
  const of_ = os.filter(s => !s.hit).length;
  const mx = Math.max(ff, lf, of_);

  // Render results
  document.getElementById('sec-fifo').innerHTML = renderSection('fifo', fs, nf);
  document.getElementById('sec-lru').innerHTML  = renderSection('lru',  ls, nf);
  document.getElementById('sec-opt').innerHTML  = renderSection('opt',  os, nf);
  document.getElementById('sec-compare').innerHTML = renderCompare(ff, lf, of_, refs, nf);

  showTab(activeTab);

  // Animate bar chart
  setTimeout(() => {
    const p = v => mx === 0 ? 100 : Math.round((v / mx) * 100);
    document.getElementById('bar-fifo').style.width = p(ff)  + '%';
    document.getElementById('bar-lru').style.width  = p(lf)  + '%';
    document.getElementById('bar-opt').style.width  = p(of_) + '%';
  }, 120);
}

/**
 * Event listeners
 */
document.addEventListener('keydown', e => { 
  if (e.key === 'Enter') runAll(); 
});
