// Catálogos: figuras nos cartões (figuras.js) e o filtro por nome ou código.
(function(){
  if(window.figura)[].forEach.call(document.querySelectorAll('[data-fig]'),function(c){c.innerHTML=figura(c.dataset.fig)});
  var f=document.getElementById('filtro'),n=document.getElementById('cConta');
  function contar(){var v=f.value.trim().toLowerCase(),k=0;
    [].forEach.call(document.querySelectorAll('.secao.cat .mod'),function(m){var ok=!v||m.dataset.f.indexOf(v)>=0;m.style.display=ok?'':'none';if(ok)k++});
    [].forEach.call(document.querySelectorAll('.secao.cat'),function(s){s.style.display=s.querySelector('.mod:not([style*="none"])')?'':'none'});
    n.textContent=k+(k===1?' módulo':' módulos')}
  if(f){f.oninput=contar;contar()}
})();

// Grupos que recolhem e módulos fixados no alto (13/11/2026, pedido do professor, a partir dos mocks mock-layout/revisao-recolher.html
// e demonstracoes-recolher.html). A ordem não muda; os fixados aparecem numa faixa à parte, na ordem da página. Cada catálogo guarda
// o seu (<disc>-base-... e <disc>-comp-..., ver preferencias.js). Enquanto o filtro tem texto, os grupos abrem e a faixa sai.
(function(){
  var main = document.querySelector('main.pag'); if (!main || !main.querySelector('.secao.cat .mod')) return;
  var PAG = main.querySelector('.mod[href^="complementar/"], .mod[data-f^="c"]') ? 'comp' : 'base';
  var C_REC = Memoria.chave(PAG + '-recolhidos'), C_FIX = Memoria.chave(PAG + '-fixados');
  function ler(k){ var v = Memoria.lerJSON(k, []); return Array.isArray(v) ? v : []; }
  function gravar(k, v){ Memoria.gravarJSON(k, v.length ? v : null); }
  var recolhidas = ler(C_REC), fixados = ler(C_FIX);
  var grupos = [].slice.call(main.querySelectorAll('.secao.cat'));
  var SETA = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
  var PINO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6l-1 6 4 3v2h-5v7l-1 1-1-1v-7H6v-2l4-3z"/></svg>';
  function codDe(a){ return a.querySelector('.cod').textContent.trim(); }

  // ---- Recolher grupos
  grupos.forEach(function(s){
    var h = s.querySelector('h2'), mods = s.querySelectorAll('.mod'), nome = h.textContent.trim();
    s.dataset.nome = nome;
    h.innerHTML = '<button type="button" class="rc-seta">' + SETA + '</button><span class="rc-nome">' + h.innerHTML + '</span>' +
      '<span class="rc-resumo">' + (mods.length === 1 ? codDe(mods[0]) : codDe(mods[0]) + ' a ' + codDe(mods[mods.length - 1]) + ' · ' + mods.length + ' módulos') + '</span>';
    h.addEventListener('click', function(){ recolher(s, !s.classList.contains('rc-fechada')); });
    recolher(s, recolhidas.indexOf(nome) >= 0, true);
  });
  function recolher(s, v, quieto){
    s.classList.toggle('rc-fechada', v);
    var b = s.querySelector('.rc-seta'); b.setAttribute('aria-expanded', !v); b.setAttribute('aria-label', (v ? 'Abrir ' : 'Recolher ') + s.dataset.nome);
    if (quieto) return;
    recolhidas = grupos.filter(function(x){ return x.classList.contains('rc-fechada'); }).map(function(x){ return x.dataset.nome; });
    gravar(C_REC, recolhidas); botaoTudo();
  }
  var linha = main.querySelector('.filtro-l'), bt = document.createElement('button');
  bt.type = 'button'; bt.className = 'rc-tudo'; linha.appendChild(bt);
  function botaoTudo(){ var todas = grupos.every(function(s){ return s.classList.contains('rc-fechada'); });
    bt.innerHTML = (todas ? 'Abrir todos' : 'Recolher todos') + '<span class="rc-longo"> os grupos</span>'; bt.dataset.abrir = todas ? '1' : ''; }
  bt.onclick = function(){ var abrir = !!bt.dataset.abrir; grupos.forEach(function(s){ recolher(s, !abrir, true); }); recolher(grupos[0], !abrir); };
  botaoTudo();

  // ---- Fixar módulos: o botão fica ao lado do cartão (um botão não pode ir dentro do link)
  [].forEach.call(main.querySelectorAll('.secao.cat .mod'), function(a){ envolver(a, codDe(a)); });
  function envolver(a, cod){
    var w = document.createElement('div'); w.className = 'rc-cel'; a.before(w); w.appendChild(a);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'rc-pino'; b.innerHTML = PINO; b.dataset.c = cod;
    w.appendChild(b); rotular(b); return w;
  }
  function rotular(b){
    var f = fixados.indexOf(b.dataset.c) >= 0;
    b.setAttribute('aria-pressed', f); b.title = f ? 'Desafixar' : 'Fixar no alto';
    b.setAttribute('aria-label', (f ? 'Desafixar ' : 'Fixar no alto ') + b.dataset.c);
  }
  var faixa = document.createElement('section'); faixa.className = 'secao rc-fixados'; faixa.style.setProperty('--cor', 'var(--define)');
  faixa.innerHTML = '<h2><span class="rc-nome">Fixados</span><span class="rc-nota">na ordem da página; todos continuam abaixo</span></h2><div class="grade"></div>';
  grupos[0].before(faixa);
  function montarFixados(){
    var g = faixa.querySelector('.grade'); g.innerHTML = '';
    var ordem = [].map.call(grupos, function(s){ return [].map.call(s.querySelectorAll('.mod'), codDe); }).reduce(function(a, b){ return a.concat(b); }, []);
    fixados = fixados.filter(function(c){ return ordem.indexOf(c) >= 0; });
    ordem.filter(function(c){ return fixados.indexOf(c) >= 0; }).forEach(function(c){
      var orig = [].filter.call(main.querySelectorAll('.secao.cat .mod'), function(a){ return codDe(a) === c; })[0];
      var a = orig.cloneNode(true); a.classList.add('rc-copia');
      a.style.setProperty('--cor', getComputedStyle(orig.closest('.secao')).getPropertyValue('--cor'));
      var w = document.createElement('div'); g.appendChild(w); w.appendChild(a); envolver(a, c); w.replaceWith(a.parentNode);
    });
    faixa.hidden = !fixados.length;
    main.querySelectorAll('.rc-pino').forEach(rotular);
  }
  main.addEventListener('click', function(e){
    var b = e.target.closest('.rc-pino'); if (!b) return;
    var c = b.dataset.c, i = fixados.indexOf(c), naFaixa = !!b.closest('.rc-fixados');
    if (i >= 0) fixados.splice(i, 1); else fixados.push(c);
    gravar(C_FIX, fixados); montarFixados();
    $aviso.textContent = c + (i >= 0 ? ' desafixado' : ' fixado no alto');
    if (naFaixa) { var o = main.querySelector('.secao.cat .rc-pino[data-c="' + c + '"]'); if (o) o.focus({ preventScroll: true }); }
  });
  document.body.insertAdjacentHTML('beforeend', '<div class="rc-aviso" aria-live="polite"></div>');
  var $aviso = document.querySelector('.rc-aviso');

  // ---- Filtro: enquanto há texto, os grupos ficam abertos e a faixa de fixados sai (a contagem já ignora a faixa)
  var f = document.getElementById('filtro');
  function filtrar(){ document.body.classList.toggle('rc-filtrando', !!f.value.trim()); }
  if (f) { f.addEventListener('input', filtrar); filtrar(); }
  montarFixados();
})();
