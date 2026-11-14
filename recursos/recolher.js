// Componente comum: grupos que recolhem e itens fixados no alto (14/11/2026; antes, uma cópia em aulas-e-exercicios.js e outra em
// catalogo.js). A página diz onde ficam a seta, o resumo, o pino e o botão "Recolher todos", e como copiar um item para a faixa
// dos fixados; o componente cuida do estado, do que fica guardado no navegador (Memoria), dos rótulos para o leitor de tela e do aviso.
// Estilos comuns em recolher.css; os tamanhos e o lugar de cada peça ficam no CSS da página.
window.Recolher = (function(){
  function SETA(t){ return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>'; }
  var PINO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6l-1 6 4 3v2h-5v7l-1 1-1-1v-7H6v-2l4-3z"/></svg>';
  function ler(k){ var v = Memoria.lerJSON(k, []); return Array.isArray(v) ? v : []; }
  function gravar(k, v){ Memoria.gravarJSON(k, v.length ? v : null); }
  function botao(classe, conteudo){ var b = document.createElement('button'); b.type = 'button'; b.className = classe; b.innerHTML = conteudo; return b; }

  // o.grupos: os elementos que recolhem; o.chave: a chave do Memoria; o.seta: tamanho do ícone (px);
  // o.resumo(g): texto mostrado com o grupo fechado; o.preparar(g, seta, resumo): põe a seta e o resumo e devolve {nome, alvo},
  // o nome guardado no navegador e o elemento que recolhe ao clique (clique em link não conta);
  // o.tudo: {por(botao), abrir, recolher, longo}, o botão de recolher ou abrir todos e os seus textos.
  function grupos(o){
    var lista = o.grupos.slice(), nomes = [], guardados = ler(o.chave);
    if (!lista.length) return { recolher: function(){}, abrirPara: function(){} };
    lista.forEach(function(g, k){
      var seta = botao('rc-seta', SETA(o.seta || 16)), resumo = document.createElement('span');
      resumo.className = 'rc-resumo'; resumo.textContent = o.resumo(g);
      var p = o.preparar(g, seta, resumo); nomes[k] = p.nome;
      p.alvo.addEventListener('click', function(e){ if (!e.target.closest('a')) recolher(g, !g.classList.contains('rc-fechada')); });
      recolher(g, guardados.indexOf(p.nome) >= 0, true);
    });
    function recolher(g, v, quieto){
      g.classList.toggle('rc-fechada', v);
      var b = g.querySelector('.rc-seta'); b.setAttribute('aria-expanded', !v); b.setAttribute('aria-label', (v ? 'Abrir ' : 'Recolher ') + nomes[lista.indexOf(g)]);
      if (quieto) return;
      gravar(o.chave, nomes.filter(function(n, k){ return lista[k].classList.contains('rc-fechada'); }));
      textoTudo();
    }
    var bt = botao('rc-tudo', ''); o.tudo.por(bt);
    function textoTudo(){ var todos = lista.every(function(g){ return g.classList.contains('rc-fechada'); });
      bt.innerHTML = (todos ? o.tudo.abrir : o.tudo.recolher) + '<span class="rc-longo">' + o.tudo.longo + '</span>'; bt.dataset.abrir = todos ? '1' : ''; }
    bt.onclick = function(){ var abrir = !!bt.dataset.abrir; lista.forEach(function(g){ recolher(g, !abrir, true); }); recolher(lista[0], !abrir); };
    textoTudo();
    return {
      recolher: recolher,
      // Abre o grupo que contém el (ir a um item pelo índice, pela busca ou por um link com #).
      abrirPara: function(el){ var g = lista.filter(function(x){ return x.contains(el); })[0]; if (g && g.classList.contains('rc-fechada')) recolher(g, false); }
    };
  }

  // o.raiz: onde ficam os itens e a faixa; o.chave: a chave do Memoria; o.faixa e o.destino: a seção dos fixados e onde as cópias entram;
  // o.itens(): os itens originais, na ordem da página; o.cod(item): o código guardado; o.rotulo(cod): o nome lido depois de "Fixar no alto";
  // o.colocar(item, pino): põe o pino junto do item; o.copia(item, cod, pino): a cópia do item na faixa (pino(cod) faz um pino novo);
  // o.depois(fixados): o que a página faz a mais a cada mudança.
  function fixar(o){
    var fixados = ler(o.chave);
    function pino(cod){ var b = botao('rc-pino', PINO); b.dataset.cod = cod; rotular(b); return b; }
    function rotular(b){
      var f = fixados.indexOf(b.dataset.cod) >= 0;
      b.setAttribute('aria-pressed', f); b.title = f ? 'Desafixar' : 'Fixar no alto';
      b.setAttribute('aria-label', (f ? 'Desafixar ' : 'Fixar no alto ') + o.rotulo(b.dataset.cod));
    }
    o.itens().forEach(function(it){ o.colocar(it, pino(o.cod(it))); });
    function montar(){
      o.destino.innerHTML = '';
      var itens = o.itens(), ordem = itens.map(o.cod);
      fixados = fixados.filter(function(c){ return ordem.indexOf(c) >= 0; });   // item que saiu da página some dos fixados
      ordem.forEach(function(c, k){ if (fixados.indexOf(c) >= 0) o.destino.appendChild(o.copia(itens[k], c, pino)); });
      o.faixa.hidden = !fixados.length;
      [].forEach.call(o.raiz.querySelectorAll('.rc-pino'), rotular);
      if (o.depois) o.depois(fixados);
    }
    var aviso = document.createElement('div'); aviso.className = 'rc-aviso'; aviso.setAttribute('aria-live', 'polite');
    document.body.appendChild(aviso);
    o.raiz.addEventListener('click', function(e){
      var b = e.target.closest('.rc-pino'); if (!b) return;
      var c = b.dataset.cod, i = fixados.indexOf(c), naFaixa = o.faixa.contains(b);
      if (i >= 0) fixados.splice(i, 1); else fixados.push(c);
      gravar(o.chave, fixados); montar();
      aviso.textContent = c + (i >= 0 ? ' desafixado' : ' fixado no alto');
      // o foco fica no pino do item na página (o da faixa pode ter sumido)
      if (naFaixa) { var orig = [].filter.call(o.raiz.querySelectorAll('.rc-pino'), function(x){ return x.dataset.cod === c && !o.faixa.contains(x); })[0];
        if (orig) orig.focus({ preventScroll: true }); }
    });
    montar();
  }

  return { grupos: grupos, fixar: fixar };
})();
