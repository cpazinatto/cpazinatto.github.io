// ── tema/js/01-inicio.js: Abertura do tema das aulas, listas e módulos: quadros, seções, pintura do quadro atual, folga dos radicais.
// O tema.js publicado é a junção, na ordem dos números, de tema/js/*.js (publicar_recursos em tema/construir.py); as partes
// compartilham o mesmo escopo (a função aberta em 01 fecha em 08) e não funcionam sozinhas.
// Navegação das aulas. Teclas: setas, espaço, PageUp/PageDown (passador), Home, End.
// M troca claro/escuro, T as cores, L a letra, A o tamanho da letra (tema/preferencias.js), F tela cheia, V visão geral.
// Na aula, I abre o índice retrátil e Backspace volta a "Aulas e exercícios"; nas listas e nos módulos, I volta ao índice.
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
    [].forEach.call(qs[i].querySelectorAll('[data-passo]'),function(e){e.classList.toggle('oculto',+e.dataset.passo>passo)});
    ajustarRadicais(qs[i]);
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
  function ajustarTudo(){
    qs.forEach(function(q){var a=q.classList.contains('ativo');q.classList.add('ativo');ajustarRadicais(q);if(!a)q.classList.remove('ativo')});
  }
  function ajustarTudoLista(){ajustarTudo();var m=document.querySelector('main');if(lista&&m)ajustarRadicais(m)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ajustarTudoLista);else ajustarTudoLista();
  // Outra letra ou outro tamanho mudam as medidas: refaz depois que a fonte nova carregar.
  document.addEventListener('preferencias',function(){requestAnimationFrame(function(){
    var refazer=function(){ajustarTudoLista();animacoes.forEach(medirValores)};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refazer);else refazer()})});
  var tr;window.addEventListener('resize',function(){clearTimeout(tr);tr=setTimeout(function(){ajustarRadicais(qs[i])},150)});

