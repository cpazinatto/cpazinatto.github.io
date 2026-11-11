// Busca com tags (decisão 28, 11/11/2026; planejamento em docs/planejamento-busca.md). Sem biblioteca de fora: funciona
// sem internet e com a saida/ aberta do disco. O índice (recursos/busca-indice-*.js, de tema/indice_busca.py) só é carregado
// ao abrir a busca, para não pesar na aula.
// Nas páginas de entrada, a caixa fica no lugar de <div class="busca-entrada">; nas aulas, listas e módulos, a tecla / e
// o botão "Buscar (/)" abrem a mesma busca por cima da página, e Esc fecha. ?busca=... no endereço abre já buscando.
(function(){
  var eu=document.currentScript,RAIZ=eu.src.replace(/recursos\/busca\.js(\?.*)?$/,''),raiz=document.documentElement;
  var PESO={k:4,s:4,h:3,o:5,b:2,w:1},PESO_O=5,CAMPOS=['k','s','h','o','b','w'];  // o: marcador, peso real na busca
  var PARADAS={};'a o e as os de da do das dos em no na nos nas um uma uns umas para por com que se ao aos the of'.split(' ').forEach(function(w){PARADAS[w]=1});
  // Tags que filtram (uma de cada grupo, se escolhidas; dentro do grupo, qualquer uma). Os valores são os de "k" no índice.
  var GRUPOS=[['Material',[['aula','Aula'],['lista','Lista'],['revisao','Revisão da base'],['demonstracao','Demonstração']]],
    ['Conteúdo',[['secao','Seção'],['definicao','Definição'],['teorema','Teorema'],['exemplo','Exemplo'],['sua vez','Sua vez'],['exercicio','Exercício'],['atencao','Atenção']]],
    ['Parte',[['base','Base'],['limites','Limites'],['derivadas','Derivadas'],['integrais','Integrais']]]];
  var POR_PAGINA=5,MAXIMO=40,GRUPOS_VISTOS=GRUPOS;
  // Etiquetas de cada resultado (11/11/2026, pedido do professor): de onde ele é e o que ele é, na ordem e na cor do tema.
  // A primeira diz o material (Aula, Seção da aula, Lista, Revisão da base, Demonstração); as outras, o conteúdo e o nível.
  var ETIQUETAS=[['em breve','Em breve','tipo'],['secao','Seção da aula','tipo'],['aula','Aula','tipo'],['lista','Lista','tipo'],['revisao','Revisão da base','tipo'],
    ['demonstracao','Demonstração','tipo'],['definicao','Definição','de'],['teorema','Teorema','de'],['exemplo','Exemplo','ex'],
    ['sua vez','Sua vez','sv'],['exercicio','Exercício','sv'],['desafio','Desafio','sv'],['onde esta o erro','Onde está o erro','at'],
    ['atencao','Atenção','at'],['retomada','Retomada','re'],['gancho','Gancho','ga'],
    ['mecanica','Mecânica','nv'],['interpretacao','Interpretação','nv'],['aplicacao','Aplicação','nv']];
  function etiquetas(e){var k=e.k||[],vistas=0,tipo=false;
    return '<span class="b-tags">'+ETIQUETAS.filter(function(t){
      if(k.indexOf(t[0])<0)return false;
      if(t[2]==='tipo'){if(tipo)return false;tipo=true}   // "Seção da aula" no lugar de "Aula"
      return ++vistas<=5}).map(function(t){return '<i class="b-tag b-'+t[2]+(t[0]==='em breve'?' b-breve':'')+'">'+t[1]+'</i>'}).join('')+'</span>'}
  var LUPA='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>';

  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\/∞]+/g,' ').trim()}
  function esc(s){return (s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // Índice em três partes (11/11/2026): busca-indice-EE.js, -EQ.js e -comum.js (módulos e tags de conceito). Só se carrega
  // o que o curso guardado pede (com Química, a Química e o comum), e só ao abrir a busca; trocar o curso carrega o que faltar.
  // Várias fontes (11/11/2026, página das disciplinas): <div class="busca-entrada" data-fontes='[{"nome":"Cálculo I",
  // "raiz":"../calculo-i/"}]'> busca no índice de cada disciplina, e o nome dela vai à frente da página no resultado.
  // Sem data-fontes, a fonte é o próprio site, onde está este busca.js. Os arquivos vêm um de cada vez: cada um se grava em
  // window.BUSCA_PARTES com o nome da parte, que é o mesmo em todas as disciplinas.
  // O vocabulário liga cada palavra às entradas (número da entrada × 8 + peso do campo).
  var FONTES=[{nome:'',raiz:RAIZ}],DADOS=[{}],E=null,VOC=null,PRONTAS='',espera=[],fila=[],baixando=false;
  function partes(){var c=raiz.dataset.curso||'';return c==='EE'||c==='EQ'?[c,'comum']:['EE','EQ','comum']}
  function faltam(){var l=[];FONTES.forEach(function(f,i){partes().forEach(function(n){if(!DADOS[i][n])l.push([i,n])})});return l}
  function soPalavras(t){var vistas={};return norm(t).split(' ').filter(function(w){if(!w||PARADAS[w]||vistas[w])return false;return vistas[w]=1}).join(' ')}
  function absorver(i){var P=window.BUSCA_PARTES||{};Object.keys(P).forEach(function(n){DADOS[i][n]=P[n];delete P[n]})}
  function chave(){return DADOS.map(function(d){return Object.keys(d).sort().join()}).join('|')}
  function preparar(){E=[];
    FONTES.forEach(function(f,fi){var D=DADOS[fi],O=(D.comum&&D.comum.o)||{},nome=f.nome||'';
      ['EE','EQ','comum'].forEach(function(n){var d=D[n];if(!d)return;
        d.e.forEach(function(e){
          if(!e.pronto){e.p=(nome?nome+' · ':'')+d.p[e.p];if(e.k)e.k=e.k.map(function(i){return d.g[i]});if(n!=='comum')e.c=n;
            e.h=(soPalavras(e.t)+(e.hs?' '+e.hs:'')).trim();e.href=f.raiz+e.u;e.fi=fi;e.pronto=1}
          e.oo=O[e.d];E.push(e)})})});
    PRONTAS=chave();VOC=new Map();
    E.forEach(function(e,i){CAMPOS.forEach(function(c){var v=c==='o'?e.oo:e[c];if(!v)return;
      (c==='k'?v.join(' '):v).split(' ').forEach(function(w){if(!w)return;var l=VOC.get(w);if(!l)VOC.set(w,l=[]);l.push(i*8+PESO[c])})})})}
  function terminar(){if(faltam().length)return;if(chave()!==PRONTAS)preparar();var fs=espera;espera=[];fs.forEach(function(g){g()})}
  function baixar(){if(baixando||!fila.length)return;baixando=true;var a=fila.shift(),fi=a[0],n=a[1];
    if(DADOS[fi][n]){baixando=false;baixar();return}
    var s=document.createElement('script');s.src=FONTES[fi].raiz+'recursos/busca-indice-'+n+'.js?t='+Math.floor(Date.now()/6e5);
    function pronto(){absorver(fi);if(!DADOS[fi][n])DADOS[fi][n]={p:[],g:[],e:[]};baixando=false;terminar();baixar()}
    s.onload=pronto;s.onerror=pronto;document.head.appendChild(s)}
  function carregar(f){
    if(FONTES.length===1&&window.BUSCA_PARTES)absorver(0);   // índice já na página (tema/conferir_busca.py)
    var l=faltam();
    if(!l.length){if(chave()!==PRONTAS)preparar();f();return}
    espera.push(f);
    l.forEach(function(a){if(!fila.some(function(b){return b[0]===a[0]&&b[1]===a[1]}))fila.push(a)});baixar();
  }

  // Distância de edição com troca de vizinhas (Damerau restrita), parando cedo quando passa do limite.
  function distancia(a,b,max){
    if(Math.abs(a.length-b.length)>max)return max+1;
    var d=[],i,j;for(i=0;i<=a.length;i++){d[i]=[i]}for(j=0;j<=b.length;j++)d[0][j]=j;
    for(i=1;i<=a.length;i++){var menor=max+1;for(j=1;j<=b.length;j++){
      var c=a[i-1]===b[j-1]?0:1,v=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,d[i-2][j-2]+1);
      d[i][j]=v;if(v<menor)menor=v}
      if(menor>max)return max+1}
    return d[a.length][b.length];
  }
  // Nota de uma palavra do índice para uma palavra buscada (seção 3 do planejamento).
  function nota(t,w){
    if(w===t)return 1;
    if(t.length>=2&&w.lastIndexOf(t,0)===0)return .8;
    if(t.length<=3)return 0;
    if(w.indexOf(t)>=0)return .6;
    var max=t.length>=8?2:1,d=distancia(t,w,max);
    if(d<=max)return d===1?.5:.35;
    if(w.length>t.length&&distancia(t,w.slice(0,t.length),max)<=max)return .4;
    return 0;
  }
  // Símbolos digitados viram palavras (11/11/2026): ∫ é "integral", √ "raiz", ∑ "somatório", π "pi", e f' ou y′ (o
  // apóstrofo logo depois de uma letra, sem outra letra em seguida, como em L'Hospital) é "derivada"; f'' é "segunda derivada".
  function simbolos(q){return (q||'').replace(/∫/g,' integral ').replace(/√/g,' raiz ').replace(/[∑Σ]/g,' somatorio ').replace(/π/g,' pi ')
    .replace(/([A-Za-z])(?:''|′′|″)(?![A-Za-z])/g,'$1 segunda derivada ').replace(/([A-Za-z])['′](?![A-Za-z])/g,'$1 derivada ')}
  // Palavras de parada e letras soltas (o "f" e o "x" de f'(x)) saem, como no índice, a não ser que não sobre nada.
  function palavrasDe(q){var ts=norm(simbolos(q)).split(' ').filter(Boolean),sem=ts.filter(function(t){return !PARADAS[t]&&!/^[a-z]$/.test(t)});return sem.length?sem:ts}

  function buscar(q,tags){
    var ts=palavrasDe(q),curso=raiz.dataset.curso||'',achadas={};
    // A tag "@N" é a do grupo Disciplina: a entrada é da fonte N.
    function passa(e){if(curso&&e.c&&e.c!==curso)return false;
      return GRUPOS_VISTOS.every(function(g){var sel=g[1].filter(function(o){return tags[o[0]]});
        return !sel.length||sel.some(function(o){return o[0][0]==='@'?e.fi===+o[0].slice(1):e.k&&e.k.indexOf(o[0])>=0})})}
    var res=[];
    if(!ts.length){E.forEach(function(e,i){if(passa(e))res.push({i:i,n:0})});return {r:res,m:achadas}}
    var total=null;
    // Por palavra buscada: a melhor nota nos campos da própria entrada, mais 40% da nota nas tags de conceito do tópico.
    // As de conceito valem para o tópico inteiro: somadas, desempatam a favor do tópico; sozinhas, ficam abaixo de
    // qualquer quadro que traga a palavra no texto ("conjugado" leva antes aos quadros do conjugado que ao "Nesta seção").
    // Palavra curta que existe tal como foi digitada ("int", "lim", "mmc") vale só igual, não como começo de outra
    // ("int" não acha "interpretação").
    ts.forEach(function(t){var proprio=new Map(),topico=new Map(),por=new Map(),exata=t.length<=3&&VOC.has(t);
      VOC.forEach(function(l,w){if(exata&&w!==t)return;var n=nota(t,w);if(!n)return;achadas[w]=1;
        for(var k=0;k<l.length;k++){var i=l[k]>>3,p=l[k]&7,m=p===PESO_O?topico:proprio,v=n*(m===topico?2:p);if(!(m.get(i)>=v))m.set(i,v)}});
      proprio.forEach(function(v,i){por.set(i,v+.4*(topico.get(i)||0))});
      topico.forEach(function(v,i){if(!proprio.has(i))por.set(i,.4*v)});
      if(total===null)total=por;else{var junto=new Map();total.forEach(function(v,i){var o=por.get(i);if(o)junto.set(i,v+o)});total=junto}});
    // Palavras na ordem buscada, juntas, valem mais ("teorema fundamental" no título ganha de "teorema" e "fundamental" soltos).
    var frase=ts.length>1?' '+ts.join(' ')+' ':'';
    function junto(v){return v&&(' '+v+' ').indexOf(frase)>=0}
    total.forEach(function(n,i){var e=E[i];if(!passa(e))return;
      if(frase)n+=junto(e.h)||junto(e.k&&e.k.join(' '))?3:junto(e.b)||junto(e.oo)?2:junto(e.w)?1:0;
      res.push({i:i,n:n})});
    res.sort(function(a,b){return b.n-a.n||a.i-b.i});
    return {r:res,m:achadas};
  }

  function marcar(texto,m){return esc(texto).replace(/[\p{L}\p{N}]+/gu,function(w){return m[norm(w)]?'<mark>'+w+'</mark>':w})}
  function mostrar(alvo,q,tags){
    var ts=palavrasDe(q),algum=Object.keys(tags).some(function(k){return tags[k]});
    if(!ts.length&&!algum){alvo.innerHTML='';return}
    var b=buscar(q,tags),grupos=[],por={},n=0;
    for(var k=0;k<b.r.length&&n<MAXIMO;k++){var e=E[b.r[k].i];
      if(!por[e.p]){por[e.p]={p:e.p,c:e.c,l:[]};grupos.push(por[e.p])}
      if(por[e.p].l.length<POR_PAGINA){por[e.p].l.push(e);n++}}
    if(!grupos.length){alvo.innerHTML='<p class="b-nada">Nada encontrado'+(raiz.dataset.curso?' neste curso':'')+'. Tente outra palavra ou tire uma tag.</p>';return}
    alvo.innerHTML='<p class="b-conta">'+(b.r.length>n?'Os '+n+' primeiros de '+b.r.length+' resultados':b.r.length+' resultado'+(b.r.length>1?'s':''))+'</p>'+
      grupos.map(function(g){return '<section class="b-grupo'+(g.c?' c-'+g.c:'')+'"><h4>'+esc(g.p)+'</h4>'+g.l.map(function(e){
        return '<a class="b-item" href="'+esc(e.href)+'">'+etiquetas(e)+'<b>'+marcar(e.t,b.m)+'</b>'+(e.x?'<span>'+marcar(e.x,b.m)+'</span>':'')+'</a>'}).join('')+'</section>'}).join('');
  }

  // A caixa: campo, tags e resultados. Um resultado na mesma página (outro quadro da aula aberta) recarrega no quadro certo.
  function criar(onde,foco){
    var tags={},cx=document.createElement('div');cx.className='busca';
    cx.innerHTML='<div class="b-campo"><input type="search" placeholder="Buscar (/): regra da cadeia, L\'Hospital, ∫ por partes, dy/dx…" aria-label="Buscar no material" autocomplete="off" enterkeyhint="search">'+LUPA+'</div>'+
      // Um grupo de filtros por linha (pedido do professor, 11/11/2026): o nome à esquerda, as opções ao lado.
      '<div class="b-chips">'+GRUPOS_VISTOS.map(function(g){return '<div class="b-linha" role="group" aria-label="'+g[0]+'"><span class="b-gr">'+g[0]+'</span><div class="b-op">'+
        g[1].map(function(o){return '<button type="button" data-tag="'+o[0]+'" aria-pressed="false">'+o[1]+'</button>'}).join('')+'</div></div>'}).join('')+'</div>'+
      '<div class="b-res" aria-live="polite"></div>';
    onde.appendChild(cx);
    var campo=cx.querySelector('input'),res=cx.querySelector('.b-res'),t;
    // Aberta (pedido do professor, 11/11/2026): os filtros e os resultados só aparecem depois de clicar no campo; clicar fora
    // da busca os esconde (o texto e as tags escolhidas ficam, e voltar ao campo os mostra de novo). Por cima da página, a
    // caixa está sempre aberta, e clicar fora fecha a janela inteira (abrir()).
    var sobreposta=!!onde.closest('.busca-caixa');
    function abrirCaixa(){if(!cx.classList.contains('aberta')){cx.classList.add('aberta');agora()}}
    function agora(){
      cx.classList.toggle('ativa',cx.classList.contains('aberta')&&!!(palavrasDe(campo.value).length||Object.keys(tags).some(function(k){return tags[k]})));
      carregar(function(){mostrar(res,campo.value,tags)})}
    // Apagar o campo (à mão, no × ou com Esc) fecha os resultados na hora, sem esperar.
    campo.addEventListener('input',function(){clearTimeout(t);cx.classList.add('aberta');if(!campo.value.trim())agora();else t=setTimeout(agora,120)});
    campo.addEventListener('search',function(){clearTimeout(t);agora()});
    campo.addEventListener('focus',function(){carregar(function(){});abrirCaixa()});
    // O índice começa a vir quando o mouse ou o dedo chega ao campo, antes do clique: a primeira busca já o encontra pronto.
    ['pointerenter','touchstart'].forEach(function(n){campo.addEventListener(n,function(){carregar(function(){})},{once:true,passive:true})});
    if(sobreposta)cx.classList.add('aberta');
    else document.addEventListener('click',function(e){
      if(!cx.contains(e.target)&&cx.classList.contains('aberta')){cx.classList.remove('aberta','ativa')}});
    campo.addEventListener('keydown',function(e){
      // Esc na página de entrada (11/11/2026): com texto, apaga; já vazio, fecha a busca e tira o foco. Por cima da página,
      // o Esc fecha a janela (abrir()).
      if(e.key==='Escape'&&!sobreposta){e.preventDefault();clearTimeout(t);
        if(campo.value){campo.value='';agora()}else{cx.classList.remove('aberta','ativa');campo.blur()}return}
      if(e.key==='Enter'){var a=res.querySelector('a');if(a){e.preventDefault();ir(a)}}
      else if(e.key==='ArrowDown'){var p=res.querySelector('a');if(p){e.preventDefault();p.focus()}}});
    res.addEventListener('keydown',function(e){var as=[].slice.call(res.querySelectorAll('a')),k=as.indexOf(document.activeElement);if(k<0)return;
      if(e.key==='ArrowDown'&&as[k+1]){e.preventDefault();as[k+1].focus()}
      else if(e.key==='ArrowUp'){e.preventDefault();(as[k-1]||campo).focus()}});
    res.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();ir(a)}});
    [].forEach.call(cx.querySelectorAll('[data-tag]'),function(b){b.addEventListener('click',function(){
      tags[b.dataset.tag]=!tags[b.dataset.tag];b.setAttribute('aria-pressed',tags[b.dataset.tag]?'true':'false');agora()})});
    // Trocar o curso (botões da decisão 27) refaz a busca.
    [].forEach.call(document.querySelectorAll('[data-curso-opcao]'),function(b){b.addEventListener('click',function(){setTimeout(agora,0)})});
    var q=new URLSearchParams(location.search).get('busca');if(q){campo.value=q;cx.classList.add('aberta');agora()}
    if(foco)campo.focus();
    return {campo:campo,agora:agora};
  }
  function ir(a){var destino=new URL(a.href,location.href);
    if(destino.pathname===location.pathname&&destino.search===location.search){location.hash=destino.hash;location.reload()}
    else location.href=destino.href}

  // Por cima da página (aulas, listas e módulos).
  var sobre=null,caixa=null;
  function abrir(){
    if(!sobre){sobre=document.createElement('div');sobre.className='busca-sobre';sobre.setAttribute('role','dialog');
      sobre.setAttribute('aria-modal','true');sobre.setAttribute('aria-label','Buscar no material');
      sobre.innerHTML='<div class="busca-caixa"><div class="b-topo"><div><b>Buscar no material</b><small class="b-teclas">Enter abre o primeiro · ↑ ↓ escolhem · Esc volta ao quadro</small></div>'+
        '<button type="button" class="b-fechar">Fechar<span class="b-teclas"> (Esc)</span></button></div></div>';
      document.body.appendChild(sobre);caixa=criar(sobre.querySelector('.busca-caixa'));
      sobre.querySelector('.b-fechar').addEventListener('click',fechar);
      sobre.addEventListener('click',function(e){if(e.target===sobre)fechar()});
      // As teclas dentro da busca não chegam às da aula (setas, espaço, M, T, L, A...).
      sobre.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();fechar()}e.stopPropagation()});
      // Nem os toques: arrastar o dedo dentro da busca (rolar os resultados ou os filtros) não troca o quadro da aula atrás.
      ['touchstart','touchmove','touchend','touchcancel'].forEach(function(n){sobre.addEventListener(n,function(e){e.stopPropagation()},{passive:true})});
    }
    document.body.classList.add('busca-aberta');caixa.campo.focus();caixa.campo.select();
  }
  function fechar(){document.body.classList.remove('busca-aberta');if(document.activeElement)document.activeElement.blur()}

  function iniciar(){
    var entrada=document.querySelector('.busca-entrada');
    if(entrada){
      // Página das disciplinas: as fontes e os grupos de filtro vêm da própria caixa (data-fontes, data-grupos).
      if(entrada.dataset.fontes){try{FONTES=JSON.parse(entrada.dataset.fontes).map(function(f){return {nome:f.nome,raiz:new URL(f.raiz,location.href).href}});
        DADOS=FONTES.map(function(){return {}})}catch(e){}}
      if(entrada.dataset.grupos){var gs=entrada.dataset.grupos.split(',');GRUPOS_VISTOS=GRUPOS.filter(function(g){return gs.indexOf(g[0])>=0})}
      // Grupo Disciplina (pedido do professor, 11/11/2026), o primeiro, com uma opção por fonte.
      if(entrada.dataset.fontes)GRUPOS_VISTOS=[['Disciplina',FONTES.map(function(f,i){return ['@'+i,f.nome]})]].concat(GRUPOS_VISTOS);
      var cx=criar(entrada);
      // A tecla / também nas páginas de entrada: leva ao campo da busca.
      document.addEventListener('keydown',function(e){
        if(e.key!=='/'||e.metaKey||e.ctrlKey||e.altKey||/^(INPUT|SELECT|TEXTAREA)$/.test((e.target||{}).tagName||''))return;
        e.preventDefault();cx.campo.scrollIntoView({block:'center'});cx.campo.focus()});
      return}
    document.addEventListener('keydown',function(e){
      if(e.key!=='/'||e.metaKey||e.ctrlKey||e.altKey||/^(INPUT|SELECT|TEXTAREA)$/.test((e.target||{}).tagName||''))return;
      e.preventDefault();e.stopPropagation();abrir()},true);
    // Botão "Buscar (/)": no menu dos quadros (aulas) e na barra de cima das listas e dos módulos.
    var ctl=document.querySelector('.ctl:not(.atalhos)'),nav=document.querySelector('header nav, main > nav, nav:not(.barra)');
    [ctl,nav].forEach(function(lugar){if(!lugar)return;var b=document.createElement('button');b.type='button';
      if(lugar===nav)b.className='botao';b.textContent='Buscar (/)';b.addEventListener('click',abrir);lugar.appendChild(b)});
    if(new URLSearchParams(location.search).get('busca'))abrir();
  }
  // Para tema/conferir_busca.py, que roda as buscas de teste fora do navegador.
  window.Busca={buscar:function(q,tags){var r;carregar(function(){r=buscar(q,tags||{})});return r.r.map(function(x){return E[x.i]})}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
