// Página das disciplinas (13/11/2026, pedido do professor, a partir do mock mock-layout/disciplinas-arrastar.html): cada aluno
// arruma a página do seu jeito e recolhe níveis. Cada disciplina muda de lugar só dentro do seu nível (professor, 13/11/2026: "Não
// deveria ser capaz de arrastar disciplina para fora da sua aba principal"); os níveis mudam de ordem entre si. Mouse: arrastar o cartão ou o título do nível. Toque: pela alça ⠿. Teclado: Espaço
// pega e solta, setas movem, Esc desiste. Fica neste navegador (disciplinas-ordem e disciplinas-recolhidas, ver preferencias.js).
// A ordem guardada se acerta com a página de agora: disciplina ou nível novo entra no lugar original; o que saiu some da ordem,
// e disciplina que o disciplinas.json mudou de nível vai para o nível novo.
(function(){
  var CHAVE = 'disciplinas-ordem', main = document.querySelector('main.pag'), rodape = main.querySelector('.rodape-pag');
  if (!main.querySelector('.secao')) return;
  var CARTOES = {}, org = false, hist = [], arr = null, ini = null, pegado = null, ignorarClique = false;
  var ALCA = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>';

  // ---- Recolher e abrir níveis (vale também fora do modo de organizar; fica neste navegador)
  var CHAVE_DOBRA = 'disciplinas-recolhidas', DOBRADAS = Memoria.lerJSON(CHAVE_DOBRA, []);
  function dobrar(s, v, quieto){
    var muda = function(){ s.classList.toggle('dobrada', v); };
    if (quieto) muda(); else flip(muda);
    var b = s.querySelector('.org-dobra'); b.setAttribute('aria-expanded', !v); b.setAttribute('aria-label', v ? 'Abrir o nível' : 'Recolher o nível');
    if (quieto) return;
    DOBRADAS = [].filter.call(main.querySelectorAll('.secao.dobrada'), function(x){ return !x.classList.contains('org-vaga'); })
      .map(function(x){ return x.querySelector('.org-titulo').textContent.trim(); });
    Memoria.gravarJSON(CHAVE_DOBRA, DOBRADAS.length ? DOBRADAS : null);
  }

  // ---- Preparar a página
  function nomeDe(c){ return c.querySelector('h3').textContent.trim(); }
  function prepCartao(c){
    var n = nomeDe(c); c.dataset.nome = n; CARTOES[n] = c;
    var p = document.createElement('span'); p.className = 'org-pega'; p.innerHTML = ALCA; c.appendChild(p);
  }
  function prepSecao(s){
    var h = s.querySelector('h2');
    if (!h.querySelector('.org-titulo')) h.innerHTML = '<span class="org-titulo">' + h.innerHTML + '</span>';
    h.insertAdjacentHTML('afterbegin', '<span class="org-pega">' + ALCA + '</span><button type="button" class="org-dobra" aria-expanded="true" aria-label="Recolher o nível"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>');
    h.querySelector('.org-titulo').insertAdjacentHTML('afterend', '<span class="org-conta"></span>');
    if (DOBRADAS.indexOf(h.querySelector('.org-titulo').textContent.trim()) >= 0) dobrar(s, true, true);
  }
  main.querySelectorAll('.disc').forEach(prepCartao);
  main.querySelectorAll('.secao').forEach(prepSecao);
  // A ordem da página como veio do disciplinas.json, antes de aplicar a guardada
  var ORIGINAL = [].map.call(main.querySelectorAll('.secao'), function(s){ return { nome: s.querySelector('.org-titulo').textContent.trim(),
    discs: [].map.call(s.querySelectorAll('.disc'), function(c){ return c.dataset.nome; }) }; });
  function novaSecao(nome){
    var s = document.createElement('section'); s.className = 'secao';
    s.innerHTML = '<h2></h2><div class="grade"></div>'; s.querySelector('h2').textContent = nome;
    prepSecao(s); return s;
  }

  var heroi = document.getElementById('heroi');
  heroi.insertAdjacentHTML('beforeend', '<p class="org-dica"><b>Deixe a página do seu jeito:</b> arraste um cartão para mudar a ordem dentro do nível; ' +
    'arraste o título do nível para mudar a ordem dos níveis. No celular, arraste pela alça ⠿. <span class="org-teclado">No teclado: <kbd>Tab</kbd> até o cartão ou título, ' +
    '<kbd>Espaço</kbd> pega, as setas mudam a posição, <kbd>Espaço</kbd> solta, <kbd>Esc</kbd> desiste.</span> ' +
    'A ordem e os níveis recolhidos ficam guardados neste navegador; “Voltar ao original” desfaz tudo.</p>');
  // A entrada do modo: um botão discreto acima dos níveis, à direita. A barra de baixo só aparece enquanto se organiza.
  main.querySelector('.secao').insertAdjacentHTML('beforebegin', '<div class="org-entrada"><button type="button" id="oEntra">' + ALCA +
    '<span>Organizar a página</span></button></div>');
  document.body.insertAdjacentHTML('beforeend',
    '<div class="org-barra" role="toolbar" aria-label="Organizar a página">' +
    '<button type="button" id="oLiga" class="liga">Concluir</button>' +
    '<button type="button" id="oDesfaz" disabled>Desfazer</button>' +
    '<button type="button" id="oOriginal">Voltar ao original</button></div>' +
    '<div class="org-aviso" aria-live="assertive" id="oAviso"></div>');
  var $ = function(id){ return document.getElementById(id); };

  // ---- Estado: [{nome, discs:[nomes]}]
  function estado(){
    return [].filter.call(main.querySelectorAll('.secao'), function(s){ return !s.classList.contains('org-vaga'); })
      .map(function(s){ return { nome: s.querySelector('.org-titulo').textContent.trim(),
        discs: [].map.call(s.querySelectorAll('.disc'), function(c){ return c.dataset.nome; }) }; });
  }
  function original(){ return JSON.parse(JSON.stringify(ORIGINAL)); }
  // A ordem guardada, acertada com a página de agora: só níveis e disciplinas que existem; o que é novo entra no lugar original.
  function juntar(g){
    var orig = original(), onde = {}, vistos = {};
    orig.forEach(function(s){ s.discs.forEach(function(n, j){ onde[n] = { sec: s.nome, pos: j }; }); });
    var r = g.filter(function(s){ return s && orig.some(function(o){ return o.nome === s.nome; }); })
      .map(function(s){ return { nome: s.nome, discs: (s.discs || []).filter(function(n){ if (!onde[n] || onde[n].sec !== s.nome || vistos[n]) return false; return (vistos[n] = true); }) }; });
    r = r.filter(function(s, i){ return r.findIndex(function(x){ return x.nome === s.nome; }) === i; });
    orig.forEach(function(s, i){ if (!r.some(function(x){ return x.nome === s.nome; })) r.splice(Math.min(i, r.length), 0, { nome: s.nome, discs: [] }); });
    Object.keys(onde).forEach(function(n){
      if (vistos[n]) return; var s = r.find(function(x){ return x.nome === onde[n].sec; });
      s.discs.splice(Math.min(onde[n].pos, s.discs.length), 0, n);
    });
    return r;
  }
  function aplicar(e){
    flip(function(){
      main.querySelectorAll('.secao').forEach(function(s){ s.remove(); });
      e.forEach(function(se){
        var s = novaSecao(se.nome), g = s.querySelector('.grade');
        se.discs.forEach(function(n){ if (CARTOES[n]) g.appendChild(CARTOES[n]); });
        main.insertBefore(s, rodape);
      });
      // Disciplina que não estava no estado guardado (nova em disciplinas.json): vai para o fim do primeiro nível.
      Object.keys(CARTOES).forEach(function(n){ if (!CARTOES[n].isConnected) main.querySelector('.secao .grade').appendChild(CARTOES[n]); });
    });
    depois();
  }
  function igual(a, b){ return JSON.stringify(a) === JSON.stringify(b); }
  function guardar(){ var e = estado(); Memoria.gravarJSON(CHAVE, igual(e, ORIGINAL) ? null : e); }
  function marcar(antes){ if (!igual(antes, estado())) { hist.push(antes); guardar(); } depois(); }
  function depois(){
    main.querySelectorAll('.secao').forEach(function(s){
      if (s.classList.contains('org-vaga')) return;
      var n = s.querySelectorAll('.disc:not(.org-solto)').length;
      s.querySelector('.org-conta').textContent = n === 1 ? '1 disciplina' : n + ' disciplinas';
    });
    $('oDesfaz').disabled = !hist.length;
    $('oOriginal').disabled = igual(estado(), original());
    var foco = org ? '0' : null;
    main.querySelectorAll('.disc, .secao > h2').forEach(function(x){ if (foco) x.setAttribute('tabindex', foco); else x.removeAttribute('tabindex'); });
  }

  // ---- Animação: os outros cartões deslizam até o lugar novo
  function flip(muda){
    var els = [].slice.call(main.querySelectorAll('.disc:not(.org-solto), .secao:not(.org-solto)')), r0 = new Map();
    els.forEach(function(x){ r0.set(x, x.getBoundingClientRect()); });
    muda();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    els.forEach(function(x){
      if (!x.isConnected || x.classList.contains('org-solto')) return;
      var a = r0.get(x), b = x.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (!dx && !dy) return;
      x.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 180, easing: 'cubic-bezier(.2,.7,.3,1)' });
    });
  }

  // ---- Ligar e desligar
  function ligar(v){
    org = v; document.body.classList.toggle('organizar', v);
    $('oEntra').setAttribute('aria-expanded', v);
    if (!v) { soltarTeclado(false); $('oEntra').focus({ preventScroll: true }); }
    else $('oLiga').focus({ preventScroll: true });
    depois();
  }
  $('oLiga').onclick = function(){ ligar(false); };
  $('oEntra').onclick = function(){ ligar(true); };
  $('oDesfaz').onclick = function(){ if (hist.length) { aplicar(hist.pop()); guardar(); depois(); } };
  $('oOriginal').onclick = function(){ var a = estado(); aplicar(original()); marcar(a); };
  main.addEventListener('click', function(e){
    if (ignorarClique) { e.preventDefault(); e.stopPropagation(); ignorarClique = false; return; }
    var sd = e.target.closest('.org-dobra') || (!org && e.target.closest('.secao > h2') && !e.target.closest('a'));
    if (sd) { var se = e.target.closest('.secao'); dobrar(se, !se.classList.contains('dobrada')); return; }
    if (!org) return;
    if (e.target.closest('.disc a')) e.preventDefault();
  }, true);
  // ---- Arrastar com mouse, caneta ou dedo
  main.addEventListener('pointerdown', function(e){
    if (!org || e.button !== 0 || e.target.closest('.org-dobra')) return;
    var pega = e.target.closest('.org-pega');
    if (e.pointerType === 'touch' && !pega) return;   // no toque, o resto do cartão rola a página
    var c = e.target.closest('.disc'), h = !c && e.target.closest('.secao > h2');
    if (!c && !h) return;
    soltarTeclado(false);
    ini = { el: c || h.parentElement, tipo: c ? 'disc' : 'secao', x: e.clientX, y: e.clientY, id: e.pointerId };
    if (pega) e.preventDefault();
  });
  document.addEventListener('pointermove', function(e){
    if (!ini || e.pointerId !== ini.id) return;
    if (!arr) { if (Math.hypot(e.clientX - ini.x, e.clientY - ini.y) < 6) return; comecar(e); }
    e.preventDefault();
    arr.el.style.left = (e.clientX - arr.dx) + 'px'; arr.el.style.top = (e.clientY - arr.dy) + 'px';
    arr.px = e.clientX; arr.py = e.clientY; posicionar();
  }, { passive: false });
  document.addEventListener('pointerup', terminar);
  document.addEventListener('pointercancel', function(e){ terminar(e, true); });

  function comecar(e){
    var el = ini.el;
    // Arrastando um nível, todos mostram só o título: a lista fica curta e cabe na tela do celular, mesmo deitado.
    if (ini.tipo === 'secao') { var hy = el.querySelector('h2').getBoundingClientRect().top; document.body.classList.add('arrastando-nivel');
      scrollBy(0, el.querySelector('h2').getBoundingClientRect().top - hy); }
    var r = el.getBoundingClientRect(), v = document.createElement(el.tagName);
    v.className = 'org-vaga' + (ini.tipo === 'secao' ? ' secao' : '');
    v.style.height = r.height + 'px';
    var dx = Math.min(Math.max(e.clientX - r.left, 0), r.width), dy = Math.min(Math.max(e.clientY - r.top, 0), r.height);
    arr = { el: el, tipo: ini.tipo, grade: el.parentNode, vaga: v, dx: dx, dy: dy, antes: estado(), px: e.clientX, py: e.clientY };
    el.parentNode.insertBefore(v, el);
    el.style.width = r.width + 'px'; el.style.height = r.height + 'px'; el.style.left = r.left + 'px'; el.style.top = r.top + 'px';
    el.classList.add('org-solto'); document.body.classList.add('arrastando');
    try { el.setPointerCapture && document.documentElement.setPointerCapture(ini.id); } catch (_) {}
    depois(); rolar();
  }
  function posicionar(){
    var x = arr.px, y = arr.py, v = arr.vaga;
    if (arr.tipo === 'disc') {
      var g = arr.grade, antesDe = null;   // só dentro do próprio nível
      g.classList.add('alvo');
      var itens = [].filter.call(g.children, function(c){ return c !== v && c !== arr.el; });
      for (var i = 0; i < itens.length; i++) {
        var r = itens[i].getBoundingClientRect();
        if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) { antesDe = itens[i]; break; }
      }
      if (v.parentNode === g && (antesDe ? v.nextElementSibling === antesDe || (v.nextElementSibling === arr.el && arr.el.nextElementSibling === antesDe) : !nextItem(v))) return;
      flip(function(){ g.insertBefore(v, antesDe); });
    } else {
      var outras = [].filter.call(main.querySelectorAll('.secao'), function(s){ return s !== arr.el && s !== v; }), antes = rodape;
      for (var j = 0; j < outras.length; j++) { var q = outras[j].getBoundingClientRect(); if (y < q.top + q.height / 2) { antes = outras[j]; break; } }
      if (v.nextElementSibling === antes || (v.nextElementSibling === arr.el && arr.el.nextElementSibling === antes)) return;
      flip(function(){ main.insertBefore(v, antes); });
    }
    depois();
  }
  function nextItem(v){ var n = v.nextElementSibling; while (n && n === arr.el) n = n.nextElementSibling; return n; }
  function terminar(e, cancelar){
    if (!ini || (e && e.pointerId !== ini.id)) return;
    ini = null; if (!arr) return;
    var a = arr; arr = null;
    var r0 = a.el.getBoundingClientRect(), vy = a.vaga.getBoundingClientRect().top;
    if (cancelar) { a.vaga.remove(); aplicar(a.antes); }
    else a.vaga.replaceWith(a.el);
    a.el.classList.remove('org-solto'); a.el.style.cssText = '';
    document.body.classList.remove('arrastando', 'arrastando-nivel');
    main.querySelectorAll('.grade.alvo').forEach(function(g){ g.classList.remove('alvo'); });
    if (a.tipo === 'secao' && !cancelar) scrollBy(0, a.el.getBoundingClientRect().top - vy);   // o nível solto fica onde o dedo o deixou
    var r1 = a.el.getBoundingClientRect();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      a.el.animate([{ transform: 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px)' }, { transform: 'none' }], { duration: 160, easing: 'ease-out' });
    ignorarClique = true; setTimeout(function(){ ignorarClique = false; }, 0);
    marcar(a.antes); avisar(a.el);
  }
  // Rolagem automática perto das bordas da janela
  function rolar(){
    if (!arr) return;
    var m = 70, h = innerHeight, d = arr.py < m ? -(m - arr.py) : arr.py > h - m ? arr.py - (h - m) : 0;
    if (d) { scrollBy(0, d / 4); posicionar(); }
    requestAnimationFrame(rolar);
  }

  // ---- Teclado
  function avisar(el){
    var t;
    if (el.classList.contains('disc')) {
      var s = el.closest('.secao'), lista = [].slice.call(s.querySelectorAll('.disc'));
      t = el.dataset.nome + ': posição ' + (lista.indexOf(el) + 1) + ' de ' + lista.length + ' em ' + s.querySelector('.org-titulo').textContent.trim();
    } else {
      var todas = [].slice.call(main.querySelectorAll('.secao'));
      t = 'Nível ' + el.querySelector('.org-titulo').textContent.trim() + ': posição ' + (todas.indexOf(el) + 1) + ' de ' + todas.length;
    }
    $('oAviso').textContent = t;
  }
  function soltarTeclado(cancelar){
    if (!pegado) return; var p = pegado; pegado = null;
    p.alvo.classList.remove('org-pegado');
    if (cancelar) { aplicar(p.antes); var f = p.el.classList.contains('disc') ? p.el : [].filter.call(main.querySelectorAll('.secao > h2'), function(h){ return h.querySelector('.org-titulo').textContent.trim() === p.el.querySelector('.org-titulo').textContent.trim(); })[0]; if (f) f.focus(); $('oAviso').textContent = 'Movimento desfeito'; }
    else { marcar(p.antes); $('oAviso').textContent = 'Solto. ' + $('oAviso').textContent; }
  }
  function moverTeclado(k){
    var el = pegado.el, foco = pegado.alvo;
    flip(function(){
      if (el.classList.contains('disc')) {
        var g = el.parentNode;
        if ((k === 'ArrowLeft' || k === 'ArrowUp') && el.previousElementSibling) g.insertBefore(el, el.previousElementSibling);
        if ((k === 'ArrowRight' || k === 'ArrowDown') && el.nextElementSibling) g.insertBefore(el.nextElementSibling, el);
      } else {
        if ((k === 'ArrowUp' || k === 'ArrowLeft') && el.previousElementSibling && el.previousElementSibling.classList.contains('secao')) main.insertBefore(el, el.previousElementSibling);
        if ((k === 'ArrowDown' || k === 'ArrowRight') && el.nextElementSibling && el.nextElementSibling.classList.contains('secao')) main.insertBefore(el.nextElementSibling, el);
      }
    });
    foco.focus(); foco.scrollIntoView({ block: 'nearest' }); depois(); avisar(el);
  }
  main.addEventListener('keydown', function(e){
    if (!org) return;
    var alvo = e.target.closest('.disc, .secao > h2');
    if (!alvo || e.target.closest('.org-dobra')) return;
    var el = alvo.classList.contains('disc') ? alvo : alvo.parentElement;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (pegado) soltarTeclado(false);
      else { pegado = { el: el, alvo: alvo, antes: estado() }; alvo.classList.add('org-pegado'); avisar(el); $('oAviso').textContent = 'Pegou. ' + $('oAviso').textContent; }
    } else if (pegado && /^Arrow/.test(e.key)) { e.preventDefault(); moverTeclado(e.key); }
    else if (pegado && e.key === 'Escape') { e.preventDefault(); soltarTeclado(true); }
  });
  main.addEventListener('focusout', function(e){ if (pegado && e.target === pegado.alvo && !main.contains(e.relatedTarget)) soltarTeclado(false); });

  // ---- Começo: a ordem guardada neste navegador, se houver
  var guardado = Memoria.lerJSON(CHAVE, null);
  if (Array.isArray(guardado)) { guardado = juntar(guardado); if (!igual(guardado, ORIGINAL)) aplicar(guardado); }
  if (/[?&]organizar\b/.test(location.search)) ligar(true); else depois();
})();
