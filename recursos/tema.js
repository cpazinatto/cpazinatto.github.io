// ── tema/js/01-inicio.js: Abertura do tema das aulas, listas e módulos: quadros, seções, pintura do quadro atual, folga dos radicais.
// O tema.js publicado é a junção, na ordem dos números, de tema/js/*.js (publicar_recursos em tema/construir.py); as partes
// compartilham o mesmo escopo (a função aberta em 01 fecha em 08) e não funcionam sozinhas.
// Navegação das aulas. Teclas: setas, espaço, PageUp/PageDown (passador), Home, End.
// M troca claro/escuro, T as cores, L a letra, A o tamanho da letra (tema/preferencias.js), F tela cheia, V visão geral.
// Na aula, I abre o índice retrátil e Backspace ou Esc voltam a "Aulas e exercícios"; nas listas e nos módulos, I volta ao índice.
// Endereço da aula (12/11/2026): #7 é o quadro de rodapé 7; #s2 é a abertura da Seção 2.
// Parâmetros: ?modo=escuro, ?cores=, ?letra=, ?tamanho=, ?conferir.
// Nas animações: + e - mudam o valor (segurar repete), R volta ao valor do passo, 1 a 9 escolhem o controle quando há mais de um.
(function(){
  document.documentElement.classList.add('js');
  var raiz=document.documentElement, qs=[].slice.call(document.querySelectorAll('.quadro'));
  var par=new URLSearchParams(location.search), i=0, passo=1;
  // Lista de exercícios: página que rola; os quadros da resolução abrem por cima dela, um grupo por questão.
  var lista=document.body.classList.contains('pag-lista'),origem=null;
  function aberto(){return !lista||document.body.classList.contains('visor-aberto')}
  // Seção de cada quadro (pelo divisor mais recente) e quantos quadros têm número de rodapé.
  var secDe=[],nomeSec={},secReal={},numerados=0;
  (function(){var s=0;qs.forEach(function(q){
    if(q.classList.contains('divisor')){var t=((q.querySelector('.ses')||{}).textContent||'').trim(),m=t.match(/^Seção (\d+) de \d+: (.*)$/);s=m?+m[1]:s+1;nomeSec[s]=m?m[2]:t;if(m)secReal[s]=1}
    secDe.push(s);if(q.dataset.n)numerados++})})();
  function mesma(k){return !lista||(qs[k]&&qs[k].dataset.q===qs[i].dataset.q)}

  function maxPasso(q){return Math.max.apply(null,[1].concat([].map.call(q.querySelectorAll('[data-passo]'),function(e){return +e.dataset.passo})))}
  function pintar(){
    if(!qs.length)return;
    qs.forEach(function(q,k){q.classList.toggle('ativo',k===i)});
    // data-ate: o elemento some depois desse passo (19/11/2026, T03: o triângulo da inclinação só no passo do seu ponto).
    [].forEach.call(qs[i].querySelectorAll('[data-passo]'),function(e){e.classList.toggle('oculto',+e.dataset.passo>passo||(!!e.dataset.ate&&passo>+e.dataset.ate))});
    ajustarRadicais(qs[i]);ajustarSinais(qs[i]);
    pintarAnimacoes();marcarEscolhido();
    var c=document.getElementById('cont');if(c)c.textContent=lista?(i+1)+' / '+qs.length:qs[i].dataset.n?qs[i].dataset.n+' / '+numerados:'Seção '+secDe[i];
    botoes();
    if(lista)return barraLista();
    try{history.replaceState(null,'','#'+(qs[i].dataset.n||'s'+secDe[i]))}catch(e){}
    vistos[i]=1;pintarProg();marcarIndice();guardarUltima();
  }
  // O Chrome reserva espaço a mais à direita do radical da Luciole Math, e a sobra varia com o ambiente.
  // Mede a sobra real em cada fórmula e desconta só ela: se não houver sobra, nada muda.
  function ajustarRadicais(q){
    [].forEach.call(q.querySelectorAll('msqrt,mroot'),function(m){
      if(m.closest('.lbf'))return;
      m.style.marginInlineEnd='';
      var alvo=m.tagName.toLowerCase()==='mroot'?m.firstElementChild:m,fim=-1e9;
      [].forEach.call(alvo.querySelectorAll('mi,mn,mo,mtext,mfrac'),function(e){var b=e.getBoundingClientRect();if(b.width)fim=Math.max(fim,b.right)});
      if(alvo.matches('mi,mn,mo,mtext'))fim=alvo.getBoundingClientRect().right;
      var total=m.getBoundingClientRect();if(!total.width||fim<0)return;
      var sobra=total.right-fim,fs=parseFloat(getComputedStyle(m).fontSize);
      if(sobra>1)m.style.marginInlineEnd=(-sobra/fs+.04).toFixed(3)+'em';
    });
  }
  // Sinal com nota em cima ou embaixo (L'H e a forma, T19, 19/11/2026) na coluna dos "=" do <conta>: a pilha é mais larga
  // que o "=", que sai do alinhamento; puxa a fórmula para a esquerda até o "=" ficar na coluna dos outros.
  // Linhas seguidas de exemplo que começam por fórmula com sinal (3x²−48 = 0, x² = 16, x = 4): o primeiro sinal de cada uma
  // vai para a mesma vertical, empurrando a linha (20/11/2026, professor: "Ajusta onde falta então também"; os módulos de base
  // não têm o <conta>). Mesmo agrupamento da conferência "iguais desalinhados".
  function alinharLinhas(q){
    var REL=['=','≈','<','>','≤','≥','≠'];
    var sinal=function(c){var m=c.querySelector('math');if(!m)return null;return [].find.call(m.querySelectorAll('mo'),function(x){return REL.indexOf(x.textContent.trim())>=0})||null};
    [].forEach.call(q.querySelectorAll('.bloco.ex,.bloco.ga'),function(b){
      var g=[],grupos=[];
      [].forEach.call(b.children,function(c){
        var ok=c.tagName==='P'&&c.firstChild&&(c.firstChild.nodeName.toLowerCase()==='math'||(c.firstChild.nodeType===3&&!c.firstChild.textContent.trim()&&c.firstElementChild&&c.firstElementChild.tagName.toLowerCase()==='math'&&c.firstElementChild===c.querySelector('*')));
        var s=ok?sinal(c):null;if(s){g.push([c,s])}else{if(g.length>1)grupos.push(g);g=[]}});
      if(g.length>1)grupos.push(g);
      grupos.forEach(function(gr){
        gr.forEach(function(p){p[0].style.paddingInlineStart=''});
        var xs=gr.map(function(p){return p[1].getBoundingClientRect().left});if(xs.some(function(x){return !x}))return;
        var alvo=Math.max.apply(null,xs),esc=b.offsetWidth?b.getBoundingClientRect().width/b.offsetWidth:1;
        gr.forEach(function(p,k){var d=(alvo-xs[k])/esc;if(d>.5)p[0].style.paddingInlineStart=(d/parseFloat(getComputedStyle(p[0]).fontSize)).toFixed(3)+'em'})});
    });
  }
  function ajustarSinais(q){
    alinharLinhas(q);
    // Linha sem sinal (o lado esquerdo da conta, "De onde paramos: lim …") larga demais empurrava a coluna dos "=" para a direita e
    // espremia o resto da conta (19/11/2026, T09). Passando de um quarto da tabela, ela vai para a coluna dos sinais: os "=" de baixo ficam sob o começo dela.
    [].forEach.call(q.querySelectorAll('table.passos-conta'),function(t){
      [].forEach.call(t.querySelectorAll('tr'),function(tr){
        var l=tr.querySelector('td.l'),d=tr.querySelector('td.d');if(!l||!d||d.textContent.trim()||!l.querySelector('math'))return;
        var m=l.querySelector('math'),tw=t.getBoundingClientRect().width;
        if(tw&&m.getBoundingClientRect().width>tw*.25){while(l.firstChild)d.appendChild(l.firstChild)}
      })});
    [].forEach.call(q.querySelectorAll('table.passos-conta td.d'),function(td){
      var m=td.querySelector('math');if(!m)return;m.style.marginInlineStart='';
      var e=m.firstElementChild;while(e&&/^(semantics|mrow|mstyle)$/i.test(e.tagName)&&e.firstElementChild)e=e.firstElementChild;
      if(!e||!/^(munder|mover|munderover)$/i.test(e.tagName))return;
      var base=e.firstElementChild;while(base&&/^(mrow|munder|mover|munderover)$/i.test(base.tagName)&&base.firstElementChild)base=base.firstElementChild;
      if(!base||base.tagName.toLowerCase()!=='mo')return;
      var w=e.getBoundingClientRect().width,wb=base.getBoundingClientRect().width;if(!w||!wb||w-wb<1)return;
      m.style.marginInlineStart=(-(w-wb)/2/parseFloat(getComputedStyle(m).fontSize)).toFixed(3)+'em';
    });
  }
  function ajustarTudo(){
    qs.forEach(function(q){var a=q.classList.contains('ativo');q.classList.add('ativo');ajustarRadicais(q);ajustarSinais(q);if(!a)q.classList.remove('ativo')});
  }
  function ajustarTudoLista(){ajustarTudo();var m=document.querySelector('main');if(lista&&m)ajustarRadicais(m)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ajustarTudoLista);else ajustarTudoLista();
  // Outra letra ou outro tamanho mudam as medidas: refaz depois que a fonte nova carregar.
  document.addEventListener('preferencias',function(){requestAnimationFrame(function(){
    var refazer=function(){ajustarTudoLista();animacoes.forEach(medirValores)};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refazer);else refazer()})});
  var tr;window.addEventListener('resize',function(){clearTimeout(tr);tr=setTimeout(function(){ajustarRadicais(qs[i]);ajustarSinais(qs[i])},150)});

// ── tema/js/02-animacoes.js: Gráficos animados (controles, paradas do passador), sólidos 3D (Three.js) e somas de Riemann.
  // Animações: <grafico> com "controle". O desenho vem pronto no estado do PDF; aqui ele é refeito com os valores do momento.
  // O passador leva, em movimento, até a parada do passo. O mouse arrasta livremente, e o valor fica até a próxima parada.
  var F={sqrt:Math.sqrt,abs:Math.abs,cbrt:Math.cbrt,exp:Math.exp,ln:Math.log,log:Math.log,log10:Math.log10,sen:Math.sin,cos:Math.cos,tan:Math.tan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,arcsen:Math.asin,arccos:Math.acos,arctg:Math.atan,floor:Math.floor,min:Math.min,max:Math.max};
  // soma(n,a,b,termo), prod(j,a,b,fator) e fat(n) (20/11/2026): a montagem traduz soma(n,0,N,T) em F.soma(0,p.N,function($n){return T}).
  // Limites e fatorial arredondados com floor(v+0.5); soma vazia 0, produto vazio 1; as mesmas contas, na mesma ordem, de
  // _soma, _prod e _fat em tema/montagem/10-expressoes.py (mudar um pede mudar o outro). Acima de 1000 termos, corta.
  function inteiro(v){return Math.floor(v+.5)}
  F.soma=function(a,b,f){a=inteiro(a);b=Math.min(inteiro(b),a+999);for(var s=0,n=a;n<=b;n++)s+=f(n);return s};
  F.prod=function(a,b,f){a=inteiro(a);b=Math.min(inteiro(b),a+999);for(var r=1,j=a;j<=b;j++)r*=f(j);return r};
  F.fat=function(v){var n=inteiro(v);if(n<0)return NaN;for(var r=1,k=2;k<=n;k++)r*=k;return r};
  var DURACAO=900;
  function compilar(js){return new Function('x','p','F','return '+js)}
  function escrever(v,casas){var n=+v.toFixed(casas);return String(n===0?0:n).replace('-','−').replace('.',',')}
  function parcela(v,casas){var n=+v.toFixed(casas);return n===0?'':(n>0?' + ':' − ')+escrever(Math.abs(n),casas)}
  function emPi(v){var n=Math.round(v/Math.PI*24);if(!n)return '0';var a=Math.abs(n),b=24,x=a,y=b;while(y){var r=x%y;x=y;y=r}a/=x;b/=x;return (n<0?'−':'')+(a===1?'':a)+'π'+(b===1?'':'/'+b)}
  function misto(v,casas){return Math.abs(v-Math.round(v/Math.PI*24)*Math.PI/24)<1e-3?emPi(v):escrever(v,casas)}
  function forma(c,v,casas){if(c.sograus)return escrever(v*180/Math.PI,casas)+'°';var t=c.pi?(c.misto?misto(v,casas):emPi(v)):escrever(v,casas);return c.graus?t+' rad = '+escrever(v*180/Math.PI,casas)+'°':t}
  // Sólido de revolução (<solido>): Three.js embutido na página. O perfil é uma lista de pontos (raio, altura) girada em torno
  // do eixo y do grupo; no eixo x, o grupo deita. Cores lidas do tema, refeitas quando o modo ou as cores mudam.
  var juntos=[];
  function criarSolido(el,s,an){
    var nada=function(){};
    if(!window.THREE){el.classList.add('sem');return nada}
    var ren;try{ren=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true})}catch(e){el.classList.add('sem');return nada}
    el.appendChild(ren.domElement);ren.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    var T=THREE,cena=new T.Scene(),cam=new T.PerspectiveCamera(30,4/3,0.01,1000),ctl=new T.OrbitControls(cam,ren.domElement);
    ctl.enablePan=false;ctl.enableDamping=false;
    var luz=new T.DirectionalLight(0xffffff,.55);luz.position.set(1,1.4,2);cam.add(luz);cena.add(cam);
    var amb=new T.AmbientLight(0xffffff,.62);cena.add(amb);
    var grupo=new T.Group();if(s.eixo==='x')grupo.rotation.z=-Math.PI/2;cena.add(grupo);
    var ff=compilar(s.f),fg=compilar(s.g),N=96,objs=[],cores={},az=30*Math.PI/180;
    // A varredura começa no plano em que a região aparece como no gráfico: para cima, no eixo x; para a direita da câmera, no eixo y.
    var f0=s.eixo==='x'?-Math.PI/2:az+Math.PI/2;
    function ler(){var cs=getComputedStyle(el),c=function(n){return new T.Color((cs.getPropertyValue(n)||'#888').trim())};
      cores={a:c('--curva-a'),b:c('--curva-b'),apoio:c('--apoio'),texto:c('--texto')}}
    function perfil(p){var A=[],B=[];
      for(var k=0;k<=N;k++){var t=s.de+(s.ate-s.de)*k/N,u=ff(t,p,F),w=fg(t,p,F);
        if(s.tRaio){A.push([t,u]);B.push([t,w])}else{A.push([Math.abs(u),t]);B.push([Math.abs(w),t])}}
      return {F:A,G:B}}
    function v2(l){return l.map(function(q){return new T.Vector2(Math.max(q[0],0),q[1])})}
    function mat(cor,op){return new T.MeshLambertMaterial({color:cor,transparent:op<1,opacity:op,side:T.DoubleSide,depthWrite:op>=1})}
    function torno(pts,ang,cor,op){if(ang<1e-4)return;var g=new T.LatheGeometry(v2(pts),Math.max(3,Math.round(72*ang/(2*Math.PI))),f0,ang);
      var m=new T.Mesh(g,mat(cor,op));m.renderOrder=op<1?2:1;grupo.add(m);objs.push(m)}
    function barra(r0,h0,r1,h1,cor,raio){var sx=Math.sin(f0),cz=Math.cos(f0),a=new T.Vector3(r0*sx,h0,r0*cz),b=new T.Vector3(r1*sx,h1,r1*cz),l=a.distanceTo(b);if(l<1e-6)return;
      var g=new T.CylinderGeometry(raio,raio,l,10),m=new T.Mesh(g,new T.MeshBasicMaterial({color:cor}));
      m.position.copy(a.clone().add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());
      grupo.add(m);objs.push(m)}
    function ponta(r0,h0,r1,h1,cor){var sx=Math.sin(f0),cz=Math.cos(f0),a=new T.Vector3(r0*sx,h0,r0*cz),b=new T.Vector3(r1*sx,h1,r1*cz),l=a.distanceTo(b);
      var m=new T.Mesh(new T.ConeGeometry(l*.42,l,16),new T.MeshBasicMaterial({color:cor}));m.position.copy(a.clone().add(b).multiplyScalar(.5));
      m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());grupo.add(m);objs.push(m)}
    // Nome do eixo: letra em itálico, na fonte e na cor do texto do quadro, sempre de frente para a câmera.
    function rotulo(txt,r,h){var cv=document.createElement('canvas');cv.width=cv.height=128;var cx=cv.getContext('2d'),cs=getComputedStyle(el);
      cx.font='italic 96px '+cs.fontFamily;cx.fillStyle='#'+cores.texto.getHexString();cx.textAlign='center';cx.textBaseline='middle';cx.fillText(txt,64,64);
      var tx=new T.CanvasTexture(cv),sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false,transparent:true}));
      sp.scale.set(vao*.17,vao*.17,1);sp.position.set(r*Math.sin(f0),h,r*Math.cos(f0));sp.renderOrder=5;grupo.add(sp);objs.push(sp)}
    // Medidas do sólido no estado do PDF: enquadramento fixo, que não pula quando o controle muda.
    var p0={};(an.d.controles||[]).forEach(function(c){p0[c.nome]=c.geral});
    var P0=perfil(p0),hs=[],rs=[];P0.F.concat(P0.G).forEach(function(q){rs.push(q[0]);hs.push(q[1])});
    var hmin=Math.min.apply(null,hs.concat([0])),hmax=Math.max.apply(null,hs),rmax=Math.max.apply(null,rs.concat([0.1]));
    var vao=Math.max(hmax-hmin,2*rmax),esp=vao*.012,eps=vao*.012;
    function montar(p){
      objs.forEach(function(o){grupo.remove(o);if(o.geometry)o.geometry.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose()});objs=[];
      var P=perfil(p),ang=s.theta?Math.max(0,Math.min(2*Math.PI,p[s.theta])):2*Math.PI,cheio=ang>2*Math.PI-1e-6;
      var op=s.fatia==='nenhuma'?.45:.22;
      torno(P.F,ang,cores.a,op);torno(P.G,ang,s.temB?cores.b:cores.a,op);
      torno([P.F[0],P.G[0]],ang,cores.a,op);torno([P.F[N],P.G[N]],ang,cores.a,op);
      // A região plana, opaca, no ângulo em que a varredura está.
      if(!cheio){var forma=new T.Shape(v2(P.F.concat(P.G.slice().reverse()))),rg=new T.Mesh(new T.ShapeGeometry(forma),new T.MeshBasicMaterial({color:cores.a,side:T.DoubleSide,transparent:true,opacity:.85}));
        rg.rotation.y=f0+ang-Math.PI/2;grupo.add(rg);objs.push(rg)}
      // Eixo de rotação, tracejado, com seta e nome; o outro eixo do plano da região, fino e sólido, também com seta e nome.
      var h0=hmin-.15*vao,h1=hmax+.15*vao,n=Math.round((h1-h0)/(vao*.05));
      for(var k=0;k<n;k+=2)barra(0,h0+(h1-h0)*k/n,0,h0+(h1-h0)*(k+1)/n,cores.apoio,esp*.8);
      ponta(0,h1,0,h1+vao*.05,cores.apoio);rotulo(s.eixo,0,h1+vao*.13);
      var r1=rmax*1.08+.04*vao,hz=Math.max(hmin,Math.min(hmax,0));
      barra(0,hz,r1,hz,cores.texto,esp*.45);ponta(r1,hz,r1+vao*.05,hz,cores.texto);rotulo(s.eixo==='x'?'y':'x',r1+vao*.13,hz);
      if(s.pos&&s.fatia!=='nenhuma'){var t=p[s.pos],u=ff(t,p,F),w=fg(t,p,F);
        if(s.fatia==='casca'){torno([[t-eps,w],[t+eps,w],[t+eps,u],[t-eps,u],[t-eps,w]],ang,cores.a,1)}
        else{u=Math.abs(u);w=Math.abs(w);var r1=Math.max(u,w),r0=Math.min(u,w);
          torno([[r0,t-eps],[r1,t-eps],[r1,t+eps],[r0,t+eps],[r0,t-eps]],2*Math.PI,cores.a,1);
          // Raios, do eixo até cada curva, no plano que encara a câmera de início.
          barra(0,t+eps*1.6,r1,t+eps*1.6,cores.a,esp*1.3);if(s.fatia==='arruela'&&r0>1e-6)barra(0,t+eps*3.4,r0,t+eps*3.4,cores.b,esp*1.3)}}
      desenhar3()}
    function desenhar3(){ren.render(cena,cam)}
    var feito=false;
    // Distância que enquadra a esfera em volta do sólido (com o eixo), no menor dos dois ângulos de visão, com folga.
    var raioEsf=Math.sqrt(Math.pow((hmax-hmin)/2+.15*vao,2)+rmax*rmax),ultimo=0;
    // Ajuste pela projeção: os cantos da caixa do sólido (com o eixo) têm de caber em 92% da cena; três aproximações bastam.
    function enquadrar(asp){var dir=cam.position.clone().sub(ctl.target).normalize(),d=raioEsf*3,cs=[];
      var R=rmax*1.08+.08*vao;[-R,R].forEach(function(x){[-R,R].forEach(function(z){[hmin-.15*vao,hmax+.2*vao].forEach(function(h){cs.push(grupo.localToWorld(new T.Vector3(x,h,z)))})})});
      for(var it=0;it<4;it++){cam.position.copy(ctl.target).add(dir.clone().multiplyScalar(d));cam.aspect=asp;cam.updateProjectionMatrix();cam.updateMatrixWorld();
        var m=0;cs.forEach(function(c){var q=c.clone().project(cam);m=Math.max(m,Math.abs(q.x),Math.abs(q.y))});d*=m/.92}
      cam.position.copy(ctl.target).add(dir.multiplyScalar(d));ctl.update();ctl.saveState()}
    function tamanho(){var w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;if(!feito){feito=true;montar(an.v)}ren.setSize(w,h,false);cam.aspect=w/h;
      if(Math.abs(cam.aspect-ultimo)>1e-3){ultimo=cam.aspect;enquadrar(cam.aspect)}cam.updateProjectionMatrix();desenhar3()}
    // Vista de três quartos: azimute de 30°, elevação de 20°, à distância que enquadra o sólido.
    var alvo=new T.Vector3(0,(hmin+hmax)/2,0);grupo.updateMatrixWorld();grupo.localToWorld(alvo);
    var dist=vao*2.3,el2=20*Math.PI/180;
    cam.position.set(alvo.x+dist*Math.cos(el2)*Math.sin(az),alvo.y+dist*Math.sin(el2),alvo.z+dist*Math.cos(el2)*Math.cos(az));
    ctl.target.copy(alvo);ctl.update();ctl.saveState();
    var eu={cam:cam,ctl:ctl,q:el.closest('.quadro'),des:desenhar3,junto:s.junto},copiando=false;juntos.push(eu);
    ctl.addEventListener('change',function(){desenhar3();if(!s.junto||copiando)return;
      juntos.forEach(function(o){if(o===eu||!o.junto||o.q!==eu.q)return;copiando=true;o.cam.position.copy(cam.position);o.ctl.target.copy(ctl.target);o.ctl.update();o.des();copiando=false})});
    ren.domElement.addEventListener('dblclick',function(){ctl.reset()});
    ler();
    if(window.ResizeObserver)new ResizeObserver(tamanho).observe(el);
    new MutationObserver(function(){ler();montar(an.v)}).observe(document.documentElement,{attributes:true});
    setTimeout(tamanho,0);
    return function(p){if(!el.clientWidth)return;feito=true;montar(p);tamanho()};
  }
  // Superfície z = f(x, y) (<superficie>, 16/11/2026): malha de 60 × 60 calculada a cada mudança de controle, com as linhas da
  // grade por cima, cortada em cima e embaixo pela janela z; eixos com seta e nome no canto da caixa; cortes (plano x ou y
  // constante) destacados na cor b, com o plano translúcido. O grupo deita (rotação em x) para o z ficar para cima.
  function criarSuperficie(el,s,an){
    var nada=function(){};
    if(!window.THREE){el.classList.add('sem');return nada}
    var ren;try{ren=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true})}catch(e){el.classList.add('sem');return nada}
    el.appendChild(ren.domElement);ren.setPixelRatio(Math.min(2,window.devicePixelRatio||1));ren.localClippingEnabled=true;
    var T=THREE,cena=new T.Scene(),cam=new T.PerspectiveCamera(30,4/3,0.01,1000),ctl=new T.OrbitControls(cam,ren.domElement);
    ctl.enablePan=false;ctl.enableDamping=false;
    var luz=new T.DirectionalLight(0xffffff,.55);luz.position.set(1,1.4,2);cam.add(luz);cena.add(cam);cena.add(new T.AmbientLight(0xffffff,.62));
    var grupo=new T.Group();grupo.rotation.x=-Math.PI/2;cena.add(grupo);
    var N=60,objs=[],cores={},fs={};Object.keys(s.fs).forEach(function(k){fs[k]=compilar(s.fs[k])});
    var x0=s.x[0],x1=s.x[1],y0=s.y[0],y1=s.y[1],z0=s.z[0],z1=s.z[1];
    // Caixa de 2 de largura no maior lado do plano; a altura, 1,4 (ou na escala real, com proporcao="real").
    var k=2/Math.max(x1-x0,y1-y0),kz=s.real?k:1.4/Math.max(z1-z0,1e-9),cx=(x0+x1)/2,cy=(y0+y1)/2,H=(z1-z0)*kz;
    function L(x,y,z){return new T.Vector3((x-cx)*k,(y-cy)*k,(z-z0)*kz-H/2)}
    var corteC=[new T.Plane(new T.Vector3(0,-1,0),H/2+1e-4),new T.Plane(new T.Vector3(0,1,0),H/2+1e-4)];
    var vao=Math.max(2,H),esp=vao*.012;
    function ler(){var cs=getComputedStyle(el),c=function(n){return new T.Color((cs.getPropertyValue(n)||'#888').trim())};
      cores={a:c('--curva-a'),b:c('--curva-b'),c:c('--gancho'),apoio:c('--apoio'),texto:c('--texto')}}
    function z(f,x,y,p){var q=Object.assign({},p);q.y=y;var v=f(x,q,F);return isFinite(v)?v:1e6}
    function por(o){grupo.add(o);objs.push(o)}
    function malha(f,cor,p){var pos=[],idx=[],lin=[];
      for(var i=0;i<=N;i++)for(var j=0;j<=N;j++){var x=x0+(x1-x0)*i/N,y=y0+(y1-y0)*j/N,v=L(x,y,z(f,x,y,p));pos.push(v.x,v.y,v.z)}
      for(i=0;i<N;i++)for(j=0;j<N;j++){var a=i*(N+1)+j,b=a+N+1;idx.push(a,b,a+1,b,b+1,a+1)}
      var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
      por(new T.Mesh(g,new T.MeshLambertMaterial({color:cor,side:T.DoubleSide,transparent:true,opacity:.82,clippingPlanes:corteC})));
      // Linhas da grade: 12 em cada direção, finas, na cor de apoio.
      var passo=N/12;for(i=0;i<=N;i+=passo)for(j=0;j<N;j++){var e=i*(N+1)+j,e2=j*(N+1)+i,e3=(j+1)*(N+1)+i;
        lin.push(pos[3*e],pos[3*e+1],pos[3*e+2],pos[3*e+3],pos[3*e+4],pos[3*e+5]);
        lin.push(pos[3*e2],pos[3*e2+1],pos[3*e2+2],pos[3*e3],pos[3*e3+1],pos[3*e3+2])}
      var gl=new T.BufferGeometry();gl.setAttribute('position',new T.Float32BufferAttribute(lin,3));
      por(new T.LineSegments(gl,new T.LineBasicMaterial({color:cores.texto,transparent:true,opacity:.28,clippingPlanes:corteC})))}
    function barra(a,b,cor,raio,clip){var l=a.distanceTo(b);if(l<1e-6)return;
      var m=new T.Mesh(new T.CylinderGeometry(raio,raio,l,10),new T.MeshBasicMaterial({color:cor,clippingPlanes:clip?corteC:[]}));
      m.position.copy(a.clone().add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());por(m)}
    function ponta(a,b,cor){var l=a.distanceTo(b),m=new T.Mesh(new T.ConeGeometry(l*.42,l,16),new T.MeshBasicMaterial({color:cor}));
      m.position.copy(a.clone().add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());por(m)}
    function rotulo(txt,v){var cv=document.createElement('canvas');cv.width=cv.height=128;var cx2=cv.getContext('2d'),cs=getComputedStyle(el);
      cx2.font='italic 96px '+cs.fontFamily;cx2.fillStyle='#'+cores.texto.getHexString();cx2.textAlign='center';cx2.textBaseline='middle';cx2.fillText(txt,64,64);
      var sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),depthTest:false,transparent:true}));
      sp.scale.set(vao*.13,vao*.13,1);sp.position.copy(v);sp.renderOrder=5;por(sp)}
    function eixo(a,b,nome,dir){barra(a,b,cores.texto,esp*.45);var c=b.clone().add(dir.clone().multiplyScalar(vao*.06));ponta(b,c,cores.texto);rotulo(nome,c.clone().add(dir.clone().multiplyScalar(vao*.08)))}
    function montar(p){
      objs.forEach(function(o){grupo.remove(o);if(o.geometry)o.geometry.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose()});objs=[];
      Object.keys(fs).forEach(function(c){malha(fs[c],cores[c],p)});
      // Eixos no canto (x0, y0, z da base) e o contorno da base, fino.
      var o=L(x0,y0,z0),ex=new T.Vector3(1,0,0),ey=new T.Vector3(0,1,0),ez=new T.Vector3(0,0,1);
      eixo(o,L(x1,y0,z0),s.nomes[0],ex);eixo(o,L(x0,y1,z0),s.nomes[1],ey);eixo(o,L(x0,y0,z1),s.nomes[2],ez);
      [[L(x1,y0,z0),L(x1,y1,z0)],[L(x0,y1,z0),L(x1,y1,z0)]].forEach(function(q){barra(q[0],q[1],cores.apoio,esp*.3)});
      // Cortes: a curva da superfície no plano, grossa, na cor b, e o plano translúcido.
      (s.cortes||[]).forEach(function(c){var f=fs[c.fn]||fs.a,v=compilar(c.v)(0,p,F),pts=[];
        for(var i=0;i<=N;i++){var t=(c.eixo==='y'?x0+(x1-x0)*i/N:y0+(y1-y0)*i/N),x=c.eixo==='y'?t:v,y=c.eixo==='y'?v:t;pts.push(L(x,y,z(f,x,y,p)))}
        for(i=0;i<N;i++)barra(pts[i],pts[i+1],cores.b,esp*1.5,true);
        var A=c.eixo==='y'?[L(x0,v,z0),L(x1,v,z0),L(x1,v,z1),L(x0,v,z1)]:[L(v,y0,z0),L(v,y1,z0),L(v,y1,z1),L(v,y0,z1)];
        var g=new T.BufferGeometry().setFromPoints([A[0],A[1],A[2],A[0],A[2],A[3]]);
        var pl=new T.Mesh(g,new T.MeshBasicMaterial({color:cores.b,side:T.DoubleSide,transparent:true,opacity:.14,depthWrite:false}));pl.renderOrder=3;por(pl)});
      desenhar3()}
    function desenhar3(){ren.render(cena,cam)}
    var feito=false,ultimo=0;
    grupo.updateMatrixWorld();var alvo=new T.Vector3(0,0,0);
    function enquadrar(asp){var dir=cam.position.clone().sub(ctl.target).normalize(),d=vao*3,cs=[];
      [x0-.15*(x1-x0),x1+.15*(x1-x0)].forEach(function(x){[y0-.15*(y1-y0),y1+.15*(y1-y0)].forEach(function(y){[z0,z1+.15*(z1-z0)].forEach(function(zz){cs.push(grupo.localToWorld(L(x,y,zz)))})})});
      for(var it=0;it<4;it++){cam.position.copy(ctl.target).add(dir.clone().multiplyScalar(d));cam.aspect=asp;cam.updateProjectionMatrix();cam.updateMatrixWorld();
        var m=0;cs.forEach(function(c){var q=c.clone().project(cam);m=Math.max(m,Math.abs(q.x),Math.abs(q.y))});d*=m/.92}
      cam.position.copy(ctl.target).add(dir.multiplyScalar(d));ctl.update();ctl.saveState()}
    function tamanho(){var w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;if(!feito){feito=true;montar(an.v)}ren.setSize(w,h,false);cam.aspect=w/h;
      if(Math.abs(cam.aspect-ultimo)>1e-3){ultimo=cam.aspect;enquadrar(cam.aspect)}cam.updateProjectionMatrix();desenhar3()}
    // Vista como nos livros: x vindo para a frente e para a esquerda, y para a direita, z para cima. A câmera fica do lado de x
    // e y positivos, acima; o grupo deita, então (x, y, z) do grupo é (x, z, −y) no mundo.
    var dl=new T.Vector3(1,.45,.6).normalize();
    cam.position.set(4*dl.x,4*dl.z,-4*dl.y);
    ctl.target.copy(alvo);ctl.update();ctl.saveState();
    var eu={cam:cam,ctl:ctl,q:el.closest('.quadro'),des:desenhar3,junto:s.junto},copiando=false;juntos.push(eu);
    ctl.addEventListener('change',function(){desenhar3();if(!s.junto||copiando)return;
      juntos.forEach(function(o){if(o===eu||!o.junto||o.q!==eu.q)return;copiando=true;o.cam.position.copy(cam.position);o.ctl.target.copy(ctl.target);o.ctl.update();o.des();copiando=false})});
    ren.domElement.addEventListener('dblclick',function(){ctl.reset()});
    ler();
    if(window.ResizeObserver)new ResizeObserver(tamanho).observe(el);
    new MutationObserver(function(){ler();montar(an.v)}).observe(document.documentElement,{attributes:true});
    setTimeout(tamanho,0);
    return function(p){if(!el.clientWidth)return;feito=true;montar(p);tamanho()};
  }
  // Faixas de uma soma de Riemann: [esquerda, largura, c, f(c)]. No modo tvm, c é o ponto do TVM da primitiva G na faixa (bisseção).
  function faixas(f,G,modo,a0,b0,nn,p){var n=Math.max(1,Math.round(nn)),h=(b0-a0)/n,l=[];
    for(var k=0;k<n;k++){var e=a0+k*h,c;
      if(modo==='tvm'){var alt=(G(e+h,p,F)-G(e,p,F))/h,g=function(x){return f(x,p,F)-alt},a=e,b=e+h;
        if(g(a)*g(b)>0)c=e+h/2;else{for(var i=0;i<50;i++){var m=(a+b)/2;if(g(a)*g(m)>0)a=m;else b=m}c=(a+b)/2}}
      else c=e+{esq:0,dir:1,meio:.5}[modo]*h;
      l.push([e,h,c,f(c,p,F)])}return l}
  function fator(v,casas){var n=+v.toFixed(casas);return n===1?'':n===-1?'−':escrever(n,casas)}
  // Campo de direções, curva pelo ponto e linha de fase (18/11/2026, T03 da ED): o mesmo cálculo de tracos_campo(),
  // curva_integral(), equilibrios() e linha_fase() em tema/montagem/30-graficos.py. Mudar um pede mudar o outro.
  function fxy(f,x,y,p){var q=Object.assign({},p);q.y=y;var v=f(x,q,F);return isFinite(v)?v:null}
  function caminhoCampo(f,nx,ny,j,p,X,Y,ux,uy,passo){var pts=[],cel;
    if(passo){var px=passo[0],py=passo[1],xs=[],ys=[],a;for(a=Math.floor(j[0]/px);a<=Math.ceil(j[2]/px);a++)if(a*px>j[0]+px*.2&&a*px<j[2]-px*.2)xs.push(a*px);
      for(a=Math.floor(j[1]/py);a<=Math.ceil(j[3]/py);a++)if(a*py>j[1]+py*.2&&a*py<j[3]-py*.2)ys.push(a*py);xs.forEach(function(x){ys.forEach(function(y){pts.push([x,y])})});cel=[px,py]}
    else{for(var i=0;i<nx;i++)for(var k=0;k<ny;k++)pts.push([j[0]+(i+.5)*(j[2]-j[0])/nx,j[1]+(k+.5)*(j[3]-j[1])/ny]);cel=[(j[2]-j[0])/nx,(j[3]-j[1])/ny]}
    var meio=.3*Math.min(cel[0]*ux,cel[1]*uy),d='';
    pts.forEach(function(q){var cx=q[0],cy=q[1],m=fxy(f,cx,cy,p);if(m===null)return;
      var vx=ux,vy=-m*uy,n=Math.hypot(vx,vy);vx=vx/n*meio;vy=vy/n*meio;
      d+='M'+(X(cx)-vx).toFixed(1)+' '+(Y(cy)-vy).toFixed(1)+'L'+(X(cx)+vx).toFixed(1)+' '+(Y(cy)+vy).toFixed(1)});return d}
  function curvaIntegral(f,xa,ya,j,p,inteira){var h0=(j[2]-j[0])/400,folga=(j[3]-j[1])/2;
    function ramo(h){var pts=[],x=xa,y=ya;while(x<=j[2]+1e-9&&x>=j[0]-1e-9){pts.push([x,y]);if(!(y>=j[1]-folga&&y<=j[3]+folga))break;
      var k1=fxy(f,x,y,p);if(k1===null)break;var k2=fxy(f,x+h/2,y+h/2*k1,p);if(k2===null)break;var k3=fxy(f,x+h/2,y+h/2*k2,p);if(k3===null)break;
      var k4=fxy(f,x+h,y+h*k3,p);if(k4===null)break;y+=h/6*(k1+2*k2+2*k3+k4);x+=h}return pts}
    return (inteira?ramo(-h0).reverse().slice(0,-1):[]).concat(ramo(h0))}
  // integral2 e integral3 (20/11/2026): o mesmo cálculo de curva_integral_n() em tema/montagem/30-graficos.py, no vetor
  // (y, y1[, y2]), com as derivadas lidas como p.y1 e p.y2 na expressão.
  function curvaIntegralN(f,xa,u0,j,p,inteira){var h0=(j[2]-j[0])/400,folga=(j[3]-j[1])/2,nomes=['y','y1','y2'];
    function der(x,u){var q=Object.assign({},p);u.forEach(function(v,i){q[nomes[i]]=v});var v=f(x,q,F);return isFinite(v)?u.slice(1).concat([v]):null}
    function soma(u,k,c){return u.map(function(a,i){return a+c*k[i]})}
    function ramo(h){var pts=[],x=xa,u=u0.slice();while(x<=j[2]+1e-9&&x>=j[0]-1e-9){pts.push([x,u[0]]);if(!(u[0]>=j[1]-folga&&u[0]<=j[3]+folga))break;
      var k1=der(x,u);if(k1===null)break;var k2=der(x+h/2,soma(u,k1,h/2));if(k2===null)break;var k3=der(x+h/2,soma(u,k2,h/2));if(k3===null)break;
      var k4=der(x+h,soma(u,k3,h));if(k4===null)break;u=u.map(function(a,i){return a+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i])});x+=h}return pts}
    return (inteira?ramo(-h0).reverse().slice(0,-1):[]).concat(ramo(h0))}
  // notempo (20/11/2026, T19 da ED): o mesmo cálculo de curva_no_tempo() em tema/montagem/30-graficos.py: a componente k da
  // solução de (x, y[, z])' = (F, G[, H])(t, x, y, z) contra t, com t lido como p.t e y, z como p.y, p.z nas expressões.
  function curvaNoTempo(fs,k,t0,u0,j,p,inteira){var h0=(j[2]-j[0])/400,folga=(j[3]-j[1])/2,nomes=['x','y','z'];
    function der(t,u){var q=Object.assign({},p),r=[];q.t=t;u.forEach(function(v,i){q[nomes[i]]=v});for(var i=0;i<fs.length;i++){var v=fs[i](u[0],q,F);if(!isFinite(v))return null;r.push(v)}return r}
    function soma(u,kk,c){return u.map(function(a,i){return a+c*kk[i]})}
    function ramo(h){var pts=[],t=t0,u=u0.slice();while(t<=j[2]+1e-9&&t>=j[0]-1e-9){pts.push([t,u[k]]);if(!(u[k]>=j[1]-folga&&u[k]<=j[3]+folga))break;
      var k1=der(t,u);if(k1===null)break;var k2=der(t+h/2,soma(u,k1,h/2));if(k2===null)break;var k3=der(t+h/2,soma(u,k2,h/2));if(k3===null)break;
      var k4=der(t+h,soma(u,k3,h));if(k4===null)break;u=u.map(function(a,i){return a+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i])});t+=h}return pts}
    return (inteira?ramo(-h0).reverse().slice(0,-1):[]).concat(ramo(h0))}
  // Curvas de nível F(x, y) = c (20/11/2026, T06 da ED): o mesmo cálculo de curvas_nivel() e caminho_nivel() em
  // tema/montagem/30-graficos.py (marching squares, bisseção nas arestas, sela pelo centro, polo de fora, segmentos ligados). Mudar um pede mudar o outro.
  function curvasNivel(f,cs,j,nx,ny,p,X,Y){var xs=[],ys=[],val=[],i,k,d='';
    for(i=0;i<=nx;i++)xs.push(j[0]+(j[2]-j[0])*i/nx);for(k=0;k<=ny;k++)ys.push(j[1]+(j[3]-j[1])*k/ny);
    for(i=0;i<=nx;i++){val.push([]);for(k=0;k<=ny;k++)val[i].push(fxy(f,xs[i],ys[k],p))}
    cs.forEach(function(c){var g=val.map(function(col){return col.map(function(v){return v===null?null:v-c})}),pts={},ruins={},segs=[],adj={};
      function aresta(e){if(e in pts)return pts[e];if(e in ruins)return null;var q=e.split(','),h=q[0]==='h',a=+q[1],b=+q[2],a2=h?a+1:a,b2=h?b:b+1;
        var ga=g[a][b],gb=g[a2][b2],lo=0,hi=1,glo=ga,t,v;
        for(var it=0;it<14;it++){t=(lo+hi)/2;v=fxy(f,xs[a]+(xs[a2]-xs[a])*t,ys[b]+(ys[b2]-ys[b])*t,p);if(v===null){ruins[e]=1;return null}
          if((v-c>0)===(glo>0)){lo=t;glo=v-c}else hi=t}
        if(Math.abs(v-c)>.01*Math.max(Math.abs(ga),Math.abs(gb))+1e-12){ruins[e]=1;return null}
        t=(lo+hi)/2;return pts[e]=[xs[a]+(xs[a2]-xs[a])*t,ys[b]+(ys[b2]-ys[b])*t]}
      for(var a=0;a<nx;a++)for(var b=0;b<ny;b++){var A=g[a][b],Bv=g[a+1][b],Cv=g[a+1][b+1],D=g[a][b+1];if(A===null||Bv===null||Cv===null||D===null)continue;
        var idx=(A>0?1:0)|(Bv>0?2:0)|(Cv>0?4:0)|(D>0?8:0);if(idx===0||idx===15)continue;
        var EB='h,'+a+','+b,ER='v,'+(a+1)+','+b,ET='h,'+a+','+(b+1),EL='v,'+a+','+b,pares;
        if(idx===5||idx===10){var ce=(A+Bv+Cv+D)/4>0;pares=((idx===5)===ce)?[[EB,ER],[ET,EL]]:[[EL,EB],[ER,ET]]}
        else{var cr=[];[[EB,A,Bv],[ER,Bv,Cv],[ET,D,Cv],[EL,A,D]].forEach(function(z){if((z[1]>0)!==(z[2]>0))cr.push(z[0])});pares=[cr]}
        if(pares.some(function(q){return aresta(q[0])===null||aresta(q[1])===null}))continue;
        pares.forEach(function(q){segs.push(q)})}
      segs.forEach(function(s,n){(adj[s[0]]=adj[s[0]]||[]).push(n);(adj[s[1]]=adj[s[1]]||[]).push(n)});
      var usado={};
      segs.forEach(function(s,n){if(usado[n])return;usado[n]=1;var ca=[s[0],s[1]];
        for(var r=0;r<2;r++){for(;;){var l=adj[ca[ca.length-1]].filter(function(m){return !usado[m]});if(!l.length)break;usado[l[0]]=1;
          var sg=segs[l[0]];ca.push(sg[0]===ca[ca.length-1]?sg[1]:sg[0])}ca.reverse()}
        var fe=ca.length>2&&ca[0]===ca[ca.length-1];if(fe)ca.pop();
        d+='M'+ca.map(function(e){return X(pts[e][0]).toFixed(1)+' '+Y(pts[e][1]).toFixed(1)}).join('L')+(fe?'Z':'')})});
    return d}
  // Retrato de fase (20/11/2026, T15 a T18 da ED): o mesmo cálculo de setas_vetores(), trajetoria_sistema(), curva_param(),
  // pontas_ao_longo(), matriz_sistema(), autovetores() e html_autoretas() em tema/montagem/30-graficos.py. Mudar um pede mudar o outro.
  function fgxy(f,g,x,y,p){var a=fxy(f,x,y,p);if(a===null)return null;var b=fxy(g,x,y,p);return b===null?null:[a,b]}
  function pontosGrade(nx,ny,j,passo){var pts=[],cel;
    if(passo){var px=passo[0],py=passo[1],xs=[],ys=[],a;for(a=Math.floor(j[0]/px);a<=Math.ceil(j[2]/px);a++)if(a*px>j[0]+px*.2&&a*px<j[2]-px*.2)xs.push(a*px);
      for(a=Math.floor(j[1]/py);a<=Math.ceil(j[3]/py);a++)if(a*py>j[1]+py*.2&&a*py<j[3]-py*.2)ys.push(a*py);xs.forEach(function(x){ys.forEach(function(y){pts.push([x,y])})});cel=[px,py]}
    else{for(var i=0;i<nx;i++)for(var k=0;k<ny;k++)pts.push([j[0]+(i+.5)*(j[2]-j[0])/nx,j[1]+(k+.5)*(j[3]-j[1])/ny]);cel=[(j[2]-j[0])/nx,(j[3]-j[1])/ny]}
    return [pts,cel]}
  function setasVetores(f,g,nx,ny,j,p,X,Y,ux,uy,passo){var pc_=pontosGrade(nx,ny,j,passo),cel=pc_[1],comp=Math.min(.55*Math.min(cel[0]*ux,cel[1]*uy),26),pc=.36*comp,pm=.2*comp,d='';
    pc_[0].forEach(function(q){var v=fgxy(f,g,q[0],q[1],p);if(v===null)return;var vx=v[0]*ux,vy=-v[1]*uy,n=Math.hypot(vx,vy);if(n<1e-9)return;vx/=n;vy/=n;
      var px=X(q[0]),py=Y(q[1]),ax=px-vx*comp/2,ay=py-vy*comp/2,bx=px+vx*comp/2,by=py+vy*comp/2,mx=bx-vx*pc,my=by-vy*pc;
      d+='M'+ax.toFixed(1)+' '+ay.toFixed(1)+'L'+mx.toFixed(1)+' '+my.toFixed(1)+'M'+bx.toFixed(1)+' '+by.toFixed(1)+'L'+(mx-vy*pm).toFixed(1)+' '+(my+vx*pm).toFixed(1)+'L'+(mx+vy*pm).toFixed(1)+' '+(my-vx*pm).toFixed(1)+'Z'});
    return d}
  var PASSO_TRAJ=2,PASSOS_TRAJ=6000,PONTA_COMP=13,PONTA_MEIA=5.5,ESPACO_PONTAS=480,LONGE_PONTAS=44;
  function trajetoriaSistema(f,g,xa,ya,j,p,ux,uy,inteira){var fx=(j[2]-j[0])/2,fy=(j[3]-j[1])/2;
    function ramo(sn){var pts=[[xa,ya]],x=xa,y=ya,ant=null,longe=0;
      for(var it=0;it<PASSOS_TRAJ;it++){if(!(x>=j[0]-fx&&x<=j[2]+fx&&y>=j[1]-fy&&y<=j[3]+fy))break;
        var k1=fgxy(f,g,x,y,p);if(k1===null)break;var vel=Math.hypot(k1[0]*ux,k1[1]*uy);if(vel<1e-12)break;var h=sn*PASSO_TRAJ/vel;
        // Passo partido ao meio até andar no máximo 1,5 vez o previsto e para a frente (como no Python, 20/11/2026).
        var novo=null;for(var tt=0;tt<40;tt++){var k2=fgxy(f,g,x+h/2*k1[0],y+h/2*k1[1],p),k3=k2===null?null:fgxy(f,g,x+h/2*k2[0],y+h/2*k2[1],p),k4=k3===null?null:fgxy(f,g,x+h*k3[0],y+h*k3[1],p);
          if(k4!==null){var cx=x+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),cy=y+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]),ddx=(cx-x)*ux,ddy=(cy-y)*uy;
            if(Math.hypot(ddx,ddy)<=1.5*PASSO_TRAJ&&(ddx*k1[0]*ux+ddy*k1[1]*uy)*sn>0){novo=[cx,cy];break}}h/=2}
        if(novo===null)break;var nx=novo[0],ny=novo[1],dx=(nx-x)*ux,dy=(ny-y)*uy;if(Math.hypot(dx,dy)<1e-3*PASSO_TRAJ)break;
        if(ant&&dx*ant[0]+dy*ant[1]<0)break;ant=[dx,dy];x=nx;y=ny;
        var dist=Math.hypot((x-xa)*ux,(y-ya)*uy);if(longe>10*PASSO_TRAJ&&dist<PASSO_TRAJ){pts.push([xa,ya]);return [pts,true]}
        longe=Math.max(longe,dist);pts.push([x,y])}
      return [pts,false]}
    var ida=ramo(1);if(ida[1]||!inteira)return ida;return [ramo(-1)[0].reverse().slice(0,-1).concat(ida[0]),false]}
  function curvaParam(fx,fy,t0,t1,p){var pts=[];for(var k=0;k<=400;k++){var s=t0+(t1-t0)*k/400,a=fx(s,p,F),b=fy(s,p,F);if(isFinite(a)&&isFinite(b))pts.push([a,b])}return pts}
  function ponta(cx,cy,vx,vy){var h=PONTA_COMP/2,tx=cx+vx*h,ty=cy+vy*h,bx=cx-vx*h,by=cy-vy*h;
    return 'M'+tx.toFixed(1)+' '+ty.toFixed(1)+'L'+(bx-vy*PONTA_MEIA).toFixed(1)+' '+(by+vx*PONTA_MEIA).toFixed(1)+'L'+(bx+vy*PONTA_MEIA).toFixed(1)+' '+(by-vx*PONTA_MEIA).toFixed(1)+'Z'}
  // Pontas lidas do d já arredondado (pontas_do_caminho), para as linhas seguintes evitarem; uma por trecho visível contínuo.
  function pontasDoCaminho(d){var r=[],re=/M(-?[\d.]+) (-?[\d.]+)/g,m;while((m=re.exec(d||'')))r.push([parseFloat(m[1]),parseFloat(m[2])]);return r}
  function pontasAoLongo(tl,jt,ocup,nfixo){var trechos=[],atual=[],k;
    for(k=0;k+1<tl.length;k++){var a=tl[k],b=tl[k+1];if(a[0]>=jt[0]&&a[0]<=jt[2]&&b[0]>=jt[0]&&b[0]<=jt[2]&&a[1]>=jt[1]&&a[1]<=jt[3]&&b[1]>=jt[1]&&b[1]<=jt[3]){
      var c=Math.hypot(b[0]-a[0],b[1]-a[1]);if(c>1e-9)atual.push([a[0],a[1],b[0],b[1],c])}else if(atual.length){trechos.push(atual);atual=[]}}
    if(atual.length)trechos.push(atual);var d='',postas=(ocup||[]).slice();
    trechos.forEach(function(segs){var total=0;segs.forEach(function(s){total+=s[4]});if(total<30)return;
      var n=nfixo||Math.max(1,Math.floor(total/ESPACO_PONTAS)),ped=total/n;
      function em(dist){var acum=0;for(var i=0;i<segs.length;i++){var s=segs[i];if(dist<=acum+s[4]){var f=(dist-acum)/s[4];return [s[0]+(s[2]-s[0])*f,s[1]+(s[3]-s[1])*f,(s[2]-s[0])/s[4],(s[3]-s[1])/s[4]]}acum+=s[4]}
        var u=segs[segs.length-1];return [u[2],u[3],(u[2]-u[0])/u[4],(u[3]-u[1])/u[4]]}
      for(var q=0;q<n;q++){var meio=(q+.5)*ped,esc=null;
        for(var pa=0;pa*8<=.4*ped&&!esc;pa++){var alvos=pa===0?[meio]:[meio+pa*8,meio-pa*8];
          for(var z=0;z<alvos.length;z++){var e=em(alvos[z]),tx=e[0]+e[2]*PONTA_COMP/2,ty=e[1]+e[3]*PONTA_COMP/2;
            if(postas.every(function(o){return Math.hypot(tx-o[0],ty-o[1])>=LONGE_PONTAS})){esc=e;break}}}
        var e2=esc||em(meio),uma=ponta(e2[0],e2[1],e2[2],e2[3]);postas=postas.concat(pontasDoCaminho(uma));d+=uma}});
    return d}
  // As pontas que a trajetória e evita, como no Python: as das autoretas (desenhadas por cima de tudo, mas vindas antes no
  // slides.html) e as das trajetórias anteriores no mesmo gráfico.
  function pontasAntes(e){var r=[],svg=e.closest('svg');if(!svg)return r;
    svg.querySelectorAll('.autoretas path.pt').forEach(function(q){r=r.concat(pontasDoCaminho(q.getAttribute('d')))});
    svg.querySelectorAll('g.traj > path').forEach(function(q){if(!e.contains(q)&&(e.compareDocumentPosition(q)&Node.DOCUMENT_POSITION_PRECEDING))r=r.concat(pontasDoCaminho(q.getAttribute('d')))});return r}
  function matrizSistema(f,g,p){var v=[[0,0],[1,0],[0,1]].map(function(q){return fgxy(f,g,q[0],q[1],p)});if(v.some(function(w){return w===null}))return null;
    return [v[1][0]-v[0][0],v[2][0]-v[0][0],v[1][1]-v[0][1],v[2][1]-v[0][1]]}
  function autovetores(a,b,c,d){var esc=Math.pow(Math.abs(a)+Math.abs(b)+Math.abs(c)+Math.abs(d),2)||1,dl=(a-d)*(a-d)+4*b*c,lams;
    if(dl<-1e-9*esc)return null;if(Math.abs(dl)<=1e-9*esc)lams=[(a+d)/2];else{var r=Math.sqrt(dl);lams=[(a+d+r)/2,(a+d-r)/2]}
    var res=[];for(var k=0;k<lams.length;k++){var l=lams[k],l1=[b,l-a],l2=[l-d,c],v=Math.hypot(l1[0],l1[1])>=Math.hypot(l2[0],l2[1])?l1:l2,n=Math.hypot(v[0],v[1]);
      if(n<1e-9*Math.sqrt(esc))return 'estrela';res.push([l,[v[0]/n,v[1]/n]])}return res}
  function recortarJ(xa,ya,xc,yc,jan){var t0=0,t1=1,dx=xc-xa,dy=yc-ya,c=[[-dx,xa-jan[0]],[dx,jan[2]-xa],[-dy,ya-jan[1]],[dy,jan[3]-ya]];
    for(var k=0;k<4;k++){var pp=c[k][0],q=c[k][1];if(pp===0){if(q<0)return null;continue}var r=q/pp;if(pp<0)t0=Math.max(t0,r);else t1=Math.min(t1,r);if(t0>t1)return null}
    return [xa+t0*dx,ya+t0*dy,xa+t1*dx,ya+t1*dy]}
  function htmlAutoretas(f,g,j,p,X,Y){var A=matrizSistema(f,g,p);if(!A)return '';var lista=autovetores(A[0],A[1],A[2],A[3]);if(!Array.isArray(lista))return '';
    var esc=Math.abs(A[0])+Math.abs(A[1])+Math.abs(A[2])+Math.abs(A[3])||1,R=2*(Math.abs(j[0])+Math.abs(j[2])+Math.abs(j[1])+Math.abs(j[3]))+1,s='';
    lista.forEach(function(e,i){var l=e[0],v=e[1],cls=['a','b'][i],parada=Math.abs(l)<1e-9*esc,d='';
      [1,-1].forEach(function(sn){var rc=recortarJ(0,0,sn*R*v[0],sn*R*v[1],j);if(!rc)return;var xa=X(rc[0]),ya=Y(rc[1]),xc=X(rc[2]),yc=Y(rc[3]);
        s+='<line class="autoreta '+cls+(parada?' parada':'')+'" x1="'+xa.toFixed(1)+'" y1="'+ya.toFixed(1)+'" x2="'+xc.toFixed(1)+'" y2="'+yc.toFixed(1)+'"/>';
        var c=Math.hypot(xc-xa,yc-ya);if(!parada&&c>50){var u=(xc-xa)/c,w=(yc-ya)/c;if(l<0){u=-u;w=-w}d+=ponta(xa+.55*(xc-xa),ya+.55*(yc-ya),u,w)}});
      if(d)s+='<path class="pt '+cls+'" d="'+d+'"/>'});
    return s}
  function equilibrios(g,lo,hi){var n=600,vs=[],fs=[],k,r=[];for(k=0;k<=n;k++){vs.push(lo+(hi-lo)*k/n);fs.push(g(vs[k]))}
    var esc=1;fs.forEach(function(v){if(v!==null)esc=Math.max(esc,Math.abs(v))});
    for(k=0;k<n;k++){var a=vs[k],b=vs[k+1],fa=fs[k],fb=fs[k+1];if(fa===null||fb===null)continue;
      if(fa===0)r.push(a);else if(fa*fb<0){for(var it=0;it<60;it++){var m=(a+b)/2,fm=g(m);if(fm===null)break;if(fa*fm<=0)b=m;else{a=m;fa=fm}}r.push((a+b)/2)}}
    for(k=1;k<n;k++){if(fs[k-1]===null||fs[k]===null||fs[k+1]===null||!(Math.abs(fs[k])<=Math.abs(fs[k-1])&&Math.abs(fs[k])<=Math.abs(fs[k+1])))continue;
      var a2=vs[k-1],b2=vs[k+1];for(var it2=0;it2<80;it2++){var m1=a2+(b2-a2)/3,m2=b2-(b2-a2)/3;if(Math.abs(g(m1)||0)<Math.abs(g(m2)||0))b2=m2;else a2=m1}
      var rr=(a2+b2)/2,gr=g(rr);if(Math.abs(gr===null?1:gr)<1e-9*esc)r.push(rr)}
    var tol=(hi-lo)*1e-4,u=[];r.sort(function(a,b){return a-b}).forEach(function(v){if(v>=lo-tol&&v<=hi+tol&&!u.some(function(w){return Math.abs(v-w)<tol}))u.push(v)});
    var dd=(hi-lo)*1e-3;return u.map(function(v){var ab=g(v-dd)||0,ac=g(v+dd)||0;return [v,ab>0&&ac<0?'estavel':ab<0&&ac>0?'instavel':ab>0?'semi+':'semi-']})}
  function htmlFase(o,f,p,X,Y){var pe=o.var==='y',tl=o.tela!=null?o.tela:(pe?X:Y)(compilar(o.pos)(0,p,F)),P=pe?function(v){return [tl,Y(v)]}:function(v){return [X(v),tl]};
    var g=pe?function(v){return fxy(f,0,v,p)}:function(v){var w=f(v,p,F);return isFinite(w)?w:null};
    var EXT=16,eq=equilibrios(g,o.lo,o.hi),A=P(o.lo),B=P(o.hi);if(pe){A[1]+=EXT;B[1]-=EXT}else{A[0]-=EXT;B[0]+=EXT}
    var s='<line class="fase" x1="'+A[0].toFixed(1)+'" y1="'+A[1].toFixed(1)+'" x2="'+B[0].toFixed(1)+'" y2="'+B[1].toFixed(1)+'"/>';
    var marcas=[o.lo].concat(eq.map(function(e){return e[0]})).concat([o.hi]);
    var C=22,M=13,FO=24,tela=function(v){return pe?P(v)[1]:P(v)[0]},eqs=eq.map(function(e){return e[0]});
    for(var k=0;k+1<marcas.length;k++){var a=marcas[k],b=marcas[k+1],ta=tela(a),tb=tela(b);
      var da=eqs.indexOf(a)>=0?FO:-(EXT-C/2-2),db=eqs.indexOf(b)>=0?FO:-(EXT-C/2-2),sn=tb>ta?1:-1,c0=ta+sn*da,c1=tb-sn*db;
      if((c1-c0)*sn<0)continue;
      var ct=Math.min(Math.max((ta+tb)/2,Math.min(c0,c1)),Math.max(c0,c1)),fr=tb!==ta?(ct-ta)/(tb-ta):.5;
      var m=a+(b-a)*fr,fm=g(m);if(fm===null||fm===0){m=a+(b-a)*.37;fm=g(m)}if(fm===null||fm===0)continue;
      var q=P(m),sx=q[0],sy=q[1],u,h=C/2;
      if(pe){u=fm>0?-1:1;s+='<path class="pt fase" d="M'+sx.toFixed(1)+' '+(sy+h*u).toFixed(1)+'L'+(sx-M).toFixed(1)+' '+(sy-h*u).toFixed(1)+'L'+(sx+M).toFixed(1)+' '+(sy-h*u).toFixed(1)+'z"/>'}
      else{u=fm>0?1:-1;s+='<path class="pt fase" d="M'+(sx+h*u).toFixed(1)+' '+sy.toFixed(1)+'L'+(sx-h*u).toFixed(1)+' '+(sy-M).toFixed(1)+'L'+(sx-h*u).toFixed(1)+' '+(sy+M).toFixed(1)+'z"/>'}}
    eq.forEach(function(e){var q=P(e[0]),cx=q[0].toFixed(1),cy=q[1].toFixed(1);
      if(e[1]==='estavel'){s+='<circle class="cheia '+o.cls+'" cx="'+cx+'" cy="'+cy+'" r="9.5"/>';return}
      s+='<circle class="aberta '+o.cls+'" cx="'+cx+'" cy="'+cy+'" r="9.5"/>';
      if(e[1].indexOf('semi')===0){if(pe)s+='<path class="cheia '+o.cls+'" d="M'+(q[0]-9.5).toFixed(1)+' '+cy+'A9.5 9.5 0 0 '+(e[1]==='semi+'?0:1)+' '+(q[0]+9.5).toFixed(1)+' '+cy+'Z"/>';
        else s+='<path class="cheia '+o.cls+'" d="M'+cx+' '+(q[1]-9.5).toFixed(1)+'A9.5 9.5 0 0 '+(e[1]==='semi+'?0:1)+' '+cx+' '+(q[1]+9.5).toFixed(1)+'Z"/>'}});
    return s}
  // Reta com zoom (22/11/2026): o mesmo desenho de zoom_desenho() em tema/montagem/35-conjuntos.py. Mudar um pede mudar o outro.
  function desenharZoom(o,z){var W=900,Y0=92,v=o.v,w0=o.x1-o.x0,m0=(o.x0+o.x1)/2,c=m0+(o.c-m0)*Math.min(1,z),w=w0/Math.pow(v,z),a=c-w/2,b=c+w/2,
    X=function(x){return 40+(x-a)/(b-a)*(W-80)},k=Math.floor(z+1e-9),ps=o.dx/Math.pow(v,k),s='<line class="ax" x1="20" y1="'+Y0+'" x2="'+(W-20)+'" y2="'+Y0+'"/>',
    i0=Math.ceil(a/ps-1e-9),i1=Math.floor(b/ps+1e-9),i,x;
    for(i=i0;i<=i1;i++){x=i*ps;var gr=Math.abs(x/(ps*v)-Math.round(x/(ps*v)))<1e-6;
      s+='<line class="tq'+(gr?' gr':'')+'" x1="'+X(x).toFixed(1)+'" x2="'+X(x).toFixed(1)+'" y1="'+(Y0-(gr?14:9))+'" y2="'+(Y0+(gr?14:9))+'"/>';
      if(i1-i0<=14||gr)s+='<text class="tk" x="'+X(x).toFixed(1)+'" y="'+(Y0+44)+'" text-anchor="middle">'+x.toFixed(k).replace('-','−').replace('.',',')+'</text>'}
    var f=z-k;if(f>.25){var fi=ps/v,op=Math.min(1,(f-.25)*2);for(i=Math.ceil(a/fi);i<=Math.floor(b/fi);i++)
      s+='<line class="tq fino" opacity="'+op.toFixed(2)+'" x1="'+X(i*fi).toFixed(1)+'" x2="'+X(i*fi).toFixed(1)+'" y1="'+(Y0-5)+'" y2="'+(Y0+5)+'"/>'}
    o.pts.forEach(function(q){if(q[0]>=a&&q[0]<=b)s+='<circle class="'+(q[1]==='cheia'?'cheia':'aberta')+' a" cx="'+X(q[0]).toFixed(1)+'" cy="'+Y0+'" r="9"/>'});
    o.rot.forEach(function(q){if(q[0]>=a&&q[0]<=b){var t=document.createElement('i');t.textContent=q[1];s+='<text class="rz" x="'+X(q[0]).toFixed(1)+'" y="'+(Y0-26)+'" text-anchor="middle">'+t.innerHTML+'</text>'}});
    return s}
  // Grade, eixos e números da janela com zoom: grade e números a cada passo dividido por vezes a cada inteiro do zoom; números na borda.
  function eixosZoom(d,j,z){var zp=d.zoomp,k=Math.floor(z+1e-9),f=Math.pow(zp.v,k),gx=zp.gx/f,gy=zp.gy/f,nx=zp.dx/f,ny=zp.dy/f,
    sx=d.ux*(d.x1-d.x0)/(j[1]-j[0]),sy=d.uy*(d.y1-d.y0)/(j[3]-j[2]),X=function(v){return d.esq+(v-j[0])*sx},Y=function(v){return d.cima+(j[3]-v)*sy},
    L=d.esq,R=d.esq+(d.x1-d.x0)*d.ux,T=d.cima,B=d.cima+(d.y1-d.y0)*d.uy,s='',v,casas=Math.max(0,Math.ceil(-Math.log10(Math.min(nx,ny))-1e-9));
    var esc=function(v){return (+v.toFixed(casas)).toString().replace('-','−').replace('.',',')};
    for(v=Math.ceil(j[0]/gx-1e-9)*gx;v<=j[1]+1e-9;v+=gx)s+='<line class="g" x1="'+X(v).toFixed(1)+'" x2="'+X(v).toFixed(1)+'" y1="'+T+'" y2="'+B+'"/>';
    for(v=Math.ceil(j[2]/gy-1e-9)*gy;v<=j[3]+1e-9;v+=gy)s+='<line class="g" x1="'+L+'" x2="'+R+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'"/>';
    if(j[2]<=0&&0<=j[3])s+='<line class="ax" x1="'+L+'" x2="'+R+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'"/>';
    if(j[0]<=0&&0<=j[1])s+='<line class="ax" x1="'+X(0).toFixed(1)+'" x2="'+X(0).toFixed(1)+'" y1="'+T+'" y2="'+B+'"/>';
    for(v=Math.ceil(j[0]/nx-1e-9)*nx;v<=j[1]+1e-9;v+=nx)if(X(v)>L+20)s+='<text class="tk" x="'+X(v).toFixed(1)+'" y="'+(B+28)+'" text-anchor="middle">'+esc(v)+'</text>';
    for(v=Math.ceil(j[2]/ny-1e-9)*ny;v<=j[3]+1e-9;v+=ny)if(Y(v)<B-12)s+='<text class="tk" x="'+(L-9)+'" y="'+(Y(v)+8).toFixed(1)+'" text-anchor="end">'+esc(v)+'</text>';
    s+='<rect class="moldura" x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/>';
    return s}
  var animacoes=[].map.call(document.querySelectorAll('svg[data-anima],.cena[data-anima],table[data-anima]'),function(svg){
    var d=JSON.parse(svg.dataset.anima),caixa=svg.closest('.anima'),a={q:svg.closest('.quadro'),svg:svg,d:d,v:{},passo:0,raf:0};
    // Zoom no plano (22/11/2026, <grafico zoom="centro=x,y ...">): a janela encolhe com o controle zoom, e X e Y seguem a janela.
    var jz=function(z){var zp=d.zoomp,w=(d.x1-d.x0)/Math.pow(zp.v,z),h=(d.y1-d.y0)/Math.pow(zp.v,z),t=Math.min(1,Math.max(0,z)),
      cx=(d.x0+d.x1)/2+(zp.c[0]-(d.x0+d.x1)/2)*t,cy=(d.y0+d.y1)/2+(zp.c[1]-(d.y0+d.y1)/2)*t;return [cx-w/2,cx+w/2,cy-h/2,cy+h/2]};
    var X=function(v){if(!d.zoomp)return d.esq+(v-d.x0)*d.ux;var j=jz(a.v.zoom||0);return d.esq+(v-j[0])*d.ux*(d.x1-d.x0)/(j[1]-j[0])},
      Y=function(v){if(!d.zoomp)return d.cima+(d.y1-v)*d.uy;var j=jz(a.v.zoom||0);return d.cima+(j[3]-v)*d.uy*(d.y1-d.y0)/(j[3]-j[2])};
    var par=function(c){var f=compilar(c[0]),g=compilar(c[1]);return function(p){return [f(0,p,F),g(0,p,F)]}};
    // Nos sólidos e superfícies, os rótulos ficam fora da cena (.rot3), e também mudam com o controle.
    var dins=[].slice.call(svg.querySelectorAll('[data-din]')).concat(svg.classList.contains('cena')?[].slice.call(caixa.querySelectorAll('.rot3 [data-din]')):[]);
    var acoes=dins.map(function(e){
      var o=JSON.parse(e.dataset.din),fs=[];
      if(o.pts){var ps=o.pts.map(par);fs.push(function(p){e.setAttribute('points',ps.map(function(f){var c=f(p);return X(c[0]).toFixed(1)+','+Y(c[1]).toFixed(1)}).join(' '))})}
      if(o.arco){var fa=o.arco.map(compilar);fs.push(function(p){var r=fa[0](0,p,F),t0=fa[1](0,p,F),t1=fa[2](0,p,F),cx=fa[3](0,p,F),cy=fa[4](0,p,F),t=[];
        for(var k=0;k<=180;k++){var u=t0+(t1-t0)*k/180;t.push(X(cx+r*d.uy/d.ux*Math.cos(u)).toFixed(1)+','+Y(cy+r*Math.sin(u)).toFixed(1))}e.setAttribute('points',t.join(' '));
        // Arco de comprimento zero não tem sentido: sem ponta de seta.
        if(e.dataset.ponta){if(Math.abs(t1-t0)>0.05)e.setAttribute('marker-end',e.dataset.ponta);else e.removeAttribute('marker-end')}})}
      if(o.guia){var fg=compilar(o.v);fs.push(function(p){var v=fg(0,p,F);if(o.guia==='x'){e.setAttribute('x1',X(v).toFixed(1));e.setAttribute('x2',X(v).toFixed(1))}else{e.setAttribute('y1',Y(v).toFixed(1));e.setAttribute('y2',Y(v).toFixed(1))}})}
      // fn com buracos (21/11/2026, como na montagem, 30-graficos.py): onde a função não existe (divisão por zero, raiz de
      // negativo, ln de 0), a curva para e recomeça depois, num <path> de trechos (M ... L ... M ...), em vez de ligar os dois lados.
      if(o.fn){var fy=compilar(o.fn),de=compilar(o.de),ate=compilar(o.ate);fs.push(function(p){var a0=de(0,p,F),b0=ate(0,p,F),t='',novo=true;
        if(d.zoomp){var jj=jz(p.zoom||0),mw=(jj[1]-jj[0])*.05;a0=Math.max(a0,jj[0]-mw);b0=Math.min(b0,jj[1]+mw)}
        for(var k=0;k<=o.n;k++){var x=a0+(b0-a0)*k/o.n,y;try{y=fy(x,p,F)}catch(_){y=NaN}
          if(isFinite(y)){t+=(novo?'M':'L')+X(x).toFixed(1)+' '+Y(y).toFixed(1);novo=false}else novo=true}
        e.setAttribute('d',t)})}
      // Região preenchida (area, entre, entrey), com parâmetro nos limites ou nas curvas.
      if(o.reg){var rf=compilar(o.reg.f),rg=compilar(o.reg.g),rd=compilar(o.reg.de),ra=compilar(o.reg.ate);fs.push(function(p){
        var a0=rd(0,p,F),b0=ra(0,p,F),ida=[],volta=[];
        for(var k=0;k<=160;k++){var x=a0+(b0-a0)*k/160,u=rf(x,p,F),w=rg(x,p,F);if(o.reg.parte==='pos')u=Math.max(u,w);else if(o.reg.parte==='neg')u=Math.min(u,w);
          ida.push(o.reg.y?[u,x]:[x,u]);volta.push(o.reg.y?[w,x]:[x,w])}
        e.setAttribute('points',ida.concat(volta.reverse()).map(function(c){return X(c[0]).toFixed(1)+','+Y(c[1]).toFixed(1)}).join(' '))})}
      if(o.riem){var qf=compilar(o.riem.f),qd=compilar(o.riem.de),qa=compilar(o.riem.ate),qn=compilar(o.riem.n),qF=o.riem.F?compilar(o.riem.F):null;fs.push(function(p){
        var fx=faixas(qf,qF,o.riem.modo,qd(0,p,F),qa(0,p,F),qn(0,p,F),p),t='';
        fx.forEach(function(r){t+=o.riem.pontos?'M'+(X(r[2])-7).toFixed(1)+' '+Y(r[3]).toFixed(1)+'a7 7 0 1 0 14 0a7 7 0 1 0 -14 0Z':
          'M'+X(r[0]).toFixed(1)+' '+Y(0).toFixed(1)+'V'+Y(r[3]).toFixed(1)+'H'+X(r[0]+r[1]).toFixed(1)+'V'+Y(0).toFixed(1)+'Z'});
        e.setAttribute('d',t)})}
      if(o.campo){var cf=compilar(o.campo.f),cnx=o.campo.nx?compilar(o.campo.nx):null,cny=o.campo.ny?compilar(o.campo.ny):null,jc=[d.x0,d.y0,d.x1,d.y1];fs.push(function(p){
        e.setAttribute('d',caminhoCampo(cf,cnx?Math.round(cnx(0,p,F)):0,cny?Math.round(cny(0,p,F)):0,jc,p,X,Y,d.ux,d.uy,o.campo.passo))})}
      if(o.integral){var inf=compilar(o.integral.f),ip=par(o.integral.p);fs.push(function(p){var c=ip(p);
        e.setAttribute('points',curvaIntegral(inf,c[0],c[1],o.integral.jan,p,o.integral.inteira).map(function(q){return X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1)}).join(' '))})}
      if(o.integraln){var gf=compilar(o.integraln.f),gp=o.integraln.p.map(compilar);fs.push(function(p){var c=gp.map(function(g){return g(0,p,F)});
        e.setAttribute('points',curvaIntegralN(gf,c[0],c.slice(1),o.integraln.jan,p,o.integraln.inteira).map(function(q){return X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1)}).join(' '))})}
      if(o.notempo){var tfs=o.notempo.f.map(compilar),tps=o.notempo.p.map(compilar),tt0=compilar(o.notempo.t0);fs.push(function(p){var c=tps.map(function(g){return g(0,p,F)});
        e.setAttribute('points',curvaNoTempo(tfs,o.notempo.k,tt0(0,p,F),c,o.notempo.jan,p,o.notempo.inteira).map(function(q){return X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1)}).join(' '))})}
      if(o.nivel){var nf=compilar(o.nivel.f),nc=o.nivel.c.map(compilar);fs.push(function(p){
        e.setAttribute('d',curvasNivel(nf,nc.map(function(c){return c(0,p,F)}),o.nivel.jan,o.nivel.n[0],o.nivel.n[1],p,X,Y))})}
      if(o.vetores){var vf=compilar(o.vetores.f),vg=compilar(o.vetores.g),vnx=o.vetores.nx?compilar(o.vetores.nx):null,vny=o.vetores.ny?compilar(o.vetores.ny):null,jv=[d.x0,d.y0,d.x1,d.y1];fs.push(function(p){
        e.setAttribute('d',setasVetores(vf,vg,vnx?Math.round(vnx(0,p,F)):0,vny?Math.round(vny(0,p,F)):0,jv,p,X,Y,d.ux,d.uy,o.vetores.passo))})}
      if(o.autoretas){var af=compilar(o.autoretas.f),ag=compilar(o.autoretas.g);fs.push(function(p){e.innerHTML=htmlAutoretas(af,ag,o.autoretas.jan,p,X,Y)})}
      // Trajetória e curva paramétrica: a linha e as pontas no mesmo <g>, refeitas com o valor do momento.
      if(o.traj||o.curva){var jq=[X(d.x0)+12,Y(d.y1)+12,X(d.x1)-12,Y(d.y0)-12],tpl=e.querySelector('polyline'),tpt=e.querySelector('path'),tcalc;
        if(o.traj){var tf=compilar(o.traj.f),tg=compilar(o.traj.g),tp=par(o.traj.p);tcalc=function(p){var c=tp(p);return trajetoriaSistema(tf,tg,c[0],c[1],o.traj.jan,p,d.ux,d.uy,o.traj.inteira)[0]}}
        else{var cx_=compilar(o.curva.x),cy_=compilar(o.curva.y),cd=compilar(o.curva.de),ca=compilar(o.curva.ate);tcalc=function(p){return curvaParam(cx_,cy_,cd(0,p,F),ca(0,p,F),p)}}
        fs.push(function(p){var tl=tcalc(p).map(function(q){return [X(q[0]),Y(q[1])]});
          tpl.setAttribute('points',tl.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1)}).join(' '));if(tpt)tpt.setAttribute('d',pontasAoLongo(tl,jq,pontasAntes(e),(o.traj||o.curva).n))})}
      if(o.fase){var ff2=compilar(o.fase.f);fs.push(function(p){e.innerHTML=htmlFase(o.fase,ff2,p,X,Y)})}
      if(o.pol){var lf=compilar(o.pol.f),ld=compilar(o.pol.de),la=compilar(o.pol.ate),ln=compilar(o.pol.n);fs.push(function(p){
        var a0=ld(0,p,F),b0=la(0,p,F),n=Math.max(1,Math.round(ln(0,p,F))),t=[];
        for(var k=0;k<=n;k++){var x=a0+(b0-a0)*k/n;t.push(X(x).toFixed(1)+','+Y(lf(x,p,F)).toFixed(1))}e.setAttribute('points',t.join(' '))})}
      // Seta com parâmetro (17/11/2026): haste até 14 unidades antes da ponta e a ponta de 7 de meia largura, como na montagem.
      if(o.seta){var s0=par(o.seta[0]),s1=par(o.seta[1]),ln=e.querySelector('line'),pt=e.querySelector('path');fs.push(function(p){
        var u=s0(p),w=s1(p),xa=X(u[0]),ya=Y(u[1]),xc=X(w[0]),yc=Y(w[1]);
        // corte="1": o trecho fora da janela sai, e a ponta fica na borda (recorte de Liang-Barsky, como na montagem).
        if(o.jan){var t0=0,t1=1,dx=xc-xa,dy=yc-ya,fora=false;[[-dx,xa-o.jan[0]],[dx,o.jan[2]-xa],[-dy,ya-o.jan[1]],[dy,o.jan[3]-ya]].forEach(function(c){
            if(fora)return;if(c[0]===0){if(c[1]<0)fora=true;return}var r=c[1]/c[0];if(c[0]<0)t0=Math.max(t0,r);else t1=Math.min(t1,r);if(t0>t1)fora=true});
          if(fora){e.style.display='none';return}var xa2=xa+t0*dx,ya2=ya+t0*dy;xc=xa+t1*dx;yc=ya+t1*dy;xa=xa2;ya=ya2}
        var n=Math.hypot(xc-xa,yc-ya);
        var ok=isFinite(n)&&n>16;e.style.display=ok?'':'none';if(!ok)return;
        var ux=(xc-xa)/n,uy=(yc-ya)/n,bx=xc-ux*14,by=yc-uy*14;
        ln.setAttribute('x1',xa.toFixed(1));ln.setAttribute('y1',ya.toFixed(1));ln.setAttribute('x2',bx.toFixed(1));ln.setAttribute('y2',by.toFixed(1));
        pt.setAttribute('d','M'+xc.toFixed(1)+' '+yc.toFixed(1)+'L'+(bx-uy*7).toFixed(1)+' '+(by+ux*7).toFixed(1)+'L'+(bx+uy*7).toFixed(1)+' '+(by-ux*7).toFixed(1)+'z')})}
      // Sem valor real (como arcsen de 2), o ponto some.
      if(o.c){var pc=par(o.c),circ=e.tagName.toLowerCase()==='circle';fs.push(function(p){var c=pc(p);
        var existe=isFinite(c[0])&&isFinite(c[1]);e.style.display=existe?'':'none';if(!existe)return;
        e.setAttribute(circ?'cx':'x',(X(c[0])+(o.ox||0)).toFixed(1));e.setAttribute(circ?'cy':'y',(Y(c[1])+(o.oy||0)).toFixed(1))})}
      if(o.t){var tx=o.t.map(function(m){return typeof m==='string'?m:{f:compilar(m.e),s:m.s}});fs.push(function(p){
        e.textContent=tx.map(function(m){if(typeof m==='string')return m;var v=m.f(0,p,F);return m.s==='+'?parcela(v,d.casas):m.s==='*'?fator(v,d.casas):m.s==='~'?emPi(v):m.s==='#'?(Math.abs(v-1)<1e-3?'':misto(v,d.casas)):escrever(v,d.casas)}).join('')})}
      if(o.zoom){fs.push(function(p){e.innerHTML=desenharZoom(o.zoom,p.zoom)})}
      if(o.eixosz){var fixos=[].slice.call(svg.querySelectorAll('[data-fixo]'));fs.push(function(p){var z=p.zoom||0,dentro=z>1e-3;
        fixos.forEach(function(f){f.style.display=dentro?'none':''});e.innerHTML=dentro?eixosZoom(d,jz(z),z):''})}
      return function(p){fs.forEach(function(f){f(p)})};
    });
    var entradas={};
    [].forEach.call(caixa.querySelectorAll('input[type=range]'),function(c){entradas[c.dataset.nome]=c;
      c.addEventListener('input',function(){parar(a);var cc=d.controles.filter(function(x){return x.nome===c.dataset.nome})[0];
        // A grade fica aqui, não no step do navegador: com pi/12 arredondado, o step não alcança o máximo.
        var g=cc.min+Math.round((+c.value-cc.min)/cc.grade)*cc.grade;g=Math.max(cc.min,Math.min(cc.max,g));a.v[cc.nome]=cc.pi?g:+g.toFixed(d.casas);desenhar(a);
        // Quem arrasta um controle o escolhe: as teclas + e - seguem nele.
        controlesAtivos().forEach(function(o,n){if(o.a===a&&o.c.nome===c.dataset.nome&&(qs[i].escolhido||0)!==n)escolher(n)})});
      // Sem foco no controle, as setas e o passador seguem navegando pelos quadros.
      c.addEventListener('pointerup',function(){c.blur()})});
    // Parâmetros derivados (deriva): soma de Riemann e comprimento da poligonal, refeitos antes de cada desenho.
    a.derivar=(d.derivados||[]).map(function(o){var f=compilar(o.f),de=compilar(o.de),ate=compilar(o.ate),nn=compilar(o.n);return function(p){
      var a0=de(0,p,F),b0=ate(0,p,F),n=Math.max(1,Math.round(nn(0,p,F))),h=(b0-a0)/n,v=0,k;
      if(o.tipo==='poligonal'){for(k=0;k<n;k++){var x=a0+k*h;v+=Math.hypot(h,f(x+h,p,F)-f(x,p,F))}}
      else faixas(f,o.F?compilar(o.F):null,o.tipo,a0,b0,n,p).forEach(function(r){v+=r[1]*r[3]})
      p[o.nome]=v}});
    // Tabela ligada (22/11/2026): um ponto no gráfico que ela segue para cada linha, no lugar do valor; passar o mouse (ou tocar)
    // numa linha acende o ponto, e no ponto acende a linha.
    if(d.gid){var lider=a.q&&a.q.querySelector('svg[data-gid="'+d.gid+'"]');if(lider){var ld=JSON.parse(lider.dataset.anima),
      LX=function(v){return ld.esq+(v-ld.x0)*ld.ux},LY=function(v){return ld.cima+(ld.y1-v)*ld.uy},ns='http://www.w3.org/2000/svg',
      grupo=document.createElementNS(ns,'g'),linhasT=[].slice.call(svg.querySelectorAll('tr[data-x]'));grupo.setAttribute('class','pts-tab');lider.appendChild(grupo);
      var pts=linhasT.map(function(tr,k){var c=document.createElementNS(ns,'circle');c.setAttribute('class','pt a');c.setAttribute('r','8');grupo.appendChild(c);
        var acender=function(on){tr.classList.toggle('acesa',on);c.setAttribute('r',on?'13':'8')};
        // Mouse: acende ao passar. Toque (sem "passar"): o toque fixa o realce nesta linha e apaga o das outras; outro toque apaga.
        [tr,c].forEach(function(el){el.addEventListener('pointerenter',function(ev){if(ev.pointerType!=='touch')acender(true)});
          el.addEventListener('pointerleave',function(ev){if(ev.pointerType!=='touch')acender(false)});
          el.addEventListener('pointerup',function(ev){if(ev.pointerType!=='touch')return;var on=!tr.classList.contains('acesa');
            linhasT.forEach(function(o,m){o.classList.remove('acesa');if(pts[m])pts[m].setAttribute('r','8')});acender(on)})});return c});
      var valorTd=function(tr){return parseFloat(tr.cells[1].textContent.replace('−','-').replace(',','.'))};
      acoes.push(function(){linhasT.forEach(function(tr,k){var y=valorTd(tr),c=pts[k],ok=isFinite(y)&&y>=ld.y0&&y<=ld.y1;
        c.style.display=ok?'':'none';if(ok){c.setAttribute('cx',LX(+tr.dataset.x).toFixed(1));c.setAttribute('cy',LY(y).toFixed(1))}})});
      acoes[acoes.length-1]()}}
    if(d.solido)acoes.push(criarSolido(svg,d.solido,a));
    if(d.superficie)acoes.push(criarSuperficie(svg,d.superficie,a));
    a.acoes=acoes;a.entradas=entradas;
    // Gráfico que segue: todos os parâmetros vêm de outro gráfico do quadro (controle "segue"); não anima por conta própria.
    a.segue=d.controles.length>0&&d.controles.every(function(c){return c.segue});
    d.controles.forEach(function(c){a.v[c.nome]=c.geral});
    return a;
  });
  // O valor ao lado do controle sai com as casas do passo (grade 0,1: uma casa), no máximo as do gráfico: com casas="3" no gráfico, o
  // passador mostrava "h = 5,137" no meio do movimento, e a coluna crescia (15/11/2026, T18). Os rótulos {…} seguem com as casas do gráfico.
  function casasDe(c,casas){if(c.pi)return casas;var g=String(c.grade),i=g.indexOf('.');return Math.min(casas,i<0?0:g.length-i-1)}
  function desenhar(a){
    a.derivar.forEach(function(f){f(a.v)});a.acoes.forEach(function(f){f(a.v)});
    if(!a.segue)animacoes.forEach(function(b){if(!b.segue||b.q!==a.q)return;
      b.d.controles.forEach(function(c){if(c.nome in a.v)b.v[c.nome]=a.v[c.nome]});b.derivar.forEach(function(f){f(b.v)});b.acoes.forEach(function(f){f(b.v)})});
    a.d.controles.forEach(function(c){var e=a.entradas[c.nome];if(!e)return;e.value=a.v[c.nome];
      e.closest('.controle').querySelector('output').textContent=forma(c,a.v[c.nome],casasDe(c,a.d.casas))});
  }
  // A coluna do valor fica com a largura do maior texto possível, a mesma em todos os controles do gráfico: a barra não muda de tamanho nem de lugar.
  function medirValores(a){
    if(!a.q.classList.contains('ativo'))return;
    var maior=0,vals=[];
    a.d.controles.forEach(function(c){var e=a.entradas[c.nome];if(!e)return;
      var val=e.closest('.controle').querySelector('.valor'),out=val.querySelector('output'),antes=out.textContent,passo=c.pi?c.grade/2:c.grade;
      val.style.minWidth='0';vals.push(val);
      var testar=function(v){out.textContent=forma(c,v,casasDe(c,a.d.casas));maior=Math.max(maior,val.getBoundingClientRect().width)};
      for(var k=0,n=Math.round((c.max-c.min)/passo);k<=n;k++)testar(c.min+k*passo);
      c.paradas.forEach(function(s){testar(s[1])});
      out.textContent=antes});
    var larg=a.q.getBoundingClientRect().width;
    if(larg)vals.forEach(function(v){v.style.minWidth=(maior/larg*100+.2).toFixed(2)+'cqw'});
  }
  function parar(a){if(a.raf)cancelAnimationFrame(a.raf);a.raf=0}
  function alvoDoPasso(c,p){var v=c.inicio;c.paradas.forEach(function(s){if(s[0]<=p)v=s[1]});return v}
  function fixar(a,alvo){parar(a);a.d.controles.forEach(function(c){a.v[c.nome]=alvo(c)});desenhar(a)}
  function mover(a,de,para){
    // O que ainda estava em movimento segue até o alvo: avançar no meio do movimento não pode congelar a curva.
    var seguem=a.raf?(a.movendo||[]):[];
    parar(a);
    var nomes=a.d.controles.filter(function(c){return alvoDoPasso(c,de)!==alvoDoPasso(c,para)||seguem.indexOf(c)>=0});
    correr(a,nomes,para);
  }
  function correr(a,nomes,para){
    if(!nomes.length)return;
    if(semMovimento.matches){nomes.forEach(function(c){a.v[c.nome]=alvoDoPasso(c,para)});return desenhar(a)}
    a.movendo=nomes;
    var ini={},t0=null;nomes.forEach(function(c){ini[c.nome]=a.v[c.nome]});
    function quadroAQuadro(t){if(t0===null)t0=t;var u=Math.min(1,(t-t0)/DURACAO),s=u<.5?2*u*u:1-2*(1-u)*(1-u);
      nomes.forEach(function(c){var alvo=alvoDoPasso(c,para),v=u<1?ini[c.nome]+(alvo-ini[c.nome])*s:alvo;
        // Controle de passo inteiro (n retângulos, n lados) anda de inteiro em inteiro também no meio do movimento.
        if(!c.pi&&c.grade>=1&&Number.isInteger(c.grade))v=c.min+Math.round((v-c.min)/c.grade)*c.grade;a.v[c.nome]=v});desenhar(a);
      a.raf=u<1?requestAnimationFrame(quadroAQuadro):0}
    a.raf=requestAnimationFrame(quadroAQuadro);
  }
  function pintarAnimacoes(){
    animacoes.forEach(function(a){
      if(a.segue)return;
      // Fora do quadro atual, na visão geral e na impressão, vale o estado do PDF.
      if(raiz.classList.contains('geral')||raiz.classList.contains('imprimindo')||a.q!==qs[i]){if(a.passo){a.passo=0;fixar(a,function(c){return c.geral})}return}
      if(!a.passo){medirValores(a);fixar(a,function(c){return alvoDoPasso(c,passo)})}
      else if(a.passo!==passo)mover(a,a.passo,passo);
      a.passo=passo;
    });
  }
  // Atalhos: valem para os controles do quadro atual. O escolhido fica marcado quando há mais de um.
  function controlesAtivos(){var l=[];if(raiz.classList.contains('geral'))return l;
    animacoes.forEach(function(a){if(a.q===qs[i])a.d.controles.forEach(function(c){if(!c.mudo)l.push({a:a,c:c})})});return l}
  function marcarEscolhido(){var l=controlesAtivos(),k=qs[i].escolhido||0;
    atalhos.style.display=l.length?'':'none';var varios=atalhos.querySelector('.varios');varios.style.display=l.length>1?'':'none';
    varios.innerHTML=l.map(function(o,n){return '<b class="'+(n===k?'esc':'')+'"><kbd>'+(n+1)+'</kbd> <i>'+(o.c.mostrah||o.c.mostra)+'</i></b>'}).join(' ');
    l.forEach(function(o,n){o.a.entradas[o.c.nome].closest('.controle').classList.toggle('escolhido',l.length>1&&n===k)})}
  function escolher(n){if(n<controlesAtivos().length){qs[i].escolhido=n;marcarEscolhido()}}
  function ajustar(sinal){var l=controlesAtivos(),o=l[qs[i].escolhido||0];if(!o)return;
    var c=o.c,a=o.a;parar(a);
    // Parte do ponto da grade mais próximo, para não acumular erro nem herdar um valor do meio do movimento.
    var v=c.min+(Math.round((a.v[c.nome]-c.min)/c.grade)+sinal)*c.grade;
    v=Math.max(c.min,Math.min(c.max,v));a.v[c.nome]=c.pi?v:+v.toFixed(a.d.casas);desenhar(a)}
  function voltarAoPasso(){animacoes.forEach(function(a){if(a.segue||a.q!==qs[i]||raiz.classList.contains('geral'))return;parar(a);
    correr(a,a.d.controles.filter(function(c){return a.v[c.nome]!==alvoDoPasso(c,passo)}),passo)})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){animacoes.forEach(medirValores)});

