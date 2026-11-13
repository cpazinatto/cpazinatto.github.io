// Páginas de entrada: preferências, teclas M, T, L e A, e o painel de aparência.
Pref.ligar();document.addEventListener('keydown',Pref.tecla);
(function(){var b=document.getElementById('bAparencia'),p=document.getElementById('aparencia');
  function abrir(v){p.hidden=!v;b.setAttribute('aria-expanded',v?'true':'false')}
  b.onclick=function(e){e.stopPropagation();abrir(p.hidden)};
  document.addEventListener('click',function(e){if(!p.hidden&&!p.contains(e.target))abrir(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden){abrir(false);b.focus()}});
})();
