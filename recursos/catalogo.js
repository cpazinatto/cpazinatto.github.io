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
