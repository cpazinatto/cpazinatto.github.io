// Uso offline (docs/planejamento-offline.md). Carregado em todas as páginas, com defer; a raiz do site é a pasta acima de
// recursos/, de onde este arquivo vem. Fora: aberto do disco (file://), ?captura=1 (tema/capturas.py) e navegador sem service
// worker; nesses, o site segue como antes e o botão da barra não aparece.
//   Etapa 1 (16/11/2026): registra o service worker da raiz (sw.js) e pede a sincronia do pacote "site" (página das disciplinas,
//   recursos comuns, Luciole) em toda abertura com internet (decisão 1).
//   Etapa 2 (16/11/2026): o indicador na barra do topo (#bOffline, de barra_topo()), o painel "Uso offline" (#offp), o aviso curto
//   quando a rede cai ou volta e os links esmaecidos, sem internet, para páginas não guardadas.
//   Etapa 3 (16/11/2026): a disciplina, baixada pelo botão (decisão 1), só no curso escolhido (decisão 2; "Os dois cursos" no
//   painel), numa fila com prioridade (a página aberta, o tópico atual e o seguinte, os vistos, o resto; a página aberta passa à
//   frente), com Pausar e Continuar; a fila para quando a aba fica escondida e volta sozinha; em dados móveis, para, avisa e
//   pergunta (decisão 4); nos cartões da página das disciplinas, o estado de cada uma.
// Guardado no navegador (Memoria, tema/preferencias.js): offline-<pasta>-cursos ("EE", "EE EQ") e offline-<pasta>-baixar ("sim" depois
// de "Baixar" ou "Continuar"; "pausa" depois de "Pausar"); só nesta aba (sessionStorage): offline-dados-ok, "continuar com dados móveis".
window.Offline=(function(){
  var s=document.currentScript,raiz=s?s.src.replace(/recursos\/offline\.js(\?.*)?$/,''):'';
  var CACHE='disciplinas-offline-1',META=raiz+'__offline__/',SITE='recursos/offline.json';
  var ouvintes=[],ultimo={};
  function ouvir(f){ouvintes.push(f)}
  function mandar(msg){var c=navigator.serviceWorker&&navigator.serviceWorker.controller;
    if(c)c.postMessage(msg);
    else if(navigator.serviceWorker)navigator.serviceWorker.ready.then(function(r){if(r.active)r.active.postMessage(msg)})}
  function pedir(pacote,op){var m={tipo:'sincronizar',pacote:pacote};for(var k in op||{})m[k]=op[k];mandar(m)}
  var ok=!!raiz&&'serviceWorker' in navigator&&'caches' in window&&location.protocol!=='file:'&&!/[?&]captura=/.test(location.search);
  var api={ativo:ok,raiz:raiz,ouvir:ouvir,sincronizar:pedir,estado:function(p){return ultimo[p]}};
  if(!ok)return api;
  navigator.serviceWorker.addEventListener('message',function(e){var d=e.data||{};if(d.tipo!=='pacote')return;ultimo[d.pacote]=d;
    ouvintes.forEach(function(f){try{f(d)}catch(x){}})});
  var registrado=new Promise(function(res){
    var iniciar=function(){navigator.serviceWorker.register(raiz+'sw.js',{scope:raiz}).then(function(){
      if(navigator.onLine!==false)pedir(SITE);res(true)}).catch(function(e){if(window.console)console.warn('offline:',e);res(false)})};
    // Depois da página pronta, para não disputar a rede com ela na primeira abertura.
    if(document.readyState==='complete')iniciar();else addEventListener('load',iniciar);
  });
  var M=window.Memoria||{ler:function(){return null},gravar:function(){},chave:function(k){return k},lerJSON:function(k,p){return p},quadros:function(){return {}}};

  // ---- Estado --------------------------------------------------------------------------------------------------------------
  var raizEl=document.documentElement,pasta=raizEl.dataset.pasta||'';
  var DISC=pasta?pasta+'/recursos/offline.json':'';
  var PRINCIPAL=DISC||SITE;
  var st={rede:navigator.onLine!==false,pac:{},escolher:false,esperaWifi:false};   // pac[rel] = {local, remoto, baixando, dm}
  function pac(rel){return st.pac[rel]||(st.pac[rel]={})}
  function pastaDe(rel){return rel.split('/')[0]}
  function chave(url){var u=new URL(url,location.href);u.hash='';u.search='';if(/\/$/.test(u.pathname))u.pathname+='index.html';return u.href}
  function abrirCache(){return caches.open(CACHE)}
  function lerLocal(rel){return abrirCache().then(function(c){return c.match(META+rel)}).then(function(m){return m?m.json():null})
    .then(function(m){pac(rel).local=m;return m},function(){return null})}
  function lerRemoto(rel){return fetch(raiz+rel,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})
    .then(function(j){pac(rel).remoto=j;return j})}
  // Pacotes guardados (as marcas em __offline__/), para listar no painel também os de outras disciplinas.
  function guardados(){return abrirCache().then(function(c){return c.keys()}).then(function(ks){
    return ks.map(function(r){return r.url}).filter(function(u){return u.indexOf(META)===0}).map(function(u){return u.slice(META.length)})},function(){return []})}
  function mesmos(a,b){return (a||[]).slice().sort().join(' ')===(b||[]).slice().sort().join(' ')}
  // Cursos a baixar: os escolhidos para o uso offline; senão, o curso escolhido na disciplina (só a da página); senão, os do que já
  // está guardado; senão, nenhum (o "Baixar" pergunta).
  function codigos(rel){var p=pac(rel),c=(p.remoto&&p.remoto.cursos)||{};return Object.keys(c)}
  function escolhidos(rel){if(rel===SITE)return null;
    var g=M.ler('offline-'+pastaDe(rel)+'-cursos');if(g)return g.split(' ');
    var cs=codigos(rel),c=rel===DISC?M.ler(M.chave('curso')):null;
    if(c&&cs.indexOf(c)>=0)return [c];
    if(cs.length===1)return cs;
    var l=pac(rel).local;return l&&l.cursos||null}
  function nomesCursos(rel,cs){var p=pac(rel),n=(p.remoto&&p.remoto.cursos)||{};cs=cs||[];
    var ns=cs.map(function(c){return n[c]||c});return ns.length>1?ns.slice(0,-1).join(', ')+' e '+ns[ns.length-1]:ns[0]||''}
  function vale(rel,a,cs){var x=pac(rel).remoto,g=x&&x.arquivos[a];var cu=g&&g[5];return !cu||!cs||cs.indexOf(cu)>=0}
  function lista(rel){var r=pac(rel).remoto,cs=escolhidos(rel);if(!r)return null;return Object.keys(r.arquivos).filter(function(a){return vale(rel,a,cs)})}
  function feitos(rel){var l=pac(rel).local,ls=lista(rel);if(!l||!l.arquivos)return 0;
    if(!ls)return Object.keys(l.arquivos).length;var t={};Object.keys(l.arquivos).forEach(function(a){t[a]=1});return ls.filter(function(a){return t[a]}).length}
  function total(rel){var ls=lista(rel);return ls?ls.length:(pac(rel).local&&pac(rel).local.total)||0}
  function tamanho(rel,cs,i){var r=pac(rel).remoto,t=0;if(!r)return 0;Object.keys(r.arquivos).forEach(function(a){if(vale(rel,a,cs))t+=r.arquivos[a][i]});return t}
  function bytes(rel){var p=pac(rel),l=p.local,r=p.remoto,t=0;if(!l||!l.arquivos)return 0;
    Object.keys(l.arquivos).forEach(function(a){var x=r&&r.arquivos[a];t+=x?x[1]:0});return t}
  function situacao(rel){var p=pac(rel),l=p.local,cs=escolhidos(rel);
    if(p.baixando)return 'baixando';
    if(p.dm)return 'dados-moveis';
    if(l&&l.token&&(!cs||mesmos(l.cursos,cs)))return p.remoto&&p.remoto.token!==l.token?'atualizar':'pronto';
    return feitos(rel)||(rel===DISC&&st.esperaWifi)?'pausado':'nada'}
  function pct(rel){var p=pac(rel);if(p.baixando)return Math.min(99,Math.floor(100*p.baixando.feitos/Math.max(1,p.baixando.total)));
    var t=total(rel);return t?Math.min(99,Math.floor(100*feitos(rel)/t)):0}
  function bandeira(rel,v){var k='offline-'+pastaDe(rel)+'-baixar';if(v!==undefined)M.gravar(k,v);return M.ler(k)}

  // ---- Fila: prioridade, dados móveis, pausar ------------------------------------------------------------------------------
  function prioridade(){var t=[],m=/\/(?:aulas|listas)\/(T\d\d[a-z]?)-|\/base\/(B\d\d[a-z]?)\.html|\/complementar\/(C\d\d[a-z]?)\.html/.exec(location.pathname);
    var atual=m&&(m[1]||m[2]||m[3]);
    if(atual){t.push(atual);var n=/^([TBC])(\d\d)/.exec(atual);if(n){var s2=+n[2]+1;t.push(n[1]+(s2<10?'0':'')+s2)}}
    try{var u=M.lerJSON(M.chave('ultima'),{});if(u&&u.cod)t.push(u.cod)}catch(e){}
    try{Object.keys(M.quadros()).forEach(function(k){t.push(k.split('-')[0])})}catch(e){}
    return t}
  function paginaAtual(){return chave(location.href).slice(raiz.length)}
  var conn=navigator.connection||null;
  // Dados móveis: só o Chrome do Android diz o tipo da rede; economia de dados e rede 2g valem em todos os que informam.
  function redeMovel(){return !!conn&&(!!conn.saveData||conn.type==='cellular'||/2g$/.test(conn.effectiveType||''))}
  function dadosOk(){try{return sessionStorage.getItem('offline-dados-ok')==='1'}catch(e){return false}}
  function iniciar(rel){var p=pac(rel);
    if(rel!==SITE&&redeMovel()&&!dadosOk()){p.dm=true;if(p.baixando){delete p.baixando;mandar({tipo:'pausar',pacote:rel})}
      // O aviso aparece uma vez por sessão; depois, o indicador ("Dados móveis?") e o painel seguem perguntando.
      var visto=false;try{visto=sessionStorage.getItem('offline-dm-avisado')==='1';sessionStorage.setItem('offline-dm-avisado','1')}catch(x){}
      if(!visto)avisar('Download pausado: você está em dados móveis. Toque na nuvem, na barra do topo, para decidir.');tudo();return}
    p.dm=false;st.esperaWifi=false;
    p.baixando={feitos:feitos(rel),total:total(rel)};
    pedir(rel,{cursos:escolhidos(rel),prioridade:prioridade(),pagina:paginaAtual()});tudo()}
  function baixar(rel){var cs=escolhidos(rel),cods=codigos(rel);
    if(!cs&&cods.length>1){st.escolher=true;desenharPainel();return}
    if(situacao(rel)==='nada'&&!confirm('Baixar '+nome(rel)+(cs&&cods.length>1?' ('+nomesCursos(rel,cs)+')':'')+' para usar sem internet?\n\nSão cerca de '+mb(tamanho(rel,cs,2))+' pela rede e '+mb(tamanho(rel,cs,1))+' no aparelho. Em dados móveis, prefira o Wi-Fi.'))return;
    if(cs)M.gravar('offline-'+pastaDe(rel)+'-cursos',cs.join(' '));
    // Guarda permanente (o navegador não apaga por falta de espaço), pedida no primeiro "Baixar"; quem não tem, segue sem.
    if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){});
    bandeira(rel,'sim');iniciar(rel)}
  function escolherCurso(rel,c){st.escolher=false;M.gravar('offline-'+pastaDe(rel)+'-cursos',c==='todos'?codigos(rel).join(' '):c);baixar(rel)}
  function pausar(rel){bandeira(rel,'pausa');st.esperaWifi=false;pac(rel).dm=false;mandar({tipo:'pausar',pacote:rel});tudo()}
  function doisCursos(rel,sim){var cods=codigos(rel),c=M.ler(M.chave('curso'));
    var cs=sim?cods:[cods.indexOf(c)>=0?c:cods[0]];M.gravar('offline-'+pastaDe(rel)+'-cursos',cs.join(' '));
    // Já baixado ou em curso: a sincronia acrescenta o outro curso ou tira o que saiu.
    if(feitos(rel)&&bandeira(rel)!=='pausa'){if(pac(rel).baixando)mandar({tipo:'pausar',pacote:rel});setTimeout(function(){iniciar(rel)},300)}
    tudo()}
  // Aba escondida: a fila para; de volta, recomeça (decisão do planejamento, 2.3).
  var pausaOculta=false;
  document.addEventListener('visibilitychange',function(){if(!DISC)return;
    if(document.hidden){if(pac(DISC).baixando){pausaOculta=true;mandar({tipo:'pausar',pacote:DISC})}}
    else if(pausaOculta){pausaOculta=false;if(bandeira(DISC)==='sim'&&st.rede)iniciar(DISC)}});
  if(conn&&conn.addEventListener)conn.addEventListener('change',function(){if(!DISC)return;var p=pac(DISC);
    if(redeMovel()){if(p.baixando&&!dadosOk())iniciar(DISC)}
    else if((p.dm||st.esperaWifi)&&bandeira(DISC)==='sim'){p.dm=false;iniciar(DISC)}});

  // ---- Indicador ------------------------------------------------------------------------------------------------------------
  var NUVEM='<path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z"/>';
  var MARCA={seta:'<path d="M12 10v6M9.5 13.5 12 16l2.5-2.5"/>',ok:'<path d="m9.2 13.4 2 2 3.8-4"/>',
    gira:'<path d="M14.8 11.2a3 3 0 1 0 .2 2.6"/><path d="M15 9.6v1.8h-1.8"/>',pausa:'<path d="M10.5 11v4M13.5 11v4"/>',riscada:'<path d="M3 3l18 18"/>'};
  function icone(m,tam){return '<svg width="'+(tam||20)+'" height="'+(tam||20)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+NUVEM+MARCA[m]+'</svg>'}
  var b=document.getElementById('bOffline'),painel=document.getElementById('offp'),vivo=null;
  function indicador(){
    var k=situacao(PRINCIPAL),p=pct(PRINCIPAL),est,txt,ic;
    if(!st.rede){ic='riscada';if(k==='pronto'||k==='atualizar'){est='offline';txt='Offline'}else{est='offline-parcial';txt=k==='nada'?'Offline':'Offline '+p+'%'}}
    else if(k==='baixando'){est='baixando';ic='seta';txt='Baixando '+p+'%'}
    else if(k==='pronto'){est='pronto';ic='ok';txt='Offline pronto'}
    else if(k==='atualizar'){est='atualizar';ic='gira';txt='Atualizar'}
    else if(k==='dados-moveis'){est='dados-moveis';ic='pausa';txt='Dados móveis?'}
    else if(k==='pausado'){est='pausado';ic='pausa';txt=st.esperaWifi&&PRINCIPAL===DISC?'Esperando Wi-Fi':'Pausado '+p+'%'}
    else{est='nada';ic='seta';txt='Baixar'}
    return {est:est,ic:icone(ic),txt:txt,p:p}}
  function desenharBotao(){if(!b)return;var e=indicador();
    var anel=e.est==='baixando'?'<svg class="anel" viewBox="0 0 26 26" aria-hidden="true"><circle class="fundo" cx="13" cy="13" r="11.5"/><circle class="feito" cx="13" cy="13" r="11.5" stroke-dasharray="72.3" stroke-dashoffset="'+(72.3*(1-e.p/100)).toFixed(1)+'"/></svg>':'';
    b.dataset.estado=e.est;b.innerHTML='<span class="ico">'+anel+e.ic+'<span class="ponto"></span></span><span class="txt">'+e.txt+'</span>';
    var r='Uso offline: '+(st.rede?'online':'sem internet')+', '+e.txt;b.setAttribute('aria-label',r);b.title=r+'. Clique para ver o que está guardado.';
    if(vivo&&vivo.dataset.ultimo!==e.est){vivo.dataset.ultimo=e.est;vivo.textContent=r;
      // O botão mudou de largura: a barra mede de novo o caminho (barra.js ouve o resize).
      try{window.dispatchEvent(new Event('resize'))}catch(x){}}}

  // ---- Painel ---------------------------------------------------------------------------------------------------------------
  function data(d){var m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d:\d\d)/.exec(d||'');return m?m[3]+'/'+m[2]+'/'+m[1]+', '+m[4]:''}
  function mb(n){var v=n/1048576;if(v>=1024)return Math.round(v/1024)+' GB';return (v<10?v.toFixed(1):Math.round(v)).toString().replace('.',',')+' MB'}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function nome(rel){var p=pac(rel);return (p.remoto&&p.remoto.nome)||(p.local&&p.local.nome)||rel.split('/')[0]}
  var ETQ={pronto:'Offline pronto',baixando:'Baixando',atualizar:'Fora de sincronia',pausado:'Pausado','dados-moveis':'Pausado',nada:'Não baixado'};
  function linhaPacote(rel){
    var k=situacao(rel),p=pac(rel),n=p.baixando?p.baixando.feitos:feitos(rel),t=p.baixando?p.baixando.total:total(rel),site=rel===SITE;
    var cs=escolhidos(rel),cods=codigos(rel),titulo=nome(rel)+(cs&&cods.length>1?' · '+nomesCursos(rel,cs):'');
    var det=n+' de '+t+' arquivos · '+mb(bytes(rel));
    if(k==='nada'&&p.remoto)det='Cerca de '+mb(tamanho(rel,cs,2))+' pela rede e '+mb(tamanho(rel,cs,1))+' no aparelho';
    if(site&&k!=='baixando')det+=' · sincroniza sozinho';
    if(k==='pausado'&&st.esperaWifi&&rel===DISC)det+=' · esperando o Wi-Fi';
    var bts='',extra='';
    if(st.rede){
      if(k==='nada')bts='<button type="button" class="pri" data-acao="baixar">Baixar</button>';
      else if(k==='baixando')bts='<button type="button" data-acao="pausar">Pausar</button>';
      else if(k==='pausado')bts='<button type="button" class="pri" data-acao="baixar">Continuar</button>';
      else if(k==='atualizar')bts='<button type="button" class="pri" data-acao="baixar">Atualizar</button>';
      else if(k==='pronto')bts='<button type="button" data-acao="conferir">Conferir agora</button>';
      if(!site&&k!=='nada')bts+='<button type="button" class="perigo" data-acao="apagar">Apagar</button>';
      // Sem curso escolhido: qual baixar (decisão 2), com o tamanho de cada escolha.
      if(st.escolher&&rel===PRINCIPAL&&cods.length>1){
        extra='<div class="off-escolha"><p>Qual curso baixar?</p><div class="bts">'+cods.map(function(c){
          return '<button type="button" data-acao="curso" data-curso="'+esc(c)+'">'+esc(nomesCursos(rel,[c]))+' <small>'+mb(tamanho(rel,[c],2))+'</small></button>'}).join('')+
          '<button type="button" data-acao="curso" data-curso="todos">Os dois <small>'+mb(tamanho(rel,cods,2))+'</small></button></div></div>';bts=''}
      if(k==='dados-moveis'&&rel===DISC){var falta=0,l=p.local||{arquivos:{}},r=p.remoto;
        if(r)lista(rel).forEach(function(a){if(l.arquivos[a]!==r.arquivos[a][0])falta+=r.arquivos[a][2]});
        extra='<div class="off-dm" role="alert"><b>Pausado: você está em dados móveis.</b> Faltam cerca de '+mb(falta)+'. Continuar com dados móveis ou esperar o Wi-Fi?'+
          '<div class="bts"><button type="button" class="pri" data-acao="dm-sim">Continuar assim</button><button type="button" data-acao="dm-wifi">Esperar Wi-Fi</button></div></div>'}
    }
    var dois=!site&&rel===DISC&&cods.length>1&&cs&&k!=='nada'?'<label class="off-op"><input type="checkbox" data-acao="dois"'+(cs.length===cods.length?' checked':'')+'> Os dois cursos ('+esc(nomesCursos(rel,cods))+')</label>':'';
    return '<div class="off-pac" data-k="'+k+'" data-pacote="'+esc(rel)+'"><div class="l1"><span class="nome">'+esc(titulo)+'</span><span class="etq">'+ETQ[k]+'</span></div>'+
      '<div class="off-barra" aria-hidden="true"><b style="width:'+(k==='pronto'||k==='atualizar'?100:pct(rel))+'%"></b></div><div class="det">'+det+'</div>'+
      extra+(bts?'<div class="bts">'+bts+'</div>':'')+dois+'</div>'}
  var espaco='',outros=[];
  function desenharPainel(){if(!painel||painel.hidden)return;
    var k=situacao(PRINCIPAL),p=pac(PRINCIPAL),l=p.local,r=p.remoto,sinc;
    if(k==='atualizar')sinc='Guardado: versão <code>'+esc(l.token)+'</code> de '+data(l.data)+' · no site: <code>'+esc(r.token)+'</code> de '+data(r.data);
    else if(l&&l.token&&(k==='pronto'))sinc='Sincronizado em '+data(l.data)+' · versão <code>'+esc(l.token)+'</code>';
    else if(k==='nada')sinc=DISC?'Esta disciplina ainda não foi baixada. As páginas que você abre ficam guardadas de passagem.':'A página das disciplinas e o tema ficam guardados sozinhos.';
    else if(k==='baixando')sinc='Baixando aos poucos: primeiro o que você está vendo e o tópico seguinte.';
    else sinc='Baixado em parte. "Continuar" recomeça de onde parou; o que já desceu abre sem internet.';
    var ls=[SITE].concat(DISC?[DISC]:[]).concat(outros.filter(function(x){return x!==SITE&&x!==DISC}));
    // Só o progresso mudou (mesmos pacotes, estados e escolhas): atualiza a barra e os números no lugar, sem refazer os botões,
    // para um clique em "Pausar" no meio do download não cair num botão que acabou de ser trocado.
    var assinatura=[st.rede,st.escolher,st.esperaWifi,espaco,sinc].concat(ls.map(function(rel){return rel+':'+situacao(rel)+':'+(escolhidos(rel)||[]).join(' ')})).join('|');
    if(painel.dataset.assinatura===assinatura){
      [].forEach.call(painel.querySelectorAll('.off-pac'),function(el){var tmp=document.createElement('div');tmp.innerHTML=linhaPacote(el.dataset.pacote);
        var novo=tmp.firstChild;el.querySelector('.off-barra b').style.width=novo.querySelector('.off-barra b').style.width;
        el.querySelector('.det').textContent=novo.querySelector('.det').textContent});
      return}
    painel.dataset.assinatura=assinatura;
    var ios=/iPhone|iPad|iPod/.test(navigator.userAgent)&&!navigator.standalone;
    var foco=document.activeElement&&painel.contains(document.activeElement)?document.activeElement.dataset.acao:null;
    painel.innerHTML='<div class="off-rede'+(st.rede?'':' off')+'"><i></i>'+(st.rede?'Você está online':'Você está sem internet')+'</div>'+
      '<p class="off-sinc">'+sinc+'</p><h3>Guardado neste aparelho</h3>'+ls.map(linhaPacote).join('')+
      (ios?'<p class="off-nota">No iPhone, o Safari pode apagar o que foi guardado depois de 7 dias sem abrir o site. Pela Tela de Início, fica.</p>':'')+
      '<div class="off-rodape"><span>'+espaco+'</span><button type="button" class="perigo" data-acao="tudo">Apagar tudo</button></div>';
    // O painel é redesenhado a cada passo do download: o foco do teclado volta ao botão em que estava.
    if(foco){var f=painel.querySelector('[data-acao="'+foco+'"]');if(f)f.focus()}}
  function medirEspaco(){if(!navigator.storage||!navigator.storage.estimate){espaco='';return Promise.resolve()}
    return navigator.storage.estimate().then(function(e){espaco='Espaço usado: '+mb(e.usage||0)+(e.quota?' de '+mb(e.quota)+' disponíveis':'')},function(){})}
  function abrirPainel(v){if(!painel||!b)return;painel.hidden=!v;b.setAttribute('aria-expanded',v?'true':'false');
    if(!v)st.escolher=false;
    if(v){var a=document.getElementById('aparencia');if(a&&!a.hidden){var ba=document.getElementById('bAparencia');a.hidden=true;if(ba)ba.setAttribute('aria-expanded','false')}
      Promise.all([medirEspaco(),guardados().then(function(g){outros=g})]).then(function(){
        return Promise.all(outros.map(function(rel){return pac(rel).local?null:lerLocal(rel)}))}).then(desenharPainel);desenharPainel()}}
  function apagarPacote(rel){if(!confirm('Apagar '+nome(rel)+' deste aparelho?\n\nAs aulas vistas, as questões feitas e as preferências ficam.'))return;
    M.gravar('offline-'+pastaDe(rel)+'-baixar',null);M.gravar('offline-'+pastaDe(rel)+'-cursos',null);delete pac(rel).baixando;pac(rel).dm=false;
    mandar({tipo:'apagar',pacote:rel})}
  function apagarTudo(){if(!confirm('Apagar tudo o que foi guardado para uso sem internet neste aparelho?\n\nAs aulas vistas, as questões feitas e as preferências ficam. A página das disciplinas e o tema voltam a ser guardados na próxima abertura com internet.'))return;
    Object.keys(st.pac).concat(outros).forEach(function(rel){if(rel!==SITE){M.gravar('offline-'+pastaDe(rel)+'-baixar',null);M.gravar('offline-'+pastaDe(rel)+'-cursos',null)}
      mandar({tipo:'apagar',pacote:rel})});
    setTimeout(function(){caches.delete(CACHE).then(function(){st.pac={};outros=[];return atualizarTudo()})},300)}
  if(b&&painel){
    b.hidden=false;
    vivo=document.createElement('span');vivo.className='off-leitor';vivo.setAttribute('aria-live','polite');document.body.appendChild(vivo);
    b.addEventListener('click',function(e){e.stopPropagation();abrirPainel(painel.hidden)});
    painel.addEventListener('click',function(e){e.stopPropagation();var t=e.target.closest('[data-acao]');if(!t||t.tagName==='INPUT')return;
      var rel=(t.closest('[data-pacote]')||{dataset:{}}).dataset.pacote;
      ({baixar:function(){baixar(rel)},conferir:function(){pedir(rel,{cursos:escolhidos(rel)})},
        pausar:function(){pausar(rel)},apagar:function(){apagarPacote(rel)},tudo:apagarTudo,curso:function(){escolherCurso(rel,t.dataset.curso)},
        'dm-sim':function(){try{sessionStorage.setItem('offline-dados-ok','1')}catch(x){}iniciar(rel)},
        'dm-wifi':function(){pac(rel).dm=false;st.esperaWifi=true;tudo()}})[t.dataset.acao]()});
    painel.addEventListener('change',function(e){var t=e.target;if(t.dataset.acao==='dois')doisCursos(t.closest('[data-pacote]').dataset.pacote,t.checked)});
    document.addEventListener('click',function(){if(!painel.hidden)abrirPainel(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!painel.hidden){abrirPainel(false);b.focus()}});
    var ba=document.getElementById('bAparencia');if(ba)ba.addEventListener('click',function(){if(!painel.hidden)abrirPainel(false)});
  }

  // ---- Rede: aviso curto e links que não abririam ---------------------------------------------------------------------------
  var aviso=null,tAviso=0;
  function avisar(txt){if(!aviso){aviso=document.createElement('div');aviso.className='off-aviso';aviso.setAttribute('role','status');document.body.appendChild(aviso)}
    aviso.innerHTML=icone(st.rede?'ok':'riscada',18)+'<span>'+txt+'</span>';aviso.classList.add('ver');clearTimeout(tAviso);
    tAviso=setTimeout(function(){aviso.classList.remove('ver')},txt.length>60?7000:4000)}
  function marcarLinks(){
    var links=[].slice.call(document.querySelectorAll('a[href]'));
    if(st.rede){links.forEach(function(a){if(a.classList.contains('off-nao')){a.classList.remove('off-nao');a.removeAttribute('aria-disabled');if(a.dataset.offTitulo!==undefined){a.title=a.dataset.offTitulo;delete a.dataset.offTitulo}}});return Promise.resolve()}
    return abrirCache().then(function(c){return c.keys()}).then(function(ks){var tem={};ks.forEach(function(r){tem[r.url]=1});
      links.forEach(function(a){var h=a.getAttribute('href');if(!h||/^(#|mailto:|javascript:)/.test(h))return;
        var u;try{u=new URL(h,location.href)}catch(e){return}
        if(u.origin!==location.origin||u.href.indexOf(raiz)!==0||!/(\.html|\/)$/.test(u.pathname))return;
        if(tem[chave(u.href)])return;
        a.classList.add('off-nao');a.setAttribute('aria-disabled','true');a.dataset.offTitulo=a.title||'';a.title='Indisponível sem internet: esta página não está guardada neste aparelho.'})})}
  function paginaGuardada(){return abrirCache().then(function(c){return c.match(chave(location.href))}).then(function(m){return !!m},function(){return false})}
  function mudouRede(rede){var antes=st.rede;st.rede=rede;
    if(antes!==rede)paginaGuardada().then(function(g){
      avisar(rede?'Internet de volta.':g?'Sem internet. Esta página está guardada.':'Sem internet. Esta página não está guardada: as próximas podem não abrir.')});
    marcarLinks();cartoes();tudo()}
  addEventListener('offline',function(){mudouRede(false)});
  addEventListener('online',function(){atualizarTudo()});

  // ---- Página das disciplinas: o estado de cada uma no cartão ---------------------------------------------------------------
  function cartoes(){if(pasta)return;
    [].forEach.call(document.querySelectorAll('article.cartao.disc h3 a[href]'),function(a){
      var u=new URL(a.getAttribute('href'),location.href);if(u.href.indexOf(raiz)!==0)return;
      var rel=u.href.slice(raiz.length).split('/')[0]+'/recursos/offline.json',cartao=a.closest('article'),corpo=cartao.querySelector('.corpo');
      Promise.all([lerLocal(rel),abrirCache().then(function(c){return c.match(chave(u.href))})]).then(function(x){
        var l=x[0],aberta=!!x[1],k,txt;
        if(l&&l.token){k='pronto';txt='Offline pronto'}
        else if(l&&l.arquivos&&Object.keys(l.arquivos).length){k='parcial';txt='Offline '+Math.min(99,Math.floor(100*Object.keys(l.arquivos).length/Math.max(1,l.total||1)))+'%'}
        else if(!st.rede&&!aberta){k='indisp';txt='Indisponível sem internet'}
        cartao.classList.toggle('off-indisp',k==='indisp');
        var e=cartao.querySelector('.off-cartao');
        if(!k){if(e)e.remove();return}
        if(!e){e=document.createElement('span');e.className='off-cartao';var etq=corpo.querySelector('.etq');(etq||corpo.firstChild).insertAdjacentElement(etq?'afterend':'beforebegin',e)}
        e.dataset.k=k;e.innerHTML=icone(k==='indisp'?'riscada':k==='pronto'?'ok':'pausa',16)+'<span>'+txt+'</span>'})})}

  // ---- Juntando -------------------------------------------------------------------------------------------------------------
  function tudo(){desenharBotao();desenharPainel()}
  function atualizarTudo(){
    var rels=[SITE].concat(DISC?[DISC]:[]);
    return Promise.all(rels.map(lerLocal)).then(function(){
      if(navigator.onLine===false){mudouRede(false);return}
      // O pedido do pacote confirma a rede (navigator.onLine diz "online" em rede sem saída, como a de portal com login).
      return Promise.all(rels.map(lerRemoto)).then(function(){mudouRede(true)},function(){mudouRede(false)})
    }).then(function(){
      // Download começado e não pausado pela pessoa: recomeça sozinho ao abrir outra página (ou a fila em curso é reordenada,
      // com a página aberta na frente).
      if(DISC&&st.rede&&bandeira(DISC)==='sim'&&situacao(DISC)!=='pronto'&&situacao(DISC)!=='atualizar')iniciar(DISC);
      tudo()})}
  ouvir(function(d){var p=pac(d.pacote);
    if(d.estado==='baixando'){if(!p.dm){p.baixando={feitos:d.feitos,total:d.total};tudo()}return}
    delete p.baixando;
    lerLocal(d.pacote).then(function(){if(d.estado==='apagado')outros=outros.filter(function(x){return x!==d.pacote});
      if(!st.rede)marcarLinks();cartoes();return painel&&!painel.hidden?medirEspaco():null}).then(tudo)});
  registrado.then(atualizarTudo);
  cartoes();
  if(b)desenharBotao();
  return api;
})();
