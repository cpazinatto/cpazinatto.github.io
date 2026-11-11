// Preferências de quem assiste: modo (claro/escuro), cores, letra e tamanho da letra. Valem para o índice, as aulas e as listas,
// e ficam guardadas no navegador. ?modo=, ?cores=, ?letra= e ?tamanho= na URL valem só para aquela abertura (sem guardar).
// Botões e seletores com data-pref="modo|cores|letra|tamanho" são ligados aqui; quem precisa refazer medidas ouve o evento "preferencias".
(function(){
  var raiz=document.documentElement,par=new URLSearchParams(location.search);
  var OPCOES={
    modo:[['claro','Claro'],['escuro','Escuro']],
    cores:[['padrao','Padrão'],['contraste','Alto contraste'],['papel','Papel'],['vibrante','Vibrante']],
    letra:[['luciole','Luciole'],['fira','Fira Sans'],['stix','STIX'],['mono','Fira Code']],
    tamanho:[['pequeno','Pequeno'],['medio','Médio'],['grande','Grande']]
  };
  // Sem escolha guardada, o modo segue o do sistema (09/11/2026); a escolha feita com M ou no seletor passa a valer depois.
  var escuro=false;try{escuro=matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}
  var PADRAO={modo:escuro?'escuro':'claro',cores:'padrao',letra:'luciole',tamanho:'grande'};
  var ROTULO={modo:'Modo',cores:'Cores',letra:'Letra',tamanho:'Tamanho'},TECLA={modo:'M',cores:'T',letra:'L',tamanho:'A'};
  // Prefixo comum a todas as disciplinas e à página principal (cpazinatto.github.io, 10/11/2026): a escolha feita numa página vale
  // em todas as do mesmo site. O prefixo antigo, 'calculo-', ainda é lido, para ninguém perder o que já escolheu.
  function ler(k){try{return localStorage.getItem('leitura-'+k)||localStorage.getItem('calculo-'+k)}catch(e){return null}}
  function valido(k,v){return OPCOES[k].some(function(o){return o[0]===v})}
  function nome(k,v){return OPCOES[k].filter(function(o){return o[0]===v})[0][1]}
  function atualizar(){
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
    if(guardar){try{localStorage.setItem('leitura-'+k,v)}catch(e){}}
    atualizar();document.dispatchEvent(new CustomEvent('preferencias',{detail:k}));
  }
  function trocar(k){var l=OPCOES[k],n=l.findIndex(function(o){return o[0]===raiz.dataset[k]});definir(k,l[(n+1)%l.length][0],true)}
  Object.keys(OPCOES).forEach(function(k){var v=par.get(k);if(!valido(k,v||''))v=ler(k);raiz.dataset[k]=valido(k,v||'')?v:PADRAO[k]});
  carregar();
  // Curso (11/11/2026, pedido do professor): o cartão do Cálculo I na página das disciplinas leva a ?curso=EE ou ?curso=EQ, que fica
  // guardado (a mesma chave que as aulas e as listas gravam no tema.js); ?curso=todos apaga. Com curso guardado, raiz.dataset.curso
  // faz "Aulas e exercícios" mostrar só as linhas dele. Vem aqui, no <head>, para a página não aparecer com os dois cursos antes.
  var CURSOS=['EE','EQ'];
  function curso(c,guardar){
    if(CURSOS.indexOf(c)>=0)raiz.dataset.curso=c;else{c='';delete raiz.dataset.curso}
    if(guardar){try{if(c)localStorage.setItem('calculo-curso',c);else localStorage.removeItem('calculo-curso')}catch(e){}}
    [].forEach.call(document.querySelectorAll('[data-curso-opcao]'),function(e){e.setAttribute('aria-pressed',e.dataset.cursoOpcao===c?'true':'false')});
  }
  (function(){var c=par.get('curso'),g=null;
    if(c==='todos'||CURSOS.indexOf(c)>=0){curso(c,true);
      // Guardado o curso, ele sai do endereço: recarregar depois de trocar nos botões não volta ao curso do link.
      try{par.delete('curso');history.replaceState(null,'',location.pathname+(par.toString()?'?'+par:'')+location.hash)}catch(e){}}
    else{try{g=localStorage.getItem('calculo-curso')}catch(e){}curso(g,false)}})();
  function ligar(){
    [].forEach.call(document.querySelectorAll('[data-curso-opcao]'),function(e){
      if(e.dataset.ligado)return;e.dataset.ligado=1;e.addEventListener('click',function(){curso(e.dataset.cursoOpcao,true)})});
    curso(raiz.dataset.curso||'',false);
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
