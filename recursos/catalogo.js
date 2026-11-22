// Catálogos: figuras nos cartões (figuras.js) e o filtro por nome ou código.
// Cartão sem desenho com data-fig-tx (os do grupo "Para estudar sozinho", etapa 5 do aprofundamento): o nome curto, nunca vazio.
(function(){
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  if(window.figura)[].forEach.call(document.querySelectorAll('[data-fig]'),function(c){var s=figura(c.dataset.fig);
    if(!s&&c.dataset.figTx&&window.FIG_AUX)s='<svg viewBox="0 0 160 80" class="fig" aria-hidden="true">'+FIG_AUX.tx(esc(c.dataset.figTx),20)+'</svg>';
    c.innerHTML=s});
  var f=document.getElementById('filtro'),n=document.getElementById('cConta');
  // O grupo "Para estudar sozinho" conta à parte, em seções: "7 módulos · 21 seções" (o cartão do tópico inteiro diz quantas em data-n).
  function contar(){var v=f.value.trim().toLowerCase(),k=0,j=0;
    [].forEach.call(document.querySelectorAll('.secao.cat .mod'),function(m){var ok=!v||m.dataset.f.indexOf(v)>=0;m.style.display=ok?'':'none';if(ok){if(m.classList.contains('aprof'))j+=(+m.dataset.n||1);else k++}});
    [].forEach.call(document.querySelectorAll('.secao.cat .unid'),function(s){s.style.display=s.querySelector('.mod:not([style*="none"])')?'':'none'});
    [].forEach.call(document.querySelectorAll('.secao.cat'),function(s){s.style.display=s.querySelector('.mod:not([style*="none"])')?'':'none'});
    n.textContent=k+(k===1?' módulo':' módulos')+(document.querySelector('.secao.estudar')?' · '+j+(j===1?' seção':' seções'):'')}
  if(f){f.oninput=contar;contar()}
})();

// Grupos que recolhem e módulos fixados no alto (13/11/2026, pedido do professor, a partir dos mocks mock-layout/revisao-recolher.html
// e demonstracoes-recolher.html), pelo componente comum (recolher.js). A ordem não muda; os fixados aparecem numa faixa à parte, na
// ordem da página. Cada catálogo guarda o seu (<disc>-base-... e <disc>-comp-..., ver preferencias.js). Enquanto o filtro tem texto,
// os grupos abrem e a faixa sai.
(function(){
  var main = document.querySelector('main.pag'); if (!main || !main.querySelector('.secao.cat .mod')) return;
  var PAG = main.querySelector('.mod[href^="complementar/"], .mod[data-f^="c"]') ? 'comp' : 'base';
  var grupos = [].slice.call(main.querySelectorAll('.secao.cat'));
  function codDe(a){ return a.querySelector('.cod').textContent.trim(); }

  // ---- Recolher grupos: seta, nome e resumo dentro do título
  Recolher.grupos({
    grupos: grupos, chave: Memoria.chave(PAG + '-recolhidos'), seta: 14,
    resumo: function(s){ var mods = s.querySelectorAll('.mod');
      if (s.classList.contains('estudar')) { var ns = +s.dataset.secoes || mods.length;
        return ns + (ns === 1 ? ' seção' : ' seções') + ', de ' + codDe(mods[0]).split(' ')[0] + ' a ' + codDe(mods[mods.length - 1]).split(' ')[0]; }
      return mods.length === 1 ? codDe(mods[0]) : codDe(mods[0]) + ' a ' + codDe(mods[mods.length - 1]) + ' · ' + mods.length + ' módulos'; },
    preparar: function(s, seta, resumo){
      var h = s.querySelector('h2'), nome = h.textContent.trim(), rn = document.createElement('span');
      rn.className = 'rc-nome'; while (h.firstChild) rn.appendChild(h.firstChild);
      h.appendChild(seta); h.appendChild(rn); h.appendChild(resumo);
      return { nome: nome, alvo: h };
    },
    tudo: { por: function(bt){ main.querySelector('.filtro-l').appendChild(bt); }, abrir: 'Abrir todos', recolher: 'Recolher todos', longo: ' os grupos' }
  });

  // ---- Fixar módulos: o pino fica ao lado do cartão (um botão não pode ir dentro do link)
  var faixa = document.createElement('section'); faixa.className = 'secao rc-fixados'; faixa.style.setProperty('--cor', 'var(--define)');
  faixa.innerHTML = '<h2><span class="rc-nome">Fixados</span><span class="rc-nota">na ordem da página; todos continuam abaixo</span></h2><div class="grade"></div>';
  grupos[0].before(faixa);
  function celula(a, pino){ var w = document.createElement('div'); w.className = 'rc-cel'; w.appendChild(a); w.appendChild(pino); return w; }
  Recolher.fixar({
    raiz: main, chave: Memoria.chave(PAG + '-fixados'), faixa: faixa, destino: faixa.querySelector('.grade'),
    itens: function(){ return [].slice.call(main.querySelectorAll('.secao.cat .mod')); },
    cod: codDe,
    rotulo: function(c){ return c; },
    colocar: function(a, pino){ var marca = document.createComment(''); a.before(marca); marca.replaceWith(celula(a, pino)); },
    copia: function(orig, c, pino){
      var a = orig.cloneNode(true); a.classList.add('rc-copia');
      a.style.setProperty('--cor', getComputedStyle(orig.closest('.secao')).getPropertyValue('--cor'));
      return celula(a, pino(c));
    }
  });

  // ---- Filtro: enquanto há texto, os grupos ficam abertos e a faixa de fixados sai (a contagem já ignora a faixa)
  var f = document.getElementById('filtro');
  function filtrar(){ document.body.classList.toggle('rc-filtrando', !!f.value.trim()); }
  if (f) { f.addEventListener('input', filtrar); filtrar(); }
})();
