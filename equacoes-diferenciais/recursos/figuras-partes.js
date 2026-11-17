// Figuras da ED (16/11/2026): as capas dos cartões da Revisão da base (B00 a B11) e das Demonstrações e desafios, e,
// quando houver, as das partes dos módulos (chave módulo.grupo, como B05.r1). Entram no mesmo F de tema/figuras.js, que
// traz as capas do Cálculo com os mesmos códigos: as daqui as substituem nas páginas da ED. Caixa 160 x 80, currentColor.
(function(A){if(!A)return;var graf=A.graf,tx=A.tx,F=A.F;
// Ponta de seta em (x, y), apontando na direção (dx, dy), em coordenadas da caixa.
function seta(x,y,dx,dy,cls){var n=Math.sqrt(dx*dx+dy*dy),ux=dx/n,uy=dy/n,a=6,b=3.4;
  return '<path d="M'+x+' '+y+'L'+(x-a*ux+b*uy).toFixed(1)+' '+(y-a*uy-b*ux).toFixed(1)+'L'+(x-a*ux-b*uy).toFixed(1)+' '+(y-a*uy+b*ux).toFixed(1)+'Z" class="'+(cls||'pt')+'"/>'}
function campo(x0,x1,y0,y1,nx,ny,m){var l=[];for(var i=0;i<nx;i++)for(var j=0;j<ny;j++){var x=x0+(i+.5)*(x1-x0)/nx,y=y0+(j+.5)*(y1-y0)/ny,s=m(x,y),h=.32*(x1-x0)/nx/Math.sqrt(1+s*s);l.push([x-h,y-s*h,x+h,y+s*h,'fino'])}return l}
function bessel0(x){var s=0,t=1;for(var k=0;k<30;k++){if(k>0)t*=-(x*x/4)/(k*k);s+=t}return s}
Object.assign(F,{
  // Revisão da base
  B00:'<rect x="56" y="12" width="48" height="58" rx="5" class="cx"/><path d="M64 28l4 4 8-8M64 44l4 4 8-8M64 60l4 4 8-8" class="cv"/><path d="M82 28h14M82 44h14M82 60h10" class="tr"/>',
  // Derivada: a tangente em y = e^(0,6x), com a inclinação proporcional à altura.
  B01:graf(-0.5,4.2,-0.5,3.6,[{f:function(x){return 0.45*Math.exp(0.6*x)}},{f:function(x){return 0.45*Math.exp(1.5)*(1+0.6*(x-2.5))},a:0.9,b:4.2,c:'cv2'}],{pts:[[2.5,0.45*Math.exp(1.5)]]}),
  // Por partes: o retângulo uv dividido pela curva em ∫u dv e ∫v du.
  B02:'<path d="M40 70V14H124" class="tr"/><path d="M40 70H124V14" class="dash"/><path d="M52 62C70 56 96 40 116 20" class="cv"/><path d="M52 62C70 56 96 40 116 20V70H52Z" class="ar"/><text x="96" y="62" class="rt" text-anchor="middle">∫v du</text><text x="66" y="34" class="rt" text-anchor="middle">∫u dv</text>',
  // Frações parciais: duas hipérboles simples (finas) e a soma delas.
  B03:graf(-4.2,3,-3,3,[{f:function(x){return 1/(3*(x-1))},c:'fino'},{f:function(x){return -1/(3*(x+2))},c:'fino'},{f:function(x){return 1/((x-1)*(x+2))}}],{lin:[[1,-3,1,3,'dash'],[-2,-3,-2,3,'dash']]}),
  // Substituição trigonométrica: o triângulo de hipotenusa a, com x = a sen θ.
  B04:'<path d="M34 66H122V18Z" class="cx"/><path d="M114 66V58H122" class="tr"/><path d="M52 66A18 18 0 0 0 50 58" class="tr2"/><text x="60" y="62" class="rt">θ</text><text x="70" y="36" class="rt" text-anchor="middle">a</text><text x="132" y="46" class="rt">x</text><text x="78" y="78" class="rt" text-anchor="middle" style="font-size:11px">√(a² − x²)</text>',
  // A família y = K e^(−kt): o K passa por zero, e y = 0 também é solução.
  B05:graf(-0.3,4.4,-2.6,2.6,[{f:function(x){return 2.2*Math.exp(-0.7*x)}},{f:function(x){return 1.2*Math.exp(-0.7*x)},c:'fino'},{f:function(x){return 0},c:'cv2'},{f:function(x){return -1.2*Math.exp(-0.7*x)},c:'fino'},{f:function(x){return -2.2*Math.exp(-0.7*x)},c:'fino'}]),
  // Paridade: a área do seno em [−π, π] se cancela.
  B06:graf(-3.6,3.6,-1.4,1.4,[{f:Math.sin,a:-Math.PI,b:Math.PI},{f:Math.cos,a:-3.4,b:3.4,c:'dash'}],{area:[-Math.PI,Math.PI,Math.sin],lin:[[-Math.PI,-0.1,-Math.PI,0.1,'tr'],[Math.PI,-0.1,Math.PI,0.1,'tr']]}),
  // Derivadas parciais: curvas de nível de f(x, y) e o corte y = y₀, onde só x varia.
  B07:'<ellipse cx="74" cy="40" rx="54" ry="28" class="fino"/><ellipse cx="74" cy="40" rx="36" ry="18" class="fino"/><ellipse cx="74" cy="40" rx="18" ry="9" class="cv"/><circle cx="74" cy="40" r="2.6" class="pt"/><path d="M14 52H134" class="tr2"/><circle cx="104" cy="52" r="3.2" class="pt"/><text x="138" y="56" class="rt" style="font-size:11px">y₀</text>',
  // Euler: e^(iθ) no círculo de raio 1, com as sombras cos θ e sen θ.
  B08:'<path d="M30 40H130M80 8V72" class="ex"/><circle cx="80" cy="40" r="28" class="fino"/><path d="M80 40L101.4 22" class="cv"/><path d="M101.4 22V40M80 22H101.4" class="dash"/><path d="M92 40A12 12 0 0 0 89.2 32.3" class="tr2"/><circle cx="101.4" cy="22" r="3.4" class="pt"/><text x="106" y="18" class="rt">e<tspan baseline-shift="super" font-size="9">iθ</tspan></text>',
  // Sistema 2 × 2: duas retas e o ponto de encontro, a solução.
  B09:graf(-1,4.4,-1,4,[{f:function(x){return 0.8*x+0.6}},{f:function(x){return 3.4-0.6*x},c:'cv2'}],{pts:[[2,2.2]],lin:[[2,-1,2,2.2,'dash'],[-1,2.2,2,2.2,'dash']]}),
  // Autovalores: v e Av na mesma reta (a do autovetor), e um vetor fora dela, que gira.
  B10:'<path d="M18 70L142 12" class="dash"/><path d="M18 22L142 62" class="dash" style="opacity:.6"/><path d="M80 41L102 30.8" class="cv"/>'+seta(102,30.8,22,-10.2)+'<path d="M80 41L132 16.8" class="tr2"/>'+seta(132,16.8,52,-24.2,'pt')+'<path d="M80 41L84 18" class="fino"/>'+seta(84,18,4,-23,'pt')+'<text x="100" y="44" class="rt">v</text><text x="122" y="32" class="rt">λv</text>',
  // Série geométrica: as somas parciais subindo até o limite.
  B11:graf(0,8.6,-0.1,1.25,[],{lin:[[0,1,8.6,1,'dash']].concat([1,2,3,4,5,6,7,8].map(function(n){return [n,0,n,1-Math.pow(0.5,n),'grosso']})),pts:[1,2,3,4,5,6,7,8].map(function(n){return [n,1-Math.pow(0.5,n)]})}),
  // Demonstrações e desafios
  // Existência e unicidade: o campo de direções e a única solução por um ponto.
  C02:graf(0,4.6,-0.2,2.8,[{f:function(x){return 0.25*Math.exp(0.5*x)}}],{lin:campo(0,4.6,-0.2,2.8,7,4,function(x,y){return 0.5*y}),pts:[[1.4,0.25*Math.exp(0.7)]]}),
  // Bernoulli: a substituição v = y^(1−n) leva a uma linear.
  C06:'<text x="80" y="32" text-anchor="middle" class="fm" style="font-size:15px">y′ + p y = q yⁿ</text><path d="M80 40V52" class="tr2"/>'+seta(80,56,0,1,'pt')+'<text x="80" y="72" text-anchor="middle" class="fm" style="font-size:14px">v = y¹⁻ⁿ: linear</text>',
  // Wronskiano: duas soluções e o determinante delas.
  C09:graf(-0.2,6.6,-1.4,1.4,[{f:function(x){return Math.exp(-0.25*x)*Math.cos(2*x)}},{f:function(x){return Math.exp(-0.25*x)*Math.sin(2*x)},c:'cv2'}]),
  // Legendre: P₂, P₃ e P₄ em [−1, 1].
  C20:graf(-1.15,1.15,-1.15,1.15,[{f:function(x){return (3*x*x-1)/2},a:-1,b:1},{f:function(x){return (5*x*x*x-3*x)/2},a:-1,b:1,c:'cv2'},{f:function(x){return (35*Math.pow(x,4)-30*x*x+3)/8},a:-1,b:1,c:'fino'}]),
  // Bessel: J₀, a oscilação que decai.
  C21:graf(-0.3,15,-0.6,1.1,[{f:bessel0,a:0,b:14.8}],{pts:[[2.405,0],[5.520,0],[8.654,0],[11.79,0]]}),
  // Fourier: a onda quadrada e uma soma parcial, com o pico de Gibbs.
  C23:graf(-3.4,3.4,-1.5,1.5,[{f:function(x){return x<0?-1:1},c:'dash'},{f:function(x){var s=0;for(var k=1;k<=15;k+=2)s+=Math.sin(k*x)/k;return 4/Math.PI*s}}]),
  // Calor numa placa: as curvas de mesma temperatura.
  C25:'<rect x="30" y="10" width="100" height="60" class="cx"/><path d="M30 10H130" class="cv2"/><path d="M34 22C60 14 100 14 126 22M38 36C62 26 98 26 122 36M44 52C66 40 94 40 116 52" class="fino"/><text x="80" y="7" class="rt" text-anchor="middle" style="font-size:10px">quente</text>'
});
/*PARTES*/
})(window.FIG_AUX);
