// O título do tópico sem o selo "aprofundamento" do tópico inteiro (22/11/2026), para o índice ao lado e o rótulo do fixar.
function tituloDe(li){var t=li.querySelector('.tit').cloneNode(true);[].forEach.call(t.querySelectorAll('.selo-curto'),function(x){x.remove()});return t.textContent.trim()}
// Aulas e exercícios: "Só os liberados", percentual visto (calculo-quadros) e o índice dos tópicos ao lado.
(function(){
  [].forEach.call(document.querySelectorAll('.linhas>li'),function(li){if(!li.querySelector('a.aula'))li.classList.add('breve')});
  var so=document.getElementById('soLib');if(so)so.onchange=function(){document.body.classList.toggle('so-lib',so.checked)};
  // Quadros vistos (calculo-quadros, gravado pelo tema.js): percentual por aula, que dá para zerar, preenchimento em cada seção e o total
  // das aulas no ar no alto da página (pedido do professor, 12/11/2026, no lugar do "✓ vista" por aula).
  var nomes={EE:'Elétrica',EQ:'Química'};
  // Seções de aprofundamento (etapa 2, 22/11/2026, docs/planejamento-aprofundamento.md, proposta 4): com algum botão data-camada, o
  // alto da página mostra duas barras, "Em sala" (só os quadros das seções do núcleo) e "Para estudar sozinho" (só os das de
  // aprofundamento); sem nenhum (o Cálculo), a barra única de sempre. O percentual por aula segue contando todos os quadros.
  var comCamadas=!!document.querySelector('.links a.aula[data-camada]'),APROF='Para estudar sozinho, fora da prova';
  var LIVRO='<svg class="ic-livro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5v13"/></svg>';
  function pintar(){var v=Memoria.quadros(),soma={EE:[0,0],EQ:[0,0]},cam={};
    function S(c){if(!soma[c])soma[c]=[0,0];if(!cam[c])cam[c]=[0,0,0,0];return c}
    [].forEach.call(document.querySelectorAll('.links[data-aula]'),function(l){var o=Memoria.faixas(v[l.dataset.aula]),tot=+l.dataset.total||0,c=S(l.dataset.aula.slice(-2));
      var vis=Memoria.contar(o,1,tot);if(tot&&l.querySelector('a.aula')){soma[c][0]+=vis;soma[c][1]+=tot}
      [].forEach.call(l.querySelectorAll('a.aula[data-ini]'),function(a){var x=+a.dataset.ini,y=+a.dataset.fim,nv=y>=x?Memoria.contar(o,x,y):0,f=y>=x?nv/(y-x+1):0,ap=!!a.dataset.camada;
        if(y>=x){var k=ap?2:0;cam[c][k]+=nv;cam[c][k+1]+=y-x+1}
        a.style.setProperty('--f',f.toFixed(3));a.classList.toggle('com-vis',f>0);
        a.title=(ap?APROF:'')+(f>0?(ap?' · ':'')+Math.round(100*f)+'% desta seção visto':'')});
      var p=l.querySelector('.pct');if(!p){p=document.createElement('span');p.className='pct';l.querySelector('.ver').before(p)}
      var pc=tot?Math.round(100*vis/tot):0;p.hidden=!vis;
      p.innerHTML=vis?'<b>'+pc+'%</b> visto <button type="button" class="zerar" aria-label="Zerar o que foi visto na '+l.dataset.aula+'">zerar</button>':'';
      if(vis)p.querySelector('.zerar').onclick=function(){Memoria.zerarVistos(l.dataset.aula);pintar()}});
    var g=document.getElementById('global'),c=document.documentElement.dataset.curso,cs=c?[c]:Memoria.cursos.filter(function(k){return soma[k]&&soma[k][0]})||[];
    if(!g)return;if(!cs.length)cs=[Memoria.cursos[0]];
    function barra(pc,cls,rot){return '<div class="progresso'+cls+'"><div class="barra-p"><i style="width:'+pc+'%"></i></div><span>'+rot+'</span></div>'}
    g.classList.toggle('camadas',comCamadas);
    g.innerHTML=cs.filter(function(k){return soma[k]&&soma[k][1]}).map(function(k){var suf=cs.length>1||!c?' · '+nomes[k]:'';
      if(comCamadas){var n=cam[k][1]?Math.round(100*cam[k][0]/cam[k][1]):0,m=cam[k][3]?Math.round(100*cam[k][2]/cam[k][3]):0;
        return barra(n,'','<b class="camada">Em sala:</b> <b>'+n+'%</b> visto'+suf)+
          (cam[k][3]?barra(m,' aprof',LIVRO+'<b class="camada">Para estudar sozinho:</b> <b>'+m+'%</b> visto'+suf):'')}
      var pc=Math.round(100*soma[k][0]/soma[k][1]);
      return barra(pc,'','<b>'+pc+'%</b> das aulas no ar vistas'+suf)}).join('')+
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
    [].forEach.call(g.querySelectorAll('.t'),function(a){a.querySelector('span').textContent=tituloDe(document.getElementById(a.dataset.t))})});
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

// Partes que recolhem e tópicos fixados no alto (13/11/2026, pedido do professor, a partir do mock mock-layout/aulas-recolher.html),
// pelo componente comum (recolher.js). A ordem do curso não muda: recolher só esconde, e os fixados aparecem numa faixa à parte, na
// ordem dos tópicos. Fica neste navegador (<disc>-aulas-recolhidas e <disc>-aulas-fixadas, ver preferencias.js).
(function(){
  var corpo = document.querySelector('.corpo-lista'); if (!corpo) return;
  var partes = [].slice.call(corpo.querySelectorAll('.parte'));

  // ---- Recolher partes: a seta antes do título, o resumo no fim do cabeçalho; "Recolher todas" no filtro fixo do alto
  var rc = Recolher.grupos({
    grupos: partes, chave: Memoria.chave('aulas-recolhidas'), seta: 16,
    resumo: function(p){ var lis = p.querySelectorAll('.linhas>li');
      return lis.length === 1 ? lis[0].id : lis[0].id + ' a ' + lis[lis.length - 1].id + ' · ' + lis.length + ' tópicos'; },
    preparar: function(p, seta, resumo){
      var cab = p.querySelector('.parte-cab'), h = cab.querySelector('h2');
      seta.setAttribute('aria-controls', p.id + '-l'); p.querySelector('.linhas').id = p.id + '-l';
      cab.insertBefore(seta, h); cab.appendChild(resumo);
      return { nome: h.textContent, alvo: cab };
    },
    tudo: { por: function(bt){ document.querySelector('.filtro .esp').after(bt); }, abrir: 'Abrir todas', recolher: 'Recolher todas', longo: ' as partes' }
  });
  // Ir a um tópico (índice ao lado, busca, link com #T07): a parte dele abre
  function abrirPara(id){ var alvo = id && document.getElementById(id); if (alvo) rc.abrirPara(alvo); }
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
  Recolher.fixar({
    raiz: corpo, chave: Memoria.chave('aulas-fixadas'), faixa: faixa, destino: faixa.querySelector('ul'),
    itens: function(){ return [].slice.call(corpo.querySelectorAll('.parte:not(.rc-fixados) .linhas>li')); },
    cod: function(li){ return li.id; },
    rotulo: function(t){ return t + ', ' + tituloDe(document.getElementById(t)); },
    colocar: function(li, pino){ li.appendChild(pino); },
    // a cópia leva o pino do original; sem id, sem o percentual e com o código como link para o tópico na lista
    copia: function(li, t){
      var c = li.cloneNode(true);
      c.removeAttribute('id'); c.dataset.t = t;
      c.querySelectorAll('[data-aula]').forEach(function(x){ x.removeAttribute('data-aula'); });
      c.querySelectorAll('.pct, .ver').forEach(function(x){ x.remove(); });
      var cod = c.querySelector('.cod'), a = document.createElement('a'); a.href = '#' + t; a.className = 'cod'; a.textContent = t; a.title = 'Ir ao ' + t + ' na lista';
      cod.replaceWith(a);
      return c;
    },
    depois: function(fixados){ corpo.querySelectorAll('.linhas>li[id]').forEach(function(li){ li.classList.toggle('rc-fixo', fixados.indexOf(li.id) >= 0); }); }
  });
})();
// Imprimir o tópico (13/11/2026): o menu fecha com um clique fora, com Esc e quando outro abre.
(function(){var ms=[].slice.call(document.querySelectorAll('details.imp-top'));if(!ms.length)return;
  function fechar(exceto){ms.forEach(function(m){if(m!==exceto)m.open=false})}
  ms.forEach(function(m){m.addEventListener('toggle',function(){if(m.open)fechar(m)})});
  document.addEventListener('click',function(e){if(!e.target.closest('details.imp-top'))fechar()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var a=ms.filter(function(m){return m.open})[0];if(a){fechar();a.querySelector('summary').focus()}}});
})();
