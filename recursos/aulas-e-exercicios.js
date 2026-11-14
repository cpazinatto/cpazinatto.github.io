// Aulas e exercícios: "Só os liberados", percentual visto (calculo-quadros) e o índice dos tópicos ao lado.
(function(){
  [].forEach.call(document.querySelectorAll('.linhas>li'),function(li){if(!li.querySelector('a.aula'))li.classList.add('breve')});
  var so=document.getElementById('soLib');if(so)so.onchange=function(){document.body.classList.toggle('so-lib',so.checked)};
  // Quadros vistos (calculo-quadros, gravado pelo tema.js): percentual por aula, que dá para zerar, preenchimento em cada seção e o total
  // das aulas no ar no alto da página (pedido do professor, 12/11/2026, no lugar do "✓ vista" por aula).
  var nomes={EE:'Elétrica',EQ:'Química'};
  function pintar(){var v=Memoria.quadros(),soma={EE:[0,0],EQ:[0,0]};
    [].forEach.call(document.querySelectorAll('.links[data-aula]'),function(l){var o=Memoria.faixas(v[l.dataset.aula]),tot=+l.dataset.total||0,c=l.dataset.aula.slice(-2);
      var vis=Memoria.contar(o,1,tot);if(tot&&l.querySelector('a.aula')){soma[c][0]+=vis;soma[c][1]+=tot}
      [].forEach.call(l.querySelectorAll('a.aula[data-ini]'),function(a){var x=+a.dataset.ini,y=+a.dataset.fim,f=y>=x?Memoria.contar(o,x,y)/(y-x+1):0;
        a.style.setProperty('--f',f.toFixed(3));a.classList.toggle('com-vis',f>0);a.title=f>0?Math.round(100*f)+'% desta seção visto':''});
      var p=l.querySelector('.pct');if(!p){p=document.createElement('span');p.className='pct';l.querySelector('.ver').before(p)}
      var pc=tot?Math.round(100*vis/tot):0;p.hidden=!vis;
      p.innerHTML=vis?'<b>'+pc+'%</b> visto <button type="button" class="zerar" aria-label="Zerar o que foi visto na '+l.dataset.aula+'">zerar</button>':'';
      if(vis)p.querySelector('.zerar').onclick=function(){Memoria.zerarVistos(l.dataset.aula);pintar()}});
    var g=document.getElementById('global'),c=document.documentElement.dataset.curso,cs=c?[c]:Memoria.cursos.filter(function(k){return soma[k][0]})||[];
    if(!g)return;if(!cs.length)cs=[Memoria.cursos[0]];
    g.innerHTML=cs.filter(function(k){return soma[k][1]}).map(function(k){var pc=Math.round(100*soma[k][0]/soma[k][1]);
      return '<div class="progresso"><div class="barra-p"><i style="width:'+pc+'%"></i></div><span><b>'+pc+'%</b> das aulas no ar vistas'+(cs.length>1||!c?' · '+nomes[k]:'')+'</span></div>'}).join('')+
      (Object.keys(v).length?'<button type="button" class="zerar" id="zerarTudo">zerar tudo</button>':'');
    var z=document.getElementById('zerarTudo');if(z)z.onclick=function(){if(confirm('Zerar o que foi visto em todas as aulas, neste navegador?')){Memoria.zerarVistos();pintar()}}}
  pintar();document.addEventListener('click',function(e){if(e.target.closest('[data-curso-opcao]'))setTimeout(pintar,0)});
  var r=document.createElement('nav');r.className='rail rail-aulas';r.setAttribute('aria-label','Índice dos tópicos');
  var b=document.createElement('button');b.type='button';b.className='b-rail';b.setAttribute('aria-expanded','false');
  b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>Índice';
  var h='<h2>Índice</h2>';[].forEach.call(document.querySelectorAll('.parte'),function(p){
    h+='<div class="grupo" data-p="'+p.id+'"><a class="p" href="#'+p.id+'"></a>';
    [].forEach.call(p.querySelectorAll('.linhas>li'),function(li){h+='<a class="t" href="#'+li.id+'" data-t="'+li.id+'"><b>'+li.id+'</b><span></span></a>'});h+='</div>'});
  r.innerHTML=h;
  [].forEach.call(r.querySelectorAll('.grupo'),function(g){var p=document.getElementById(g.dataset.p);g.querySelector('.p').textContent=p.querySelector('h2').textContent;
    [].forEach.call(g.querySelectorAll('.t'),function(a){a.querySelector('span').textContent=document.getElementById(a.dataset.t).querySelector('.tit').textContent})});
  document.body.appendChild(r);document.body.appendChild(b);
  b.onclick=function(){b.setAttribute('aria-expanded',r.classList.toggle('aberta'))};
  r.addEventListener('click',function(e){if(e.target.closest('a')){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&r.classList.contains('aberta')){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}});
  if(!window.IntersectionObserver)return;
  new IntersectionObserver(function(es){var fora=!es[0].isIntersecting;r.classList.toggle('ver',fora);b.classList.toggle('ver',fora);
    if(!fora){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}}).observe(document.getElementById('heroi'));
  // Tópico atual (13/11/2026): o último que já passou da barra do curso no alto, não o do meio da tela, que marcava outro tópico logo
  // depois do salto; clicar no índice marca o tópico clicado até a pessoa rolar de novo. Tópico de parte recolhida não conta.
  var lis=[].slice.call(document.querySelectorAll('.parte:not(.rc-fixados) .linhas>li[id], .corpo-lista>.parte .linhas>li[id]')),trava=false,atual=null;
  function marcar(id){if(id===atual)return;atual=id;var li=id&&document.getElementById(id),p=li?li.closest('.parte').id:'';
    [].forEach.call(r.querySelectorAll('.grupo'),function(g){g.classList.toggle('aberto',g.dataset.p===p)});
    [].forEach.call(r.querySelectorAll('a.t'),function(a){a.classList.toggle('atual',a.dataset.t===id)})}
  function atualizar(){if(trava)return;var a='';for(var k=0;k<lis.length;k++){var q=lis[k].getBoundingClientRect();if(!q.height)continue;if(q.top>140)break;a=lis[k].id}
    marcar(a||(lis[0]&&lis[0].id))}
  addEventListener('scroll',atualizar,{passive:true});addEventListener('resize',atualizar);
  ['wheel','touchstart','keydown'].forEach(function(n){addEventListener(n,function(){trava=false},{passive:true})});
  r.addEventListener('click',function(e){var x=e.target.closest('a.t');if(!x)return;trava=true;atual=null;marcar(x.dataset.t)});
  atualizar();
})();