// ── tema/js/03-navegacao.js: Troca de quadro e de passo, visor das listas e dos módulos, tela cheia, visão geral, botões do menu.
  // Transição entre quadros: FADE ms para sumir e FADE ms para surgir. Os passos dentro de um quadro não têm transição.
  // Toques durante o fade só atualizam a posição: ao terminar, aparece o quadro mais recente, sem fila de animações.
  var FADE=180, fade=0, semMovimento=window.matchMedia('(prefers-reduced-motion: reduce)');
  raiz.style.setProperty('--fade',FADE+'ms');
  var veu=document.createElement('div');veu.className='veu';document.body.appendChild(veu);
  function revelar(){fade=0;pintar();raiz.classList.remove('trocando')}
  function mostrar(){if(!fade)pintar()}
  function ir(k,p,direto){
    k=Math.max(0,Math.min(qs.length-1,k));
    var muda=k!==i;i=k;passo=p||1;
    if(!muda||direto||semMovimento.matches||raiz.classList.contains('geral'))return mostrar();
    if(!fade){raiz.classList.add('trocando');fade=setTimeout(revelar,FADE)}
  }
  // Nada leva de uma parte ou resolução à seguinte: no fim, › fecha e volta à página. Questões desde 13/11/2026; partes dos módulos
  // (revisão, "Por que vale?", demonstrações) desde 17/11/2026 (professor: "ao final de uma parte, vai direto para a próxima. Não
  // quero."). Antes, as partes seguiam encadeadas (etapa 2 do layout, 12/11/2026).
  function seguinte(){return null}
  function prox(){if(passo<maxPasso(qs[i])){passo++;mostrar()}else if(i<qs.length-1&&mesma(i+1))ir(i+1);else if(lista&&seguinte())abrirLista(qs[i+1].dataset.q,null,true);else if(lista)fecharLista()}
  function ant(){if(passo>1){passo--;mostrar()}else if(i>0&&mesma(i-1))ir(i-1,maxPasso(qs[i-1]))}
  // Na lista: o passo conta todos os passos da questão; no último, o aviso diz para onde › leva.
  function barraLista(){var grupo=qs.filter(function(q){return q.dataset.q===qs[i].dataset.q}),feitos=0,total=0;
    grupo.forEach(function(q){var m=maxPasso(q);if(qs.indexOf(q)<i)feitos+=m;total+=m});
    var g=grupoDe(qs[i].dataset.q),s=document.getElementById('vpasso');if(s)s.textContent=(g?g.nome+' · ':'')+'passo '+(feitos+passo)+' de '+total;
    var ult=feitos+passo>=total,seg=ult?seguinte():null,b=document.querySelector('.barra [data-v=prox]');
    if(b)b.setAttribute('aria-label',!ult?'Próximo passo':seg?'Seguir para '+seg.nome:'Fechar');
    var f=document.querySelector('.fim-q');if(f){f.classList.toggle('ver',ult);f.textContent=ult&&g?'Fim de '+g.nome+'. '+(seg?'› segue para '+seg.nome+'; Esc volta à página.':'› ou Esc volta à página.'):''}
    marcarGL()}
  function abrirLista(n,botao,seguindo){if(!seguindo)origem=botao||null;else{var gg=grupoDe(String(n));if(gg&&gg.bt)origem=gg.bt}
    [].forEach.call(document.querySelectorAll('.resol'),function(r){r.classList.toggle('aberta',r.dataset.q===String(n))});
    document.body.classList.add('visor-aberto');animacoes.forEach(function(a){parar(a);a.passo=0});
    var k=qs.findIndex(function(q){return q.dataset.q===String(n)});ir(k,1,true)}
  function fecharLista(){fecharGL();document.body.classList.remove('visor-aberto');animacoes.forEach(function(a){parar(a);a.passo=0});
    [].forEach.call(document.querySelectorAll('.resol.aberta'),function(r){r.classList.remove('aberta')});if(origem)origem.focus()}
  if(lista){
    [].forEach.call(document.querySelectorAll('[data-abre]'),function(b){b.addEventListener('click',function(){abrirLista(b.dataset.abre,b)})});
    var acoesBarra={ant:function(){ant()},prox:function(){prox()},fim:function(){fecharLista()},ind:function(){alternarGL()}};
    [].forEach.call(document.querySelectorAll('.barra [data-v]'),function(b){b.addEventListener('click',acoesBarra[b.dataset.v])});
  }
  // Tela cheia (10/11/2026): também com o nome antigo do Safari (webkit, iPad com iPadOS antigo). No iPhone a Apple não deixa
  // um site entrar em tela cheia: o botão fica esmaecido, e o jeito é "Adicionar à Tela de Início" (manifest.webmanifest).
  function podeTela(){return !!(document.fullscreenEnabled||document.webkitFullscreenEnabled)}
  function tela(){
    if(document.fullscreenElement||document.webkitFullscreenElement)(document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else if(raiz.requestFullscreen)raiz.requestFullscreen();else if(raiz.webkitRequestFullscreen)raiz.webkitRequestFullscreen()}
  // Visão geral (V): abre rolada até o quadro em que se estava, marcado, e não no começo da aula (professor, 18/11/2026: "seria
  // bom começar em torno do frame que está").
  function geral(){fecharIndice();raiz.classList.toggle('geral');botoes();
    qs.forEach(function(q,k){q.classList.toggle('aqui',k===i&&raiz.classList.contains('geral'))});
    if(raiz.classList.contains('geral')){qs.forEach(ajustarRadicais);
      requestAnimationFrame(function(){qs[i].scrollIntoView({block:'center',behavior:'instant'})})}
    else ajustarRadicais(qs[i]);pintarAnimacoes()}
  // Todos os botões ficam sempre no menu; os que não têm serventia no momento ficam esmaecidos.
  function podeVoltar(){return !raiz.classList.contains('geral')&&(passo>1||(i>0&&mesma(i-1)))}
  function podeAvancar(){return !raiz.classList.contains('geral')&&(passo<maxPasso(qs[i])||(i<qs.length-1&&mesma(i+1))||lista)}
  function botoes(){
    [].forEach.call(document.querySelectorAll('#bAnt,.barra [data-v=ant]'),function(b){b.disabled=!podeVoltar()});
    [].forEach.call(document.querySelectorAll('#bPro'),function(b){b.disabled=!podeAvancar()});
  }

// ── tema/js/04-menu.js: Menu dos quadros e a dica das teclas da animação.
  // Índice (botão e tecla I): as aulas e exercícios; os módulos de base dizem o seu em data-indice.
  var indice=document.body.dataset.indice||'../Aulas-e-exercicios.html';
  // Na aula (12/11/2026): "‹ Aulas" sai para o tópico em "Aulas e exercícios", e "Índice (I)" abre o índice retrátil.
  var cod=((document.querySelector('.divisor .cod')||{}).textContent||'').trim(),sair=indice+(cod?'#'+cod:'');
  var ctl=document.createElement('nav');ctl.className='ctl';ctl.setAttribute('aria-label','Navegação');
  // Pílula da aula (barra comum, 13/11/2026, docs/planejamento-barra.md): só o que é do quadro. "‹ Aulas", Anterior, Próxima, as
  // preferências, a busca e o "Ir para" passaram à barra do topo (caminho, painel Aparência e "Ir para"); Backspace segue voltando.
  ctl.innerHTML='<button id="bAnt" aria-label="Anterior">‹</button><span id="cont"></span><button id="bPro" aria-label="Próximo">›</button>'+
    (lista?'<a href="'+indice+'">Índice (I)</a>':'<button id="bInd" aria-expanded="false" aria-controls="indice">Índice (I)</button>')+
    '<button id="bGer">Visão geral (V)</button><button id="bTel">Tela cheia (F)</button>';
  document.body.appendChild(ctl);
  // Dica das teclas da animação, no canto de cima, onde nunca encontra o menu. Fica sempre visível em quadro com controle.
  var atalhos=document.createElement('div');atalhos.className='ctl atalhos';
  atalhos.innerHTML='<span><kbd>+</kbd> <kbd>−</kbd> muda o valor</span><span><kbd>R</kbd> volta ao passo</span><span class="varios"></span>';
  document.body.appendChild(atalhos);
// ── tema/js/05-indice-aula.js: Índice retrátil da aula, linha de progresso, quadros vistos e "continuar de onde parou".
  // Índice retrátil da aula (12/11/2026, do mock aprovado em ../mock-layout/aula.html): só aparece quando chamado (I, botão
  // "Índice", alça na borda esquerda) e some com Esc, clique fora ou ao escolher um quadro; fixado, fica ao lado do quadro.
  // Abas: os quadros desta aula (com filtros), miniaturas (montadas só quando a aba abre) e todas as aulas (do <template>
  // que o construir.py põe na página). A linha de progresso, no alto, tem um trecho por seção e aparece com o menu.
  var gav=null,vistos={},prog=null,rolar=null,aba='aula',filtro='tudo',alca=null,ta=0,infos=[];
  // Seções de aprofundamento (etapa 2, 22/11/2026): a camada de cada seção, do data-camada do divisor (nunca do texto "Seção N de M").
  var camSec={},LIVRO='<svg class="ic-livro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5v13"/></svg>';
  if(!lista)qs.forEach(function(q,k){if(q.classList.contains('divisor')&&q.dataset.camada)camSec[secDe[k]]=q.dataset.camada});
  var SELO_CURTO='<span class="selo-curto" title="Para estudar sozinho, fora da prova">'+LIVRO+'aprofundamento</span>';
  var ROT={te:'Teorema',ex:'Exemplo',sv:'Sua vez',ga:'Gancho',at:'Atenção',re:'Retomada',tit:'',div:'',gab:'Gabarito'};
  function htmlDe(el,tira){if(!el)return '';var c=el.cloneNode(true);[].forEach.call(c.querySelectorAll(tira||'.rot,.base-etq'),function(x){x.remove()});
    [].forEach.call(c.querySelectorAll('[id]'),function(x){x.removeAttribute('id')});return c.innerHTML.trim()}
  function infoDe(q,k){
    if(q.classList.contains('divisor'))return {tipo:'div',rotulo:'',titulo:'Abertura da seção'};
    var f=q.querySelector('.faixa span');
    if(q.classList.contains('gabarito'))return {tipo:'gab',rotulo:f?f.textContent:'Gabarito',titulo:'Resolução'};
    if(q.classList.contains('suavez'))return {tipo:'sv',rotulo:f?f.textContent:'Sua vez',titulo:htmlDe(q.querySelector('.in>h2'))||htmlDe(q.querySelector('.in p'))||htmlDe(q.querySelector('.bloco>h3'))};
    var b=q.querySelector('.bloco'),r=q.querySelector('.bloco>h3 .rot'),h2=q.querySelector('.in>h2'),h3=q.querySelector('.bloco>h3');
    var c=b?b.classList:{contains:function(){return false}};
    var tipo=c.contains('te')||c.contains('de')?'te':c.contains('ex')?'ex':c.contains('ga')?'ga':c.contains('at')?'at':c.contains('re')?'re':'tit';
    if(h2)return {tipo:r?tipo:'tit',rotulo:r?r.textContent.replace(/\s+/g,' ').trim():'',titulo:htmlDe(h2)};
    return {tipo:tipo,rotulo:r?r.textContent.replace(/\s+/g,' ').trim():'',titulo:htmlDe(h3)||('Quadro '+(q.dataset.n||k+1))}}
  function montarIndice(){
    if(!gav)return;gav.querySelector('.filtros').style.display=aba==='aula'?'':'none';
    if(aba==='todas'){var tp=document.getElementById('todas-aulas');rolar.innerHTML='<div class="aulas-l">'+(tp?tp.innerHTML:'')+'</div>';
      var at=rolar.querySelector('.item-a.atual a');if(at)at.addEventListener('click',function(e){e.preventDefault();fecharIndice()});return}
    if(aba==='minis'){var h='<div class="minis">';qs.forEach(function(q,k){h+='<button class="mini'+(camSec[secDe[k]]?' aprof':'')+'" data-k="'+k+'" aria-label="'+(q.dataset.n?'Quadro '+q.dataset.n:'Seção '+secDe[k])+'"><span class="rotn">'+(q.dataset.n||'Seção '+secDe[k])+'</span></button>'});
      rolar.innerHTML=h+'</div>';
      [].forEach.call(rolar.querySelectorAll('.mini'),function(m){var c=qs[+m.dataset.k].cloneNode(true);c.classList.add('ativo');c.removeAttribute('data-n');
        c.setAttribute('aria-hidden','true');c.setAttribute('inert','');[].forEach.call(c.querySelectorAll('.oculto'),function(x){x.classList.remove('oculto')});
        [].forEach.call(c.querySelectorAll('[id]'),function(x){x.removeAttribute('id')});m.insertBefore(c,m.firstChild);m.onclick=function(){escolherQuadro(+m.dataset.k)}});
      marcarIndice();return}
    var h='',sec=-1;
    qs.forEach(function(q,k){var x=infos[k];
      if(secDe[k]!==sec){sec=secDe[k];h+='<div class="secao-i'+(camSec[sec]?' aprof':'')+'">'+(nomeSec[sec]&&/^Seção/.test(((qs[k].querySelector('.ses')||{}).textContent||''))?'Seção '+sec+' · '+nomeSec[sec]:(nomeSec[sec]||''))+(camSec[sec]?SELO_CURTO:'')+'</div>'}
      var sub=x.tipo==='gab'||x.tipo==='div';
      if(filtro==='tit'&&['tit','te','ex','ga'].indexOf(x.tipo)<0)return;
      if(filtro!=='tudo'&&filtro!=='tit'&&x.tipo!==filtro)return;
      var r=x.rotulo||ROT[x.tipo];
      h+='<button class="item k-'+x.tipo+(sub?' sub':'')+'" data-k="'+k+'"><span class="n">'+(q.dataset.n||'§')+'</span><span>'+(r&&!sub?'<span class="k">'+r+'</span>':'')+
        '<span class="t">'+(sub&&r?r+' · ':'')+x.titulo+'</span></span></button>'});
    rolar.innerHTML=h||'<p class="vazio">Nada com esse filtro nesta aula.</p>';
    [].forEach.call(rolar.querySelectorAll('.item'),function(b){b.onclick=function(){escolherQuadro(+b.dataset.k)}});marcarIndice()}
  function marcarIndice(){if(!gav)return;
    [].forEach.call(rolar.querySelectorAll('[data-k]'),function(b){var k=+b.dataset.k;b.classList.toggle('atual',k===i);b.classList.toggle('visto',!!vistos[k]&&k!==i);
      if(k===i)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
    var a=rolar.querySelector('[data-k].atual');if(a&&gav.classList.contains('ver')){var r=a.getBoundingClientRect(),c=rolar.getBoundingClientRect();if(r.top<c.top||r.bottom>c.bottom)rolar.scrollTop+=r.top-c.top-c.height/3}}
  function escolherQuadro(k){ir(k,1,true);if(!document.body.classList.contains('fixo'))fecharIndice()}
  function abrirIndice(){if(!gav)return;if(raiz.classList.contains('geral'))geral();gav.classList.add('ver');gav.removeAttribute('inert');gav.setAttribute('aria-hidden','false');
    document.getElementById('bInd').setAttribute('aria-expanded','true');if(alca)alca.classList.remove('ver');marcarIndice();
    var a=rolar.querySelector('.atual')||rolar.querySelector('button,a');if(a)a.focus({preventScroll:true})}
  function fecharIndice(){if(!gav||!gav.classList.contains('ver'))return;var volta=gav.contains(document.activeElement);
    gav.classList.remove('ver');gav.setAttribute('inert','');gav.setAttribute('aria-hidden','true');document.getElementById('bInd').setAttribute('aria-expanded','false');
    document.body.classList.remove('fixo');gav.querySelector('.fixar').setAttribute('aria-pressed','false');if(volta)document.activeElement.blur();ajustarRadicais(qs[i])}
  function alternarIndice(){if(gav)gav.classList.contains('ver')?fecharIndice():abrirIndice()}
  // "Continuar de onde parou" no início e os quadros vistos de cada aula (calculo-quadros, {"T14-EE":"1-7,9"}), para o percentual em
  // "Aulas e exercícios" (pedido do professor, 12/11/2026: com várias seções, "vista" por ter aberto uma não servia). Só neste navegador.
  var chaveAula=(location.pathname.match(/(T\d\d[a-z]?-[A-Z]{2,3})\.html$/)||[])[1],vistosSalvos={};
  if(!lista&&chaveAula){vistosSalvos=Memoria.vistos(chaveAula);Memoria.gravar(Memoria.chave('vistas'),null);
    qs.forEach(function(q,k){if(q.dataset.n&&vistosSalvos[q.dataset.n])vistos[k]=1})}
  var gu=0;function guardarUltima(){if(chaveAula&&qs[i].dataset.n)vistosSalvos[qs[i].dataset.n]=1;clearTimeout(gu);gu=setTimeout(function(){try{var m=location.pathname.match(/(T\d\d[a-z]?)-([A-Z]{2,3})\.html$/);if(!m)return;
    Memoria.gravarVistos(chaveAula,vistosSalvos);
    var s=secDe[i];Memoria.gravarJSON(Memoria.chave('ultima'),{u:'aulas/'+m[1]+'-'+m[2]+'.html',h:qs[i].dataset.n||'s'+s,cod:m[1],
      tit:document.title.replace(/^T\d\d[a-z]?\s*/,''),n:qs[i].dataset.n||'',tot:numerados,sec:nomeSec[s]&&s?'Seção '+s+': '+nomeSec[s]:''})}catch(e){}},400)}
  function bordaEsquerda(e){if(!alca||gav.classList.contains('ver')||raiz.classList.contains('geral'))return;
    if(e.clientX<14){alca.classList.add('ver');clearTimeout(ta);ta=setTimeout(function(){alca.classList.remove('ver')},2000)}}
  function pintarProg(){if(!prog)return;[].forEach.call(prog.children,function(t){var s=+t.dataset.s,ks=[];secDe.forEach(function(x,k){if(x===s)ks.push(k)});
    var f=i>ks[ks.length-1]?1:i<ks[0]?0:(i-ks[0]+1)/ks.length;t.firstChild.style.width=(f*100)+'%'})}
  // Quadro moderno (etapa 5, 12/11/2026): a seção no pé do quadro, ao lado do tópico (tema.css, .pe>span[data-sec]).
  if(!lista)qs.forEach(function(q,k){var h=q.querySelector('.pe>span');if(h&&secReal[secDe[k]])h.dataset.sec='Seção '+secDe[k]+': '+nomeSec[secDe[k]]});
  // Seção de aprofundamento (21/11/2026, docs/planejamento-aprofundamento.md): nos quadros .aprof, o nome da seção num span com o
  // livro antes (o ::after do data-sec fica sem conteúdo no tema.css), para o ícone e o aria-label "aprofundamento". A palavra
  // "Aprofundamento" (.pe-aprof) só aparece no papel (impressao.css, etapa 3, 22/11/2026).
  if(!lista)qs.forEach(function(q){var h=q.classList.contains('aprof')&&q.querySelector('.pe>span[data-sec]');if(!h)return;
    var s=document.createElement('span');s.className='pe-sec';
    s.innerHTML=' · <svg class="ic-livro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="aprofundamento"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5v13"/></svg><span class="pe-aprof">Aprofundamento · </span>';
    s.appendChild(document.createTextNode(h.dataset.sec));h.appendChild(s)});
  if(!lista&&qs.length){
    infos=qs.map(infoDe);
    var por={};secDe.forEach(function(s){por[s]=(por[s]||0)+1});
    prog=document.createElement('div');prog.className='prog';prog.setAttribute('aria-hidden','true');
    prog.innerHTML=Object.keys(por).map(function(s){return '<div class="tr'+(camSec[s]?' aprof':'')+'" data-s="'+s+'" style="flex:'+por[s]+'"><i></i><span>'+(nomeSec[s]?'Seção '+s+': '+nomeSec[s]:'')+'</span></div>'}).join('');
    document.body.appendChild(prog);
    var te=document.querySelector('.divisor .tit'),tit=document.title;
    if(te){te=te.cloneNode(true);[].forEach.call(te.querySelectorAll('br'),function(b){b.replaceWith(' ')});tit=te.textContent.replace(/\s+/g,' ').trim()}
    gav=document.createElement('aside');gav.className='indice';gav.id='indice';gav.setAttribute('aria-label','Índice da aula');gav.setAttribute('aria-hidden','true');gav.setAttribute('inert','');
    var pe=document.getElementById('pe-indice');
    gav.innerHTML='<header><div class="l1"><span class="cod">'+cod+'</span><span class="tt"></span>'+
      '<button class="ib fixar" aria-pressed="false" title="Fixar ao lado do quadro" aria-label="Fixar ao lado do quadro"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg></button>'+
      '<button class="ib fechar" title="Fechar (Esc)" aria-label="Fechar o índice">✕</button></div>'+
      '<div class="abas" role="tablist"><button role="tab" aria-selected="true" data-aba="aula">Nesta aula</button><button role="tab" aria-selected="false" data-aba="minis">Miniaturas</button><button role="tab" aria-selected="false" data-aba="todas">Todas as aulas</button></div>'+
      '<div class="filtros"><button aria-pressed="true" data-f="tudo">Tudo</button><button aria-pressed="false" data-f="tit">Só títulos</button><button aria-pressed="false" data-f="sv">Sua vez</button><button aria-pressed="false" data-f="te">Teoremas</button><button aria-pressed="false" data-f="ex">Exemplos</button></div></header>'+
      '<div class="rolar"></div><footer>'+(pe?pe.innerHTML:'')+'</footer>';
    gav.querySelector('.tt').textContent=tit.replace(/^T\d\d[a-z]?\s*/,'');
    document.body.appendChild(gav);rolar=gav.querySelector('.rolar');
    var veuI=document.createElement('div');veuI.className='veu-i';document.body.appendChild(veuI);veuI.onclick=fecharIndice;
    alca=document.createElement('button');alca.className='alca';alca.textContent='Índice';alca.setAttribute('aria-label','Abrir o índice da aula');alca.tabIndex=-1;
    document.body.appendChild(alca);alca.onclick=abrirIndice;
    gav.querySelector('.fechar').onclick=fecharIndice;
    // No celular, arrastar o índice para a esquerda o fecha (12/11/2026).
    (function(){var x0=null,y0=0;gav.addEventListener('touchstart',function(e){if(e.touches.length===1){x0=e.touches[0].clientX;y0=e.touches[0].clientY}},{passive:true});
      gav.addEventListener('touchend',function(e){if(x0===null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
        if(dx<-60&&Math.abs(dx)>1.5*Math.abs(dy))fecharIndice()},{passive:true})})();
    gav.querySelector('.fixar').onclick=function(){var f=document.body.classList.toggle('fixo');this.setAttribute('aria-pressed',f);ajustarRadicais(qs[i])};
    [].forEach.call(gav.querySelectorAll('.abas button'),function(b){b.onclick=function(){aba=b.dataset.aba;
      [].forEach.call(gav.querySelectorAll('.abas button'),function(o){o.setAttribute('aria-selected',o===b)});montarIndice()}});
    [].forEach.call(gav.querySelectorAll('.filtros button'),function(b){b.onclick=function(){filtro=b.dataset.f;
      [].forEach.call(gav.querySelectorAll('.filtros button'),function(o){o.setAttribute('aria-pressed',o===b)});montarIndice()}});
    document.getElementById('bInd').onclick=alternarIndice;
    // Miniaturas e quadros do índice seguem o modo e as cores: refeitas quando as preferências mudam.
    document.addEventListener('preferencias',function(){if(aba==='minis')montarIndice()});
    montarIndice();
  }
// ── tema/js/06-listas.js: Links "de onde vim" da aula; listas e módulos: feitas, índice da página, índice dos quadros.
  // Aula: os links dos quadros para a revisão da base e as demonstrações levam de onde vieram (?de=T14-EE.7), e o módulo mostra
  // "Voltar ao quadro" (etapa 2, 12/11/2026).
  if(!lista){var curso=(location.pathname.match(/-([A-Z]{2,3})\.html$/)||[])[1];
    if(cod&&curso)qs.forEach(function(q){if(!q.dataset.n)return;[].forEach.call(q.querySelectorAll('a[href]'),function(a){var h=a.getAttribute('href');
      if(!/(^|\/)(base|complementar)\/[BC]\d\d[a-z]?\.html/.test(h))return;var k=h.search(/#|$/);
      a.setAttribute('href',h.slice(0,k)+(h.slice(0,k).indexOf('?')<0?'?':'&')+'de='+cod+'-'+curso+'.'+q.dataset.n+h.slice(k))})})}

  // Listas e módulos (etapa 2, 12/11/2026, do mock em ../mock-layout/doc.html).
  // O nome da questão ("Questão 3"): só o texto do título, sem a seta de recolher, o nível e o "Marcar feita" (13/11/2026: o índice
  // lia o primeiro nó do título e, com a seta na frente, ficou em branco).
  function tituloQ(h){var s='';[].forEach.call(h.childNodes,function(n){if(n.nodeType===3)s+=n.textContent});return s.trim()}
  var gl=null,grupos=[];
  function grupoDe(q){for(var k=0;k<grupos.length;k++)if(grupos[k].q===q)return grupos[k];return null}
  function marcarGL(){if(!gl)return;var r=gl.querySelector('.rolar');
    [].forEach.call(r.querySelectorAll('.item'),function(b){var at=+b.dataset.k===i;b.classList.toggle('atual',at);if(at)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
    var a=r.querySelector('.atual');if(a&&gl.classList.contains('ver')){var x=a.getBoundingClientRect(),c=r.getBoundingClientRect();if(x.top<c.top||x.bottom>c.bottom)r.scrollTop+=x.top-c.top-c.height/3}}
  function abrirGL(){if(!gl)return;montarGL();gl.classList.add('ver');gl.removeAttribute('inert');gl.setAttribute('aria-hidden','false');
    var b=document.querySelector('.barra [data-v=ind]');if(b)b.setAttribute('aria-expanded','true');marcarGL();var a=gl.querySelector('.atual');if(a)a.focus({preventScroll:true})}
  function fecharGL(){if(!gl||!gl.classList.contains('ver'))return;var volta=gl.contains(document.activeElement);gl.classList.remove('ver');gl.setAttribute('inert','');gl.setAttribute('aria-hidden','true');
    var b=document.querySelector('.barra [data-v=ind]');if(b)b.setAttribute('aria-expanded','false');document.body.classList.remove('fixo');gl.querySelector('.fixar').setAttribute('aria-pressed','false');
    if(volta)document.activeElement.blur()}
  function alternarGL(){if(gl)gl.classList.contains('ver')?fecharGL():abrirGL()}
  function lerFeitas(){return Memoria.lerJSON(chaveFeitas,{})}
  function gravarFeitas(f){Memoria.gravarJSON(chaveFeitas,f)}
  var chaveFeitas=Memoria.chave('feita')+':'+location.pathname.split('/').slice(-2).join('/').replace(/\.html$/,'');
  function tituloQuadro(q,k){var f=q.querySelector('.faixa span'),r=q.querySelector('.bloco>h3 .rot'),h=q.querySelector('.in>h2')||q.querySelector('.bloco>h3 .tt')||q.querySelector('.bloco>h3');
    var t=h?h.cloneNode(true):null;if(t)[].forEach.call(t.querySelectorAll('.rot,.base-etq'),function(x){x.remove()});
    var tt=t?t.textContent.replace(/\s+/g,' ').trim():'';
    return (f&&!/Resolução|Questão|Exercício|Desafio|Revisão|Demonstração|Por que vale/.test(f.textContent)?f.textContent+' · ':'')+(r?r.textContent.trim()+(tt?' · ':''):'')+(tt||(r?'':'Passo '+(k+1)))}
  // No índice do visor, a resolução de uma questão mostra só os passos dela (13/11/2026); as partes do módulo, todas as partes.
  function montarGL(){var f=lerFeitas(),h='',at=grupoDe(qs[i].dataset.q);
    grupos.filter(function(g){return at&&at.art?g===at:!g.art}).forEach(function(g){var ok=g.art&&f[g.art.id];h+='<div class="g'+(ok?' ok':'')+'">'+g.nome+'</div>';
      g.ks.forEach(function(k,j){h+='<button class="item" data-k="'+k+'"><span class="n">'+(j+1)+'/'+g.ks.length+'</span><span class="t"></span></button>'})});
    var r=gl.querySelector('.rolar');r.innerHTML=h;
    [].forEach.call(r.querySelectorAll('.item'),function(b){var k=+b.dataset.k;b.querySelector('.t').textContent=tituloQuadro(qs[k],k);
      b.onclick=function(){var q=qs[k].dataset.q;if(qs[i].dataset.q!==q)abrirLista(q,null,true);ir(k,1,true);if(!document.body.classList.contains('fixo'))fecharGL()}});
    var vis=grupos.filter(function(g){return at&&at.art?g===at:!g.art}),nq=vis.reduce(function(n,g){return n+g.ks.length},0);
    gl.querySelector('footer').textContent=(at&&at.art?at.nome:vis.length+' parte'+(vis.length>1?'s':''))+' · '+nq+' quadro'+(nq>1?'s':'');
    marcarGL()}
  if(lista&&qs.length&&!par.has('conferir')){
    var cab=document.querySelector('.cab-lista'),cabTxt=cab&&cab.querySelector('div>p');
    // Grupos do visor: cada botão "abrir" (questão, parte da revisão, "Por que vale?").
    [].forEach.call(document.querySelectorAll('.resol'),function(r){var q=r.dataset.q,bt=document.querySelector('[data-abre="'+q+'"]'),art=bt&&bt.closest('.questao'),car=bt&&bt.closest('.cartao');
      var nome=art?tituloQ(art.querySelector('h2')):car?car.querySelector('b').textContent.replace(/^Parte (\d+) · .*/,'Parte $1'):'Parte '+q,ks=[];
      qs.forEach(function(s,k){if(s.dataset.q===q)ks.push(k)});grupos.push({q:q,nome:nome,art:art,bt:bt,ks:ks})});
    var codP=((cab&&cab.querySelector('.cod'))||{}).textContent||'',titP=((cab&&cab.querySelector('h1'))||{}).textContent||document.title;
    gl=document.createElement('aside');gl.className='indice';gl.setAttribute('aria-label','Índice dos quadros');gl.setAttribute('aria-hidden','true');gl.setAttribute('inert','');
    gl.innerHTML='<header><div class="l1"><span class="cod"></span><span class="tt"></span>'+
      '<button class="ib fixar" aria-pressed="false" title="Fixar ao lado do quadro" aria-label="Fixar ao lado do quadro"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg></button>'+
      '<button class="ib fechar" title="Fechar (Esc)" aria-label="Fechar o índice">✕</button></div></header><div class="rolar"></div><footer></footer>';
    gl.querySelector('.cod').textContent=codP.split(' · ')[0];gl.querySelector('.tt').textContent=titP;
    document.body.appendChild(gl);var veuG=document.createElement('div');veuG.className='veu-i';document.body.appendChild(veuG);veuG.onclick=fecharGL;
    gl.querySelector('.fechar').onclick=fecharGL;
    (function(){var x0=null,y0=0;gl.addEventListener('touchstart',function(e){if(e.touches.length===1){x0=e.touches[0].clientX;y0=e.touches[0].clientY}},{passive:true});
      gl.addEventListener('touchend',function(e){if(x0===null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
        if(dx<-60&&Math.abs(dx)>1.5*Math.abs(dy))fecharGL()},{passive:true})})();
    gl.querySelector('.fixar').onclick=function(){this.setAttribute('aria-pressed',document.body.classList.toggle('fixo'));ajustarRadicais(qs[i])};
    // Cartões das partes (revisão, "Por que vale?", demonstrações): a miniatura do primeiro quadro da parte, que também abre a parte
    // (pedido do professor, 12/11/2026).
    // Com a figura da parte desenhada (tema/figuras-partes.js, B06.r1), ela; sem, a miniatura.
    var codM=(((document.querySelector('.cab-lista .cod')||{}).textContent||'').split(' · ')[0]).trim();
    [].forEach.call(document.querySelectorAll('.cartoes .cartao'),function(c){var b=c.querySelector('[data-abre]'),g=b&&grupoDe(b.dataset.abre);if(!g||!g.ks.length)return;
      var fg=window.figura&&codM?figura(codM+'.'+g.q):'';
      if(fg){var cp=document.createElement('div');cp.className='capa-p';cp.setAttribute('aria-hidden','true');cp.innerHTML=fg;c.insertBefore(cp,c.firstChild);cp.onclick=function(){b.click()};return}
      var q=qs[g.ks[0]].cloneNode(true),m=document.createElement('div');m.className='mini-p';m.setAttribute('aria-hidden','true');
      q.classList.add('ativo');q.removeAttribute('data-n');q.removeAttribute('data-q');q.setAttribute('inert','');
      [].forEach.call(q.querySelectorAll('.oculto'),function(x){x.classList.remove('oculto')});[].forEach.call(q.querySelectorAll('[id]'),function(x){x.removeAttribute('id')});
      m.appendChild(q);c.insertBefore(m,c.firstChild);m.onclick=function(){b.click()}});
    // "Marcar feita" em cada questão, guardado no navegador, com o progresso no cabeçalho e no índice da página.
    var qsP=[].slice.call(document.querySelectorAll('main .questao')),item=qsP.length?tituloQ(qsP[0].querySelector('h2')).split(' ')[0].toLowerCase():'';
    var prog=null;
    if(qsP.length&&cabTxt){prog=document.createElement('div');prog.className='progresso';prog.innerHTML='<div class="barra-p"><i style="width:0"></i></div><span></span>';cabTxt.after(prog)}
    function progresso(){if(!prog)return;var f=lerFeitas(),n=qsP.filter(function(q){return f[q.id]}).length,fr=(item==='questão'?'feitas':'feitos');
      prog.querySelector('i').style.width=(100*n/qsP.length)+'%';prog.querySelector('span').textContent=n+' de '+qsP.length+' '+(item==='questão'?'questões':item+'s')+' '+fr}
    qsP.forEach(function(a){var b=document.createElement('button');b.type='button';b.className='feita';a.querySelector('h2').appendChild(b);
      function pinta(){var ok=!!lerFeitas()[a.id];a.classList.toggle('ok',ok);b.textContent=ok?'✓ Feita':'Marcar feita';b.setAttribute('aria-pressed',ok)}
      pinta();b.onclick=function(){var f=lerFeitas();f[a.id]=!f[a.id];if(!f[a.id])delete f[a.id];gravarFeitas(f);pinta();progresso();montarIP()}});
    progresso();
    // Questões que recolhem (13/11/2026, pedido do professor: "quero ter a opção de colapsar qualquer questão", do mock
    // mock-layout/lista-recolher.html): a seta antes de "Questão N" ou a linha do título recolhem e abrem; recolhida, fica só o título,
    // com o "Marcar feita". "Recolher todas" fica acima da primeira. Ir a uma questão (índice da página, #q3) a abre. Guardado por página,
    // à parte das feitas (<disc>-recolhida:<página>).
    (function(){if(!qsP.length)return;var chaveRec=Memoria.chave('recolhida')+chaveFeitas.slice(chaveFeitas.indexOf(':')),rec=Memoria.lerJSON(chaveRec,[]),bt;
      if(!Array.isArray(rec))rec=[];
      function nomeQ(a){return tituloQ(a.querySelector('h2'))}
      function recolher(a,v,quieto){a.classList.toggle('rq-fechada',v);var b=a.querySelector('.rq-seta');b.setAttribute('aria-expanded',!v);b.setAttribute('aria-label',(v?'Abrir a ':'Recolher a ')+nomeQ(a));
        if(quieto)return;rec=qsP.filter(function(x){return x.classList.contains('rq-fechada')}).map(function(x){return x.id});Memoria.gravarJSON(chaveRec,rec.length?rec:null);botao()}
      qsP.forEach(function(a){var h=a.querySelector('h2'),b=document.createElement('button');b.type='button';b.className='rq-seta';
        b.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
        h.insertBefore(b,h.firstChild);h.addEventListener('click',function(e){if(e.target.closest('.feita,a'))return;recolher(a,!a.classList.contains('rq-fechada'))});
        recolher(a,rec.indexOf(a.id)>=0,true)});
      bt=document.createElement('button');bt.type='button';bt.className='rq-tudo';var ln=document.createElement('div');ln.className='rq-linha';ln.appendChild(bt);qsP[0].before(ln);
      function botao(){var todas=qsP.every(function(a){return a.classList.contains('rq-fechada')});bt.textContent=todas?'Abrir todas':'Recolher todas';bt.dataset.abrir=todas?'1':''}
      bt.onclick=function(){var abrir=!!bt.dataset.abrir;qsP.forEach(function(a){recolher(a,!abrir,true)});recolher(qsP[0],!abrir)};botao();
      // "Só o que cai em prova" (etapa 4 do aprofundamento, 22/11/2026; docs/planejamento-aprofundamento.md, proposta 7; mock em
      // ../mock-layout/aprofundamento/listas/): ao lado de "Recolher todas", só na lista com questão de aprofundamento (.aprof-q,
      // posta pela montagem a partir do secao= e da camada da seção). Esconde as de aprofundamento (html.so-nucleo-on), na página, no
      // índice e no "Ir para"; guardado por disciplina (<disc>-so-nucleo), vale para todas as listas dela. "N de M feitas" segue
      // somando todas. Ir a uma questão escondida (pelo endereço #q7) desliga o filtro.
      var aprofs=qsP.filter(function(a){return a.classList.contains('aprof-q')}),chaveSN=Memoria.chave('so-nucleo'),bn=null,av=null;
      function soNucleo(v,quieto){raiz.classList.toggle('so-nucleo-on',v);if(!bn)return;bn.setAttribute('aria-pressed',v);
        av.textContent=v?(aprofs.length===1?'1 questão de aprofundamento escondida':aprofs.length+' questões de aprofundamento escondidas'):'';
        if(!quieto)Memoria.gravar(chaveSN,v?'1':null)}
      if(aprofs.length){bn=document.createElement('button');bn.type='button';bn.className='so-nucleo';bn.textContent='Só o que cai em prova';
        bn.title='Esconde as questões de aprofundamento, para estudar sozinho, fora da prova';
        av=document.createElement('span');av.className='so-nucleo-aviso';av.setAttribute('aria-live','polite');ln.insertBefore(av,bt);ln.appendChild(bn);
        bn.onclick=function(){soNucleo(!raiz.classList.contains('so-nucleo-on'))};soNucleo(Memoria.ler(chaveSN)==='1',true)}
      function abrirPara(id){var a=id&&document.getElementById(id);if(a&&a.classList.contains('aprof-q')&&raiz.classList.contains('so-nucleo-on'))soNucleo(false);
        if(a&&a.classList.contains('rq-fechada'))recolher(a,false)}
      document.addEventListener('click',function(e){var x=e.target.closest('a[href^="#"]');if(x)abrirPara(x.getAttribute('href').slice(1))},true);
      addEventListener('hashchange',function(){abrirPara(location.hash.slice(1))});abrirPara(location.hash.slice(1))})();
    // "Você veio do quadro 7 da T14": ?de=T14-EE.7, posto pelos links dos quadros da aula.
    var de=(par.get('de')||'').match(/^(T\d\d[a-z]?)-([A-Z]{2,3})\.(\d+)$/);
    if(de&&cab){var v=document.createElement('div');v.className='vindo';v.innerHTML='<span></span><a></a>';
      v.firstChild.textContent='Você veio do quadro '+de[3]+' do '+de[1]+'.';v.lastChild.textContent='‹ Voltar ao quadro';
      v.lastChild.setAttribute('href','../aulas/'+de[1]+'-'+de[2]+'.html#'+de[3]);(prog||cabTxt||cab.firstChild).after(v)}
    // Índice da página: seções e questões; aparece quando o cabeçalho sai de vista.
    var ip=document.createElement('nav');ip.className='rail rail-pag';ip.setAttribute('aria-label','Índice da página');
    var bi=document.createElement('button');bi.type='button';bi.className='b-rail';bi.setAttribute('aria-expanded','false');
    bi.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>Índice';
    document.body.appendChild(ip);document.body.appendChild(bi);
    // Questão de aprofundamento (etapa 4, 22/11/2026): no índice, o livro do selo depois do nome, e o item com data-camada.
    function itemQ(q,f){var a=document.createElement('a');a.className='q'+(f[q.id]?' ok':'');a.href='#'+q.id;a.dataset.id=q.id;a.textContent=tituloQ(q.querySelector('h2'));
      var lv=q.classList.contains('aprof-q')&&q.querySelector('h2 .selo-curto .ic-livro');
      if(lv){a.dataset.camada='aprofundamento';a.title='Para estudar sozinho, fora da prova';a.appendChild(lv.cloneNode(true))}return a}
    function montarIP(){var f=lerFeitas(),n=qsP.filter(function(q){return f[q.id]}).length;ip.innerHTML='<h2>Nesta página</h2>';
      if(qsP.length){var pl=document.createElement('div');pl.className='prog-l';pl.innerHTML='<span></span><div class="barra-p"><i></i></div>';
        pl.firstChild.textContent=n+' de '+qsP.length+(item==='questão'?' feitas':' feitos');pl.querySelector('i').style.width=(100*n/qsP.length)+'%';ip.appendChild(pl)}
      [].forEach.call(document.querySelectorAll('main>.parte-base,main>.questao'),function(s){
        if(s.classList.contains('parte-base')){var a=document.createElement('a');a.className='s';a.href='#'+s.id;a.dataset.id=s.id;a.textContent=s.querySelector('h2').textContent;ip.appendChild(a);
          [].forEach.call(s.querySelectorAll('.questao'),function(q){ip.appendChild(itemQ(q,f))})}
        else ip.appendChild(itemQ(s,f))});
      marcarIP()}
    var atualIP='';function marcarIP(){[].forEach.call(ip.querySelectorAll('a[data-id]'),function(a){a.classList.toggle('atual',a.dataset.id===atualIP)})}
    montarIP();
    if(window.IntersectionObserver&&cab){
      new IntersectionObserver(function(es){var fora=!es[0].isIntersecting;ip.classList.toggle('ver',fora);bi.classList.toggle('ver',fora);if(!fora){ip.classList.remove('aberta');bi.setAttribute('aria-expanded','false')}}).observe(cab);
      // Item atual (13/11/2026, professor: o índice "parece que não está indo para o local correto"): o último que já passou do alto
      // da tela, não o que cruza o meio, que marcava a questão de baixo logo depois do salto. Clicar no índice marca o item clicado
      // até a pessoa rolar de novo (no fim da página o item clicado pode não chegar ao alto).
      var alvosIP=[].filter.call(document.querySelectorAll('main .parte-base,main .questao'),function(s){return s.id}),travaIP=false;
      function atualizarIP(){if(travaIP)return;var a='';for(var k=0;k<alvosIP.length;k++){var r=alvosIP[k].getBoundingClientRect();if(!r.height)continue;if(r.top>120)break;a=alvosIP[k].id}
        if(a!==atualIP){atualIP=a;marcarIP()}}
      addEventListener('scroll',atualizarIP,{passive:true});addEventListener('resize',atualizarIP);
      ['wheel','touchstart','keydown'].forEach(function(n){addEventListener(n,function(){travaIP=false},{passive:true})});
      ip.addEventListener('click',function(e){var x=e.target.closest('a[data-id]');if(!x)return;travaIP=true;atualIP=x.dataset.id;marcarIP()});
      atualizarIP()}
    bi.onclick=function(){bi.setAttribute('aria-expanded',ip.classList.toggle('aberta'))};
    ip.addEventListener('click',function(e){if(e.target.closest('a')){ip.classList.remove('aberta');bi.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ip.classList.contains('aberta')){ip.classList.remove('aberta');bi.setAttribute('aria-expanded','false')}});
  }
  // Complementar e base: "quadro 7" em "Onde você vai usar isto" leva direto ao quadro da aula (o número é o do rodapé, igual nos dois cursos).
  if(lista)[].forEach.call(document.querySelectorAll('.usos li'),function(li){var m=li.textContent.match(/quadros? (\d+)/);if(!m)return;
    [].forEach.call(li.querySelectorAll('a[data-ee],a[data-eq]'),function(a){['data-ee','data-eq'].forEach(function(n){var v=a.getAttribute(n);if(v&&v.indexOf('#')<0)a.setAttribute(n,v+'#'+m[1])})})});
  document.getElementById('bAnt').onclick=ant;document.getElementById('bPro').onclick=prox;
// ── tema/js/07-toque-teclas.js: Menu que aparece e some, toque e gestos no celular, teclas e cliques.
  Pref.ligar();document.getElementById('bTel').onclick=tela;document.getElementById('bTel').disabled=!podeTela();document.getElementById('bGer').onclick=geral;
  var t;function verMenu(ms){ctl.classList.add('ver');raiz.classList.add('menu-ver');clearTimeout(t);t=setTimeout(esconderMenu,ms||1800)}
  // Ao sumir, o menu tira a seleção do botão clicado com o mouse ou tocado (antes, ela o mantinha aceso), mas não a de quem
  // chegou ao botão pela tecla Tab: para esse, o menu segue à vista enquanto o botão estiver selecionado.
  var teclado=false;
  // Aparelho só de toque (15/11/2026): a classe toque vem já ao abrir, e não só depois do primeiro toque; antes, o primeiro toque
  // acertava os botões do menu ainda escondido (o "Índice" abria direto, sem o menu à vista).
  if(window.matchMedia&&matchMedia('(hover: none) and (pointer: coarse)').matches)raiz.classList.add('toque');
  document.addEventListener('keydown',function(e){if(e.key==='Tab')teclado=true},true);
  document.addEventListener('mousedown',function(){teclado=false},true);
  // Com o mouse em cima do menu, ele não some (pedido do professor, 12/11/2026: sumia ao trocar de quadro pelo botão ›). No toque, o
  // :hover fica preso no último botão tocado, por isso a regra vale só fora do toque.
  // A barra do topo (barra comum, 13/11/2026) aparece e some com o menu: o mouse em cima dela, o foco dentro dela ou o painel de
  // aparência aberto também seguram os dois.
  var barraTopo=document.querySelector("header.topo");
  function segura(){var ap=document.getElementById('aparencia');return (barraTopo&&(barraTopo.contains(document.activeElement)||(!raiz.classList.contains("toque")&&barraTopo.matches(":hover"))))||(ap&&!ap.hidden)}
  function esconderMenu(){if(segura()){clearTimeout(t);t=setTimeout(esconderMenu,1800);return}
    if(!raiz.classList.contains('toque')&&ctl.matches(':hover')){clearTimeout(t);t=setTimeout(esconderMenu,1800);return}
    clearTimeout(t);ctl.classList.remove('ver');raiz.classList.remove('menu-ver');if(!teclado&&ctl.contains(document.activeElement))document.activeElement.blur()}
  // No toque, o Safari do iOS dispara um mousemove de imitação depois de cada toque: ele não pode reabrir o menu.
  var ultimoToque=0;
  document.addEventListener('mousemove',function(e){if(Date.now()-ultimoToque>1500){verMenu();bordaEsquerda(e)}});
  // Celular e tablet (10/11/2026): arrastar para a esquerda avança, para a direita volta. Um toque em qualquer lugar do quadro
  // (desde 15/11/2026; antes, só na faixa de baixo, no meio) mostra o menu; outro toque o esconde (some sozinho em 4 s); arrastar
  // não o mostra. Com o toque, o menu escondido não recebe toques (classe toque em <html>, ver tema.css) e o foco num botão não o
  // mantém aceso.
  // Não vale sobre controles (deslizador, sólido 3D, botões, links), que têm o seu próprio arrasto.
  // No Safari do iOS, se o navegador toma o arrasto (rolagem, zoom), o toque acaba em touchcancel, sem touchend: por isso
  // o arrasto horizontal é segurado no touchmove (preventDefault) e o fim vale tanto no touchend quanto no touchcancel.
  // Gestos (12/11/2026, pedido do professor): puxar para baixo fecha a resolução ou a parte (listas e módulos) e, na aula, volta a
  // "Aulas e exercícios"; o arrasto vertical é segurado, para o navegador não recarregar a página ("puxar para atualizar").
  // No celular de verdade (12/11/2026), o navegador tomava o arrasto nos primeiros pixels e cortava o toque (touchcancel) antes do
  // puxão longo: o arrasto passa a ser segurado desde o primeiro movimento (a aula e o visor não rolam), e vale o maior puxão visto.
  var tx=null,ty=0,lx=0,ly=0,horiz=false,vert=false,maxdy=0,engolir=false;
  [ctl,barraTopo].forEach(function(el){if(el)el.addEventListener('click',function(e){if(engolir){engolir=false;e.preventDefault();e.stopPropagation()}},true)});
  document.addEventListener('touchstart',function(e){
    ultimoToque=Date.now();raiz.classList.add('toque');tx=null;teclado=false;engolir=false;
    // Toque no menu ou na barra ainda escondidos só os mostra: o clique que viria depois é descartado (engolir), para não
    // acionar um botão que a pessoa não via.
    if(ctl.contains(e.target)||(barraTopo&&barraTopo.contains(e.target))){engolir=!ctl.classList.contains('ver');verMenu(4000);return}
    if(e.touches.length!==1||!aberto()||raiz.classList.contains('geral'))return;
    if(e.target.closest&&e.target.closest('input,select,button,a,.cena,.ctl,.barra,.controles,.indice,.alca,table.lig tr[data-x],.pts-tab'))return;
    if(gav&&gav.classList.contains('ver')&&!document.body.classList.contains('fixo'))return;
    tx=lx=e.touches[0].clientX;ty=ly=e.touches[0].clientY;horiz=false;vert=false;maxdy=0;
  },{passive:true});
  document.addEventListener('touchmove',function(e){
    if(tx===null)return;
    if(e.touches.length!==1){tx=null;return}
    lx=e.touches[0].clientX;ly=e.touches[0].clientY;
    if(!horiz&&!vert&&Math.abs(lx-tx)>10&&Math.abs(lx-tx)>Math.abs(ly-ty))horiz=true;
    if(!horiz&&!vert&&ly-ty>10&&ly-ty>Math.abs(lx-tx))vert=true;
    maxdy=Math.max(maxdy,ly-ty);
    if(e.cancelable)e.preventDefault();
  },{passive:false});
  function fimToque(e){
    ultimoToque=Date.now();
    if(tx===null)return;
    if(e.changedTouches&&e.changedTouches.length){lx=e.changedTouches[0].clientX;ly=e.changedTouches[0].clientY}
    var dx=lx-tx,dy=ly-ty;tx=null;
    // Arrastar para o lado troca o quadro; se o menu estava à vista, ele continua (antes sumia a cada troca).
    if(Math.abs(dx)>40&&Math.abs(dx)>1.5*Math.abs(dy)){var via=ctl.classList.contains('ver');if(dx<0)prox();else ant();if(via)verMenu(4000)}
    else if(lista&&Math.max(dy,maxdy)>70&&Math.max(dy,maxdy)>1.5*Math.abs(dx)){if(gl&&gl.classList.contains('ver'))fecharGL();else fecharLista()}
    // Na aula, puxar para baixo fecha a aula e volta ao tópico em "Aulas e exercícios" (pedido do professor, 12/11/2026); o puxão é
    // mais longo que nas listas, para não sair por engano.
    else if(!lista&&Math.max(dy,maxdy)>100&&Math.max(dy,maxdy)>1.8*Math.abs(dx))location.href=sair;
    else if(e.type==='touchend'&&Math.abs(dx)<12&&Math.abs(dy)<12){
      // Um toque em qualquer lugar fora dos controles mostra o menu e a barra; outro toque os esconde (professor, 15/11/2026: "as
      // barras só tem aparecido em ponto específico da tela"; substitui a faixa de baixo, no meio, de 10/11/2026).
      if(ctl.classList.contains('ver'))esconderMenu();else verMenu(4000)}
  }
  document.addEventListener('touchend',fimToque,{passive:true});
  document.addEventListener('touchcancel',fimToque,{passive:true});

  // Esc fecha a aula como fecha a lista e o módulo (23/11/2026, professor: "esc fecha aqui, não nas aulas"; "deveria fechar em
  // todos"). Antes, vê na fase de captura se algum painel estava aberto: o Esc que fecha a Aparência, o "Ir para", a impressão
  // ou o uso offline não fecha também a aula (os painéis fecham nos próprios ouvintes, antes deste).
  var escDePainel=false;
  document.addEventListener('keydown',function(e){if(e.key==='Escape')escDePainel=irAberto()||
    !!document.querySelector('#aparencia:not([hidden]),#offp:not([hidden]),.imp-veu:not([hidden])')},true);
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey)return;
    // Com o painel "Ir para" aberto, as teclas são dele (07b-ir-para.js).
    if(irAberto())return;
    var k=e.key;
    // Com a resolução fechada, a página rola normalmente: só valem M e I.
    if(Pref.tecla(e))return;
    if(!aberto()){if(k==='i'||k==='I')location.href=indice;return}
    // Índice retrátil da aula: I abre e fecha, Esc fecha; aberto (e não fixado), as setas para cima e para baixo andam pela lista.
    if(gav){var dentro=e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');if(dentro)return;
      var ab=gav.classList.contains('ver');
      if(k==='i'||k==='I'){e.preventDefault();alternarIndice();return}
      if(k==='Escape'&&ab){fecharIndice();return}
      if((k==='Backspace'||(k==='Escape'&&!escDePainel))&&!ab){e.preventDefault();location.href=sair;return}
      if(ab&&gav.contains(document.activeElement)&&(k==='Enter'||k===' '))return;
      if(ab&&!document.body.classList.contains('fixo')&&(k==='ArrowUp'||k==='ArrowDown')){e.preventDefault();
        var bs=[].slice.call(gav.querySelectorAll('.rolar button,.rolar a')),p=bs.indexOf(document.activeElement),
          nx=bs[Math.max(0,Math.min(bs.length-1,p+(k==='ArrowDown'?1:-1)))];if(nx)nx.focus();return}}
    if(lista&&k==='Escape'){if(gl&&gl.classList.contains('ver'))fecharGL();else fecharLista();return}
    if(lista&&(k==='i'||k==='I')){e.preventDefault();alternarGL();return}
    if(lista&&(k==='Home'||k==='End'||k==='v'||k==='V'||k==='f'||k==='F'))return;
    if(k==='ArrowRight'||k==='ArrowDown'||k==='PageDown'||k===' '){e.preventDefault();prox()}
    else if(k==='ArrowLeft'||k==='ArrowUp'||k==='PageUp'){e.preventDefault();ant()}
    else if(k==='Home')ir(0);else if(k==='End')ir(qs.length-1,maxPasso(qs[qs.length-1]));
    else if(k==='f'||k==='F')tela();else if(k==='v'||k==='V')geral();
    else if(k==='+'||k==='='){e.preventDefault();ajustar(1)}else if(k==='-'){e.preventDefault();ajustar(-1)}
    else if(k==='r'||k==='R')voltarAoPasso();
    else if(k>='1'&&k<='9')escolher(+k-1);
  });
  qs.forEach(function(q,k){q.addEventListener('click',function(e){
    if(raiz.classList.contains('geral')){raiz.classList.remove('geral');ir(k,1,true)}
  })});

// ── tema/js/07b-ir-para.js: O "Ir para" na aula, na lista e no módulo, e a roda do mouse na aula e no visor.
  // Fica depois de 07 e antes de 08 (que fecha o escopo comum): o "b" põe a parte nessa ordem na junção do tema.js.
  // Planejamento: docs/planejamento-navegacao.md, aprovado pelo professor em 13/11/2026 ("Aprovar tudo").
  // O painel em si é o da barra do topo (tema/paginas/barra.js, window.IrPara, comum a todas as páginas desde a barra comum,
  // docs/planejamento-barra.md); aqui ficam só as partes que dependem dos quadros.
  // Com o "Ir para" ou o painel de impressão abertos, as teclas e a roda são deles.
  function irAberto(){return (!!window.IrPara&&IrPara.aberto())||(!!window.Impressao&&Impressao.aberto())}
  // Para a impressão (impressao.js): com html.imprimindo, todas as animações vão ao estado da visão geral (02-animacoes.js).
  window.Quadros={repintar:function(){pintarAnimacoes()}};
  if(window.IrPara){
    // Ao abrir: fecha o índice e a visão geral e marca a seção atual da aula.
    IrPara.aoAbrir(function(p){
      if(gav&&gav.classList.contains('ver')&&!document.body.classList.contains('fixo'))fecharIndice();
      if(raiz.classList.contains('geral'))geral();
      if(!lista)[].forEach.call(p.querySelectorAll('[data-sec]'),function(a){var at=+a.dataset.sec===secDe[i];a.classList.toggle('atual',at);
        if(at)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})});
    // Link para a própria lista ou módulo (#q3, #revisao) com o visor aberto: fecha o visor.
    IrPara.aoInterno(function(){if(lista&&document.body.classList.contains('visor-aberto'))fecharLista()});
    // "Ir ao quadro": o número do rodapé, o mesmo do endereço (T14-EE.html#7).
    var fq=document.querySelector('.ip-quadro');
    if(fq)fq.addEventListener('submit',function(e){e.preventDefault();var v=(fq.querySelector('input').value||'').trim();
      if(!qs.some(function(q){return q.dataset.n===v})){fq.classList.add('erro');return}
      fq.classList.remove('erro');IrPara.fechar(true);location.hash='#'+v});
  }

  // Roda do mouse: na aula e no visor aberto, troca o quadro (para baixo ou dois dedos para a esquerda: ›; para cima ou para a
  // direita: ‹). Três modos, no painel Aparência (leitura-roda, preferencias.js):
  //   contínua (o padrão, 14/11/2026, pedido do professor: "a roda tem como funcionar de forma contínua? Com inércia?"): a soma do
  //     deslocamento dá um passo a cada 120 px, com a inércia do trackpad: um giro curto avança um quadro, uma lançada avança vários,
  //     desacelerando com ela; no máximo um passo a cada 100 ms; trocar de sentido zera a soma;
  //   um por giro: a soma passa de 50 px, dá um passo e trava até a roda ficar 180 ms parada (a inércia não dá outro passo);
  //   desligada.
  // Em todos, a roda com "cliques" (deltaMode de linhas, ou passos inteiros de 100 px ou mais) dá um passo por clique, no máximo um a
  // cada 100 ms. Sobre um deslizador, muda o valor dele (como + e -). Não mexe: com Ctrl ou Cmd (zoom), sobre um sólido 3D (a roda
  // aproxima), dentro do índice, da busca, do painel ou de uma caixa que rola, na visão geral. Na aula, para nas pontas; no visor,
  // nunca fecha a resolução nem passa para a questão ou a parte seguinte (só ›, Esc e o toque fazem isso).
  var rAcc=0,rTrava=false,rQuieto=0,rUltimo=0,RODA_PASSO=120,RODA_GIRO=50,RODA_INTERVALO=100;
  function rolavel(el,dx,dy){for(;el&&el!==document.body&&el!==raiz;el=el.parentElement){var cs=getComputedStyle(el);
      if(dy&&/(auto|scroll)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+1&&(dy<0?el.scrollTop>0:el.scrollTop+el.clientHeight<el.scrollHeight-1))return true;
      if(dx&&/(auto|scroll)/.test(cs.overflowX)&&el.scrollWidth>el.clientWidth+1&&(dx<0?el.scrollLeft>0:el.scrollLeft+el.clientWidth<el.scrollWidth-1))return true}
    return false}
  function rodaPasso(s,controle){
    if(controle){var l=controlesAtivos(),n=l.findIndex(function(o){return o.a.entradas&&o.a.entradas[o.c.nome]===controle});if(n<0)return;
      if((qs[i].escolhido||0)!==n)escolher(n);ajustar(-s);return}
    if(s<0){ant();return}
    // Avança só dentro da aula, da questão ou da parte aberta.
    if(passo<maxPasso(qs[i])||(i<qs.length-1&&mesma(i+1)))prox()}
  // O leitor fica só onde a roda troca o quadro: na aula, no body (a página não rola); nas listas e nos módulos, em cada visor
  // (.resol). Preso ao documento inteiro e sem modo passivo, ele fazia toda rolagem das listas esperar o JavaScript (Safari, 14/11/2026).
  function aoGirar(e){
    if(raiz.dataset.roda==='desligada'||e.ctrlKey||e.metaKey||!qs.length||!aberto()||irAberto())return;
    if(raiz.classList.contains('geral')||document.body.classList.contains('busca-aberta'))return;
    if(gav&&gav.classList.contains('ver')&&!document.body.classList.contains('fixo'))return;
    var t=e.target.closest?e.target:e.target.parentElement;if(!t||t.closest('.cena,.indice,.busca-sobre,.ip-veu,.ctl'))return;
    var linhas=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1,dx=e.deltaX*linhas,dy=e.deltaY*linhas,d=Math.abs(dy)>=Math.abs(dx)?dy:dx;
    if(!d||rolavel(t,Math.abs(dx)>Math.abs(dy)?dx:0,Math.abs(dy)>=Math.abs(dx)?dy:0))return;
    e.preventDefault();
    var controle=t.closest('input[type=range]'),s=d>0?1:-1;
    clearTimeout(rQuieto);rQuieto=setTimeout(function(){rTrava=false;rAcc=0},180);
    var agora=Date.now();
    if(e.deltaMode===1||e.deltaMode===2||(Math.abs(d)>=100&&Math.round(d)===d)){if(agora-rUltimo<RODA_INTERVALO)return;rUltimo=agora;rodaPasso(s,controle);return}
    if(raiz.dataset.roda==='giro'){if(rTrava)return;rAcc+=d;if(Math.abs(rAcc)>=RODA_GIRO){rodaPasso(rAcc>0?1:-1,controle);rTrava=true;rAcc=0}return}
    // Contínua: a inércia segue dando passos; a sobra fica para o passo seguinte, e trocar de sentido recomeça a soma.
    if(rAcc&&(rAcc>0)!==(d>0))rAcc=0;
    rAcc+=d;
    if(Math.abs(rAcc)>=RODA_PASSO&&agora-rUltimo>=RODA_INTERVALO){rUltimo=agora;var sg=rAcc>0?1:-1;rAcc-=sg*RODA_PASSO;
      if(Math.abs(rAcc)>RODA_PASSO)rAcc=sg*RODA_PASSO;rodaPasso(sg,controle)}
  }
  (lista?[].slice.call(document.querySelectorAll('.resol')):[document.body]).forEach(function(x){x.addEventListener('wheel',aoGirar,{passive:false})});
// ── tema/js/08-endereco-conferir.js: Endereço (#7, #s2), parâmetros (?abrir, ?inteiro) e a conferência automática (?conferir).
  // Aula: #7 é o quadro de rodapé 7, #s2 a abertura da Seção 2 (12/11/2026); nas listas, a posição, como antes.
  function doEndereco(){var hs=decodeURIComponent(location.hash.slice(1));
    if(lista){var h=parseInt(hs,10);return h>0?h-1:0}
    if(/^s\d+$/.test(hs))return qs.findIndex(function(q,k){return q.classList.contains('divisor')&&secDe[k]===+hs.slice(1)});
    if(/^\d+$/.test(hs))return qs.findIndex(function(q){return q.dataset.n===hs});
    return -1}
  if(qs.length)ir(Math.max(0,doEndereco()),1,true);
  // Link para outro quadro da mesma aula (#12, #s2): vai até ele sem recarregar.
  if(!lista)window.addEventListener('hashchange',function(){var k=doEndereco();if(k>=0&&k!==i)ir(k,1,true)});
  // ?inteiro abre o quadro do endereço (#16) com todos os passos (para conferir em captura).
  if(!lista&&qs.length&&par.has('inteiro')){ir(i,maxPasso(qs[i]),true);animacoes.forEach(function(a){parar(a);a.passo=0});pintar()}
  // ?abrir=3 abre a resolução da questão 3; ?abrir=3.2 abre o quadro 2 dela com todos os passos (para conferir em captura).
  if(lista&&par.get('abrir')){var ab=par.get('abrir').split('.');abrirLista(ab[0]);
    if(ab[1]){var alvo=qs.findIndex(function(q){return q.dataset.n==='Q'+ab[0]+'.'+ab[1]});if(alvo>=0){ir(alvo,maxPasso(qs[alvo]),true);animacoes.forEach(function(a){parar(a);a.passo=0});pintar()}}}

  // Conferência automática: conteúdo fora do quadro e fórmula com erro
  if(par.has('conferir')){
    if(lista){document.body.classList.add('visor-aberto');[].forEach.call(document.querySelectorAll('.resol'),function(r){r.classList.add('aberta')})}
    document.fonts.ready.then(function(){
      ajustarTudo();
      var r=[],dicas=[];
      qs.forEach(function(q,k){
        qs.forEach(function(x){x.classList.remove('ativo')});q.classList.add('ativo');
        // Transição vazia: um passo sem nada novo, por número pulado ou por estar dentro de um bloco que só aparece depois.
        var ps=[].slice.call(q.querySelectorAll('[data-passo]'));
        for(var pv=2,mx=maxPasso(q);pv<=mx;pv++){if(!ps.some(function(e){if(+e.dataset.passo!==pv)return false;
          for(var a=e.parentElement;a&&a!==q;a=a.parentElement){if(a.dataset.passo&&+a.dataset.passo>pv)return false}return true}))r.push('quadro '+(q.dataset.n||k+1)+': passo '+pv+' não mostra nada novo')}
        // Exemplo passo a passo (17/11/2026, docs/planejamento-ganchos-roteiro-e-passos.md): a conta não fica à vista no passo 1
        // nem entra inteira num passo só. Só nas aulas; `aberto` no bloco dispensa.
        // Número de passo da faixa do roteiro fora do bloco (18/11/2026): o passo é parte do gancho, fica dentro dele.
        if([].some.call(q.querySelectorAll('.rpasso'),function(p){return !p.closest('.bloco')}))r.push('quadro '+(q.dataset.n||k+1)+': número do passo fora do bloco');
        // Título preto (19/11/2026, professor: "ou com ou sem títulos pretos, precisamos de consistencia de layout"): o quadro que é um
        // bloco com título próprio (exemplo, teorema, atenção, gancho) não leva o h2; os outros levam. Só nas aulas.
        if(!lista&&!q.matches('.suavez,.gabarito,.divisor')){var h2=q.querySelector(':scope>.in>h2'),pri=h2?h2.nextElementSibling:q.querySelector(':scope>.in>*');
          // Colunas que começam o quadro contam pelo bloco de dentro (definição ao lado do gráfico, dois teoremas lado a lado).
          var tb=function(b){if(b&&b.classList.contains('col'))return [].map.call(b.children,function(c){return tb(c)||tb(c.firstElementChild)}).join('');
            if(!b||!b.classList.contains('bloco'))return '';var h3=b.querySelector(':scope>h3');if(!h3)return '';
            var tt=h3.querySelector('.tt'),ro=h3.querySelector('.rot');if(!tt&&ro)return /\d$/.test(ro.textContent.trim())?'':ro.textContent.trim();return ((tt||h3).textContent||'').trim()};
          // "Nesta seção", "Resumo" e "Onde está o erro?" marcam a seção ou o tipo do quadro e ficam sempre com o título.
          // Tirar só quando o quadro é um bloco só (professor, 19/11/2026: "título preto só em quadros com blocos bem definidos. se for
          // para marcar a seção, pode ter"): o título que junta vários blocos ("Onde está o erro?", "Dois cuidados") fica.
          var umBloco=pri&&pri.classList.contains('bloco')&&q.querySelectorAll('.bloco').length===1;
          if(h2&&umBloco&&tb(pri)&&!/^(Nesta seção|Resumo|Onde está o erro\?)$/.test(h2.textContent.trim()))r.push('quadro '+(q.dataset.n||k+1)+': título preto e bloco com título (tirar o título preto)');
          if(!h2&&!tb(pri))r.push('quadro '+(q.dataset.n||k+1)+': sem título preto nem bloco com título')}
        if(!lista)[].forEach.call(q.querySelectorAll('.bloco.ex:not(.aberto)'),function(b){
          function pp(e){var m=1;for(var a=e;a&&a!==q;a=a.parentElement)if(a.dataset&&a.dataset.passo)m=Math.max(m,+a.dataset.passo);return m}
          var iguais=[].filter.call(b.querySelectorAll('mo'),function(o){return o.textContent.trim()==='='&&!o.closest('svg')&&!o.closest('h3')});
          if(iguais.filter(function(o){return pp(o)===1}).length>=3)r.push('quadro '+(q.dataset.n||k+1)+': exemplo com a conta à vista no passo 1');
          var por={};[].forEach.call(b.querySelectorAll('p,tr'),function(l){if(l.classList.contains('s')||l.classList.contains('junto')||l.closest('svg'))return;
            if(![].some.call(l.querySelectorAll('mo'),function(o){return o.textContent.trim()==='='&&pp(o)===pp(l)}))return;var v=pp(l);if(v>1)por[v]=(por[v]||0)+1});
          for(var v in por)if(por[v]>=2){r.push('quadro '+(q.dataset.n||k+1)+': exemplo com a conta num passo só (passo '+v+')');break}});
        [].forEach.call(q.querySelectorAll('.oculto'),function(e){e.classList.remove('oculto')});
        var nome=q.dataset.n||('divisor '+(k+1)),inn=q.querySelector('.in'),qr=q.getBoundingClientRect(),pe=q.querySelector('.pe'),limite=pe?pe.getBoundingClientRect().top-qr.width*0.004:qr.bottom-qr.height*0.035;
        var ult=0,dir=0;[].forEach.call(inn.children,function(c){var b=c.getBoundingClientRect();ult=Math.max(ult,b.bottom);dir=Math.max(dir,b.right)});
        if(ult>limite+1)r.push('quadro '+nome+': passa da altura em '+((ult-limite)/qr.width*100).toFixed(1)+' cqw');
        // Espaço sobrando embaixo de um quadro com gráfico (19/11/2026, professor: "a figura não pode crescer?"): dica, não problema;
        // o gráfico tinha sido encolhido quando o que passava da altura era o texto. Quadros centrados ficam de fora.
        else if(inn.querySelector('svg.graf')&&!q.classList.contains('centro')&&(limite-ult)/qr.width*100>6)dicas.push('dica: quadro '+nome+': sobram '+((limite-ult)/qr.width*100).toFixed(0)+' cqw embaixo; o gráfico pode crescer');
        // Rótulo da conta que quebra em duas linhas (23/11/2026, professor: "pq o espaço gigante?"): dica, só nas disciplinas com
        // "rotulos_curtos" no disciplina.json (Matemática I); no Cálculo e na ED há rótulos longos de propósito.
        if(document.documentElement.hasAttribute('data-rotulos-curtos'))[].forEach.call(inn.querySelectorAll('table.passos-conta .rt'),function(e){var g=document.createRange();g.selectNodeContents(e.classList.contains('it')?e.lastElementChild:e);
          var rs=[].filter.call(g.getClientRects(),function(x){return x.width>1&&x.height>1}),fim=1e9;
          rs.forEach(function(x){fim=Math.min(fim,x.bottom)});
          if(rs.some(function(x){return x.top>=fim-1}))dicas.push('dica: quadro '+nome+': rótulo da conta em 2 linhas: "'+e.textContent.trim().slice(0,40)+'"')});
        // O <svg> em si entra (23/11/2026: sete fichas com nowrap saíam do quadro sem aviso); só o que está dentro dele fica de fora.
        [].forEach.call(inn.querySelectorAll('*'),function(e){var b=e.getBoundingClientRect();
          if(b.width&&b.right>qr.right-qr.width*0.02&&!(e.parentElement&&e.parentElement.closest('svg'))){r.push('quadro '+nome+': passa da largura <'+e.tagName+'>')}});
        // Fórmula que passa da borda direita do bloco (T27, quadros 7 e 9: o "+ C" na borda), mesmo sem passar do quadro.
        [].forEach.call(inn.querySelectorAll('.bloco math'),function(m){var bl=m.closest('.bloco').getBoundingClientRect(),b=m.getBoundingClientRect();
          if(b.width&&b.right>bl.right-qr.width*0.004){var t='quadro '+nome+': fórmula passa da borda do bloco';if(r.indexOf(t)<0)r.push(t)}});
        [].forEach.call(inn.querySelectorAll('svg.graf'),function(s){var b=s.getBoundingClientRect(),p=s.parentElement.getBoundingClientRect();
          if(b.right>qr.right+1||b.left<qr.left-1)r.push('quadro '+nome+': gráfico fora do quadro');
          var ws=parseFloat(s.style.width);if(ws&&b.width<ws/100*qr.width*0.88)r.push('quadro '+nome+': gráfico encolhido para '+(b.width/qr.width*100).toFixed(0)+' de '+ws+' cqw')});
        // Avisos da montagem do gráfico (data-aviso): campo com escalas diferentes, seta da linha de fase sem espaço (19/11/2026).
        [].forEach.call(inn.querySelectorAll('svg.graf[data-aviso]'),function(s){var t='quadro '+nome+': '+s.dataset.aviso;if(r.indexOf(t)<0)r.push(t)});
        // Controle (deslizador) mais largo que a coluna do gráfico: invade o texto ou a borda do bloco, sem passar do quadro (T18, 15/11/2026).
        [].forEach.call(inn.querySelectorAll('.anima .controle'),function(c){var an=c.closest('.anima').getBoundingClientRect(),b=c.getBoundingClientRect();
          if(b.width&&(b.right>an.right+qr.width*0.003||b.left<an.left-qr.width*0.003)){var t='quadro '+nome+': controle passa da coluna do gráfico';if(r.indexOf(t)<0)r.push(t)}});
        [].forEach.call(inn.querySelectorAll('.bloco>h3'),function(h){var alvo=h.querySelector('.tt')||h.querySelector('.rot')||h,rg=document.createRange();rg.selectNodeContents(alvo);
          // Na fonte dos títulos, a caixa do texto é mais alta que a linha: reduz cada caixa à altura da linha, em torno do centro.
          var alt=parseFloat(getComputedStyle(alvo).lineHeight),linhas=0,fim=-1e9;
          var rs=[].slice.call(rg.getClientRects()).filter(function(b){return b.width>0}).map(function(b){var c=(b.top+b.bottom)/2,m=Math.min(b.height,alt)/2;return {top:c-m,bottom:c+m}}).sort(function(a,b){return a.top-b.top});
          rs.forEach(function(b){if(b.top>=fim-1){linhas++;fim=b.bottom}else fim=Math.max(fim,b.bottom)});
          if(linhas>1)r.push('quadro '+nome+': título de bloco em '+linhas+' linhas: '+alvo.textContent.trim().slice(0,50))});
        // Rótulo escondido (display:none, como os números fixos de um gráfico com zoom no plano, 22/11/2026) não conta.
        function rotulos(s,onde){var ts=[].slice.call(s.querySelectorAll('text,.lbf')).filter(function(e){return e.getClientRects().length>0}).map(function(e){
            if(e.classList.contains('lbf')){var g=document.createRange();g.selectNodeContents(e);return {b:g.getBoundingClientRect(),t:e.textContent.trim()}}
            return {b:e.getBoundingClientRect(),t:e.textContent}});
          for(var a=0;a<ts.length;a++)for(var c=a+1;c<ts.length;c++){var A=ts[a].b,B=ts[c].b,lx=Math.min(A.right,B.right)-Math.max(A.left,B.left),ly=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);
            if(lx>2&&ly>4){var m='quadro '+nome+': rótulos sobrepostos'+onde+': '+ts[a].t+' / '+ts[c].t;if(r.indexOf(m)<0)r.push(m)}}
          {var lim=(s.closest('.bloco')||q).getBoundingClientRect();ts.forEach(function(x){if(x.b.right>lim.right||x.b.left<lim.left||x.b.top<lim.top||x.b.bottom>lim.bottom){var m='quadro '+nome+': rótulo sai do '+(s.closest('.bloco')?'bloco':'quadro')+onde+': '+x.t;if(r.indexOf(m)<0)r.push(m)}})}
          // Rótulo do gráfico que passa da borda do desenho: invade a coluna ao lado sem sair do quadro (17/11/2026, B01 da ED,
          // professor: "sobreposição"). Os números e os nomes dos eixos ficam de fora (o nome do eixo x fica depois da seta).
          if(s.classList.contains('graf')){var sb=s.getBoundingClientRect();[].forEach.call(s.querySelectorAll('text,.lbf'),function(e){
            if(e.classList.contains('tk')||e.classList.contains('axl')||getComputedStyle(e).visibility==='hidden')return;
            var bb;if(e.classList.contains('lbf')){var g=document.createRange();g.selectNodeContents(e);bb=g.getBoundingClientRect()}else bb=e.getBoundingClientRect();
            if(bb.width&&(bb.right>sb.right+2||bb.left<sb.left-2)){var m='quadro '+nome+': rótulo sai do gráfico'+onde+': '+(e.textContent||'').trim().slice(0,30)+' ('+(bb.right>sb.right+2?'direita ':'esquerda ')+Math.ceil(Math.max(bb.right-sb.right,sb.left-bb.left)/qr.width*1000)+')';if(r.indexOf(m)<0)r.push(m)}})}
          encostos(s,onde)}
        // Rótulo encostado em linha, curva ou ponto: testa uma grade de pontos dentro da caixa do rótulo (encolhida 15% de cada
        // lado) contra o traço de cada forma do desenho. A grade de fundo não conta; os números dos eixos ficam por cima das curvas, com contorno.
        function encostos(s,onde){var m0=s.getScreenCTM();if(!m0)return;var inv=m0.inverse(),pt=s.createSVGPoint();
          var formas=[].slice.call(s.querySelectorAll('path,line,polyline,polygon,circle,ellipse,rect')).filter(function(f){
            return !f.closest('defs,clipPath,marker,mask,foreignObject')&&!f.classList.contains('g')&&getComputedStyle(f).visibility!=='hidden'&&getComputedStyle(f).display!=='none'});
          [].forEach.call(s.querySelectorAll('text,.lbf'),function(e){
            if(getComputedStyle(e).visibility==='hidden')return;
            var b;if(e.classList.contains('lbf')){var g=document.createRange();g.selectNodeContents(e);b=g.getBoundingClientRect()}else b=e.getBoundingClientRect();
            if(!b.width||!b.height)return;
            if(e.classList.contains('tk')||e.classList.contains('axl'))return;var eixo=false,dx=b.width*.15,dy=b.height*.15,achou=false;
            for(var u=0;u<5&&!achou;u++)for(var w=0;w<3&&!achou;w++){
              pt.x=b.left+dx+(b.width-2*dx)*u/4;pt.y=b.top+dy+(b.height-2*dy)*w/2;var p=pt.matrixTransform(inv);
              achou=formas.some(function(f){if(eixo&&(f.classList.contains('ax')||f.classList.contains('seta')))return false;
                try{return f.isPointInStroke(p)||(f.tagName==='circle'&&+f.getAttribute('r')<15&&f.isPointInFill(p))}catch(x){return false}})}
            if(achou){var m='quadro '+nome+': rótulo encosta em linha ou ponto'+onde+': '+(e.textContent||'').trim().slice(0,30);if(r.indexOf(m)<0)r.push(m)}})}
        [].forEach.call(inn.querySelectorAll('svg.graf,svg.circ'),function(s){rotulos(s,'')});
        // A dica de atalhos fica sempre à vista: não pode cobrir o conteúdo do quadro.
        if(animacoes.some(function(a){return a.q===q})){i=k;marcarEscolhido();var da=atalhos.getBoundingClientRect();
          [].forEach.call(inn.querySelectorAll('h2,h3,p,li,table,.controle,svg.graf text'),function(c){var b;if(/^(H2|H3|P|LI)$/.test(c.tagName)){var g=document.createRange();g.selectNodeContents(c);b=g.getBoundingClientRect()}else b=c.getBoundingClientRect();
            // Na fonte dos títulos, a caixa do texto sobe bem acima das letras.
            var topo=c.tagName==='H2'?b.top+.3*b.height:b.top;
            if(b.left<da.right&&b.right>da.left&&topo<da.bottom&&b.bottom>da.top)r.push('quadro '+nome+': dica de atalhos cobre <'+c.tagName+'>')})}
        animacoes.forEach(function(a){if(a.q===q)medirValores(a)});
        // Animação: repete a conferência dos rótulos ao longo de cada controle, em nove posições e nas paradas.
        animacoes.forEach(function(a){if(a.q!==q)return;a.d.controles.forEach(function(c){
          var vs=c.paradas.map(function(s){return s[1]}).concat([c.inicio,c.geral]);for(var u=0;u<=8;u++)vs.push(c.min+Math.round((c.max-c.min)*u/8/c.grade)*c.grade);
          vs.forEach(function(v){a.d.controles.forEach(function(o){a.v[o.nome]=o.geral});a.v[c.nome]=v;desenhar(a);if(a.svg.getScreenCTM)rotulos(a.svg,' com '+c.nome+'='+forma(c,v,a.d.casas))});
          a.v[c.nome]=c.geral;desenhar(a)})});
        [].forEach.call(inn.querySelectorAll('math'),function(m){var pr=m.nextSibling;if(!m.querySelector('msqrt,mroot')||!pr||m.closest('.lbf'))return;
          var fim=-1e9;[].forEach.call(m.querySelectorAll('mi,mn,mo,mtext'),function(e){fim=Math.max(fim,e.getBoundingClientRect().right)});
          var g=document.createRange();g.selectNode(pr);var nb=g.getBoundingClientRect();
          if(nb.width&&Math.abs(nb.top-m.getBoundingClientRect().top)<qr.width*.03&&nb.left<fim-1)r.push('quadro '+nome+': fórmula com radical encosta no que vem depois')});
        [].forEach.call(inn.querySelectorAll('.col>*,.col3>*,.col4>*'),function(c){if(c.scrollWidth>c.clientWidth+1&&!c.querySelector('svg,table'))r.push('quadro '+nome+': conteúdo passa da coluna')});
        // Conta fora do <conta> (19/11/2026, professor, no T26: "não deveria ficar no conta?"): num quadro de aula, a linha que é
        // só uma fórmula com dois sinais de relação ou mais (uma cadeia), a que começa por um sinal (continua a de cima) e duas
        // ou mais linhas seguidas de fórmula com sinal são conta, e conta de exemplo vai no <conta>. Definição solta (f(x) = x²)
        // não conta, salvo no bloco que já tem conta. Retomada, definição e teorema enunciam, não fazem conta (T15, 19/11/2026:
        // mudança de base e as hiperbólicas). Fora também: Sua vez, gabarito, Resumo, "Onde está o erro?".
        if(!lista&&!q.matches('.suavez,.gabarito,.divisor')){var h2c=q.querySelector(':scope>.in>h2');
          if(!(h2c&&/^(Resumo|Onde está o erro\?)$/.test(h2c.textContent.trim()))&&![].some.call(inn.querySelectorAll('h3,.tit'),function(t){return /Onde está o erro/.test(t.textContent)})){
            var REL=['=','≈','<','>','≤','≥','≠'],soFormula=function(c){if(c.tagName!=='P'||c.closest('table,svg,.lbf,li'))return null;var ms=c.querySelectorAll('math');if(ms.length!==1)return null;
              var t=c.textContent.replace(ms[0].textContent,'').replace(/[\s.,;:]/g,'');if(t)return null;
              var rs=[].filter.call(ms[0].querySelectorAll('mo'),function(o){return REL.indexOf(o.textContent.trim())>=0&&!o.closest('mfrac,msub,msup,msubsup,munder,mover,munderover')});
              if(!rs.length)return null;var pri=[].find.call(ms[0].querySelectorAll('mi,mn,mo,mtext'),function(e){return e.textContent.trim()});
              return {n:rs.length,comeca:pri===rs[0]}};
            // No bloco que já tem conta ou casas (<conta>, <partes>), toda linha de fórmula com sinal é passo da conta.
            var fora=false;[].forEach.call(inn.querySelectorAll('.bloco,.in'),function(b){if(b.matches('.bloco.re,.bloco.de,.bloco.te,.bloco.con'))return;var seguidas=0,temConta=!!b.querySelector(':scope>table.passos-conta,:scope>table.casas');
              [].forEach.call(b.children,function(c){var f=soFormula(c);
              if(!f){seguidas=0;return}seguidas++;if(f.n>=2||f.comeca||seguidas>=2||temConta)fora=true})});
            if(fora)r.push('quadro '+nome+': conta fora do <conta>')}}
        // Iguais desalinhados (19/11/2026, professor: "eu não aguento mais isso, iguais desalinhados"; desde 20/11/2026, só nas linhas
        // encadeadas do <conta>, tr.cad: "Alinhamos apenas em encadeamentos necessários por igualdades"): numa conta em passos
        // (<conta>) e em linhas seguidas de exemplo que começam por fórmula com "=", o primeiro "=" de cada linha cai na mesma
        // vertical. Tolerância de 0,6% da largura.
        var primeiroIgual=function(el){var m=el.querySelector('math');if(!m)return null;var o=[].find.call(m.querySelectorAll('mo'),function(x){var t=x.textContent.trim();return ['=','≈','<','>','≤','≥','≠'].indexOf(t)>=0});return o?o.getBoundingClientRect().left:null};
        var grupos=[];[].forEach.call(inn.querySelectorAll('table.passos-conta'),function(t){grupos.push([].map.call(t.querySelectorAll('tr.cad'),function(tr){var l=tr.querySelector('td.l'),d=tr.querySelector('td.d');var xl=l?primeiroIgual(l):null;return xl!==null?xl:(d?primeiroIgual(d):null)}))});
        [].forEach.call(inn.querySelectorAll('.bloco.ex,.bloco.ga'),function(b){var g=[];[].forEach.call(b.children,function(c){var ok=c.tagName==='P'&&c.firstChild&&(c.firstChild.nodeName.toLowerCase()==='math'||(c.firstChild.nodeType===3&&!c.firstChild.textContent.trim()&&c.firstElementChild&&c.firstElementChild.tagName.toLowerCase()==='math'&&c.firstElementChild===c.querySelector('*')));
          var x=ok?primeiroIgual(c):null;if(x!==null)g.push(x);else{if(g.length>1)grupos.push(g);g=[]}});if(g.length>1)grupos.push(g)});
        grupos.forEach(function(g){var xs=g.filter(function(x){return x!==null});if(xs.length<2)return;if(Math.max.apply(null,xs)-Math.min.apply(null,xs)>qr.width*0.006){var t='quadro '+nome+': iguais desalinhados';if(r.indexOf(t)<0)r.push(t)}});
        // Colunas que se sobrepõem ou quase encostam (19/11/2026, T26: a tabela das casas invadia a conta ao lado, e a conferência
        // de cima pula tabela e figura). Mede a tinta de cada coluna (texto, fórmula, figura) e cobra uma folga de 2% da largura.
        var tinta=function(el){var bs=[];[].forEach.call(el.querySelectorAll('math,svg,img,canvas'),function(e){if(e.closest('svg')!==e&&e.closest('svg'))return;
            // Gráfico: a caixa do desenho (getBBox), não a do SVG com as margens.
            if(e.tagName.toLowerCase()==='svg'&&e.getBBox&&e.getScreenCTM()){try{var bb=e.getBBox(),M=e.getScreenCTM(),p1=new DOMPoint(bb.x,bb.y).matrixTransform(M),p2=new DOMPoint(bb.x+bb.width,bb.y+bb.height).matrixTransform(M);
              var R=e.getBoundingClientRect(),L=Math.max(R.left,Math.min(p1.x,p2.x)),Rt=Math.min(R.right,Math.max(p1.x,p2.x)),T=Math.max(R.top,Math.min(p1.y,p2.y)),B=Math.min(R.bottom,Math.max(p1.y,p2.y));
              // O que passa da janela do gráfico é cortado (clip): só conta o que fica dentro do SVG.
              bs.push({left:L,right:Rt,top:T,bottom:B,width:Rt-L,height:B-T});return}catch(err){}}
            bs.push(e.getBoundingClientRect())});
          var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null);while(w.nextNode()){var t=w.currentNode;if(!t.textContent.trim()||t.parentElement.closest('math,svg'))continue;
            var g=document.createRange();g.selectNodeContents(t);[].forEach.call(g.getClientRects(),function(b){bs.push(b)})}
          return bs.filter(function(b){return b.width>0&&b.height>0})};
        [].forEach.call(inn.querySelectorAll('.col,.col3,.col4'),function(col){var fs=[].slice.call(col.children).map(function(c){return {c:c,b:tinta(c)}}).filter(function(f){return f.b.length});
          // A coluna da direita que começa por "=" (ou outro sinal) é a continuação da conta da esquerda, alinhada de propósito
          // com o espaço normal antes do sinal: não são duas colunas de conteúdo (20/11/2026, listas do T11 e o C11).
          var abreComSinal=function(el){var m=el.querySelector('math');if(!m)return false;var t=[].find.call(m.querySelectorAll('mi,mn,mo,mtext'),function(x){return x.textContent.trim()});
            return !!t&&t.tagName.toLowerCase()==='mo'&&['=','≈','<','>','≤','≥','≠'].indexOf(t.textContent.trim())>=0&&!el.textContent.replace(m.textContent,'').trim()&&el.firstElementChild===m};
          for(var i=0;i<fs.length;i++)for(var j=0;j<fs.length;j++){if(i===j)continue;var A=fs[i],B=fs[j],ra=A.c.getBoundingClientRect(),rb=B.c.getBoundingClientRect();if(ra.left>=rb.left)continue;if(abreComSinal(B.c))continue;
            var dir=-1e9,esq=1e9;A.b.forEach(function(a){B.b.forEach(function(b){if(Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>0){dir=Math.max(dir,a.right);esq=Math.min(esq,b.left)}})});
            if(dir>-1e9&&esq-dir<qr.width*0.02){var t='quadro '+nome+': '+(esq<dir?'colunas se sobrepõem':'colunas quase encostam')+' ('+(Math.round((esq-dir)/qr.width*1000)/10)+' cqw)';if(r.indexOf(t)<0)r.push(t)}}})
        if(q.querySelector('merror'))r.push('quadro '+nome+': erro em fórmula');
        // Toda figura leva descrição para leitor de tela (aria-label), a automática do <grafico> ou uma escrita à mão.
        [].forEach.call(q.querySelectorAll('svg:not([aria-hidden]):not(.marcas)'),function(g){var l=g.getAttribute('aria-label');
          if(!g.closest('[aria-label]')||l==='')r.push('quadro '+nome+': figura sem descrição (aria-label)')});
      });
      if(lista&&document.querySelector('main merror'))r.push('página da lista: erro em fórmula');
      // Fontes em recursos/fontes/ (09/11/2026): se uma não carrega, o navegador troca a letra sem avisar.
      var falhas=[],carregadas={};document.fonts.forEach(function(f){var n=f.family.replace(/"/g,'');
        if(f.status==='error')falhas.push(n+' '+f.weight+(f.style!=='normal'?' '+f.style:''));if(f.status==='loaded')carregadas[n]=1});
      if(falhas.length)r.push('fonte que não carregou: '+falhas.join(', '));
      ['Luciole','Luciole Math'].forEach(function(n){if(!carregadas[n])r.push('fonte não carregada: '+n)});
      if(lista){document.body.classList.remove('visor-aberto');var lw=document.documentElement.scrollWidth,vw=window.innerWidth;
        if(lw>vw+1)r.push('página da lista: rolagem lateral, '+lw+' px em janela de '+vw+' px');document.body.classList.add('visor-aberto')}
      var pre=document.createElement('pre');pre.id='relatorio';pre.textContent='RELATORIO\n'+(r.length?r.join('\n'):'nenhum problema')+(dicas.length?'\n'+dicas.join('\n'):'')+'\nFIM';
      document.body.appendChild(pre);
    });
  }
})();
// ── tema/js/09-curso.js: Curso guardado: os links de tópico dos módulos levam à aula do curso escolhido.
// Curso guardado (10/11/2026, pedido do professor): a aula ou a lista aberta guarda o curso (EE ou EQ) no navegador; nos módulos de
// base e complementares, os links de tópico (data-ee, data-eq) passam a levar à aula desse curso. Sem curso guardado, ou sem a aula
// do curso no site, fica o destino do href: o índice das aulas, no tópico.
(function(){
  var m=location.pathname.match(/\/(?:aulas|listas)\/T\d\d[a-z]?-([A-Z]{2,3})\.html$/);
  if(m&&Memoria.cursos.indexOf(m[1])>=0)Memoria.gravar(Memoria.chave('curso'),m[1]);
  var c=Memoria.ler(Memoria.chave('curso'));
  if(Memoria.cursos.indexOf(c)<0)return;
  function ligar(){[].forEach.call(document.querySelectorAll(Memoria.cursos.map(function(k){return 'a[data-'+k.toLowerCase()+']'}).join(',')),function(a){
    var d=a.getAttribute('data-'+c.toLowerCase());if(d)a.setAttribute('href',d)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ligar);else ligar();
})();
