// Figuras dos cartões da base e dos complementares: um desenho pequeno por módulo, na cor da seção (currentColor).
// Do mock do layout novo (../mock-layout/figuras.js, 12/11/2026); as das partes estão em figuras-partes.js.
// Caixa 160 x 80. Curvas com plot(); fórmulas com tx().
(function(){
  var W=160,H=80,P=8;
  function esc(v,a,b,c,d){return c+(v-a)/(b-a)*(d-c)}
  function Eixos(x0,x1,y0,y1){
    var s='';
    if(y0<=0&&y1>=0){var y=esc(0,y0,y1,H-P,P);s+='<line x1="'+P+'" y1="'+y+'" x2="'+(W-P)+'" y2="'+y+'" class="ex"/>'}
    if(x0<=0&&x1>=0){var x=esc(0,x0,x1,P,W-P);s+='<line x1="'+x+'" y1="'+P+'" x2="'+x+'" y2="'+(H-P)+'" class="ex"/>'}
    return s}
  // Gráfico: lista de funções em [x0,x1] x [y0,y1]. op: {tr:'dash'|'fino', area:[a,b], pts:[[x,y]...], lin:[[x,y,x,y]...]}
  function graf(x0,x1,y0,y1,fs,op){op=op||{};
    var X=function(x){return esc(x,x0,x1,P,W-P)},Y=function(y){return esc(y,y0,y1,H-P,P)},s=Eixos(x0,x1,y0,y1);
    function caminho(f,a,b){var d='',pena=false;for(var k=0;k<=120;k++){var x=a+(b-a)*k/120,y=f(x);
      if(!isFinite(y)||y<y0-3*(y1-y0)||y>y1+3*(y1-y0)){pena=false;continue}
      y=Math.max(y0-(y1-y0),Math.min(y1+(y1-y0),y));d+=(pena?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);pena=true}return d}
    if(op.area){var a=op.area[0],b=op.area[1],f=op.area[2]||fs[0].f,d='M'+X(a)+' '+Y(0);
      for(var k=0;k<=60;k++){var x=a+(b-a)*k/60;d+='L'+X(x).toFixed(1)+' '+Y(Math.min(y1,f(x))).toFixed(1)}d+='L'+X(b)+' '+Y(0)+'Z';s+='<path d="'+d+'" class="ar"/>'}
    (op.faixa||[]).forEach(function(r){s+='<rect x="'+P+'" y="'+Y(r[1])+'" width="'+(W-2*P)+'" height="'+(Y(r[0])-Y(r[1]))+'" class="ar"/>'});
    (op.lin||[]).forEach(function(l){s+='<line x1="'+X(l[0])+'" y1="'+Y(l[1])+'" x2="'+X(l[2])+'" y2="'+Y(l[3])+'" class="'+(l[4]||'tr')+'"/>'});
    fs.forEach(function(o){s+='<path d="'+caminho(o.f,o.a!=null?o.a:x0,o.b!=null?o.b:x1)+'" class="'+(o.c||'cv')+'"/>'});
    (op.pts||[]).forEach(function(p){s+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="3.2" class="'+(p[2]||'pt')+'"/>'});
    (op.tx||[]).forEach(function(t){s+='<text x="'+X(t[0])+'" y="'+Y(t[1])+'" class="rt">'+t[2]+'</text>'});
    return '<g clip-path="url(#fig-caixa)">'+s+'</g>'}
  function tx(t,tam){return '<text x="80" y="'+(46+(tam||24)/3.6)+'" text-anchor="middle" class="fm" style="font-size:'+(tam||24)+'px">'+t+'</text>'}
  function sen(x){return Math.sin(x)}
  var F={
    B00:'<rect x="56" y="12" width="48" height="58" rx="5" class="cx"/><path d="M64 28l4 4 8-8M64 44l4 4 8-8M64 60l4 4 8-8" class="cv"/><path d="M82 28h14M82 44h14M82 60h10" class="tr"/>',
    B01:tx('¾ · (−)(−) = +',22),
    B02:tx('x² · √x = x<tspan baseline-shift="super" font-size="14">5/2</tspan>',22),
    B03:tx('(a+b)² = a²+2ab+b²',15),
    B04:tx('2x + 3 = 7  ⇒  x = 2',18),
    B05:tx('a(b + c) = ab + ac',19),
    B06:graf(-2.2,2.2,-3,3,[{f:function(x){return x*x*x-2.5*x}}],{pts:[[0,0],[-Math.sqrt(2.5),0],[Math.sqrt(2.5),0]]}),
    B07:graf(-1,4,-1,4,[{f:function(x){return 0.8*x+0.6}},{f:function(x){return 3.4-0.6*x},c:'cv2'}],{pts:[[2,2.2]]}),
    B08:tx('a : b = c : d   ·   %',20),
    B09:graf(-1,4,-1,4,[{f:function(x){return 0.7*x+0.5}}],{pts:[[0,0.5],[3,2.6]],lin:[[0,0.5,3,0.5,'dash'],[3,0.5,3,2.6,'dash']]}),
    B10:graf(-1,5,-1,3,[{f:function(x){return Math.sqrt(x)},a:0,b:4.5}],{lin:[[0,-0.5,4.5,-0.5,'grosso']],pts:[[0,0]]}),
    B11:tx('f(x) = x² − 1  →  f(2) = 3',15),
    B12:graf(-1,5,-1,3,[{f:function(x){return 1.2+Math.sin(x*1.4)}}],{pts:[[2,1.2+Math.sin(2.8)]],lin:[[2,0,2,1.2+Math.sin(2.8),'dash'],[0,1.2+Math.sin(2.8),2,1.2+Math.sin(2.8),'dash']]}),
    B13:graf(-3,3,-1,3,[{f:function(x){return Math.abs(x)}},{f:function(x){return 0.5*x+1},c:'cv2'}]),
    B14:graf(-1,5,-2,3,[{f:function(x){return 0.6*(x-2)*(x-2)-1.5}}],{pts:[[2,-1.5],[2-Math.sqrt(2.5),0],[2+Math.sqrt(2.5),0]]}),
    B15:graf(-3,3,-3,3,[{f:function(x){return 1/x},a:0.05,b:3},{f:function(x){return 1/x},a:-3,b:-0.05}]),
    B16:graf(-3,4,-1,4,[{f:function(x){return x*x},c:'dash'},{f:function(x){return (x-1.5)*(x-1.5)+0.8}}]),
    B17:graf(-1,4,-1,4,[{f:function(x){return x},c:'dash'},{f:function(x){return Math.exp(x*0.7)-1}},{f:function(x){return Math.log(x+1)/0.7},a:-0.95,c:'cv2'}]),
    B18:tx('log₂ 8 = 3  ⇔  2³ = 8',18),
    B19:graf(-2,4,-2,4,[{f:function(x){return Math.exp(x)}},{f:function(x){return Math.log(x)},a:0.02,c:'cv2'},{f:function(x){return x},c:'dash'}]),
    B20:'<path d="M30 66H130V18Z" class="cx"/><path d="M118 66v-12h12" class="tr"/><path d="M52 66A22 22 0 0 0 50 57" class="cv"/><text x="58" y="62" class="rt">θ</text>',
    B21:'<circle cx="80" cy="40" r="30" class="cx"/><path d="M42 40h76M80 6v68" class="ex"/><path d="M80 40L103 21" class="cv"/><path d="M92 40A12 12 0 0 0 89 32" class="tr"/><circle cx="103" cy="21" r="3.2" class="pt"/><path d="M103 21V40" class="dash"/>',
    B22:graf(-0.3,7,-1.5,1.5,[{f:sen},{f:Math.cos,c:'cv2'}]),
    B23:tx('sen²x + cos²x = 1',19),
    B24:graf(-0.3,7,-1.5,1.5,[{f:sen}],{lin:[[-0.3,0.5,7,0.5,'dash']],pts:[[Math.PI/6,0.5],[5*Math.PI/6,0.5]]}),
    B25:'<path d="M24 66L104 66L70 14Z" class="cx"/><text x="64" y="76" class="rt">c</text><text x="92" y="38" class="rt">a</text><text x="38" y="38" class="rt">b</text>',
    B26:'<rect x="20" y="22" width="44" height="40" class="cx"/><circle cx="104" cy="42" r="22" class="cx"/><path d="M104 42h22" class="tr"/><text x="110" y="38" class="rt">r</text>',
    B27:'<path d="M28 30l16-12h40l-16 12zM28 30v34h40V30M68 64l16-12V18" class="cx"/><ellipse cx="122" cy="22" rx="18" ry="6" class="cx"/><path d="M104 22v40a18 6 0 0 0 36 0V22" class="cx"/>',
    B28:graf(-1,5,-0.2,2.5,[{f:function(x){return 1.15+Math.sqrt(Math.max(0,1-(x-2)*(x-2)))},a:1,b:3},{f:function(x){return 1.15-Math.sqrt(Math.max(0,1-(x-2)*(x-2)))},a:1,b:3},{f:function(x){return 0.45*x+0.2},c:'cv2'}],{pts:[[2,1.15]]}),
    C01:'<path d="M14 46H146" class="ex"/><path d="M30 41v10M60 41v10M90 41v10M120 41v10" class="tr"/><text x="30" y="68" class="rt" text-anchor="middle">0</text><text x="60" y="68" class="rt" text-anchor="middle">1</text><text x="90" y="68" class="rt" text-anchor="middle">2</text><circle cx="72.4" cy="46" r="4" class="pt"/><text x="72" y="30" class="rt" text-anchor="middle">√2</text>',
    C06:graf(-2.5,2.5,-0.3,4,[{f:function(x){return Math.cosh(x)}},{f:function(x){return Math.exp(x)/2},c:'dash'},{f:function(x){return Math.exp(-x)/2},c:'dash'}]),
    C07:graf(-0.3,7,-2,2,[{f:sen,c:'fino'},{f:function(x){return Math.cos(x)},c:'fino'},{f:function(x){return Math.sin(x)+Math.cos(x)}}]),
    C08:graf(-0.5,4,-0.5,4,[{f:function(x){return 0.25*x*x+0.5}}],{faixa:[[1.9,2.6]],lin:[[2.65,-0.5,2.65,4,'dash'],[3.15,-0.5,3.15,4,'dash']],pts:[[2.9,0.25*8.41+0.5]]}),
    C11:graf(-9,9,-0.5,1.3,[{f:function(x){return x?Math.sin(x)/x:1}}],{pts:[[0,1,'ab']]}),
    C12:graf(-0.5,4,-2,2.5,[{f:function(x){return 0.4*x*x*x-1.2*x*x+0.5*x+0.6*x-1.5}}],{lin:[[-0.5,0.6,4,0.6,'dash']],pts:[[3.25,0.4*34.33-1.2*10.56+1.1*3.25-1.5]]}),
    C14:'<rect x="34" y="16" width="70" height="40" class="cx"/><rect x="104" y="16" width="20" height="40" class="ar"/><rect x="34" y="56" width="70" height="12" class="ar"/><text x="66" y="42" class="rt" text-anchor="middle">f·g</text><text x="114" y="12" class="rt" text-anchor="middle">Δf</text><text x="22" y="66" class="rt">Δg</text>',
    C15:graf(-2,2.5,-0.5,5,[{f:Math.exp},{f:function(x){return Math.exp(1)*(x-1)+Math.exp(1)},c:'cv2'}],{pts:[[1,Math.exp(1)]]}),
    C16:tx('(f ∘ g)′ = f′(g)·g′',16),
    C17:graf(-0.5,4,-0.5,4,[{f:function(x){return x},c:'dash'},{f:function(x){return 0.25*x*x},a:0},{f:function(x){return 2*Math.sqrt(x)},a:0,c:'cv2'}],{pts:[[2,1],[1,2]]}),
    C18:graf(-0.5,3,-1.5,3,[{f:function(x){return x*x-2}},{f:function(x){return 5*(x-2.5)+4.25},c:'cv2'}],{pts:[[2.5,4.25*0+4.25],[1.65,0],[Math.SQRT2,0,'ab']]}),
    C19:tx('0/0  →  f′/g′',24),
    C20:graf(-0.5,4,-0.5,3.5,[{f:function(x){return 0.5+Math.sqrt(x)*1.2}},{f:function(x){return 0.5+1.2*Math.sqrt(1.6)+(x-1.6)*0.47},c:'cv2'}],{lin:[[0.2,0.5+1.2*Math.sqrt(0.2),3.6,0.5+1.2*Math.sqrt(3.6),'dash']],pts:[[0.2,0.5+1.2*Math.sqrt(0.2)],[3.6,0.5+1.2*Math.sqrt(3.6)]]}),
    C21:graf(-2,2,-0.5,4,[{f:function(x){return x*x}},{f:function(x){return 2*(x-0.8)+0.64},c:'cv2'}],{pts:[[0.8,0.64]]}),
    C22:graf(-0.5,4,-0.5,3,[{f:function(x){return 2.4-0.6*(x-1.8)*(x-1.8)}}],{pts:[[1.8,2.4]],lin:[[0.8,2.4,2.8,2.4,'tr2']]}),
    C25:graf(-0.5,4,-0.5,3,[{f:function(x){return 0.8+0.6*Math.sin(x*1.3)+0.25*x}}],{area:[0.7,3.2]}),
    C26:tx('∫u dv = uv − ∫v du',15),
    C27:graf(-0.3,6.6,-1.3,1.3,[{f:function(x){return Math.sin(x)*Math.sin(2*x)},c:'cv'},{f:sen,c:'fino'},{f:function(x){return Math.sin(2*x)},c:'fino'}],{area:[0,2*Math.PI,function(x){return Math.sin(x)*Math.sin(2*x)}]}),
    C29:'<text x="80" y="34" text-anchor="middle" class="fm" style="font-size:15px">1/(x² − 1) =</text><text x="80" y="58" text-anchor="middle" class="fm" style="font-size:15px">A/(x − 1) + B/(x + 1)</text>',
    C31:'<path d="M20 40h120" class="ex"/><path d="M28 40C50 10 90 10 132 22" class="cv"/><path d="M28 40C50 70 90 70 132 58" class="dash"/><ellipse cx="80" cy="40" rx="6" ry="22" class="cx"/><ellipse cx="132" cy="40" rx="6" ry="18" class="cx"/>',
    C32:graf(-0.3,4.2,-0.3,3,[{f:function(x){return 0.4+0.5*x+0.6*Math.sin(x*1.6)}}],{lin:[[0,0.4,1,0.4+0.5+0.6*Math.sin(1.6),'tr2'],[1,0.4+0.5+0.6*Math.sin(1.6),2,0.4+1+0.6*Math.sin(3.2),'tr2'],[2,0.4+1+0.6*Math.sin(3.2),3,0.4+1.5+0.6*Math.sin(4.8),'tr2'],[3,0.4+1.5+0.6*Math.sin(4.8),4,0.4+2+0.6*Math.sin(6.4),'tr2']]}),
    'D-CALC1':graf(-0.5,4.5,-0.4,3,[{f:function(x){return 0.6+0.9*Math.sin(x*0.9)+0.35*x}},{f:function(x){return 0.6+0.9*Math.sin(2.7)+1.05+(0.81*Math.cos(2.7)+0.35)*(x-3)},a:1.9,b:4.2,c:'cv2'}],{area:[0.4,2.2],pts:[[3,0.6+0.9*Math.sin(2.7)+1.05]]}),
    'D-ED':(function(){var l=[];for(var i=0;i<6;i++)for(var j=0;j<4;j++){var x=0.4+i*0.75,y=0.3+j*0.75,m=-0.8*(y-1.4),h=0.22/Math.sqrt(1+m*m);l.push([x-h,y-m*h,x+h,y+m*h,'tr'])}
      return graf(0,4.6,0,2.8,[{f:function(x){return 1.4+1.2*Math.exp(-0.8*x)}},{f:function(x){return 1.4-1.1*Math.exp(-0.8*x)},c:'cv2'}],{lin:l})})(),
    'D-CALC2':graf(-3.4,3.4,-1.6,1.6,[{f:Math.sin},{f:function(x){return x-x*x*x/6},c:'cv2'},{f:function(x){return x},c:'dash'}]),
    // Estatística (página das disciplinas): histograma com a curva normal por cima.
    'D-EST':(function(){var g=function(x){return 0.4*Math.exp(-x*x/2)},s='',X=function(x){return 8+(x+3.2)/6.4*144},Y=function(y){return 72-y/0.45*64};
      for(var k=-3;k<3;k+=0.8){var c=k+0.4,h=g(c)*0.97;s+='<rect x="'+X(k).toFixed(1)+'" y="'+Y(h).toFixed(1)+'" width="'+(X(k+0.8)-X(k)-2).toFixed(1)+'" height="'+(Y(0)-Y(h)).toFixed(1)+'" class="cx"/>'}
      return s+graf(-3.2,3.2,0,0.45,[{f:g,c:'cv2'}])})(),
    C33:graf(-0.3,6,-0.2,1.4,[{f:function(x){return 1/(x*x)},a:0.85}],{area:[1,6,function(x){return 1/(x*x)}],tx:[[4.6,0.6,'→ ∞']]})
  };
  // As figuras das partes dos módulos (tema/figuras-partes.js, 12/11/2026) entram no mesmo F, com as mesmas ferramentas.
  window.FIG_AUX={graf:graf,tx:tx,esc:esc,F:F};
  window.figura=function(cod){var c=F[cod];if(!c)return '';return '<svg viewBox="0 0 160 80" class="fig" aria-hidden="true"><defs><clipPath id="fig-caixa"><rect width="160" height="80"/></clipPath></defs>'+c+'</svg>'};
})();
