// Catálogos: figuras nos cartões (figuras.js) e o filtro por nome ou código.
(function(){
  if(window.figura)[].forEach.call(document.querySelectorAll('[data-fig]'),function(c){c.innerHTML=figura(c.dataset.fig)});
  var f=document.getElementById('filtro'),n=document.getElementById('cConta');
  function contar(){var v=f.value.trim().toLowerCase(),k=0;
    [].forEach.call(document.querySelectorAll('.mod'),function(m){var ok=!v||m.dataset.f.indexOf(v)>=0;m.style.display=ok?'':'none';if(ok)k++});
    [].forEach.call(document.querySelectorAll('.secao.cat'),function(s){s.style.display=s.querySelector('.mod:not([style*="none"])')?'':'none'});
    n.textContent=k+(k===1?' módulo':' módulos')}
  if(f){f.oninput=contar;contar()}
})();
