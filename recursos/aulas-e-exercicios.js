// Aulas e exercícios: "Só os liberados", percentual visto (calculo-quadros) e o índice dos tópicos ao lado.
(function(){
  [].forEach.call(document.querySelectorAll('.linhas>li'),function(li){if(!li.querySelector('a.aula'))li.classList.add('breve')});
  var so=document.getElementById('soLib');if(so)so.onchange=function(){document.body.classList.toggle('so-lib',so.checked)};
  // Quadros vistos (calculo-quadros, gravado pelo tema.js): percentual por aula, que dá para zerar, preenchimento em cada seção e o total
  // das aulas no ar no alto da página (pedido do professor, 12/11/2026, no lugar do "✓ vista" por aula).
  var nomes={EE:'Elétrica',EQ:'Química'};
  function pintar(){var v=Memoria.quadros(),soma={EE:[0,0],EQ:[0,0]};
    [].forEach.call(document.querySelectorAll('.links[data-aula]'),function(l){var o=Memoria.faixas(v[l.dataset.aula]),tot=+l.dataset.total||0,c=l.dataset.aula.slice(-2);
      var vis=Memoria.contar(o,1,tot);if(tot&&l.querySelector('a.aula')){soma[c][0]+=vis;soma[c][1]+=tot}
      [].forEach.call(l.querySelectorAll('a.aula[data-ini]'),function(a){var x=+a.dataset.ini,y=+a.dataset.fim,f=y>=x?Memoria.contar(o,x,y)/(y-x+1):0;
        a.style.setProperty('--f',f.toFixed(3));a.classList.toggle('com-vis',f>0);a.title=f>0?Math.round(100*f)+'% desta seção visto':''});
      var p=l.querySelector('.pct');if(!p){p=document.createElement('span');p.className='pct';l.querySelector('.ver').before(p)}
      var pc=tot?Math.round(100*vis/tot):0;p.hidden=!vis;
      p.innerHTML=vis?'<b>'+pc+'%</b> visto <button type="button" class="zerar" aria-label="Zerar o que foi visto na '+l.dataset.aula+'">zerar</button>':'';
      if(vis)p.querySelector('.zerar').onclick=function(){Memoria.zerarVistos(l.dataset.aula);pintar()}});
    var g=document.getElementById('global'),c=document.documentElement.dataset.curso,cs=c?[c]:Memoria.cursos.filter(function(k){return soma[k][0]})||[];
    if(!g)return;if(!cs.length)cs=[Memoria.cursos[0]];
    g.innerHTML=cs.filter(function(k){return soma[k][1]}).map(function(k){var pc=Math.round(100*soma[k][0]/soma[k][1]);
      return '<div class="progresso"><div class="barra-p"><i style="width:'+pc+'%"></i></div><span><b>'+pc+'%</b> das aulas no ar vistas'+(cs.length>1||!c?' · '+nomes[k]:'')+'</span></div>'}).join('')+
      (Object.keys(v).length?'<button type="button" class="zerar" id="zerarTudo">zerar tudo</button>':'');
    var z=document.getElementById('zerarTudo');if(z)z.onclick=function(){if(confirm('Zerar o que foi visto em todas as aulas, neste navegador?')){Memoria.zerarVistos();pintar()}}}
  pintar();document.addEventListener('click',function(e){if(e.target.closest('[data-curso-opcao]'))setTimeout(pintar,0)});
  var r=document.createElement('nav');r.className='rail rail-aulas';r.setAttribute('aria-label','Índice dos tópicos');
  var b=document.createElement('button');b.type='button';b.className='b-rail';b.setAttribute('aria-expanded','false');
  b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>Índice';
  var h='<h2>Índice</h2>';[].forEach.call(document.querySelectorAll('.parte'),function(p){
    h+='<div class="grupo" data-p="'+p.id+'"><a class="p" href="#'+p.id+'"></a>';
    [].forEach.call(p.querySelectorAll('.linhas>li'),function(li){h+='<a class="t" href="#'+li.id+'" data-t="'+li.id+'"><b>'+li.id+'</b><span></span></a>'});h+='</div>'});
  r.innerHTML=h;
  [].forEach.call(r.querySelectorAll('.grupo'),function(g){var p=document.getElementById(g.dataset.p);g.querySelector('.p').textContent=p.querySelector('h2').textContent;
    [].forEach.call(g.querySelectorAll('.t'),function(a){a.querySelector('span').textContent=document.getElementById(a.dataset.t).querySelector('.tit').textContent})});
  document.body.appendChild(r);document.body.appendChild(b);
  b.onclick=function(){b.setAttribute('aria-expanded',r.classList.toggle('aberta'))};
  r.addEventListener('click',function(e){if(e.target.closest('a')){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&r.classList.contains('aberta')){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}});
  if(!window.IntersectionObserver)return;
  new IntersectionObserver(function(es){var fora=!es[0].isIntersecting;r.classList.toggle('ver',fora);b.classList.toggle('ver',fora);
    if(!fora){r.classList.remove('aberta');b.setAttribute('aria-expanded','false')}}).observe(document.getElementById('heroi'));
  var o=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var p=e.target.closest('.parte').id;
    [].forEach.call(r.querySelectorAll('.grupo'),function(g){g.classList.toggle('aberto',g.dataset.p===p)});
    [].forEach.call(r.querySelectorAll('a.t'),function(a){a.classList.toggle('atual',a.dataset.t===e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
  [].forEach.call(document.querySelectorAll('.linhas>li'),function(l){o.observe(l)});
})();
