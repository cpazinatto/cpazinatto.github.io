// Preferências de quem assiste: modo (claro/escuro), cores, letra e tamanho da letra. Valem para o índice, as aulas e as listas,
// e ficam guardadas no navegador. ?modo=, ?cores=, ?letra= e ?tamanho= na URL valem só para aquela abertura (sem guardar).
// Botões e seletores com data-pref="modo|cores|letra|tamanho" são ligados aqui; quem precisa refazer medidas ouve o evento "preferencias".
// O que fica guardado no navegador (12/11/2026): um lugar só para ler e gravar. Nada sai do aparelho. Chaves:
//   leitura-modo, -cores, -letra, -tamanho  preferências de leitura, comuns a todas as disciplinas (o prefixo antigo calculo- ainda é lido)
//   leitura-roda             a roda do mouse na aula e no visor: continua (o padrão, 14/11/2026), giro (um passo por giro) ou desligada
//   <disc>-curso             o curso escolhido (EE, EQ...)
//   <disc>-quadros           {"T14-EE":"1-7,9"}: quadros vistos de cada aula, pelo número do rodapé
//   <disc>-ultima            {u, h, cod, tit, n, tot, sec}: a última aula aberta ("Continuar de onde parou")
//   <disc>-feita:<página>    {"q3":true}: questões marcadas como feitas numa lista ou num módulo
//   <disc>-recolhida:<página> ["q1","q3"]: questões recolhidas numa lista ou num módulo
//   <disc>-aulas-recolhidas, <disc>-aulas-fixadas   partes recolhidas e tópicos fixados em "Aulas e exercícios"
//   <disc>-base-recolhidos, -base-fixados, <disc>-comp-recolhidos, -comp-fixados   o mesmo na Revisão da base e nas Demonstrações
//   disciplinas-ordem        [{nome, discs}]: a ordem dos níveis e das disciplinas que o aluno arrumou na página das disciplinas
//   disciplinas-recolhidas   ["Ensino técnico..."]: os níveis recolhidos nela
// <disc> é o prefixo da disciplina (13/11/2026), no <html data-disc>, e os cursos dela vêm em <html data-cursos>, os dois do
// disciplina.json. O Cálculo I usa "calculo", o mesmo de antes; a página sem data-disc (a das disciplinas) fica com ele.
window.Memoria=(function(){
  var raiz=document.documentElement,PREFIXO=raiz.dataset.disc||'calculo',CURSOS=(raiz.dataset.cursos||'EE EQ').split(' ');
  function chave(nome){return PREFIXO+'-'+nome}
  function ler(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function gravar(k,v){try{if(v===null||v===undefined)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
  function lerJSON(k,padrao){var v=null;try{v=JSON.parse(ler(k)||'null')}catch(e){}return v||padrao}
  function gravarJSON(k,v){gravar(k,v===null||v===undefined?null:JSON.stringify(v))}
  // Faixas de quadros: "1-7,9" <-> {1:1,...,7:1,9:1}.
  function faixas(t){var o={};(t||'').split(',').forEach(function(p){var m=p.match(/^(\d+)(?:-(\d+))?$/);if(m)for(var a=+m[1],b=+(m[2]||m[1]);a<=b;a++)o[a]=1});return o}
  function escreverFaixas(o){var ns=Object.keys(o).map(Number).sort(function(a,b){return a-b}),r=[],k=0;
    while(k<ns.length){var j=k;while(j+1<ns.length&&ns[j+1]===ns[j]+1)j++;r.push(ns[k]===ns[j]?ns[k]:ns[k]+'-'+ns[j]);k=j+1}return r.join(',')}
  function contar(o,a,b){var n=0;for(var k=a;k<=b;k++)if(o[k])n++;return n}
  // Quadros vistos: todos ({aula: "faixas"}), os de uma aula, gravar os de uma aula, zerar uma aula ou todas.
  function quadros(){return lerJSON(chave('quadros'),{})}
  function vistos(aula){return faixas(quadros()[aula])}
  function gravarVistos(aula,o){var v=quadros();v[aula]=escreverFaixas(o);gravarJSON(chave('quadros'),v)}
  function zerarVistos(aula){if(aula===undefined){gravarJSON(chave('quadros'),{});return}var v=quadros();delete v[aula];gravarJSON(chave('quadros'),v)}
  return {chave:chave,cursos:CURSOS,ler:ler,gravar:gravar,lerJSON:lerJSON,gravarJSON:gravarJSON,faixas:faixas,escreverFaixas:escreverFaixas,contar:contar,
    quadros:quadros,vistos:vistos,gravarVistos:gravarVistos,zerarVistos:zerarVistos};
})();
(function(){
  var raiz=document.documentElement,par=new URLSearchParams(location.search);
  // ?captura=1 (tema/capturas.py, 13/11/2026): sem transições nem animações, para a captura não pegar nada no meio do caminho.
  if(par.has('captura'))raiz.classList.add('captura');
  var OPCOES={
    modo:[['claro','Claro'],['escuro','Escuro']],
    cores:[['padrao','Padrão'],['contraste','Alto contraste'],['papel','Papel'],['vibrante','Vibrante']],
    letra:[['luciole','Luciole'],['fira','Fira Sans'],['stix','STIX'],['mono','Fira Code']],
    tamanho:[['pequeno','Pequeno'],['medio','Médio'],['grande','Grande']],
    // Roda do mouse (13/11/2026, docs/planejamento-navegacao.md): sem tecla; ?roda=0 ou ?roda=desligada na URL; contínua desde 14/11/2026.
    roda:[['continua','Contínua'],['giro','Um por giro'],['desligada','Desligada']]
  };
  // Sem escolha guardada, o modo segue o do sistema (09/11/2026); a escolha feita com M ou no seletor passa a valer depois.
  var escuro=false;try{escuro=matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}
  var PADRAO={modo:escuro?'escuro':'claro',cores:'padrao',letra:'luciole',tamanho:'grande',roda:'continua'};
  var ROTULO={modo:'Modo',cores:'Cores',letra:'Letra',tamanho:'Tamanho',roda:'Roda do mouse'},TECLA={modo:'M',cores:'T',letra:'L',tamanho:'A'};
  // Prefixo comum a todas as disciplinas e à página principal (cpazinatto.github.io, 10/11/2026): a escolha feita numa página vale
  // em todas as do mesmo site. O prefixo antigo, 'calculo-', ainda é lido, para ninguém perder o que já escolheu.
  function ler(k){return Memoria.ler('leitura-'+k)||Memoria.ler('calculo-'+k)}
  function valido(k,v){return OPCOES[k].some(function(o){return o[0]===v})}
  function nome(k,v){return OPCOES[k].filter(function(o){return o[0]===v})[0][1]}
  function atualizar(){
    // Painel de aparência das páginas de entrada (12/11/2026): um botão por valor, data-pref-opcao="modo:escuro".
    [].forEach.call(document.querySelectorAll('[data-pref-opcao]'),function(e){var p=e.dataset.prefOpcao.split(':');e.setAttribute('aria-pressed',raiz.dataset[p[0]]===p[1]?'true':'false')});
    [].forEach.call(document.querySelectorAll('[data-pref]'),function(e){var k=e.dataset.pref,v=raiz.dataset[k];
      if(e.tagName==='SELECT'){e.value=v;return}
      // No menu dos quadros, só o valor, para o menu caber numa linha; o nome completo fica na dica do mouse.
      e.textContent=(e.closest('.ctl')?'':ROTULO[k]+': ')+nome(k,v)+' ('+TECLA[k]+')';e.title=ROTULO[k]+': '+nome(k,v)+'. Clique ou tecle '+TECLA[k]+' para trocar.'})}
  // As fontes vêm de recursos/fontes/ (09/11/2026) e o Chrome só as pede quando um texto visível as usa; os quadros escondidos e
  // as fórmulas do quadro seguinte seriam medidos com outra letra. Por isso as fontes da letra escolhida são pedidas já, e
  // document.fonts.ready espera por elas antes das medidas (radicais, rótulos, conferência). Com a Fira Code, os gráficos usam a Fira Sans.
  var FONTES={luciole:['Luciole','"Luciole Titulo"','"Luciole Math"'],fira:['"Fira Sans"','"Fira Math"'],
    stix:['"STIX Two Text"','"STIX Two Math"'],mono:['"Fira Code"','"Fira Math"','"Fira Sans"']};
  function carregar(){if(!document.fonts||!document.fonts.load)return;
    (FONTES[raiz.dataset.letra]||[]).forEach(function(f){['16px ','bold 16px ','italic 16px ','italic bold 16px '].forEach(function(e){
      document.fonts.load(e+f).catch(function(){})})})}
  function definir(k,v,guardar){
    if(!valido(k,v))return;raiz.dataset[k]=v;carregar();
    if(guardar)Memoria.gravar('leitura-'+k,v);
    atualizar();document.dispatchEvent(new CustomEvent('preferencias',{detail:k}));
  }
  function trocar(k){var l=OPCOES[k],n=l.findIndex(function(o){return o[0]===raiz.dataset[k]});definir(k,l[(n+1)%l.length][0],true)}
  if(par.get('roda')==='0')par.set('roda','desligada');if(par.get('roda')==='1')par.set('roda','continua');
  Object.keys(OPCOES).forEach(function(k){var v=par.get(k);if(!valido(k,v||''))v=ler(k);raiz.dataset[k]=valido(k,v||'')?v:PADRAO[k]});
  carregar();
  // Curso (11/11/2026, pedido do professor): o cartão do Cálculo I na página das disciplinas leva a ?curso=EE ou ?curso=EQ, que fica
  // guardado (a mesma chave que as aulas e as listas gravam no tema.js); ?curso=todos apaga. Com curso guardado, raiz.dataset.curso
  // faz "Aulas e exercícios" mostrar só as linhas dele. Vem aqui, no <head>, para a página não aparecer com os dois cursos antes.
  var CURSOS=Memoria.cursos;
  function curso(c,guardar){
    if(CURSOS.indexOf(c)>=0)raiz.dataset.curso=c;else{c='';delete raiz.dataset.curso}
    if(guardar)Memoria.gravar(Memoria.chave('curso'),c||null);
    [].forEach.call(document.querySelectorAll('[data-curso-opcao]'),function(e){e.setAttribute('aria-pressed',e.dataset.cursoOpcao===c?'true':'false')});
  }
  (function(){var c=par.get('curso'),g=null;
    if(c==='todos'||CURSOS.indexOf(c)>=0){curso(c,true);
      // Guardado o curso, ele sai do endereço: recarregar depois de trocar nos botões não volta ao curso do link.
      try{par.delete('curso');history.replaceState(null,'',location.pathname+(par.toString()?'?'+par:'')+location.hash)}catch(e){}}
    else{g=Memoria.ler(Memoria.chave('curso'));curso(g,false)}})();
  function ligar(){
    [].forEach.call(document.querySelectorAll('[data-curso-opcao]'),function(e){
      if(e.dataset.ligado)return;e.dataset.ligado=1;e.addEventListener('click',function(){curso(e.dataset.cursoOpcao,true)})});
    curso(raiz.dataset.curso||'',false);
    [].forEach.call(document.querySelectorAll('[data-pref-opcao]'),function(e){
      if(e.dataset.ligado)return;e.dataset.ligado=1;e.addEventListener('click',function(){var p=e.dataset.prefOpcao.split(':');definir(p[0],p[1],true)})});
    [].forEach.call(document.querySelectorAll('[data-pref]'),function(e){
      if(e.dataset.ligado)return;e.dataset.ligado=1;
      if(e.tagName==='SELECT'){e.innerHTML=OPCOES[e.dataset.pref].map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>'}).join('');
        e.addEventListener('change',function(){definir(e.dataset.pref,e.value,true)})}
      else e.addEventListener('click',function(){trocar(e.dataset.pref)})});
    atualizar();
  }
  // Teclas M, T, L e A: quem tem atalhos próprios chama Pref.tecla(e) no seu keydown.
  function tecla(e){if(e.metaKey||e.ctrlKey||e.altKey||/^(INPUT|SELECT|TEXTAREA)$/.test((e.target||{}).tagName||''))return false;
    var k={m:'modo',t:'cores',l:'letra',a:'tamanho'}[(e.key||'').toLowerCase()];if(!k)return false;trocar(k);return true}
  window.Pref={trocar:trocar,ligar:ligar,tecla:tecla};
})();