// Partes que recolhem e tópicos fixados no alto (13/11/2026, pedido do professor, a partir do mock mock-layout/aulas-recolher.html).
// A ordem do curso não muda: recolher só esconde, e os fixados aparecem numa faixa à parte, na ordem dos tópicos. Fica neste
// navegador (<disc>-aulas-recolhidas e <disc>-aulas-fixadas, ver preferencias.js).
(function(){
  var C_REC = Memoria.chave('aulas-recolhidas'), C_FIX = Memoria.chave('aulas-fixadas');
  function ler(k){ var v = Memoria.lerJSON(k, []); return Array.isArray(v) ? v : []; }
  function gravar(k, v){ Memoria.gravarJSON(k, v.length ? v : null); }
  var recolhidas = ler(C_REC), fixados = ler(C_FIX);
  var corpo = document.querySelector('.corpo-lista'); if (!corpo) return;
  var partes = [].slice.call(corpo.querySelectorAll('.parte'));
  var SETA = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
  var PINO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6l-1 6 4 3v2h-5v7l-1 1-1-1v-7H6v-2l4-3z"/></svg>';

  // ---- Recolher partes
  partes.forEach(function(p){
    var cab = p.querySelector('.parte-cab'), h = cab.querySelector('h2'), lis = p.querySelectorAll('.linhas>li');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'rc-seta'; b.innerHTML = SETA;
    b.setAttribute('aria-controls', p.id + '-l'); p.querySelector('.linhas').id = p.id + '-l';
    cab.insertBefore(b, h);
    var r = document.createElement('span'); r.className = 'rc-resumo';
    r.textContent = lis.length === 1 ? lis[0].id : lis[0].id + ' a ' + lis[lis.length - 1].id + ' · ' + lis.length + ' tópicos';
    cab.appendChild(r);
    cab.addEventListener('click', function(e){ if (!e.target.closest('a')) recolher(p, !p.classList.contains('rc-fechada')); });
    recolher(p, recolhidas.indexOf(h.textContent) >= 0, true);
  });
  function recolher(p, v, quieto){
    p.classList.toggle('rc-fechada', v);
    var b = p.querySelector('.rc-seta'), nome = p.querySelector('h2').textContent;
    b.setAttribute('aria-expanded', !v); b.setAttribute('aria-label', (v ? 'Abrir ' : 'Recolher ') + nome);
    if (quieto) return;
    recolhidas = partes.filter(function(x){ return x.classList.contains('rc-fechada'); }).map(function(x){ return x.querySelector('h2').textContent; });
    gravar(C_REC, recolhidas); botaoTudo();
  }
  // Recolher tudo e abrir tudo, no filtro fixo do alto
  var esp = document.querySelector('.filtro .esp'), bt = document.createElement('button');
  bt.type = 'button'; bt.className = 'rc-tudo'; esp.after(bt);
  function botaoTudo(){ var todas = partes.every(function(p){ return p.classList.contains('rc-fechada'); }); bt.innerHTML = (todas ? 'Abrir todas' : 'Recolher todas') + '<span class="rc-longo"> as partes</span>'; bt.dataset.abrir = todas ? '1' : ''; }
  bt.onclick = function(){ var abrir = !!bt.dataset.abrir; partes.forEach(function(p){ recolher(p, !abrir, true); }); recolher(partes[0], !abrir); };
  botaoTudo();
  // Ir a um tópico (índice ao lado, busca, link com #T07): a parte dele abre
  function abrirPara(id){
    var alvo = id && document.getElementById(id); if (!alvo) return;
    var p = alvo.closest('.parte'); if (p && p.classList.contains('rc-fechada')) recolher(p, false);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    abrirPara(a.getAttribute('href').slice(1));   // a parte abre antes de o navegador rolar até o tópico
  }, true);
  addEventListener('hashchange', function(){ abrirPara(location.hash.slice(1)); });
  abrirPara(location.hash.slice(1));

  // ---- Fixar tópicos no alto
  var faixa = document.createElement('section'); faixa.className = 'parte rc-fixados'; faixa.id = 'fixados';
  faixa.innerHTML = '<div class="parte-cab"><h2>Fixados</h2><p>os tópicos que você fixou, na ordem do curso; a lista completa continua abaixo</p></div><ul class="linhas"></ul>';
  corpo.insertBefore(faixa, corpo.firstChild);
  [].forEach.call(corpo.querySelectorAll('.parte:not(.rc-fixados) .linhas>li'), function(li){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'rc-pino'; b.innerHTML = PINO; b.dataset.t = li.id;
    li.appendChild(b); rotular(b);
  });
  function rotular(b){
    var f = fixados.indexOf(b.dataset.t) >= 0, tit = document.getElementById(b.dataset.t).querySelector('.tit').textContent;
    b.setAttribute('aria-pressed', f); b.title = f ? 'Desafixar' : 'Fixar no alto';
    b.setAttribute('aria-label', (f ? 'Desafixar ' : 'Fixar no alto ') + b.dataset.t + ', ' + tit);
  }
  function montarFixados(){
    var ul = faixa.querySelector('ul'); ul.innerHTML = '';
    var ordem = [].map.call(corpo.querySelectorAll('.parte:not(.rc-fixados) .linhas>li'), function(li){ return li.id; });
    fixados = fixados.filter(function(t){ return ordem.indexOf(t) >= 0; });   // tópico que saiu da página some dos fixados
    ordem.filter(function(t){ return fixados.indexOf(t) >= 0; }).forEach(function(t){
      var c = document.getElementById(t).cloneNode(true);
      c.removeAttribute('id'); c.dataset.t = t;
      c.querySelectorAll('[data-aula]').forEach(function(x){ x.removeAttribute('data-aula'); });
      c.querySelectorAll('.pct, .ver').forEach(function(x){ x.remove(); });
      var cod = c.querySelector('.cod'), a = document.createElement('a'); a.href = '#' + t; a.className = 'cod'; a.textContent = t; a.title = 'Ir ao ' + t + ' na lista';
      cod.replaceWith(a);
      ul.appendChild(c);
    });
    faixa.hidden = !fixados.length;
    corpo.querySelectorAll('.rc-pino').forEach(function(b){ if (document.getElementById(b.dataset.t)) rotular(b); });
    corpo.querySelectorAll('.linhas>li[id]').forEach(function(li){ li.classList.toggle('rc-fixo', fixados.indexOf(li.id) >= 0); });
  }
  corpo.addEventListener('click', function(e){
    var b = e.target.closest('.rc-pino'); if (!b) return;
    var t = b.dataset.t, i = fixados.indexOf(t), dentroFaixa = !!b.closest('.rc-fixados');
    if (i >= 0) fixados.splice(i, 1); else fixados.push(t);
    gravar(C_FIX, fixados); montarFixados();
    var aviso = document.getElementById('rcAviso'); aviso.textContent = t + (i >= 0 ? ' desafixado' : ' fixado no alto');
    // o foco fica no mesmo botão do tópico na lista (o da faixa pode ter sumido)
    if (dentroFaixa) { var o = document.querySelector('#' + t + ' .rc-pino'); if (o) o.focus({ preventScroll: true }); }
  });
  document.body.insertAdjacentHTML('beforeend', '<div class="rc-aviso" id="rcAviso" aria-live="polite"></div>');
  montarFixados();
})();
// Imprimir o tópico (13/11/2026): o menu fecha com um clique fora, com Esc e quando outro abre.
(function(){var ms=[].slice.call(document.querySelectorAll('details.imp-top'));if(!ms.length)return;
  function fechar(exceto){ms.forEach(function(m){if(m!==exceto)m.open=false})}
  ms.forEach(function(m){m.addEventListener('toggle',function(){if(m.open)fechar(m)})});
  document.addEventListener('click',function(e){if(!e.target.closest('details.imp-top'))fechar()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var a=ms.filter(function(m){return m.open})[0];if(a){fechar();a.querySelector('summary').focus()}}});
})();
