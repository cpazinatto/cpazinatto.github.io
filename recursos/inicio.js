// Início: "Continuar de onde parou", da última aula aberta neste navegador (tema.js grava calculo-ultima e calculo-quadros).
(function(){var u=Memoria.lerJSON(Memoria.chave('ultima'),null);
  if(!u||!/^aulas\/T\d\d[a-z]?-[A-Z]{2,3}\.html$/.test(u.u||''))return;var c=document.getElementById('continuar');
  c.querySelector('.cod').textContent=u.cod||'';c.querySelector('.t').textContent=u.tit||'';
  var vis=Object.keys(Memoria.vistos(u.u.replace(/^aulas\/|\.html$/g,''))).length;
  // Partes que existem, unidas por " · " (na capa da aula não há número de quadro); o percentual vai na barra (13/11/2026).
  c.querySelector('.q').textContent=[u.n?'Quadro '+u.n+(u.tot?' de '+u.tot:''):'',u.sec||''].filter(Boolean).join(' · ');
  if(u.tot){var pct=Math.min(100,Math.round(100*vis/u.tot)),pr=c.querySelector('.progresso');
    pr.querySelector('i').style.width=pct+'%';pr.querySelector('span').textContent=pct+'% visto';pr.hidden=false}
  c.querySelector('.botao').setAttribute('href',u.u+(u.h?'#'+u.h:''));c.hidden=false})();