// ── tema/js/02-animacoes.js: Gráficos animados (controles, paradas do passador), sólidos 3D (Three.js) e somas de Riemann.
  // Animações: <grafico> com "controle". O desenho vem pronto no estado do PDF; aqui ele é refeito com os valores do momento.
  // O passador leva, em movimento, até a parada do passo. O mouse arrasta livremente, e o valor fica até a próxima parada.
  var F={sqrt:Math.sqrt,abs:Math.abs,cbrt:Math.cbrt,exp:Math.exp,ln:Math.log,log:Math.log,log10:Math.log10,sen:Math.sin,cos:Math.cos,tan:Math.tan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,arcsen:Math.asin,arccos:Math.acos,arctg:Math.atan,floor:Math.floor,min:Math.min,max:Math.max};
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
  // Faixas de uma soma de Riemann: [esquerda, largura, c, f(c)]. No modo tvm, c é o ponto do TVM da primitiva G na faixa (bisseção).
  function faixas(f,G,modo,a0,b0,nn,p){var n=Math.max(1,Math.round(nn)),h=(b0-a0)/n,l=[];
    for(var k=0;k<n;k++){var e=a0+k*h,c;
      if(modo==='tvm'){var alt=(G(e+h,p,F)-G(e,p,F))/h,g=function(x){return f(x,p,F)-alt},a=e,b=e+h;
        if(g(a)*g(b)>0)c=e+h/2;else{for(var i=0;i<50;i++){var m=(a+b)/2;if(g(a)*g(m)>0)a=m;else b=m}c=(a+b)/2}}
      else c=e+{esq:0,dir:1,meio:.5}[modo]*h;
      l.push([e,h,c,f(c,p,F)])}return l}
  function fator(v,casas){var n=+v.toFixed(casas);return n===1?'':n===-1?'−':escrever(n,casas)}
  var animacoes=[].map.call(document.querySelectorAll('svg[data-anima],.cena[data-anima]'),function(svg){
    var d=JSON.parse(svg.dataset.anima),caixa=svg.closest('.anima'),a={q:svg.closest('.quadro'),svg:svg,d:d,v:{},passo:0,raf:0};
    var X=function(v){return d.esq+(v-d.x0)*d.ux},Y=function(v){return d.cima+(d.y1-v)*d.uy};
    var par=function(c){var f=compilar(c[0]),g=compilar(c[1]);return function(p){return [f(0,p,F),g(0,p,F)]}};
    var acoes=[].map.call(svg.querySelectorAll('[data-din]'),function(e){
      var o=JSON.parse(e.dataset.din),fs=[];
      if(o.pts){var ps=o.pts.map(par);fs.push(function(p){e.setAttribute('points',ps.map(function(f){var c=f(p);return X(c[0]).toFixed(1)+','+Y(c[1]).toFixed(1)}).join(' '))})}
      if(o.arco){var fa=o.arco.map(compilar);fs.push(function(p){var r=fa[0](0,p,F),t0=fa[1](0,p,F),t1=fa[2](0,p,F),cx=fa[3](0,p,F),cy=fa[4](0,p,F),t=[];
        for(var k=0;k<=180;k++){var u=t0+(t1-t0)*k/180;t.push(X(cx+r*d.uy/d.ux*Math.cos(u)).toFixed(1)+','+Y(cy+r*Math.sin(u)).toFixed(1))}e.setAttribute('points',t.join(' '));
        // Arco de comprimento zero não tem sentido: sem ponta de seta.
        if(e.dataset.ponta){if(Math.abs(t1-t0)>0.05)e.setAttribute('marker-end',e.dataset.ponta);else e.removeAttribute('marker-end')}})}
      if(o.guia){var fg=compilar(o.v);fs.push(function(p){var v=fg(0,p,F);if(o.guia==='x'){e.setAttribute('x1',X(v).toFixed(1));e.setAttribute('x2',X(v).toFixed(1))}else{e.setAttribute('y1',Y(v).toFixed(1));e.setAttribute('y2',Y(v).toFixed(1))}})}
      if(o.fn){var fy=compilar(o.fn),de=compilar(o.de),ate=compilar(o.ate);fs.push(function(p){var a0=de(0,p,F),b0=ate(0,p,F),t=[];
        for(var k=0;k<=o.n;k++){var x=a0+(b0-a0)*k/o.n,y=fy(x,p,F);if(isFinite(y))t.push(X(x).toFixed(1)+','+Y(y).toFixed(1))}e.setAttribute('points',t.join(' '))})}
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
      if(o.pol){var lf=compilar(o.pol.f),ld=compilar(o.pol.de),la=compilar(o.pol.ate),ln=compilar(o.pol.n);fs.push(function(p){
        var a0=ld(0,p,F),b0=la(0,p,F),n=Math.max(1,Math.round(ln(0,p,F))),t=[];
        for(var k=0;k<=n;k++){var x=a0+(b0-a0)*k/n;t.push(X(x).toFixed(1)+','+Y(lf(x,p,F)).toFixed(1))}e.setAttribute('points',t.join(' '))})}
      // Sem valor real (como arcsen de 2), o ponto some.
      if(o.c){var pc=par(o.c),circ=e.tagName.toLowerCase()==='circle';fs.push(function(p){var c=pc(p);
        var existe=isFinite(c[0])&&isFinite(c[1]);e.style.display=existe?'':'none';if(!existe)return;
        e.setAttribute(circ?'cx':'x',(X(c[0])+(o.ox||0)).toFixed(1));e.setAttribute(circ?'cy':'y',(Y(c[1])+(o.oy||0)).toFixed(1))})}
      if(o.t){var tx=o.t.map(function(m){return typeof m==='string'?m:{f:compilar(m.e),s:m.s}});fs.push(function(p){
        e.textContent=tx.map(function(m){if(typeof m==='string')return m;var v=m.f(0,p,F);return m.s==='+'?parcela(v,d.casas):m.s==='*'?fator(v,d.casas):m.s==='~'?emPi(v):m.s==='#'?(Math.abs(v-1)<1e-3?'':misto(v,d.casas)):escrever(v,d.casas)}).join('')})}
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
    if(d.solido)acoes.push(criarSolido(svg,d.solido,a));
    a.acoes=acoes;a.entradas=entradas;
    // Gráfico que segue: todos os parâmetros vêm de outro gráfico do quadro (controle "segue"); não anima por conta própria.
    a.segue=d.controles.length>0&&d.controles.every(function(c){return c.segue});
    d.controles.forEach(function(c){a.v[c.nome]=c.geral});
    return a;
  });
  function desenhar(a){
    a.derivar.forEach(function(f){f(a.v)});a.acoes.forEach(function(f){f(a.v)});
    if(!a.segue)animacoes.forEach(function(b){if(!b.segue||b.q!==a.q)return;
      b.d.controles.forEach(function(c){if(c.nome in a.v)b.v[c.nome]=a.v[c.nome]});b.derivar.forEach(function(f){f(b.v)});b.acoes.forEach(function(f){f(b.v)})});
    a.d.controles.forEach(function(c){var e=a.entradas[c.nome];if(!e)return;e.value=a.v[c.nome];
      e.closest('.controle').querySelector('output').textContent=forma(c,a.v[c.nome],a.d.casas)});
  }
  // A coluna do valor fica com a largura do maior texto possível, a mesma em todos os controles do gráfico: a barra não muda de tamanho nem de lugar.
  function medirValores(a){
    if(!a.q.classList.contains('ativo'))return;
    var maior=0,vals=[];
    a.d.controles.forEach(function(c){var e=a.entradas[c.nome];if(!e)return;
      var val=e.closest('.controle').querySelector('.valor'),out=val.querySelector('output'),antes=out.textContent,passo=c.pi?c.grade/2:c.grade;
      val.style.minWidth='0';vals.push(val);
      var testar=function(v){out.textContent=forma(c,v,a.d.casas);maior=Math.max(maior,val.getBoundingClientRect().width)};
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
      if(raiz.classList.contains('geral')||a.q!==qs[i]){if(a.passo){a.passo=0;fixar(a,function(c){return c.geral})}return}
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
    varios.innerHTML=l.map(function(o,n){return '<b class="'+(n===k?'esc':'')+'"><kbd>'+(n+1)+'</kbd> <i>'+o.c.mostra+'</i></b>'}).join(' ');
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
  // Na lista e nos módulos (etapa 2, 12/11/2026): no fim de uma parte do módulo, › segue para a parte seguinte; depois da última, fecha.
  // A resolução de uma questão não leva à de outra (pedido do professor, 13/11/2026): no fim dela, › fecha e volta à página.
  function seguinte(){if(i>=qs.length-1)return null;var a=grupoDe(qs[i].dataset.q),b=grupoDe(qs[i+1].dataset.q);
    return a&&b&&!a.art&&!b.art?b:null}
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
  function geral(){fecharIndice();raiz.classList.toggle('geral');botoes();if(raiz.classList.contains('geral'))qs.forEach(ajustarRadicais);else ajustarRadicais(qs[i]);pintarAnimacoes()}
  // Todos os botões ficam sempre no menu; os que não têm serventia no momento ficam esmaecidos.
  function podeVoltar(){return !raiz.classList.contains('geral')&&(passo>1||(i>0&&mesma(i-1)))}
  function podeAvancar(){return !raiz.classList.contains('geral')&&(passo<maxPasso(qs[i])||(i<qs.length-1&&mesma(i+1))||lista)}
  function botoes(){
    [].forEach.call(document.querySelectorAll('#bAnt,.barra [data-v=ant]'),function(b){b.disabled=!podeVoltar()});
    [].forEach.call(document.querySelectorAll('#bPro'),function(b){b.disabled=!podeAvancar()});
  }

// ── tema/js/04-menu.js: Menu dos quadros e a dica das teclas da animação.
  function aula(nome,antes,depois,falta){var d=document.body.dataset,c=d[nome];return c?'<a href="'+c+'-'+d.curso+'.html">'+antes+c+depois+'</a>':'<button disabled>'+falta+'</button>'}
  // Índice (botão e tecla I): as aulas e exercícios; os módulos de base dizem o seu em data-indice.
  var indice=document.body.dataset.indice||'../Aulas-e-exercicios.html';
  // Na aula (12/11/2026): "‹ Aulas" sai para o tópico em "Aulas e exercícios", e "Índice (I)" abre o índice retrátil.
  var cod=((document.querySelector('.divisor .cod')||{}).textContent||'').trim(),sair=indice+(cod?'#'+cod:'');
  var ctl=document.createElement('nav');ctl.className='ctl';ctl.setAttribute('aria-label','Navegação');
  ctl.innerHTML='<button id="bAnt" aria-label="Anterior">‹</button><span id="cont"></span><button id="bPro" aria-label="Próximo">›</button>'+
    (lista?'<a href="'+indice+'">Índice (I)</a>':'<a href="'+sair+'" id="bSair" title="Aulas e exercícios (Backspace)">‹ Aulas</a><button id="bInd" aria-expanded="false" aria-controls="indice">Índice (I)</button>')+aula('anterior','‹ Anterior: ','','‹ Anterior')+aula('proxima','Próxima: ',' ›','Próxima ›')+
    '<button id="bTel">Tela cheia (F)</button><button id="bGer">Visão geral (V)</button>'+
    '<button data-pref="modo"></button><button data-pref="cores"></button><button data-pref="letra"></button><button data-pref="tamanho"></button>';
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
    if(aba==='minis'){var h='<div class="minis">';qs.forEach(function(q,k){h+='<button class="mini" data-k="'+k+'" aria-label="'+(q.dataset.n?'Quadro '+q.dataset.n:'Seção '+secDe[k])+'"><span class="rotn">'+(q.dataset.n||'Seção '+secDe[k])+'</span></button>'});
      rolar.innerHTML=h+'</div>';
      [].forEach.call(rolar.querySelectorAll('.mini'),function(m){var c=qs[+m.dataset.k].cloneNode(true);c.classList.add('ativo');c.removeAttribute('data-n');
        c.setAttribute('aria-hidden','true');c.setAttribute('inert','');[].forEach.call(c.querySelectorAll('.oculto'),function(x){x.classList.remove('oculto')});
        [].forEach.call(c.querySelectorAll('[id]'),function(x){x.removeAttribute('id')});m.insertBefore(c,m.firstChild);m.onclick=function(){escolherQuadro(+m.dataset.k)}});
      marcarIndice();return}
    var h='',sec=-1;
    qs.forEach(function(q,k){var x=infos[k];
      if(secDe[k]!==sec){sec=secDe[k];h+='<div class="secao-i">'+(nomeSec[sec]&&/^Seção/.test(((qs[k].querySelector('.ses')||{}).textContent||''))?'Seção '+sec+' · '+nomeSec[sec]:(nomeSec[sec]||''))+'</div>'}
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
  if(!lista&&qs.length){
    infos=qs.map(infoDe);
    var por={};secDe.forEach(function(s){por[s]=(por[s]||0)+1});
    prog=document.createElement('div');prog.className='prog';prog.setAttribute('aria-hidden','true');
    prog.innerHTML=Object.keys(por).map(function(s){return '<div class="tr" data-s="'+s+'" style="flex:'+por[s]+'"><i></i><span>'+(nomeSec[s]?'Seção '+s+': '+nomeSec[s]:'')+'</span></div>'}).join('');
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
      function abrirPara(id){var a=id&&document.getElementById(id);if(a&&a.classList.contains('rq-fechada'))recolher(a,false)}
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
    function itemQ(q,f){var a=document.createElement('a');a.className='q'+(f[q.id]?' ok':'');a.href='#'+q.id;a.dataset.id=q.id;a.textContent=tituloQ(q.querySelector('h2'));return a}
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
  document.addEventListener('keydown',function(e){if(e.key==='Tab')teclado=true},true);
  document.addEventListener('mousedown',function(){teclado=false},true);
  // Com o mouse em cima do menu, ele não some (pedido do professor, 12/11/2026: sumia ao trocar de quadro pelo botão ›). No toque, o
  // :hover fica preso no último botão tocado, por isso a regra vale só fora do toque.
  function esconderMenu(){if(!raiz.classList.contains('toque')&&ctl.matches(':hover')){clearTimeout(t);t=setTimeout(esconderMenu,1800);return}
    clearTimeout(t);ctl.classList.remove('ver');raiz.classList.remove('menu-ver');if(!teclado&&ctl.contains(document.activeElement))document.activeElement.blur()}
  // No toque, o Safari do iOS dispara um mousemove de imitação depois de cada toque: ele não pode reabrir o menu.
  var ultimoToque=0;
  document.addEventListener('mousemove',function(e){if(Date.now()-ultimoToque>1500){verMenu();bordaEsquerda(e)}});
  // Celular e tablet (10/11/2026): arrastar para a esquerda avança, para a direita volta. Um toque no quadro, na faixa de baixo
  // e no meio, mostra o menu; outro toque o esconde (some sozinho em 4 s); arrastar não o mostra. Com o toque, o menu escondido não recebe toques
  // (classe toque em <html>, ver tema.css) e o foco num botão não o mantém aceso.
  // Não vale sobre controles (deslizador, sólido 3D, botões, links), que têm o seu próprio arrasto.
  // No Safari do iOS, se o navegador toma o arrasto (rolagem, zoom), o toque acaba em touchcancel, sem touchend: por isso
  // o arrasto horizontal é segurado no touchmove (preventDefault) e o fim vale tanto no touchend quanto no touchcancel.
  // Gestos (12/11/2026, pedido do professor): puxar para baixo fecha a resolução ou a parte (listas e módulos) e, na aula, volta a
  // "Aulas e exercícios"; o arrasto vertical é segurado, para o navegador não recarregar a página ("puxar para atualizar").
  // No celular de verdade (12/11/2026), o navegador tomava o arrasto nos primeiros pixels e cortava o toque (touchcancel) antes do
  // puxão longo: o arrasto passa a ser segurado desde o primeiro movimento (a aula e o visor não rolam), e vale o maior puxão visto.
  var tx=null,ty=0,lx=0,ly=0,horiz=false,vert=false,maxdy=0;
  document.addEventListener('touchstart',function(e){
    ultimoToque=Date.now();raiz.classList.add('toque');tx=null;teclado=false;
    if(ctl.contains(e.target)){verMenu(4000);return}
    if(e.touches.length!==1||!aberto()||raiz.classList.contains('geral'))return;
    if(e.target.closest&&e.target.closest('input,select,button,a,.cena,.ctl,.barra,.controles,.indice,.alca'))return;
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
      // Só o toque na faixa de baixo, no meio da tela, abre o menu; fora dela, o toque só o fecha (professor, 10/11/2026).
      var zona=ly>innerHeight*0.75&&lx>innerWidth*0.25&&lx<innerWidth*0.75;
      if(ctl.classList.contains('ver'))esconderMenu();else if(zona)verMenu(4000)}
  }
  document.addEventListener('touchend',fimToque,{passive:true});
  document.addEventListener('touchcancel',fimToque,{passive:true});

  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey)return;
    var k=e.key;
    // Com a resolução fechada, a página rola normalmente: só valem M e I.
    if(Pref.tecla(e))return;
    if(!aberto()){if(k==='i'||k==='I')location.href=indice;return}
    // Índice retrátil da aula: I abre e fecha, Esc fecha; aberto (e não fixado), as setas para cima e para baixo andam pela lista.
    if(gav){var dentro=e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');if(dentro)return;
      var ab=gav.classList.contains('ver');
      if(k==='i'||k==='I'){e.preventDefault();alternarIndice();return}
      if(k==='Escape'&&ab){fecharIndice();return}
      if(k==='Backspace'&&!ab){e.preventDefault();location.href=sair;return}
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
      var r=[];
      qs.forEach(function(q,k){
        qs.forEach(function(x){x.classList.remove('ativo')});q.classList.add('ativo');
        // Transição vazia: um passo sem nada novo, por número pulado ou por estar dentro de um bloco que só aparece depois.
        var ps=[].slice.call(q.querySelectorAll('[data-passo]'));
        for(var pv=2,mx=maxPasso(q);pv<=mx;pv++){if(!ps.some(function(e){if(+e.dataset.passo!==pv)return false;
          for(var a=e.parentElement;a&&a!==q;a=a.parentElement){if(a.dataset.passo&&+a.dataset.passo>pv)return false}return true}))r.push('quadro '+(q.dataset.n||k+1)+': passo '+pv+' não mostra nada novo')}
        [].forEach.call(q.querySelectorAll('.oculto'),function(e){e.classList.remove('oculto')});
        var nome=q.dataset.n||('divisor '+(k+1)),inn=q.querySelector('.in'),qr=q.getBoundingClientRect(),pe=q.querySelector('.pe'),limite=pe?pe.getBoundingClientRect().top-qr.width*0.004:qr.bottom-qr.height*0.035;
        var ult=0,dir=0;[].forEach.call(inn.children,function(c){var b=c.getBoundingClientRect();ult=Math.max(ult,b.bottom);dir=Math.max(dir,b.right)});
        if(ult>limite+1)r.push('quadro '+nome+': passa da altura em '+((ult-limite)/qr.width*100).toFixed(1)+' cqw');
        [].forEach.call(inn.querySelectorAll('*'),function(e){var b=e.getBoundingClientRect();
          if(b.width&&b.right>qr.right-qr.width*0.02&&!e.closest('svg')){r.push('quadro '+nome+': passa da largura <'+e.tagName+'>')}});
        // Fórmula que passa da borda direita do bloco (T27, quadros 7 e 9: o "+ C" na borda), mesmo sem passar do quadro.
        [].forEach.call(inn.querySelectorAll('.bloco math'),function(m){var bl=m.closest('.bloco').getBoundingClientRect(),b=m.getBoundingClientRect();
          if(b.width&&b.right>bl.right-qr.width*0.004){var t='quadro '+nome+': fórmula passa da borda do bloco';if(r.indexOf(t)<0)r.push(t)}});
        [].forEach.call(inn.querySelectorAll('svg.graf'),function(s){var b=s.getBoundingClientRect(),p=s.parentElement.getBoundingClientRect();
          if(b.right>qr.right+1||b.left<qr.left-1)r.push('quadro '+nome+': gráfico fora do quadro');
          var ws=parseFloat(s.style.width);if(ws&&b.width<ws/100*qr.width*0.88)r.push('quadro '+nome+': gráfico encolhido para '+(b.width/qr.width*100).toFixed(0)+' de '+ws+' cqw')});
        [].forEach.call(inn.querySelectorAll('.bloco>h3'),function(h){var alvo=h.querySelector('.tt')||h.querySelector('.rot')||h,rg=document.createRange();rg.selectNodeContents(alvo);
          // Na fonte dos títulos, a caixa do texto é mais alta que a linha: reduz cada caixa à altura da linha, em torno do centro.
          var alt=parseFloat(getComputedStyle(alvo).lineHeight),linhas=0,fim=-1e9;
          var rs=[].slice.call(rg.getClientRects()).filter(function(b){return b.width>0}).map(function(b){var c=(b.top+b.bottom)/2,m=Math.min(b.height,alt)/2;return {top:c-m,bottom:c+m}}).sort(function(a,b){return a.top-b.top});
          rs.forEach(function(b){if(b.top>=fim-1){linhas++;fim=b.bottom}else fim=Math.max(fim,b.bottom)});
          if(linhas>1)r.push('quadro '+nome+': título de bloco em '+linhas+' linhas: '+alvo.textContent.trim().slice(0,50))});
        function rotulos(s,onde){var ts=[].slice.call(s.querySelectorAll('text,.lbf')).map(function(e){
            if(e.classList.contains('lbf')){var g=document.createRange();g.selectNodeContents(e);return {b:g.getBoundingClientRect(),t:e.textContent.trim()}}
            return {b:e.getBoundingClientRect(),t:e.textContent}});
          for(var a=0;a<ts.length;a++)for(var c=a+1;c<ts.length;c++){var A=ts[a].b,B=ts[c].b,lx=Math.min(A.right,B.right)-Math.max(A.left,B.left),ly=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);
            if(lx>2&&ly>4){var m='quadro '+nome+': rótulos sobrepostos'+onde+': '+ts[a].t+' / '+ts[c].t;if(r.indexOf(m)<0)r.push(m)}}
          {var lim=(s.closest('.bloco')||q).getBoundingClientRect();ts.forEach(function(x){if(x.b.right>lim.right||x.b.left<lim.left||x.b.top<lim.top||x.b.bottom>lim.bottom){var m='quadro '+nome+': rótulo sai do '+(s.closest('.bloco')?'bloco':'quadro')+onde+': '+x.t;if(r.indexOf(m)<0)r.push(m)}})}
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
      var pre=document.createElement('pre');pre.id='relatorio';pre.textContent='RELATORIO\n'+(r.length?r.join('\n'):'nenhum problema')+'\nFIM';
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
