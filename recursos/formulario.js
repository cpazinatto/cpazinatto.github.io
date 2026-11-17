// Formulário (17/11/2026, tema/montagem/92-formulario.py): filtro por texto e por bloco, "Ver como na prova", imprimir, a fórmula
// do endereço (#F07, vindo da busca) em destaque e os links de tópico levando à aula do curso guardado, como nos módulos (09-curso.js).
(function(){
  var raiz=document.querySelector('.fm-pag');if(!raiz)return;
  var filtro=document.getElementById('fmFiltro'),conta=document.getElementById('fmConta'),prova=document.getElementById('fmProva');
  var grupos=[].slice.call(raiz.querySelectorAll('.fm-g')),bloco='';
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim()}
  function aplicar(){
    var q=norm(filtro&&filtro.value).split(' ').filter(Boolean),n=0,tot=0;
    grupos.forEach(function(g){
      var vis=0,fs=[].slice.call(g.querySelectorAll('.fm'));
      fs.forEach(function(f){tot++;var ok=(!bloco||g.dataset.b===bloco)&&q.every(function(p){return f.dataset.f.indexOf(p)>=0});f.hidden=!ok;if(ok)vis++});
      n+=vis;g.hidden=(bloco&&g.dataset.b!==bloco)||(q.length>0&&!vis);
    });
    if(conta)conta.textContent=(q.length||bloco)?(n?n+(n>1?' fórmulas':' fórmula'):'Nenhuma fórmula com isso. Tente outra palavra ou o bloco Todos.'):'';
  }
  if(filtro)filtro.addEventListener('input',aplicar);
  [].forEach.call(document.querySelectorAll('.fm-chips button'),function(b,_,todos){
    b.addEventListener('click',function(){bloco=b.dataset.b;[].forEach.call(todos,function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});aplicar()})});
  // "Ver como na prova": fica guardado neste navegador, como as escolhas de leitura.
  var chave=window.Memoria?Memoria.chave('formulario-prova'):null;
  function modo(on){document.body.classList.toggle('fm-prova',on);if(prova)prova.setAttribute('aria-pressed',on?'true':'false')}
  try{modo(chave&&Memoria.ler(chave)==='1')}catch(e){}
  if(prova)prova.addEventListener('click',function(){var on=!document.body.classList.contains('fm-prova');modo(on);try{if(chave)Memoria.gravar(chave,on?'1':null)}catch(e){}});
  // Imprimir (17/11/2026, professor: "imprimir só põe tudo; tbm deve ser de forma compacta, para não gastar muitas folhas"): um
  // painel escolhe os blocos (marcados os que estão à vista), se vale só o filtro de texto, e o formato, Compacta (o padrão, três
  // colunas) ou Ampla. Cmd+P / Ctrl+P sem o painel imprime o que está à vista, compacto.
  var chaveFmt=window.Memoria?Memoria.chave('formulario-folha'):null;
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function limpar(){document.body.classList.remove('fm-ampla','fm-todas');grupos.forEach(function(g){g.classList.remove('fm-fora','fm-dentro')})}
  window.addEventListener('afterprint',limpar);
  function painel(){
    var d=document.getElementById('fmImpp');if(d)d.remove();
    var com=grupos.filter(function(g){return g.querySelector('.fm')}),q=filtro&&filtro.value.trim();
    var ampla=false;try{ampla=chaveFmt&&Memoria.ler(chaveFmt)==='ampla'}catch(e){}
    d=document.createElement('dialog');d.className='fm-impp';d.id='fmImpp';d.setAttribute('aria-labelledby','fmImppT');
    d.innerHTML='<h2 id="fmImppT">Imprimir o formulário</h2><fieldset><legend>O que entra</legend>'
      +com.map(function(g){var n=g.querySelectorAll('.fm').length;
        return '<label><input type="checkbox" data-g="'+g.dataset.b+'"'+(g.hidden?'':' checked')+'> '+esc(g.querySelector('h2').firstChild.textContent)+' <small>'+n+(n>1?' fórmulas':' fórmula')+'</small></label>'}).join('')
      +(q?'<label><input type="checkbox" id="fmSoFiltro" checked> Só as que passam no filtro “'+esc(q)+'”</label>':'')
      +'</fieldset><fieldset><legend>Formato</legend>'
      +'<label><input type="radio" name="fmFmt" value="compacta"'+(ampla?'':' checked')+'> Compacta <small>três colunas, letra menor: menos folhas</small></label>'
      +'<label><input type="radio" name="fmFmt" value="ampla"'+(ampla?' checked':'')+'> Ampla <small>duas colunas, letra maior</small></label></fieldset>'
      +'<div class="fm-impp-pe"><span id="fmImppN"></span><button type="button" data-x>Cancelar</button><button type="button" class="ok">Imprimir</button></div>';
    document.body.appendChild(d);
    function conta(){var n=0,so=d.querySelector('#fmSoFiltro');
      [].forEach.call(d.querySelectorAll('[data-g]'),function(c){if(!c.checked)return;var g=document.querySelector('.fm-g[data-b="'+c.dataset.g+'"]');
        n+=[].filter.call(g.querySelectorAll('.fm'),function(f){return !(so&&so.checked)||!f.hidden||!q}).length});
      d.querySelector('#fmImppN').textContent=n+(n===1?' fórmula':' fórmulas');d.querySelector('.ok').disabled=!n}
    d.addEventListener('change',conta);conta();
    d.querySelector('[data-x]').addEventListener('click',function(){d.close()});
    d.querySelector('.ok').addEventListener('click',function(){
      var so=d.querySelector('#fmSoFiltro'),fmt=d.querySelector('input[name=fmFmt]:checked').value;
      try{if(chaveFmt)Memoria.gravar(chaveFmt,fmt==='ampla'?'ampla':null)}catch(e){}
      [].forEach.call(d.querySelectorAll('[data-g]'),function(c){var g=document.querySelector('.fm-g[data-b="'+c.dataset.g+'"]');
        g.classList.add(c.checked?'fm-dentro':'fm-fora')});
      grupos.forEach(function(g){if(!g.querySelector('.fm'))g.classList.add('fm-fora')});
      document.body.classList.toggle('fm-todas',!(so&&so.checked));
      document.body.classList.toggle('fm-ampla',fmt==='ampla');
      d.close();setTimeout(function(){window.print()},50)});
    d.showModal();
  }
  var imp=document.getElementById('fmImp');if(imp)imp.addEventListener('click',painel);
  // Fórmula do endereço: aparece mesmo com filtro, com o exemplo aberto.
  function alvo(){var id=decodeURIComponent(location.hash.slice(1)),f=id&&document.getElementById(id);if(!f||!f.classList.contains('fm'))return;
    if(filtro)filtro.value='';bloco='';[].forEach.call(document.querySelectorAll('.fm-chips button'),function(x){x.setAttribute('aria-pressed',x.dataset.b===''?'true':'false')});aplicar();
    var d=f.querySelector('details');if(d&&!document.body.classList.contains('fm-prova'))d.open=true;f.scrollIntoView({block:'center'})}
  window.addEventListener('hashchange',alvo);if(location.hash)setTimeout(alvo,0);
  // Links de tópico: a aula do curso guardado (data-ee, data-eq); sem curso, o tópico em "Aulas e exercícios".
  try{var c=window.Memoria&&Memoria.ler(Memoria.chave('curso'));if(c&&Memoria.cursos.indexOf(c)>=0)
    [].forEach.call(raiz.querySelectorAll('a[data-'+c.toLowerCase()+']'),function(a){a.setAttribute('href',a.getAttribute('data-'+c.toLowerCase()))})}catch(e){}
})();
