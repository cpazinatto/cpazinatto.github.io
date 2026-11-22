// Figuras da ED (16/11/2026): as capas dos cartões da Revisão da base (B00 a B20) e das Demonstrações e desafios, e,
// quando houver, as das partes dos módulos (chave módulo.grupo, como B05.r1). Entram no mesmo F de tema/figuras.js, que
// traz as capas do Cálculo com os mesmos códigos: as daqui as substituem nas páginas da ED. Caixa 160 x 80, currentColor.
(function(A){if(!A)return;var graf=A.graf,tx=A.tx,F=A.F;
// Ponta de seta em (x, y), apontando na direção (dx, dy), em coordenadas da caixa.
function seta(x,y,dx,dy,cls){var n=Math.sqrt(dx*dx+dy*dy),ux=dx/n,uy=dy/n,a=6,b=3.4;
  return '<path d="M'+x+' '+y+'L'+(x-a*ux+b*uy).toFixed(1)+' '+(y-a*uy-b*ux).toFixed(1)+'L'+(x-a*ux-b*uy).toFixed(1)+' '+(y-a*uy+b*ux).toFixed(1)+'Z" class="'+(cls||'pt')+'"/>'}
function campo(x0,x1,y0,y1,nx,ny,m){var l=[];for(var i=0;i<nx;i++)for(var j=0;j<ny;j++){var x=x0+(i+.5)*(x1-x0)/nx,y=y0+(j+.5)*(y1-y0)/ny,s=m(x,y),h=.32*(x1-x0)/nx/Math.sqrt(1+s*s);l.push([x-h,y-s*h,x+h,y+s*h,'fino'])}return l}
function bessel0(x){var s=0,t=1;for(var k=0;k<30;k++){if(k>0)t*=-(x*x/4)/(k*k);s+=t}return s}
// Y₀, a segunda solução de Bessel de ordem 0, com o logaritmo (o terceiro caso de Frobenius): série com os harmônicos H_k.
function bessel0y(x){var s=0,t=1,H=0;for(var k=1;k<40;k++){t*=(x*x/4)/(k*k);H+=1/k;s+=(k%2?1:-1)*H*t}return 2/Math.PI*((Math.log(x/2)+0.5772156649)*bessel0(x)+s)}
// Ai(x), a função de Airy: a série de y'' = x y, aₙ = aₙ₋₃ / (n(n − 1)), com a₀ = Ai(0) e a₁ = Ai′(0).
function airy(x){var a=[0.355028053887817,-0.258819403792807,0],s=a[0]+a[1]*x,p=x;for(var n=2;n<180;n++){if(n>2)a[n]=a[n-3]/(n*(n-1));p*=x;s+=a[n]*p}return s}
// Coordenadas da caixa (160 x 80, margem 8) para a janela [x0, x1] x [y0, y1], como em graf(): para pôr setas nos gráficos.
function caixa(x0,x1,y0,y1){return {X:function(x){return 8+(x-x0)/(x1-x0)*144},Y:function(y){return 72-(y-y0)/(y1-y0)*64}}}
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
  // Hiperbólicas: cosh (a catenária) e senh, saindo da exponencial.
  B06:graf(-2.4,2.4,-2.6,3.4,[{f:Math.cosh},{f:Math.sinh,c:'cv2'},{f:function(x){return Math.exp(x)/2},c:'fino',a:-2.4,b:1.6}],{pts:[[0,1]]}),
  // Limites no infinito: t² e^(−t) sobe e depois cai para zero; a exponencial vence.
  B07:graf(-0.3,9,-0.1,0.75,[{f:function(x){return x*x*Math.exp(-x)},a:0,b:9}],{lin:[[0,0,9,0,'dash']],pts:[[2,4*Math.exp(-2)]]}),
  // Paridade: a área do seno em [−π, π] se cancela.
  B08:graf(-3.6,3.6,-1.4,1.4,[{f:Math.sin,a:-Math.PI,b:Math.PI},{f:Math.cos,a:-3.4,b:3.4,c:'dash'}],{area:[-Math.PI,Math.PI,Math.sin],lin:[[-Math.PI,-0.1,-Math.PI,0.1,'tr'],[Math.PI,-0.1,Math.PI,0.1,'tr']]}),
  // Funções periódicas: a onda dente de serra, o mesmo pedaço a cada período.
  B09:graf(-3.2,3.2,-1.4,1.4,[{f:function(x){return x/Math.PI},a:-Math.PI,b:Math.PI*0.99},{f:function(x){return (x-2*Math.PI)/Math.PI},a:Math.PI*1.01,b:3.2,c:'fino'},{f:function(x){return (x+2*Math.PI)/Math.PI},a:-3.2,b:-Math.PI*1.01,c:'fino'}],{lin:[[-Math.PI,-1.3,-Math.PI,1.3,'dash'],[Math.PI,-1.3,Math.PI,1.3,'dash']]}),
  // Derivadas parciais: curvas de nível de f(x, y) e o corte y = y₀, onde só x varia.
  B10:'<ellipse cx="74" cy="40" rx="54" ry="28" class="fino"/><ellipse cx="74" cy="40" rx="36" ry="18" class="fino"/><ellipse cx="74" cy="40" rx="18" ry="9" class="cv"/><circle cx="74" cy="40" r="2.6" class="pt"/><path d="M14 52H134" class="tr2"/><circle cx="104" cy="52" r="3.2" class="pt"/><text x="138" y="56" class="rt" style="font-size:11px">y₀</text>',
  // Cadeia em duas variáveis e polares (B11, 22/11/2026): a árvore u → x, y → r, θ e, ao lado, a grade polar com um ponto.
  B11:'<path d="M40 17L25 37M25 47L17 62M25 47L33 62" class="cv"/><path d="M40 17L55 37M55 47L47 62M55 47L63 62" class="cv2"/>'
    +'<text x="40" y="14" class="rt" text-anchor="middle">u</text><text x="25" y="46" class="rt" text-anchor="middle">x</text><text x="55" y="46" class="rt" text-anchor="middle">y</text>'
    +'<text x="17" y="73" class="rt" text-anchor="middle">r</text><text x="33" y="73" class="rt" text-anchor="middle">θ</text><text x="47" y="73" class="rt" text-anchor="middle">r</text><text x="63" y="73" class="rt" text-anchor="middle">θ</text>'
    +'<path d="M88 66H152M120 66V10" class="tr"/><path d="M106 66A14 14 0 0 1 134 66M92 66A28 28 0 0 1 148 66M80 66A40 40 0 0 1 160 66" class="fino"/>'
    +'<path d="M120 66L143.4 36.2" class="cv"/><path d="M132 66A12 12 0 0 0 127.4 56.6" class="tr2"/><circle cx="143.4" cy="36.2" r="3.2" class="pt"/>',
  // Integral dupla (B12, 22/11/2026): o retângulo com uma fatia pintada e o retângulo polar, de área r dr dθ.
  B12:'<rect x="12" y="20" width="52" height="42" class="cx"/><rect x="32" y="20" width="10" height="42" class="ar"/><path d="M32 20V62M42 20V62" class="cv"/>'
    +'<path d="M92 70H156M92 70V8" class="tr"/><path d="M112 70A20 20 0 0 0 92 50M132 70A40 40 0 0 0 92 30M150 70A58 58 0 0 0 92 12" class="fino"/>'
    +'<path d="M92 70L144.6 45.5M92 70L125.3 22.5" class="fino"/>'
    +'<path d="M113.8 59.9L131.9 51.4A44 44 0 0 0 117.2 34.0L105.8 50.3A24 24 0 0 1 113.8 59.9Z" class="ar"/><path d="M113.8 59.9L131.9 51.4A44 44 0 0 0 117.2 34.0L105.8 50.3A24 24 0 0 1 113.8 59.9Z" class="cv"/>',
  // Números complexos: z = a + bi no plano e o conjugado, refletido no eixo real.
  B13:'<path d="M24 40H136M60 8V72" class="ex"/><path d="M60 40L104 18" class="cv"/><path d="M60 40L104 62" class="cv2"/><path d="M104 18V62" class="dash"/><circle cx="104" cy="18" r="3.4" class="pt"/><circle cx="104" cy="62" r="3.4" class="pt"/><text x="110" y="20" class="rt">z</text><text x="110" y="66" class="rt">z̄</text>',
  // Euler: e^(iθ) no círculo de raio 1, com as sombras cos θ e sen θ.
  B14:'<path d="M30 40H130M80 8V72" class="ex"/><circle cx="80" cy="40" r="28" class="fino"/><path d="M80 40L101.4 22" class="cv"/><path d="M101.4 22V40M80 22H101.4" class="dash"/><path d="M92 40A12 12 0 0 0 89.2 32.3" class="tr2"/><circle cx="101.4" cy="22" r="3.4" class="pt"/><text x="106" y="18" class="rt">e<tspan baseline-shift="super" font-size="9">iθ</tspan></text>',
  // Sistema 2 × 2: duas retas e o ponto de encontro, a solução.
  B15:graf(-1,4.4,-1,4,[{f:function(x){return 0.8*x+0.6}},{f:function(x){return 3.4-0.6*x},c:'cv2'}],{pts:[[2,2.2]],lin:[[2,-1,2,2.2,'dash'],[-1,2.2,2,2.2,'dash']]}),
  // Matrizes: o quadrado unitário e a imagem dele pela matriz, um paralelogramo.
  B16:'<path d="M30 66H130M40 74V8" class="ex"/><path d="M40 66H72V34H40Z" class="tr"/><path d="M40 66L104 50L124 18L60 34Z" class="ar"/><path d="M40 66L104 50L124 18L60 34Z" class="cv"/><circle cx="104" cy="50" r="3" class="pt"/><circle cx="60" cy="34" r="3" class="pt"/>',
  // Autovalores: v e Av na mesma reta (a do autovetor), e um vetor fora dela, que gira.
  B17:'<path d="M18 70L142 12" class="dash"/><path d="M18 22L142 62" class="dash" style="opacity:.6"/><path d="M80 41L102 30.8" class="cv"/>'+seta(102,30.8,22,-10.2)+'<path d="M80 41L132 16.8" class="tr2"/>'+seta(132,16.8,52,-24.2,'pt')+'<path d="M80 41L84 18" class="fino"/>'+seta(84,18,4,-23,'pt')+'<text x="100" y="44" class="rt">v</text><text x="122" y="32" class="rt">λv</text>',
  // Diagonalização: na base dos autovetores, a matriz só estica cada eixo.
  B18:'<path d="M20 70L140 10" class="dash"/><path d="M28 18L132 62" class="dash"/><path d="M80 40L100 30" class="tr2"/>'+seta(100,30,20,-10)+'<path d="M80 40L124 18" class="cv"/>'+seta(124,18,44,-22)+'<path d="M80 40L98 47.6" class="tr2"/>'+seta(98,47.6,18,7.6)+'<path d="M80 40L107 51.4" class="cv2"/>'+seta(107,51.4,27,11.4),
  // Sequências: os pontos a_n se juntando no limite.
  B19:graf(0,10,-0.1,1.25,[],{lin:[[0,1,10,1,'dash']],pts:[1,2,3,4,5,6,7,8,9].map(function(n){return [n,n/(n+1)]})}),
  // Série geométrica: as somas parciais subindo até o limite.
  B20:graf(0,8.6,-0.1,1.25,[],{lin:[[0,1,8.6,1,'dash']].concat([1,2,3,4,5,6,7,8].map(function(n){return [n,0,n,1-Math.pow(0.5,n),'grosso']})),pts:[1,2,3,4,5,6,7,8].map(function(n){return [n,1-Math.pow(0.5,n)]})}),
  // Demonstrações e desafios
  // Existência e unicidade: o campo de direções e a única solução por um ponto.
  C02:graf(0,4.6,-0.2,2.8,[{f:function(x){return 0.25*Math.exp(0.5*x)}}],{lin:campo(0,4.6,-0.2,2.8,7,4,function(x,y){return 0.5*y}),pts:[[1.4,0.25*Math.exp(0.7)]]}),
  // Exatas, fatores e trocas: cada troca leva a um tipo que já sabemos resolver (o fio condutor do C06, 22/11/2026).
  C06:'<text x="22" y="22" class="fm" style="font-size:12px">× μ</text><text x="117" y="22" class="rt" style="font-size:11px">exata</text>'+'<text x="22" y="46" class="fm" style="font-size:12px">y = v x</text><text x="117" y="46" class="rt" style="font-size:11px">separável</text>'+'<text x="22" y="70" class="fm" style="font-size:12px">w = y¹⁻ⁿ</text><text x="117" y="70" class="rt" style="font-size:11px">linear</text>'+'<path d="M94 18H108M94 42H108M94 66H108" class="tr2"/>'+seta(113,18,1,0)+seta(113,42,1,0)+seta(113,66,1,0),
  // Wronskiano: duas soluções e o determinante delas.
  C09:graf(-0.2,6.6,-1.4,1.4,[{f:function(x){return Math.exp(-0.25*x)*Math.cos(2*x)}},{f:function(x){return Math.exp(-0.25*x)*Math.sin(2*x)},c:'cv2'}]),
  // Legendre: P₂, P₃ e P₄ em [−1, 1].
  // Bessel: J₀, a oscilação que decai.
  C23:graf(-0.3,15,-0.6,1.1,[{f:bessel0,a:0,b:14.8}],{pts:[[2.405,0],[5.520,0],[8.654,0],[11.79,0]]}),
  // Fourier: a onda quadrada e uma soma parcial, com o pico de Gibbs.
  C24:graf(-3.4,3.4,-1.5,1.5,[{f:function(x){return x<0?-1:1},c:'dash'},{f:function(x){var s=0;for(var k=1;k<=15;k+=2)s+=Math.sin(k*x)/k;return 4/Math.PI*s}}]),
  // Expansão em autofunções: duas autofunções de Robin, sem fórmula para μ, e ortogonais (C27, quadro 13).
  C27:graf(-0.05,1.05,-1.2,1.2,[{f:function(x){return Math.sin(2.0288*x)},a:0,b:1},{f:function(x){return Math.sin(4.9132*x)},a:0,b:1,c:'cv2'},{f:function(x){return Math.sin(2.0288*x)*Math.sin(4.9132*x)},a:0,b:1,c:'fino'}]),
  // Calor numa placa: as curvas de mesma temperatura.
  C28:'<rect x="30" y="10" width="100" height="60" class="cx"/><path d="M30 10H130" class="cv2"/><path d="M34 22C60 14 100 14 126 22M38 36C62 26 98 26 122 36M44 52C66 40 94 40 116 52" class="fino"/><text x="80" y="7" class="rt" text-anchor="middle" style="font-size:10px">quente</text>',
  // "Para estudar sozinho" (etapa 5 do aprofundamento, 22/11/2026): uma capa por cartão, chave TNN.sN na seção e TNN no tópico
  // inteiro (T08, T14, T19, T29). T01.s2, T07.s3, T26.s2, T26.s4 e T29 vêm do mock (../mock-layout/aprofundamento/mock-figuras.js).
  // T01, Seção 2 (Da situação à equação): o café esfriando até a sala, com a reta da taxa num instante.
  'T01.s2':graf(-0.2,5,-0.2,3.2,[{f:function(x){return 0.8+2.2*Math.exp(-0.7*x)},a:0},{f:function(x){var y=0.8+2.2*Math.exp(-0.7);return y-0.7*2.2*Math.exp(-0.7)*(x-1)},a:0.2,b:2.1,c:'cv2'}],{lin:[[0,0.8,5,0.8,'dash']],pts:[[1,0.8+2.2*Math.exp(-0.7)]]}),
  // T02, Seção 2 (Existe? É única?): y' = √y, com y = 0 e y = x²/4 saindo do mesmo ponto, e outra que espera e depois sobe.
  'T02.s2':graf(-0.6,4.2,-0.4,3.2,[{f:function(){return 0},c:'cv2'},{f:function(x){return x*x/4},a:0,b:3.7},{f:function(x){return (x-1.6)*(x-1.6)/4},a:1.6,b:4.2,c:'fino'}],{pts:[[0,0]]}),
  // T03, Seção 2 (Na autônoma basta uma reta): a linha de fase da logística ao lado das curvas; y = 1 atrai, y = 0 repele.
  'T03.s2':(function(){var w=caixa(-1.8,5,-0.55,1.5),lg=function(y0){return function(t){return 1/(1+(1/y0-1)*Math.exp(-1.3*t))}},xf=w.X(-1.1);
    return graf(-1.8,5,-0.55,1.5,[{f:function(){return 1},a:0,c:'cv2'},{f:lg(0.08),a:0},{f:lg(0.4),a:0},{f:lg(1.42),a:0}],{lin:[[-1.1,-0.5,-1.1,1.45,'tr']],pts:[[-1.1,1],[-1.1,0,'ab']]})
      +seta(xf,w.Y(0.62),0,-1)+seta(xf,w.Y(1.3),0,1)+seta(xf,w.Y(-0.32),0,1)})(),
  // T04, Seção 2 (Separar com dois fatores): y' = y(2 − y); as soluções y = 0 e y = 2, que a divisão perde, e as curvas entre elas.
  'T04.s2':(function(){var lg=function(y0){return function(t){return 2/(1+(2/y0-1)*Math.exp(-2.4*t))}};
    return graf(-0.2,4.6,-0.7,2.8,[{f:function(){return 2},c:'cv2'},{f:function(){return 0},c:'cv2'},{f:lg(0.12),a:0},{f:lg(0.6),a:0,c:'fino'},{f:lg(2.7),a:0},{f:lg(-0.12),a:0,c:'fino'}])})(),
  // T06, Seção 2 (homogêneas): a inclinação só depende de y/x, então é a mesma ao longo de cada reta pela origem.
  'T06.s2':(function(){var l=[];[0.3,0.9,2].forEach(function(v){var c=1/Math.sqrt(1+v*v),m=v+0.6,h=0.24/Math.sqrt(1+m*m);l.push([0,0,5*c,5*v*c,'dash']);
    [0.9,1.9,2.9].forEach(function(d){var x=d*c,y=d*v*c;l.push([x-h,y-m*h,x+h,y+m*h,'cv'])})});return graf(-0.2,4.4,-0.2,3.2,[],{lin:l})})(),
  // T07, Seção 2 (Aplicações: o tanque que esvazia): o tanque com o furo e a altura caindo até zero, h = (1 − t)².
  'T07.s2':(function(){var d='';for(var k=0;k<=40;k++){var t=k/40;d+=(k?'L':'M')+(100+42*t).toFixed(1)+' '+(70-56*(1-t)*(1-t)).toFixed(1)}
    return '<path d="M18 12V66H58V12" class="tr"/><rect x="18" y="32" width="40" height="34" class="ar"/><path d="M18 32H58" class="cv"/>'
      +'<path d="M58 60H68" class="tr"/><circle cx="71" cy="66" r="2" class="pt"/><circle cx="73" cy="73" r="1.6" class="pt"/>'
      +'<path d="M100 8V70H152" class="ex" fill="none"/><path d="'+d+'H150" class="cv"/><circle cx="142" cy="70" r="3" class="pt"/>'})(),
  // T07, Seção 3 (Revisão da Unidade I): o campo de direções e três soluções.
  'T07.s3':graf(0,4.6,-0.2,2.8,[{f:function(x){return 1.3+1.2*Math.exp(-0.8*x)}},{f:function(x){return 1.3-1.1*Math.exp(-0.8*x)},c:'cv2'},{f:function(x){return 1.3+0.5*Math.exp(-0.8*x)},c:'fino'}],{lin:campo(0,4.6,-0.2,2.8,7,4,function(x,y){return -0.8*(y-1.3)})}),
  // T08 (Redutíveis e não lineares; o PVC): de um ponto, três inclinações de saída; só uma acerta o ponto do outro lado.
  'T08':graf(-0.3,4.5,-0.2,2.4,[{f:function(x){return 0.3+0.6*x-0.25*x*x},a:0,c:'fino'},{f:function(x){return 0.3+1.4*x-0.25*x*x},a:0,c:'fino'},{f:function(x){return 0.3+x-0.25*x*x},a:0,b:4}],{pts:[[0,0.3],[4,0.3]]}),
  // T14 (Aplicações de 2ª ordem): o número que decide; oscila e morre, crítico e superamortecido, da mesma partida.
  'T14':graf(-0.2,6,-0.75,1.15,[{f:function(t){return Math.exp(-0.35*t)*Math.cos(2.4*t)},a:0},{f:function(t){return (1+1.4*t)*Math.exp(-1.4*t)},a:0,c:'cv2'},{f:function(t){return 1.2*Math.exp(-0.6*t)-0.2*Math.exp(-3.6*t)},a:0,c:'fino'}]),
  // T18, Seção 2 (A matriz exponencial): eᴬᵗ pela série.
  'T18.s2':'<text x="80" y="36" text-anchor="middle" class="fm" style="font-size:26px">e<tspan baseline-shift="super" font-size="15">At</tspan></text><text x="80" y="64" text-anchor="middle" class="fm" style="font-size:14px">= I + At + ½A²t² + ⋯</text>',
  // T19 (Aplicações de sistemas: achatar a curva): o pico dos infectados alto e o achatado, abaixo da linha da capacidade.
  'T19':graf(-0.2,6,-0.08,1.2,[{f:function(t){return 1.05*Math.exp(-(t-1.8)*(t-1.8)/0.35)},a:0,c:'cv2'},{f:function(t){return 0.45*Math.exp(-(t-3)*(t-3)/1.6)},a:0}],{lin:[[0,0.6,6,0.6,'dash']]}),
  // T21, Seção 2 (até onde vale): 1/(1 + x²) e o polinômio de Taylor de grau 8, que só a acompanha entre −1 e 1.
  'T21.s2':graf(-2.2,2.2,-0.25,1.45,[{f:function(x){return 1/(1+x*x)}},{f:function(x){var u=x*x;return 1-u+u*u-u*u*u+u*u*u*u},a:-1.3,b:1.3,c:'cv2'}],{lin:[[-1,-0.25,-1,1.45,'dash'],[1,-0.25,1,1.45,'dash']]}),
  // T22, Seção 2 (Airy): Ai(x), que oscila à esquerda e morre à direita.
  'T22.s2':graf(-9,2.6,-0.5,0.65,[{f:airy}]),
  // T23, Seção 2 (Os três casos: Bessel): J₀ e a segunda solução Y₀, com o logaritmo, que desce para −∞ no zero.
  'T23.s2':graf(-0.3,13,-1.1,1.1,[{f:bessel0,a:0,b:13},{f:bessel0y,a:0.06,b:13,c:'cv2'}]),
  // T26, Seção 2 (Pontas isoladas): o perfil de cosseno achatando até a média, com as pontas sem inclinação.
  'T26.s2':graf(-0.2,3.35,-0.1,1.25,[{f:function(x){return 0.55+0.45*Math.cos(x)},a:0,b:Math.PI},{f:function(x){return 0.55+0.2*Math.cos(x)},a:0,b:Math.PI,c:'cv2'},{f:function(x){return 0.55},a:0,b:Math.PI,c:'dash'}],{lin:[[0,-0.05,0,1.15,'grosso'],[Math.PI,-0.05,Math.PI,1.15,'grosso']]}),
  // T26, Seção 4 (as duas metades): o pulso de partida (tracejado) e as duas metades, uma para cada lado.
  'T26.s4':graf(-4,4,-0.15,1.25,[{f:function(x){return Math.exp(-3*x*x)},c:'dash'},{f:function(x){return 0.5*Math.exp(-3*(x+2.2)*(x+2.2))}},{f:function(x){return 0.5*Math.exp(-3*(x-2.2)*(x-2.2))}}],{tx:[[-2.2,0.85,'←'],[2.2,0.85,'→']]}),
  // T27, Seção 2 (A barra segue a rampa): as pontas em temperaturas diferentes; o perfil cai sobre a reta do regime permanente.
  'T27.s2':(function(){var r=function(x){return 0.2+0.7*x/Math.PI};
    return graf(-0.2,3.35,-0.1,1.3,[{f:function(x){return r(x)+0.55*Math.sin(x)},a:0,b:Math.PI,c:'fino'},{f:function(x){return r(x)+0.22*Math.sin(x)},a:0,b:Math.PI},{f:r,a:0,b:Math.PI,c:'cv2'}],{lin:[[0,-0.05,0,1.2,'grosso'],[Math.PI,-0.05,Math.PI,1.2,'grosso']]})})(),
  // T27, Seção 3 (Onda forçada e ressonância): a amplitude crescendo entre as duas retas, t sen t.
  'T27.s3':graf(-0.3,12.6,-1.25,1.25,[{f:function(t){return 0.085*t*Math.sin(2.2*t)},a:0},{f:function(t){return 0.085*t},a:0,c:'dash'},{f:function(t){return -0.085*t},a:0,c:'dash'}]),
  // T28, Seção 2 (O disco): um modo da membrana circular, com o círculo e o diâmetro que não se mexem e os sinais alternados.
  'T28.s2':'<circle cx="80" cy="40" r="32" class="cx"/><circle cx="80" cy="40" r="14" class="dash"/><path d="M80 6V74" class="dash"/>'
    +'<text x="72" y="45" class="rt" text-anchor="middle">+</text><text x="88" y="45" class="rt" text-anchor="middle">−</text>'
    +'<text x="57" y="45" class="rt" text-anchor="middle">−</text><text x="103" y="45" class="rt" text-anchor="middle">+</text>',
  // T29 (Aplicações de EDPs e qual método?): as três equações e a pergunta.
  'T29':'<text x="58" y="22" text-anchor="middle" class="fm" style="font-size:13px">uₜ = k uₓₓ</text><text x="58" y="44" text-anchor="middle" class="fm" style="font-size:13px">uₜₜ = c² uₓₓ</text><text x="58" y="66" text-anchor="middle" class="fm" style="font-size:13px">Δu = 0</text><path d="M100 12V70" class="fino"/><text x="128" y="56" text-anchor="middle" class="fm" style="font-size:40px">?</text>'
});
/*PARTES*/
})(window.FIG_AUX);
