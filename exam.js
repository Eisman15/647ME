/* ============================================================
   IFN647 Interactive Exam — App logic
   ============================================================ */
(function(){
  const BANK = window.BANK, MODULES = window.MODULES;
  const KINDS = {
    mc:{label:"Concept", glyph:"◆"},
    tf:{label:"True / False", glyph:"⊻"},
    calc:{label:"Calculation", glyph:"∑"},
    short:{label:"Short answer", glyph:"¶"},
    code:{label:"Python", glyph:"</>"},
    formula:{label:"Formula", glyph:"∫"}
  };
  const STORE_KEY = "ifn647_progress_v1";

  /* ---------- persistent progress ---------- */
  let progress = {};            // id -> {status:'correct'|'wrong'|'self', marks:awarded}
  try { progress = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch(e){ progress = {}; }
  function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch(e){} }

  /* ---------- view state ---------- */
  let state = { module:"all", kind:"all", mock:false, order:null };

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const el = (t,c,h)=>{const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;};
  function normNum(s){
    if(s==null) return null;
    s = String(s).trim().toLowerCase().replace(/%/g,'').replace(/\s+/g,'');
    if(s.includes('/')){ const [a,b]=s.split('/').map(Number); if(b) return a/b; }
    const v = parseFloat(s);
    return isNaN(v) ? null : v;
  }
  function matchCalc(input, accept){
    const val = normNum(input);
    if(val===null) return false;
    for(const a of accept){
      const av = normNum(a);
      if(av===null) continue;
      // tolerant compare: relative for big, absolute for small
      const tol = Math.max(0.01, Math.abs(av)*0.02);
      if(Math.abs(val - av) <= tol) return true;
    }
    return false;
  }
  function typeset(node){
    if(window.MathJax && MathJax.typesetPromise){ MathJax.typesetPromise(node?[node]:undefined).catch(()=>{}); }
  }

  /* ---------- scoring HUD ---------- */
  function refreshHUD(){
    const ids = currentList().map(q=>q.id);
    let won=0, possible=0, attempted=0, correctish=0;
    currentList().forEach(q=>{
      possible += q.marks;
      const p = progress[q.id];
      if(p){ attempted++; won += (p.marks||0); if(p.status!=='wrong') correctish++; }
    });
    $("#m-score").textContent = won;
    $("#bar-score").style.width = possible? (won/possible*100)+'%' : '0%';
    const acc = attempted? Math.round(correctish/attempted*100) : null;
    $("#m-acc").textContent = acc===null? '—' : acc+'%';
    $("#bar-acc").style.width = acc===null? '0%' : acc+'%';
    $("#m-done").innerHTML = attempted+'<small style="font-size:12px;color:var(--muted-2)">/'+ids.length+'</small>';
  }

  /* ---------- facets ---------- */
  function buildFacets(){
    const fc = $("#facets"); fc.innerHTML='';
    const all = facetBtn('all','All modules', BANK.length, 'var(--text)');
    fc.appendChild(all);
    Object.keys(MODULES).forEach(m=>{
      const ct = BANK.filter(q=>q.module==+m).length;
      fc.appendChild(facetBtn(m, 'M'+m+' · '+MODULES[m].name.split(',')[0], ct, MODULES[m].color));
    });
    const kc = $("#kinds"); kc.innerHTML='';
    kc.appendChild(kindBtn('all','All types', BANK.length));
    Object.keys(KINDS).forEach(k=>{
      const ct = BANK.filter(q=>q.kind===k).length;
      kc.appendChild(kindBtn(k, KINDS[k].label, ct));
    });
  }
  function facetBtn(val, label, ct, color){
    const b = el('button','facet'+(state.module===val&&!state.mock?' active':''));
    b.innerHTML = `<span class="dot" style="background:${color}"></span><span>${label}</span><span class="ct">${ct}</span>`;
    b.onclick = ()=>{ state.module=val; state.mock=false; state.order=null; render(); };
    return b;
  }
  function kindBtn(val,label,ct){
    const b = el('button','facet'+(state.kind===val&&!state.mock?' active':''));
    b.innerHTML = `<span class="dot" style="background:var(--muted-2)"></span><span>${label}</span><span class="ct">${ct}</span>`;
    b.onclick = ()=>{ state.kind=val; state.mock=false; state.order=null; render(); };
    return b;
  }

  /* ---------- question list selection ---------- */
  function currentList(){
    if(state.mock && state.order){ return state.order.map(id=>BANK.find(q=>q.id===id)); }
    let list = BANK.filter(q=>
      (state.module==='all'||q.module==+state.module) &&
      (state.kind==='all'||q.kind===state.kind));
    if(state.order){ const map=Object.fromEntries(list.map(q=>[q.id,q])); list = state.order.filter(id=>map[id]).map(id=>map[id]); }
    return list;
  }

  /* ---------- render one question ---------- */
  function renderQuestion(q, idx){
    const card = el('div','q');
    const p = progress[q.id];
    if(p) card.classList.add(p.status==='wrong'?'wrong':'done');

    // head
    const head = el('div','qhead');
    const rank = el('div','rank', String(idx+1).padStart(2,'0'));
    const meta = el('div','meta');
    const tags = el('div','tags');
    tags.appendChild(el('span','chip kind', KINDS[q.kind].glyph+' '+KINDS[q.kind].label));
    tags.appendChild(el('span','chip week', q.week));
    tags.appendChild(el('span','chip marks', q.marks+' mark'+(q.marks>1?'s':'')));
    tags.appendChild(el('span','chip diff', q.diff));
    meta.appendChild(tags);
    meta.appendChild(el('div','prompt', q.prompt));
    head.appendChild(rank); head.appendChild(meta);
    card.appendChild(head);

    if(q.ctx) card.appendChild(el('div','ctx', q.ctx));

    // body by kind
    const body = el('div','qbody');
    card.appendChild(body);
    const locked = !!p; // already answered this session/persisted

    if(q.kind==='mc' || q.kind==='tf'){
      renderChoice(q, body, card, locked);
    } else if(q.kind==='calc'){
      renderCalc(q, body, card, locked);
    } else if(q.kind==='formula'){
      renderFormula(q, body, card, locked);
    } else { // short / code
      renderReveal(q, body, card, locked);
    }
    return card;
  }

  function award(q, card, status){
    const marks = status==='wrong'?0:q.marks;
    progress[q.id] = {status, marks};
    save();
    card.classList.remove('done','wrong');
    card.classList.add(status==='wrong'?'wrong':'done');
    refreshHUD();
  }

  /* choice (mc + tf) */
  function renderChoice(q, body, card, locked){
    const opts = el('div','opts');
    let options, correctIdx;
    if(q.kind==='tf'){
      options = ['True','False'];
      correctIdx = q.answer? 0 : 1;
    } else {
      options = q.options; correctIdx = q.correct;
    }
    const letters = 'ABCDE';
    const btns = [];
    options.forEach((o,i)=>{
      const b = el('button','opt');
      b.innerHTML = `<span class="mk">${letters[i]}</span><span class="ot">${o}</span>`;
      b.onclick = ()=>choose(i);
      opts.appendChild(b); btns.push(b);
    });
    body.appendChild(opts);

    const revealHost = el('div'); body.appendChild(revealHost);

    function lockReveal(picked){
      btns.forEach((b,i)=>{
        b.disabled = true;
        if(i===correctIdx) b.classList.add('correct');
        else if(i===picked) b.classList.add('incorrect');
      });
      const ok = picked===correctIdx;
      const r = el('div','reveal');
      r.appendChild(el('div','verdict '+(ok?'ok':'no'),
        (ok?'✓ Correct':'✗ Not quite')+' · '+(ok?q.marks:0)+'/'+q.marks+' marks'));
      r.appendChild(el('h5',null,'Why'));
      r.appendChild(el('div','ans', q.explain));
      revealHost.appendChild(r);
      typeset(r);
    }
    function choose(i){
      if(progress[q.id]) return;
      award(q, card, i===correctIdx?'correct':'wrong');
      lockReveal(i);
    }
    if(locked){
      // reconstruct: we didn't store the pick, show correct answer state
      btns.forEach((b,i)=>{ b.disabled=true; if(i===correctIdx) b.classList.add('correct'); });
      const ok = progress[q.id].status!=='wrong';
      const r = el('div','reveal');
      r.appendChild(el('div','verdict '+(ok?'ok':'no'),
        (ok?'✓ Answered correctly':'✗ Previously missed')+' · '+(progress[q.id].marks)+'/'+q.marks+' marks'));
      r.appendChild(el('h5',null,'Why'));
      r.appendChild(el('div','ans', q.explain));
      revealHost.appendChild(r);
      typeset(r);
    }
  }

  /* calculation */
  function renderCalc(q, body, card, locked){
    const row = el('div','answerrow');
    const input = el('input'); input.type='text'; input.placeholder='Your answer…';
    const sub = el('button','btn'); sub.textContent='Check';
    const showBtn = el('button','btn ghost'); showBtn.textContent='Show working';
    const hint = el('span','hint', q.hint?('format: '+q.hint):'');
    row.appendChild(input); row.appendChild(sub); row.appendChild(showBtn); if(q.hint) row.appendChild(hint);
    body.appendChild(row);
    const revealHost = el('div'); body.appendChild(revealHost);

    function showWorking(status, userOk){
      revealHost.innerHTML='';
      const r = el('div','reveal');
      if(status){
        const ok = status!=='wrong';
        r.appendChild(el('div','verdict '+(ok?'ok':'no'),
          (ok?'✓ Correct':'✗ Not quite')+' · '+(ok?q.marks:0)+'/'+q.marks+' marks'));
      }
      r.appendChild(el('h5',null,'Worked solution'));
      const ol = el('ol','steps');
      (q.steps||[]).forEach(s=> ol.appendChild(el('li',null,s)));
      r.appendChild(ol);
      r.appendChild(el('h5',null,'Answer'));
      r.appendChild(el('div','ans', q.model));
      revealHost.appendChild(r);
      typeset(r);
    }
    sub.onclick = ()=>{
      if(progress[q.id]) return;
      const ok = matchCalc(input.value, q.accept);
      award(q, card, ok?'correct':'wrong');
      input.disabled=true; sub.disabled=true; showBtn.disabled=true;
      input.style.borderColor = ok? 'var(--green)':'var(--red)';
      showWorking(progress[q.id].status);
    };
    input.addEventListener('keydown',e=>{ if(e.key==='Enter') sub.click(); });
    showBtn.onclick = ()=>{
      if(!progress[q.id]){ award(q, card, 'self'); input.disabled=true; sub.disabled=true; showBtn.disabled=true; }
      showWorking(progress[q.id]?progress[q.id].status:null);
    };
    if(locked){
      input.disabled=true; sub.disabled=true; showBtn.disabled=true;
      showWorking(progress[q.id].status);
    }
  }

  /* formula — multi-step progressive */
  function renderFormula(q, body, card, locked){
    if(q.formulas) q.formulas.forEach(f=> body.appendChild(el('div','formula-box',f)));
    if(q.table){
      const t=document.createElement('table'); t.className='data'; t.style.margin='12px 0';
      const thead=document.createElement('thead'), hr=document.createElement('tr');
      q.table.headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;hr.appendChild(th);});
      thead.appendChild(hr); t.appendChild(thead);
      const tbody=document.createElement('tbody');
      q.table.rows.forEach(row=>{
        const tr=document.createElement('tr');
        row.forEach(cell=>{const td=document.createElement('td');td.textContent=cell;tr.appendChild(td);});
        tbody.appendChild(tr);
      });
      t.appendChild(tbody); body.appendChild(t);
    }
    const substeps=q.substeps||[], stepOk=substeps.map(()=>false), stepEls=[];
    const finalDiv=el('div','final-fstep'+(substeps.length?' locked':''));

    substeps.forEach((ss,i)=>{
      const wrap=el('div','fstep'+(i>0?' locked':''));
      const row=el('div','fstep-row');
      const inp=document.createElement('input'); inp.type='text'; inp.className='fstep-inp'; inp.placeholder='0.0000';
      const fb=el('span','fstep-fb');
      row.appendChild(el('label',null,ss.label)); row.appendChild(inp); row.appendChild(fb);
      if(ss.hint){
        const hBtn=el('button','fstep-hint-btn','hint');
        const hintP=el('p','fstep-hint',ss.hint);
        hBtn.onclick=()=>{hintP.style.display='block';};
        row.appendChild(hBtn); wrap.appendChild(row); wrap.appendChild(hintP);
      } else { wrap.appendChild(row); }
      inp.addEventListener('input',()=>{
        if(progress[q.id]) return;
        if(normNum(inp.value)===null){fb.className='fstep-fb';fb.textContent='';return;}
        const ok=matchCalc(inp.value,ss.accept);
        fb.className='fstep-fb '+(ok?'ok':'no'); fb.textContent=ok?'✓':'✗';
        if(ok&&!stepOk[i]){
          stepOk[i]=true; inp.disabled=true; inp.style.borderColor='var(--green)';
          if(stepEls[i+1]) stepEls[i+1].classList.remove('locked');
          else finalDiv.classList.remove('locked');
        }
      });
      stepEls.push(wrap); body.appendChild(wrap);
    });

    const finalRow=el('div','answerrow');
    if(q.finalLabel){const lbl=el('span',null,q.finalLabel);lbl.style.cssText='font-family:var(--mono);font-size:13.5px';finalRow.appendChild(lbl);}
    const finalInp=document.createElement('input'); finalInp.type='text'; finalInp.placeholder='Your answer…';
    const subBtn=el('button','btn','Check'), showBtn=el('button','btn ghost','Show working');
    finalRow.appendChild(finalInp); finalRow.appendChild(subBtn); finalRow.appendChild(showBtn);
    if(q.hint) finalRow.appendChild(el('span','hint','format: '+q.hint));
    finalDiv.appendChild(finalRow);
    const revealHost=el('div'); finalDiv.appendChild(revealHost); body.appendChild(finalDiv);

    function lockAll(){
      stepEls.forEach(s=>{s.classList.remove('locked');const i=s.querySelector('.fstep-inp');if(i)i.disabled=true;});
      finalDiv.classList.remove('locked');
      finalInp.disabled=true; subBtn.disabled=true; showBtn.disabled=true;
    }
    function showWorking(status){
      revealHost.innerHTML='';
      const r=el('div','reveal');
      if(status){const ok=status!=='wrong';r.appendChild(el('div','verdict '+(ok?'ok':'no'),(ok?'✓ Correct':'✗ Not quite')+' · '+(ok?q.marks:0)+'/'+q.marks+' marks'));}
      r.appendChild(el('h5',null,'Worked solution'));
      const ol=el('ol','steps'); (q.steps||[]).forEach(s=>ol.appendChild(el('li',null,s))); r.appendChild(ol);
      r.appendChild(el('h5',null,'Answer')); r.appendChild(el('div','ans',q.model));
      revealHost.appendChild(r); typeset(r);
    }
    subBtn.onclick=()=>{
      if(progress[q.id]) return;
      const ok=matchCalc(finalInp.value,q.accept);
      award(q,card,ok?'correct':'wrong');
      lockAll(); finalInp.style.borderColor=ok?'var(--green)':'var(--red)';
      showWorking(progress[q.id].status);
    };
    finalInp.addEventListener('keydown',e=>{if(e.key==='Enter')subBtn.click();});
    showBtn.onclick=()=>{
      lockAll();
      if(!progress[q.id]) award(q,card,'self');
      showWorking(progress[q.id]?progress[q.id].status:null);
    };
    if(locked){lockAll();showWorking(progress[q.id].status);}
  }

  /* short / code — self graded */
  function renderReveal(q, body, card, locked){
    const row = el('div','answerrow');
    const showBtn = el('button','btn'); showBtn.textContent = q.kind==='code'?'Show model code':'Show model answer';
    row.appendChild(showBtn);
    body.appendChild(row);
    const revealHost = el('div'); body.appendChild(revealHost);

    function doReveal(){
      revealHost.innerHTML='';
      const r = el('div','reveal');
      r.appendChild(el('div','verdict self','◐ Self-assess · '+q.marks+' marks'));
      if(q.keypoints && q.keypoints.length){
        r.appendChild(el('h5',null,'Marks are for hitting'));
        const ul = el('ul','steps');
        q.keypoints.forEach(k=> ul.appendChild(el('li',null,k)));
        r.appendChild(ul);
      }
      r.appendChild(el('h5',null, q.kind==='code'?'Model code':'Model answer'));
      r.appendChild(el('div','ans', q.model));
      if(q.notes){ r.appendChild(el('h5',null,'What examiners look for')); r.appendChild(el('div','ans', q.notes)); }

      const sg = el('div','selfgrade');
      sg.appendChild(el('span','q-self','How did you do?'));
      const got = el('button','btn tiny'); got.textContent='✓ Got it ('+q.marks+')';
      const part = el('button','btn tiny'); part.textContent='~ Partial ('+Math.max(1,Math.round(q.marks/2))+')';
      const miss = el('button','btn tiny ghost'); miss.textContent='✗ Missed (0)';
      got.onclick = ()=>selfScore('correct', q.marks);
      part.onclick = ()=>selfScore('self', Math.max(1,Math.round(q.marks/2)));
      miss.onclick = ()=>selfScore('wrong', 0);
      sg.appendChild(got); sg.appendChild(part); sg.appendChild(miss);
      r.appendChild(sg);
      revealHost.appendChild(r);
      typeset(r);

      function selfScore(status, marks){
        progress[q.id] = {status, marks}; save();
        card.classList.remove('done','wrong');
        card.classList.add(status==='wrong'?'wrong':'done');
        [got,part,miss].forEach(b=>b.disabled=true);
        refreshHUD();
      }
      if(locked){ [got,part,miss].forEach(b=>b.disabled=true); }
    }
    showBtn.onclick = doReveal;
    if(locked) doReveal();
  }

  /* ---------- render whole stream ---------- */
  function render(){
    buildFacets();
    const list = currentList();
    const host = $("#questions"); host.innerHTML='';

    // header text
    if(state.mock){
      $("#stream-title").textContent = 'Mock exam · 13 questions';
      $("#stream-sub").textContent = 'Q1–5 short answer (10 marks) · Q6–13 problem solving (35 marks)';
    } else {
      const m = state.module==='all'?'All modules':('Module '+state.module+' · '+MODULES[state.module].name);
      $("#stream-title").textContent = m;
      const wk = state.module==='all'?'Weeks 2–12':MODULES[state.module].weeks;
      const kt = state.kind==='all'?'all types':KINDS[state.kind].label;
      $("#stream-sub").textContent = wk+' · '+kt+' · '+list.length+' questions';
    }

    if(!list.length){
      host.appendChild(el('div','bigcard','<h3>No questions here</h3><p>Try another module or type filter.</p>'));
      refreshHUD(); return;
    }
    list.forEach((q,i)=> host.appendChild(renderQuestion(q,i)));
    refreshHUD();
    typeset(host);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  /* ---------- mock exam ---------- */
  function startMock(){
    // 5 short (concept/tf/short), 8 problem (calc/code) where possible, exam order
    const shortPool = BANK.filter(q=>['mc','tf','short'].includes(q.kind));
    const probPool  = BANK.filter(q=>['calc','code','formula'].includes(q.kind));
    const pick = (arr,n)=>{ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a.slice(0,n); };
    const five = pick(shortPool,5);
    const eight = pick(probPool,8);
    state.mock = true;
    state.order = [...five, ...eight].map(q=>q.id);
    render();
  }

  /* ---------- controls ---------- */
  $("#mock").onclick = startMock;
  $("#shuffle").onclick = ()=>{
    const list = currentList();
    const ids = list.map(q=>q.id);
    for(let i=ids.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[ids[i],ids[j]]=[ids[j],ids[i]];}
    state.order = ids; render();
  };
  $("#reset").onclick = ()=>{
    if(confirm('Reset all progress and scores?')){ progress={}; save(); state.order=null; render(); }
  };

  /* ---------- boot ---------- */
  $("#fact-bank").textContent = BANK.length;
  render();
})();
