// Barra do topo, comum a todas as páginas (docs/planejamento-barra.md, aprovado em 13/11/2026): painel de aparência, painel
// "Ir para" (tecla S; docs/planejamento-navegacao.md) e Backspace, que sobe ao nível de cima do caminho. Vem antes do tema.js
// nas aulas, nas listas e nos módulos, que usam window.IrPara (07b-ir-para.js: seção atual, fechar o visor, roda).
(function(){
  var raiz=document.documentElement;
  function campo(e){var t=e.target||{};return /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName||'')||t.isContentEditable}

  // Painel de aparência (de entrada.js, 12/11/2026): abre pelo botão, fecha com clique fora ou Esc.
  var bA=document.getElementById('bAparencia'),pA=document.getElementById('aparencia');
  function aparencia(v){if(!pA)return;pA.hidden=!v;bA.setAttribute('aria-expanded',v?'true':'false')}
  if(bA&&pA){bA.onclick=function(e){e.stopPropagation();aparencia(pA.hidden)};
    document.addEventListener('click',function(e){if(!pA.hidden&&!pA.contains(e.target))aparencia(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pA.hidden){aparencia(false);bA.focus()}})}

  // Caminho que não cabe (14/11/2026, professor: "está cortando o breadcrumb"): primeiro os botões ficam só com o ícone (.compacta);
  // depois o caminho perde os níveis do começo, um a um, com o separador (.c-fora). O lugar onde se está fica inteiro enquanto houver
  // nível para tirar. Medido ao abrir (depois das fontes), ao mudar a largura e ao trocar a letra ou o tamanho.
  var topo=document.querySelector('header.topo'),cam=topo&&topo.querySelector('.caminho'),lin=topo&&topo.querySelector('.lin');
  // Não cabe: o caminho ou a linha passam da largura, ou o lugar onde se está (que encolhe antes dos outros itens) foi cortado.
  function naoCabe(){var cur=cam.querySelector('[aria-current]');
    return cam.scrollWidth>cam.clientWidth+1||lin.scrollWidth>lin.clientWidth+1||(!!cur&&cur.scrollWidth>cur.clientWidth+1)}
  function ajustarCaminho(){if(!cam||getComputedStyle(cam).display==='none')return;
    topo.classList.remove('compacta','sem-portas');[].forEach.call(cam.children,function(x){x.classList.remove('c-fora')});
    if(!naoCabe())return;topo.classList.add('compacta');
    var itens=[].slice.call(cam.children);
    for(var k=0;k<itens.length-1&&naoCabe();k+=2){itens[k].classList.add('c-fora');if(itens[k+1]&&k+1<itens.length-1)itens[k+1].classList.add('c-fora')}
    // Por último, as portas saem da barra (seguem no "Ir para").
    if(naoCabe())topo.classList.add('sem-portas')}
  // Margem do salto (#q3, #T14) abaixo da barra presa no alto (não na aula, onde ela fica por cima e some).
  if(topo&&!topo.classList.contains('sobre'))document.documentElement.style.scrollPaddingTop=(topo.offsetHeight+16)+'px';
  if(cam){var tc;addEventListener('resize',function(){clearTimeout(tc);tc=setTimeout(function(){ajustarCaminho();if(aberto())arrumar()},80)});
    document.addEventListener('preferencias',function(){requestAnimationFrame(ajustarCaminho)});
    ajustarCaminho();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ajustarCaminho)}

  // "Ir para": o conteúdo vem montado no <template id="ir-para"> (construir.py) e é posto na página já na abertura, escondido:
  // assim o 09-curso.js acerta os links de tópico e o clique nos links "#q3" da lista passa pelo 06-listas.js (abre a questão recolhida).
  var veu=null,painel=null,volta=null,aoAbrir=[],aoInterno=[];
  var tp=document.getElementById('ir-para');
  if(tp){
    veu=document.createElement('div');veu.className='ip-veu';veu.hidden=true;
    veu.innerHTML='<div class="ip" role="dialog" aria-modal="true" aria-labelledby="ip-tit"><header><h2 id="ip-tit">Ir para</h2><kbd>S</kbd>'+
      '<button type="button" class="ip-fechar" aria-label="Fechar (Esc)" title="Fechar (Esc)">✕</button></header><div class="ip-corpo"></div>'+
      '<p class="ip-dica"><kbd>↑</kbd> <kbd>↓</kbd> andam pelos itens · <kbd>Enter</kbd> abre · <kbd>Esc</kbd> fecha</p></div>';
    painel=veu.querySelector('.ip');veu.querySelector('.ip-corpo').appendChild(tp.content.cloneNode(true));
    document.body.appendChild(veu);
    veu.addEventListener('click',function(e){if(e.target===veu){fechar();return}
      var a=e.target.closest('a[href]');if(!a)return;
      // Link para a própria página (#s2, #q3, #revisao): fecha o painel (e o visor, na lista) e deixa o navegador seguir.
      if(a.getAttribute('href').charAt(0)==='#'){fechar(true);aoInterno.forEach(function(f){f(a)})}});
    veu.querySelector('.ip-fechar').onclick=function(){fechar()};
    // "Continuar de onde parou" nas páginas de entrada: a última aula aberta neste navegador (tema.js grava em <disc>-ultima).
    var cont=painel.querySelector('.ip-continuar');
    if(cont&&window.Memoria){var u=Memoria.lerJSON(Memoria.chave('ultima'),null);
      if(u&&u.u){var a=document.createElement('a');a.className='ip-it';a.href=u.u+'#'+(u.h||'');
        a.innerHTML='<span class="ip-tag">'+(u.cod||'›')+'</span><span class="ip-t"></span>';
        a.querySelector('.ip-t').textContent=u.tit||u.cod;var s=document.createElement('small');s.textContent=(u.sec?u.sec+' · ':'')+(u.n?'quadro '+u.n:'abertura');
        a.querySelector('.ip-t').appendChild(s);cont.appendChild(a)}else cont.remove()}
    // Questões feitas: a grade da lista e a linha da lista na aula, lidas do navegador ao abrir.
    aoAbrir.push(function(){if(!window.Memoria)return;
      var aqui=Memoria.chave('feita')+':'+location.pathname.split('/').slice(-2).join('/').replace(/\.html$/,''),feitas=Memoria.lerJSON(aqui,{});
      [].forEach.call(painel.querySelectorAll('.ip-grade a[data-q]'),function(a){a.classList.toggle('feita',!!feitas[a.dataset.q])});
      [].forEach.call(painel.querySelectorAll('[data-feitas]'),function(a){var f=Memoria.lerJSON(Memoria.chave('feita')+':'+a.dataset.feitas,{}),
        n=Object.keys(f).filter(function(k){return f[k]}).length,s=a.querySelector('small.ip-feitas');
        if(!s){s=document.createElement('small');s.className='ip-feitas';a.querySelector('.ip-t').appendChild(s)}
        s.textContent=n?n+(n===1?' questão feita':' questões feitas'):'nenhuma questão marcada como feita'})});
  }
  function aberto(){return !!veu&&!veu.hidden}
  function botoes(v){[].forEach.call(document.querySelectorAll('[data-ir-para]'),function(b){b.setAttribute('aria-expanded',v?'true':'false')})}
  // Colunas pela altura: cada seção vai para a coluna mais curta, na ordem do painel (uma grade comum deixava a coluna Portas numa
  // segunda fileira, com espaço vazio embaixo das mais curtas; colunas em fluxo partiam a coluna no Safari). Refeito ao abrir.
  var secoes=veu?[].slice.call(veu.querySelectorAll('.ip-corpo>.ip-col')):[];
  function arrumar(){var corpo=veu.querySelector('.ip-corpo'),n=Math.max(1,Math.min(secoes.length,Math.floor((corpo.clientWidth-32+18)/(240+18))));
    corpo.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))';[].forEach.call(corpo.querySelectorAll('.ip-pilha'),function(p){p.remove()});
    var pilhas=[];for(var k=0;k<n;k++){var p=document.createElement('div');p.className='ip-pilha';corpo.appendChild(p);pilhas.push(p)}
    secoes.forEach(function(s){var menor=pilhas.reduce(function(a,b){return b.offsetHeight<a.offsetHeight?b:a});menor.appendChild(s)})}
  function abrir(){if(!veu)return;aparencia(false);aoAbrir.forEach(function(f){f(painel)});
    volta=document.activeElement;veu.hidden=false;document.body.classList.add('ip-aberto');botoes(true);arrumar();
    var f=painel.querySelector('.ip-it.atual')||painel.querySelector('a[href],input');if(f)f.focus({preventScroll:true})}
  function fechar(seguindo){if(!aberto())return;veu.hidden=true;document.body.classList.remove('ip-aberto');botoes(false);
    if(!seguindo&&volta&&volta.focus&&volta!==document.body)try{volta.focus({preventScroll:true})}catch(e){}else if(document.activeElement)document.activeElement.blur()}
  function alternar(){aberto()?fechar():abrir()}
  [].forEach.call(document.querySelectorAll('[data-ir-para]'),function(b){if(!veu){b.remove();return}b.addEventListener('click',function(e){e.stopPropagation();alternar()})});
  window.IrPara={aberto:aberto,abrir:abrir,fechar:fechar,alternar:alternar,aoAbrir:function(f){aoAbrir.push(f)},aoInterno:function(f){aoInterno.push(f)}};

  // Teclas: S abre e fecha o painel; com ele aberto, as setas andam pelos itens, Tab fica dentro dele e Esc fecha (o tema.js não
  // troca o quadro enquanto IrPara.aberto()). Backspace sobe ao nível de cima do caminho, fora de campos, com o visor fechado e
  // nada aberto; na aula, quem cuida é o tema.js (volta ao tópico em "Aulas e exercícios", o mesmo destino).
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey)return;
    var k=e.key,c=campo(e);
    if(aberto()){
      if(k==='Escape'){e.preventDefault();fechar();return}
      if((k==='s'||k==='S')&&!c){e.preventDefault();fechar();return}
      var fs=[].slice.call(painel.querySelectorAll('a[href],button,input')).filter(function(x){return x.offsetParent!==null}),p=fs.indexOf(document.activeElement);
      if((k==='ArrowDown'||k==='ArrowUp')&&!c){e.preventDefault();var nx=fs[Math.max(0,Math.min(fs.length-1,p+(k==='ArrowDown'?1:-1)))];if(nx)nx.focus()}
      else if(k==='Tab'&&fs.length){if(e.shiftKey&&p<=0){e.preventDefault();fs[fs.length-1].focus()}else if(!e.shiftKey&&p===fs.length-1){e.preventDefault();fs[0].focus()}}
      return}
    if(c||document.body.classList.contains('busca-aberta')||(window.Impressao&&Impressao.aberto()))return;
    if((k==='s'||k==='S')&&veu){e.preventDefault();abrir();return}
    if(k==='Backspace'&&!document.querySelector('main.aula')&&!document.body.classList.contains('visor-aberto')&&(!pA||pA.hidden)){
      var cs=document.querySelectorAll('header.topo .caminho a[href]');if(cs.length){e.preventDefault();location.href=cs[cs.length-1].href}}
  });
})();
