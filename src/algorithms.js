/**
 * Page Replacement Algorithms
 * Implements FIFO, LRU, and Optimal algorithms for page replacement
 */

/**
 * FIFO (First-In-First-Out) Algorithm
 * Evicts the page that has been in memory the longest
 */
function runFIFO(refs, nf) {
  const frames = [], queue = [], steps = [];
  for (let i = 0; i < refs.length; i++) {
    const p = refs[i];
    if (frames.includes(p)) {
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: true, 
        evicted: null, 
        note: '', 
        step: i+1 
      });
    } else {
      let ev = null, note = '';
      if (frames.length >= nf) {
        ev = queue.shift(); 
        frames.splice(frames.indexOf(ev), 1); 
        note = 'Oldest in queue';
      }
      frames.push(p); 
      queue.push(p);
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: false, 
        evicted: ev, 
        note, 
        step: i+1, 
        added: p 
      });
    }
  }
  return steps;
}

/**
 * LRU (Least Recently Used) Algorithm
 * Evicts the page that was accessed furthest in the past
 */
function runLRU(refs, nf) {
  const frames = [], steps = [];
  for (let i = 0; i < refs.length; i++) {
    const p = refs[i];
    if (frames.includes(p)) {
      frames.splice(frames.indexOf(p), 1); 
      frames.push(p);
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: true, 
        evicted: null, 
        note: '', 
        step: i+1 
      });
    } else {
      let ev = null, note = '';
      if (frames.length >= nf) { 
        ev = frames.shift(); 
        note = 'Least recently used'; 
      }
      frames.push(p);
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: false, 
        evicted: ev, 
        note, 
        step: i+1, 
        added: p 
      });
    }
  }
  return steps;
}

/**
 * Optimal (MIN) Algorithm
 * Evicts the page that will not be needed for the longest time in the future
 * Requires future knowledge - used as theoretical benchmark
 */
function runOptimal(refs, nf) {
  const frames = [], steps = [];
  for (let i = 0; i < refs.length; i++) {
    const p = refs[i];
    if (frames.includes(p)) {
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: true, 
        evicted: null, 
        note: '', 
        step: i+1 
      });
    } else {
      let ev = null, note = '';
      if (frames.length >= nf) {
        let far = -1, victim = null;
        for (const f of frames) {
          const nx = refs.slice(i+1).indexOf(f);
          if (nx === -1) { 
            victim = f; 
            note = 'Never used again'; 
            break; 
          }
          if (nx > far) { 
            far = nx; 
            victim = f; 
            note = 'Next use at step ' + (i+2+far); 
          }
        }
        ev = victim; 
        frames.splice(frames.indexOf(ev), 1);
      }
      frames.push(p);
      steps.push({ 
        page: p, 
        frames: [...frames], 
        hit: false, 
        evicted: ev, 
        note, 
        step: i+1, 
        added: p 
      });
    }
  }
  return steps;
}

/**
 * Metadata and descriptions for each algorithm
 */
const META = {
  fifo: {
    label: 'FIFO', 
    tagClass: 'tag-fifo', 
    descClass: 'fifo', 
    full: 'First-In, First-Out',
    desc: 'FIFO evicts whichever page has been resident in memory the longest. A queue governs the order — the earliest arrival is always chosen for replacement when a new page must be loaded. Easy to implement, but ignores usage frequency or recency, and is susceptible to Bélády\'s Anomaly.'
  },
  lru: {
    label: 'LRU', 
    tagClass: 'tag-lru', 
    descClass: 'lru', 
    full: 'Least Recently Used',
    desc: 'LRU evicts the page that was last accessed furthest in the past. It exploits temporal locality — recently used pages are likely to be used again soon. LRU closely approximates Optimal and is widely adopted in real operating systems, often via hardware-assisted approximations such as clock or aging algorithms.'
  },
  opt: {
    label: 'OPT', 
    tagClass: 'tag-opt', 
    descClass: 'opt', 
    full: 'Optimal Page Replacement',
    desc: 'Optimal (also called MIN) evicts the page that will not be needed for the longest time in the future, guaranteeing the minimum possible page fault count. Because it requires complete knowledge of future references, it cannot be implemented in real systems — it exists as the theoretical lower-bound benchmark for evaluating other algorithms.'
  }
};
