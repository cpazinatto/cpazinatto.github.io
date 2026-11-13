// Figuras dos cartões das partes dos módulos (Revisão, "Por que vale?", Demonstrações), pedido do professor em 12/11/2026:
// minimalistas e ilustrativas, no estilo dos catálogos (tema/figuras.js, caixa 160 x 80, currentColor). Chave: módulo.grupo,
// como B06.r1 (parte 1 da revisão) e B06.p2 (parte 2 do "Por que vale?"). Parte nova pede um desenho novo aqui.
(function(A){if(!A)return;var graf=A.graf,tx=A.tx,F=A.F;
/*PARTES*/
// Lote A
Object.assign(F,{
  'B01.r1':'<path d="M12 48H148" class="ex"/><path d="M20 43v10M140 43v10" class="tr"/><text x="20" y="68" class="rt" text-anchor="middle">0</text><text x="140" y="68" class="rt" text-anchor="middle">1</text><path d="M80 38Q100 20 120 38" class="tr2"/><circle cx="80" cy="48" r="3.2" class="pt"/><circle cx="120" cy="48" r="3.2" class="pt"/><text x="80" y="68" class="rt" text-anchor="middle">½</text><text x="120" y="68" class="rt" text-anchor="middle">⅚</text>',
  'B01.r2':'<text x="80" y="20" class="rt" text-anchor="middle">12</text><path d="M74 24L62 34M86 24L98 34" class="tr"/><text x="58" y="46" class="rt" text-anchor="middle">2</text><text x="102" y="46" class="rt" text-anchor="middle">6</text><path d="M97 50L88 59M107 50L116 59" class="tr"/><text x="84" y="71" class="rt" text-anchor="middle">2</text><text x="120" y="71" class="rt" text-anchor="middle">3</text><circle cx="58" cy="41.5" r="9" class="fino"/><circle cx="84" cy="66.5" r="9" class="fino"/><circle cx="120" cy="66.5" r="9" class="fino"/>',
  'B01.r3':'<rect x="20" y="16" width="120" height="16" class="cx"/><rect x="20" y="16" width="80" height="16" class="ar"/><path d="M60 16v16M100 16v16" class="fino"/><rect x="20" y="48" width="120" height="16" class="cx"/><rect x="20" y="48" width="80" height="16" class="ar"/><path d="M30 48v16M40 48v16M50 48v16M60 48v16M70 48v16M80 48v16M90 48v16M100 48v16M110 48v16M120 48v16M130 48v16" class="fino"/>',
  'B01.r4':'<rect x="30" y="12" width="100" height="56" class="cx"/><rect x="30" y="12" width="90" height="37.3" class="ar"/><path d="M40 12v56M50 12v56M60 12v56M70 12v56M80 12v56M90 12v56M100 12v56M110 12v56M120 12v56M30 30.7h100M30 49.3h100" class="fino"/>',
  'B02.r1':'<path d="M18 68H142" class="ex"/><rect x="24" y="20" width="16" height="48" class="cx"/><rect x="48" y="44" width="16" height="24" class="cx"/><rect x="72" y="56" width="16" height="12" class="ar"/><rect x="96" y="62" width="16" height="6" class="cx"/><rect x="120" y="65" width="16" height="3" class="cx"/>',
  'B02.r2':graf(-3,4,-2,2.2,[{f:Math.cbrt,c:'cv2'},{f:Math.sqrt,a:0}],{pts:[[0,0]]}),
  'B02.r3':'<rect x="54" y="14" width="52" height="52" class="cx"/><path d="M54 66L106 14" class="cv"/><text x="44" y="44" class="rt" text-anchor="middle">6</text><text x="88" y="58" class="rt" text-anchor="middle">6√2</text>',
  'B02.p1':graf(-3,2.5,-0.5,4.5,[{f:function(x){return Math.pow(2,x)}}],{pts:[[0,1]],lin:[[-3,1,0,1,'dash']]}),
  'B02.p2':graf(-4,4,-1,10.5,[{f:function(x){return x*x}}],{lin:[[-4,9,4,9,'dash']],pts:[[-3,9,'ab'],[3,9]]}),
  'B03.r1':'<rect x="50" y="10" width="38" height="38" class="cx"/><rect x="88" y="10" width="22" height="38" class="ar"/><rect x="50" y="48" width="38" height="22" class="ar"/><rect x="88" y="48" width="22" height="22" class="cx"/><text x="69" y="34" class="rt" text-anchor="middle">a²</text><text x="99" y="64" class="rt" text-anchor="middle">b²</text>',
  'B03.r2':'<path d="M50 10H86V34H110V70H50Z" class="cx"/><rect x="86" y="10" width="24" height="24" class="dash"/><path d="M50 10V70" class="cv"/><path d="M50 70H110" class="cv2"/>',
  'B03.r3':graf(-1,5,-1,8,[{f:function(x){return (x-2)*(x-2)+3}}],{pts:[[2,3]],lin:[[2,0,2,3,'dash'],[0,3,2,3,'dash']]}),
  'B04.r1':'<path d="M80 30L70 68H90Z" class="cx"/><path d="M28 30H132" class="grosso"/><rect x="34" y="14" width="18" height="16" class="cx"/><text x="43" y="26" class="rt" text-anchor="middle">x</text><circle cx="62" cy="25" r="3.2" class="pt"/><circle cx="104" cy="25" r="3.2" class="pt"/><circle cx="114" cy="25" r="3.2" class="pt"/><circle cx="124" cy="25" r="3.2" class="pt"/>',
  'B04.r2':graf(-8,2,-17,6,[{f:function(x){return x*x+6*x-7}}],{pts:[[-7,0],[1,0]]}),
  'B04.r3':graf(-3.5,7.6,-3,4,[{f:function(x){return Math.sqrt(x+3)},a:-3},{f:function(x){return x-3},c:'cv2'}],{lin:[[1,-2,1,2,'dash']],pts:[[6,3],[1,-2,'ab']]}),
  'B04.p1':'<path d="M12 46H148" class="ex"/><path d="M80 22V56" class="dash"/><path d="M80 34H36M80 34H124M36 30v8M124 30v8" class="tr2"/><circle cx="36" cy="46" r="3.2" class="pt"/><circle cx="124" cy="46" r="3.2" class="pt"/><text x="36" y="66" class="rt" text-anchor="middle">x₁</text><text x="124" y="66" class="rt" text-anchor="middle">x₂</text><text x="80" y="17" class="rt" text-anchor="middle">−b/2a</text>',
  'B04.p2':graf(1.5,6.5,-2,3,[{f:function(x){return x-3},c:'fino'},{f:function(x){return x-5},c:'fino'},{f:function(x){return (x-3)*(x-5)}}],{pts:[[3,0],[5,0]]}),
  'B05.r1':'<rect x="36" y="24" width="52" height="40" class="cx"/><rect x="88" y="24" width="40" height="40" class="ar"/><text x="26" y="48" class="rt" text-anchor="middle">a</text><text x="62" y="18" class="rt" text-anchor="middle">b</text><text x="108" y="18" class="rt" text-anchor="middle">c</text><text x="62" y="48" class="rt" text-anchor="middle">ab</text><text x="108" y="48" class="rt" text-anchor="middle">ac</text>',
  'B05.r2':graf(-6,9,-4,6,[{f:function(x){return 1+5/x},a:0.05},{f:function(x){return 1+5/x},b:-0.05}],{pts:[[5,2,'ab']]}),
  'B05.r3':'<path d="M44 40H116" class="grosso"/><rect x="72" y="10" width="16" height="8" class="cx"/><path d="M66 22H94" class="tr"/><rect x="72" y="26" width="16" height="8" class="cx"/><rect x="72" y="46" width="16" height="8" class="cx"/><path d="M66 58H94" class="tr"/><rect x="72" y="62" width="16" height="8" class="cx"/>',
  'B06.r1':graf(-2,4,-8,9,[{f:function(x){return (x+1)*(x-2)*(x-3)}}],{pts:[[-1,0],[2,0],[3,0],[0,6,'ab']]}),
  'B06.r2':'<text x="60" y="34" text-anchor="middle" class="fm" style="font-size:20px">17</text><path d="M84 14V48M84 40H130" class="tr"/><text x="106" y="34" text-anchor="middle" class="fm" style="font-size:20px">5</text><text x="106" y="64" text-anchor="middle" class="fm" style="font-size:20px">3</text><text x="60" y="64" text-anchor="middle" class="fm" style="font-size:20px">2</text>',
  'B06.r3':graf(-2.5,2.8,-1,12,[{f:function(x){return x*x*x-2*x+5}}],{pts:[[2,9]],lin:[[2,0,2,9,'dash']],tx:[[2.15,4,'R']]}),
  'B06.r4':'<path d="M12 44H148" class="ex"/><path d="M80 38v12" class="tr"/><text x="80" y="66" class="rt" text-anchor="middle">0</text><circle cx="28.8" cy="44" r="3.2" class="ab"/><circle cx="54.4" cy="44" r="3.2" class="ab"/><circle cx="67.2" cy="44" r="3.2" class="ab"/><circle cx="92.8" cy="44" r="3.2" class="pt"/><circle cx="105.6" cy="44" r="3.2" class="ab"/><circle cx="131.2" cy="44" r="3.2" class="ab"/><text x="92.8" y="32" class="rt" text-anchor="middle">½</text>',
  'B06.p1':'<path d="M42 12V68M42 42H150" class="tr"/><text x="28" y="31" class="rt" text-anchor="middle">a</text><rect x="120" y="50" width="16" height="16" class="cx"/><path d="M65 55L81 29M87 55L103 29M109 55L125 29" class="tr2"/><circle cx="62" cy="26" r="3.2" class="ab"/><circle cx="84" cy="26" r="3.2" class="ab"/><circle cx="106" cy="26" r="3.2" class="ab"/><circle cx="128" cy="26" r="3.2" class="ab"/><circle cx="62" cy="58" r="3.2" class="pt"/><circle cx="84" cy="58" r="3.2" class="pt"/><circle cx="106" cy="58" r="3.2" class="pt"/><circle cx="128" cy="58" r="3.2" class="pt"/>',
  'B06.p2':graf(-1.5,2.5,-3,4,[{f:function(x){return (x-1)*(x*x+1)}},{f:function(x){return x-1},c:'cv2'}],{pts:[[1,0]]}),
  'B06.p3':tx('p | a₀   q | a₃',20),
  'B07.r1':'<path d="M40 14c-8 0-6 26-14 26 8 0 6 26 14 26" class="cv"/><text x="48" y="33" class="fm" style="font-size:15px">y = 3x − 2</text><text x="48" y="61" class="fm" style="font-size:15px">2x + y = 13</text>',
  'B07.r2':graf(-1,6,-1,6,[{f:function(x){return 5-x}},{f:function(x){return 1.5-x},c:'cv2'}]),
  'B07.r3':'<path d="M38 12c-6 0-5 28-11 28 6 0 5 28 11 28" class="cv"/><circle cx="50" cy="20" r="3.2" class="pt"/><circle cx="74" cy="20" r="3.2" class="pt"/><circle cx="98" cy="20" r="3.2" class="pt"/><circle cx="74" cy="40" r="3.2" class="pt"/><circle cx="98" cy="40" r="3.2" class="pt"/><circle cx="98" cy="60" r="3.2" class="pt"/><circle cx="122" cy="20" r="3.2" class="ab"/><circle cx="122" cy="40" r="3.2" class="ab"/><circle cx="122" cy="60" r="3.2" class="ab"/><path d="M142 62V18M137 24L142 18L147 24" class="tr2"/>',
  'B07.r4':graf(-4,2,-10,14,[{f:function(x){return 3*(x+3)},c:'fino'},{f:function(x){return 2*(x-1)},c:'fino'},{f:function(x){return 5*x+7}}],{pts:[[1,12],[-3,-8]]}),
  'B08.r1':graf(-0.3,4,-0.3,3,[{f:function(x){return 0.65*x},a:0}],{pts:[[1.6,1.04],[3.6,2.34]],lin:[[1.6,0,1.6,1.04,'dash'],[3.6,0,3.6,2.34,'dash']]}),
  'B08.r2':'<path d="M24 68H136" class="ex"/><path d="M24 38H136" class="dash"/><rect x="36" y="38" width="20" height="30" class="cx"/><rect x="70" y="23" width="20" height="45" class="ar"/><rect x="104" y="45.5" width="20" height="22.5" class="cx"/>',
  'B08.r3':tx('4,7 × 10⁻⁴',22),
  'B09.r1':graf(-1,3.2,-1,3.2,[],{pts:[[1,2.6],[2.6,1]],lin:[[1,0,1,2.6,'dash'],[0,2.6,1,2.6,'dash'],[2.6,0,2.6,1,'dash'],[0,1,2.6,1,'dash']]}),
  'B09.r2':graf(-1,3,-2,4,[{f:function(x){return 3-2*x}}],{lin:[[0.5,2,1.5,2,'tr2'],[1.5,2,1.5,0,'tr2']],pts:[[0.5,2],[1.5,0]]}),
  'B09.r3':graf(-1,4,-1,4,[{f:function(x){return 1-(x-1)},c:'fino'},{f:function(x){return 1+0.4*(x-1)},c:'fino'},{f:function(x){return 1+4*(x-1)},c:'fino'},{f:function(x){return 1+1.5*(x-1)}}],{pts:[[1,1]]}),
  'B09.r4':'<path d="M14 58L94 18M66 66L146 26" class="cv"/><path d="M46 22L70 70" class="cv2"/><path d="M56.7 43.4L62.1 40.7L59.4 35.3" class="tr"/>'
});
// Lote B
Object.assign(F,{
  // B10: função, domínio e imagem
  'B10.r1':'<ellipse cx="44" cy="40" rx="18" ry="30" class="cx"/><ellipse cx="116" cy="40" rx="18" ry="30" class="cx"/>'+
    '<circle cx="44" cy="22" r="3.2" class="pt"/><circle cx="44" cy="40" r="3.2" class="pt"/><circle cx="44" cy="58" r="3.2" class="pt"/>'+
    '<circle cx="116" cy="22" r="3.2" class="pt"/><circle cx="116" cy="40" r="3.2" class="pt"/><circle cx="116" cy="58" r="3.2" class="pt"/>'+
    '<path d="M49 23L110 38M49 40L110 40M49 57L110 42M104 34l6 4-7 2M104 44l6-4" class="tr"/>',
  'B10.r2':'<path d="M42 40H118M80 8V72" class="ex"/><circle cx="80" cy="40" r="28" class="cv"/><path d="M92 8V72" class="dash"/>'+
    '<circle cx="92" cy="14.7" r="3.2" class="pt"/><circle cx="92" cy="65.3" r="3.2" class="pt"/>',
  'B10.r3':graf(-3,5,-3,3,[{f:function(x){return 1/(x-1)},a:-3,b:0.93},{f:function(x){return 1/(x-1)},a:1.07,b:5}],{lin:[[1,-3,1,3,'dash']],pts:[[1,0,'ab']]}),
  'B10.r4':graf(-2.2,4,-6,5,[{f:function(x){return 4-x*x},a:-1,b:3}],{lin:[[-1.7,-5,-1.7,4,'grosso'],[-1.7,4,0,4,'dash'],[-1.7,-5,3,-5,'dash']],pts:[[-1,3],[3,-5]]}),
  // B11: substituir em função
  'B11.r1':'<rect x="62" y="22" width="36" height="36" rx="5" class="cx"/><text x="80" y="47" text-anchor="middle" class="fm" style="font-size:20px">f</text>'+
    '<path d="M34 40H56M104 40H126M51 35l5 5-5 5M121 35l5 5-5 5" class="tr"/><text x="18" y="45" class="rt">3</text><text x="130" y="45" class="rt">15</text>',
  'B11.r2':tx('f(2x) ≠ 2f(x)',20),
  'B11.r3':'<rect x="28" y="12" width="104" height="56" rx="6" class="cx"/><rect x="62" y="26" width="58" height="34" rx="5" class="cx"/>'+
    '<text x="38" y="32" class="rt">f</text><text x="68" y="40" class="rt">g</text><text x="94" y="50" text-anchor="middle" class="fm" style="font-size:18px">x</text>',
  'B11.r4':'<path d="M10 46H150" class="ex"/><path d="M42 46H86M92 46H150" class="grosso"/><circle cx="42" cy="46" r="3.2" class="pt"/><circle cx="89" cy="46" r="3.2" class="ab"/>'+
    '<text x="32" y="68" class="rt">−2</text><text x="85" y="68" class="rt">3</text>',
  // B12: ler um gráfico
  'B12.r1':graf(-4.8,3.6,-5.5,5,[{f:function(x){return -(x+4)*(x+1)*(x+1)*(x-3)/12},a:-4.6,b:3.4}],{area:[-4,3],pts:[[-4,0],[-1,0],[3,0]]}),
  'B12.r2':(function(){var P=Math.PI;return graf(-0.4,6.7,-1.5,1.5,[{f:Math.sin,a:0,b:P/2},{f:Math.sin,a:P/2,b:3*P/2,c:'cv2'},{f:Math.sin,a:3*P/2,b:2*P}],{lin:[[P/2,0,P/2,1,'dash'],[3*P/2,0,3*P/2,-1,'dash']]})})(),
  'B12.r3':(function(){var p=[[-5,-2],[-3,2],[-1,0],[2,3],[4,-3],[5,-1]];function f(x){for(var i=0;i<p.length-1;i++)if(x<=p[i+1][0]+1e-9)return p[i][1]+(p[i+1][1]-p[i][1])*(x-p[i][0])/(p[i+1][0]-p[i][0]);return p[p.length-1][1]}
    return graf(-5.5,5.5,-3.6,3.6,[{f:f,a:-5,b:5}],{lin:[[-5.5,3,2,3,'dash'],[-5.5,-3,4,-3,'dash']],pts:[[2,3],[4,-3]]})})(),
  'B12.r4':(function(){function f(x){return x*x*x*x-4*x*x}var a=2.1;return graf(-2.6,2.6,-4.6,3,[{f:f}],{lin:[[-a,f(a),a,f(a),'dash']],pts:[[-a,f(a)],[a,f(a)]]})})(),
  'B12.r5':graf(-3.6,3.6,-2.8,4.8,[{f:function(x){return 4-19*x*x/15+x*x*x*x/15},a:-3,b:3,c:'dash'}],{pts:[[-3,-2],[-2,0],[0,4],[2,0],[3,-2]]}),
  // B13: afim e modular
  'B13.r1':graf(-1,5,-1,4,[{f:function(x){return 0.5*x+1}}],{lin:[[1,1.5,3,1.5,'dash'],[3,1.5,3,2.5,'dash']],pts:[[0,1]]}),
  'B13.r2':graf(-2,24,-60,560,[{f:function(t){return 500-25*t},a:0,b:20}],{pts:[[0,500],[20,0]]}),
  'B13.r3':'<path d="M14 54H146" class="ex"/><path d="M80 49v10" class="tr"/><path d="M31 49Q55 20 79 49M129 49Q105 20 81 49" class="tr"/>'+
    '<circle cx="30" cy="54" r="3.2" class="pt"/><circle cx="130" cy="54" r="3.2" class="pt"/><text x="51" y="24" class="rt">4</text><text x="101" y="24" class="rt">4</text>',
  'B13.r4':graf(-0.5,6.5,-1,7,[{f:function(x){return Math.abs(2*x-6)}}],{lin:[[-0.5,4,6.5,4,'dash']],pts:[[1,4],[5,4],[3,0,'ab']]}),
  'B13.r5':graf(-3,7,-1,5.5,[{f:function(x){return Math.abs(x-2)}}],{lin:[[-3,3,7,3,'dash'],[-1,0,5,0,'grosso']],pts:[[-1,0,'ab'],[5,0,'ab']]}),
  // B14: quadrática
  'B14.r1':graf(-3,5,-11,11,[{f:function(x){return x*x-2*x-8}},{f:function(x){return -x*x+2*x+8},c:'cv2'}],{pts:[[0,-8],[0,8]]}),
  'B14.r2':graf(-3,5,-10.5,8,[{f:function(x){return (x-1)*(x-1)-9}}],{lin:[[1,-10.5,1,8,'dash'],[-1,-5,3,-5,'fino']],pts:[[-1,-5,'ab'],[3,-5,'ab'],[1,-9]]}),
  'B14.r3':graf(-3,5,-10.5,8,[{f:function(x){return x*x-2*x-8}}],{pts:[[-2,0],[4,0]],tx:[[-2.6,5,'+'],[0.75,-4.2,'−'],[4.3,6,'+']]}),
  'B14.p1':tx('a(x − h)² + k',22),
  'B14.p2':graf(-1,4,-2,4,[{f:function(x){return 1.2*(x-1.5)*(x-1.5)-1},c:'cv'}],{lin:[[0,-1,0,4,'grosso'],[0,-1,1.5,-1,'dash']],pts:[[1.5,-1]]}),
  // B15: potências, polinômios e 1/x
  'B15.r1':graf(-1.7,1.7,-1.7,1.7,[{f:function(x){return x*x}},{f:function(x){return x*x*x},c:'cv2'}],{pts:[[1,1]]}),
  'B15.r2':graf(-4.5,4.5,-2,2,[{f:Math.sqrt,a:0},{f:Math.cbrt,c:'cv2'}],{pts:[[0,0]]}),
  'B15.r3':graf(-3,3,-3,4,[{f:function(x){return 1/(x*x)},a:-3,b:-0.05},{f:function(x){return 1/(x*x)},a:0.05,b:3},{f:function(x){return 1/x},a:-3,b:-0.05,c:'cv2'},{f:function(x){return 1/x},a:0.05,b:3,c:'cv2'}]),
  'B15.r4':graf(-1.8,5,-6,10,[{f:function(x){return (x+1)*(x-2)*(x-4)}}],{area:[-1,2],pts:[[-1,0],[2,0],[4,0]]}),
  'B15.r5':graf(-0.3,3,-0.3,4,[{f:function(x){return 1/x},a:0.05},{f:function(x){return 1/(x*x)},a:0.05,c:'cv2'},{f:function(x){return 1/(x*x*x)},a:0.05,c:'fino'}],{pts:[[1,1]]}),
  // B16: transformações e por partes
  'B16.r1':graf(-1,6,-1,4,[{f:Math.sqrt,a:0,c:'dash'},{f:function(x){return Math.sqrt(x-2)+1},a:2}],{lin:[[0,0,2,1,'tr2']],pts:[[0,0,'ab'],[2,1]]}),
  'B16.r2':graf(-5,5,-2.5,2.5,[{f:Math.sqrt,a:0,c:'dash'},{f:function(x){return -Math.sqrt(x)},a:0},{f:function(x){return Math.sqrt(-x)},b:0,c:'cv2'}]),
  'B16.r3':graf(-4,4,-1,4,[{f:Math.abs,c:'dash'},{f:function(x){return 3-Math.abs(x)}}],{pts:[[0,3],[-3,0],[3,0]]}),
  'B16.r4':graf(-7,10,-5.5,3.5,[{f:Math.sqrt,a:0,c:'dash'},{f:function(x){return 1-2*Math.sqrt(3-x)},b:3}],{pts:[[3,1],[0,0,'ab']]}),
  'B16.r5':graf(-4,4.5,-1.5,4.5,[{f:function(x){return x+3},b:-1},{f:function(x){return x*x},a:-1,b:2},{f:function(){return 3},a:2}],{pts:[[-1,2,'ab'],[-1,1],[2,4,'ab'],[2,3]]}),
  // B17: composição e inversa
  'B17.r1':'<rect x="44" y="26" width="28" height="28" rx="4" class="cx"/><rect x="96" y="26" width="28" height="28" rx="4" class="cx"/>'+
    '<text x="54" y="45" class="rt">g</text><text x="107" y="45" class="rt">f</text>'+
    '<path d="M16 40H40M76 40H92M128 40H148M35 35l5 5-5 5M87 35l5 5-5 5M143 35l5 5-5 5" class="tr"/><text x="20" y="34" class="rt">x</text>',
  'B17.r2':graf(-3,7,-1,5,[{f:function(x){return Math.sqrt(10-2*x)},b:5}],{lin:[[-3,0,5,0,'grosso']],pts:[[5,0]]}),
  'B17.r3':'<ellipse cx="34" cy="40" rx="16" ry="30" class="cx"/><ellipse cx="126" cy="40" rx="16" ry="30" class="cx"/>'+
    '<circle cx="34" cy="22" r="3.2" class="pt"/><circle cx="34" cy="40" r="3.2" class="pt"/><circle cx="34" cy="58" r="3.2" class="pt"/>'+
    '<circle cx="126" cy="22" r="3.2" class="pt"/><circle cx="126" cy="40" r="3.2" class="pt"/><circle cx="126" cy="58" r="3.2" class="pt"/>'+
    '<path d="M56 19H104M56 37H104M56 55H104M99 15l5 4-5 4M99 33l5 4-5 4M99 51l5 4-5 4" class="tr"/>'+
    '<path d="M104 25H56M104 43H56M104 61H56M61 21l-5 4 5 4M61 39l-5 4 5 4M61 57l-5 4 5 4" class="tr2"/>',
  'B17.r4':graf(-1.5,5.25,-0.5,2.5,[{f:function(x){return x},c:'dash'},{f:function(x){return 1.8*x+0.3}},{f:function(x){return (x-0.3)/1.8},c:'cv2'}],{pts:[[1,2.1],[2.1,1]]}),
  'B17.r5':graf(-3,4.875,-1.5,2,[{f:function(x){return x},c:'dash'},{f:function(x){return (x+1)*(x+1)},b:-1,c:'fino'},{f:function(x){return (x+1)*(x+1)},a:-1},{f:function(x){return Math.sqrt(x)-1},a:0,c:'cv2'}],{pts:[[-1,0],[0,-1]]}),
  'B17.p1':graf(-4,2.5,-1,5.5,[{f:function(x){return (x+1)*(x+1)}}],{lin:[[-4,4,2.5,4,'dash']],pts:[[-3,4],[1,4]]}),
  'B17.p2':'<path d="M44 76L116 4" class="dash"/><path d="M54 22L98 66" class="tr"/>'+
    '<circle cx="54" cy="22" r="3.2" class="pt"/><circle cx="98" cy="66" r="3.2" class="pt"/><circle cx="76" cy="44" r="3.2" class="ab"/>'+
    '<text x="40" y="20" class="rt">P</text><text x="104" y="72" class="rt">Q</text><text x="84" y="48" class="rt">M</text>'
});
// Lote C
Object.assign(F,(function(){
  function f1(v){return (+v).toFixed(1)}
  function pc(cx,cy,r,t){return [cx+r*Math.cos(t),cy-r*Math.sin(t)]}
  function arco(cx,cy,r,t0,t1,c){var p=pc(cx,cy,r,t0),q=pc(cx,cy,r,t1);
    return '<path d="M'+f1(p[0])+' '+f1(p[1])+'A'+r+' '+r+' 0 '+(Math.abs(t1-t0)>Math.PI?1:0)+' '+(t1>t0?0:1)+' '+f1(q[0])+' '+f1(q[1])+'" class="'+c+'"/>'}
  function seg(p,q,c){return '<line x1="'+f1(p[0])+'" y1="'+f1(p[1])+'" x2="'+f1(q[0])+'" y2="'+f1(q[1])+'" class="'+c+'"/>'}
  function ponto(p,c){return '<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="3.2" class="'+(c||'pt')+'"/>'}
  function ciclo(cx,cy,r){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" class="cx"/>'+seg([cx-r-6,cy],[cx+r+6,cy],'ex')+seg([cx,cy-r-4],[cx,cy+r+4],'ex')}
  function rot(x,y,t){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" class="rt">'+t+'</text>'}
  var L2=Math.log(2),L3=Math.log(3),sen=Math.sin,PI=Math.PI;
  function log2(x){return Math.log(x)/L2}
  return {
  'B18.r1':graf(-1.2,3.2,-0.6,7,[{f:function(x){return Math.pow(2,x)}}],{lin:[[-1.2,5,log2(5),5,'dash'],[log2(5),5,log2(5),0,'dash']],pts:[[log2(5),0]],tx:[[log2(5)+0.12,0.4,'c']]}),
  'B18.r2':(function(){var s='<rect x="12" y="14" width="110" height="22" rx="3" class="cx"/><rect x="40" y="42" width="112" height="22" rx="3" class="cx"/>';
    for(var n=1;n<=10;n++){var x=16+100*Math.log10(n),m=(n==1||n==2||n==6||n==10);s+=seg([x,36],[x,m?28:31],'fino');s+=seg([x+30.1,42],[x+30.1,m?50:47],'fino')}
    var a=16+100*Math.log10(2),b=16+100*Math.log10(6);
    s+=seg([a,10],[a,70],'dash')+seg([b,10],[b,70],'dash')+rot(a+6,27,'2')+rot(b+6,27,'6')+rot(a+6,60,'1')+rot(b+6,60,'3');return s})(),
  'B18.r3':tx('x = ln 30 / ln 7',18),
  'B18.r4':graf(-3.5,7,-2.5,5,[{f:function(x){return log2(x)+log2(x-2)},a:2.005,b:7}],{lin:[[2,-2.5,2,5,'dash'],[-3.5,3,7,3,'fino']],pts:[[4,3],[-2,3,'ab']]}),
  'B18.p1':(function(){var s='',E=['aᵐ·aⁿ','aᵐ/aⁿ','(aᵐ)ᵖ'],D=['m + n','m − n','p · m'];
    for(var i=0;i<3;i++){var y=10+i*22;s+='<rect x="22" y="'+y+'" width="48" height="16" rx="3" class="cx"/><rect x="90" y="'+y+'" width="48" height="16" rx="3" class="cx"/>'+seg([74,y+8],[86,y+8],'tr')+rot(46,y+12.5,E[i])+rot(114,y+12.5,D[i])}return s})(),
  'B18.p2':(function(){var s='',u=28,x0=44;
    s+=seg([x0,30],[x0+3*u,30],'cv')+seg([x0,54],[x0+2*u,54],'cv2');
    for(var k=0;k<=3;k++)s+=seg([x0+k*u,25],[x0+k*u,35],'fino');
    for(k=0;k<=2;k++)s+=seg([x0+k*u,49],[x0+k*u,59],'fino');
    s+='<text x="36" y="34.5" text-anchor="end" class="rt">27</text><text x="36" y="58.5" text-anchor="end" class="rt">9</text>'+rot(x0+3*u+10,34.5,'3')+rot(x0+2*u+10,58.5,'2');return s})(),
  'B19.r1':graf(-0.6,3.6,-0.8,9,[{f:function(x){return 1+x},c:'dash'},{f:function(x){return Math.pow(2,x)}}],{pts:[[0,1],[1,2],[2,4],[3,8]]}),
  'B19.r2':graf(-3,3,-0.8,5,[{f:function(x){return Math.pow(2,x)}},{f:function(x){return Math.pow(0.5,x)},c:'cv2'}],{pts:[[0,1]]}),
  'B19.r3':graf(-2,2.2,-0.5,6,[{f:function(x){return Math.pow(2,x)},c:'fino'},{f:function(x){return Math.pow(3,x)}},{f:function(x){return Math.pow(5,x)},c:'cv2'}],{lin:[[1,0,1,6,'dash']],pts:[[1,2],[1,3],[1,5]]}),
  'B19.r4':graf(-3,2,-0.8,6,[{f:function(x){return Math.pow(3,x)},c:'dash'},{f:function(x){return Math.pow(3,x)+2}}],{lin:[[-3,2,2,2,'fino']],pts:[[0,1,'ab'],[0,3]]}),
  'B19.r5':graf(-1.5,4.5,-1.5,4,[{f:function(x){return x},c:'dash'},{f:function(x){return Math.pow(3,x)}},{f:function(x){return Math.log(x)/L3},a:0.05,c:'cv2'}],{lin:[[1,3,3,1,'fino']],pts:[[1,3],[3,1]]}),
  'B19.r6':graf(-0.5,10.5,-0.4,4.5,[{f:function(x){return 4*Math.pow(0.5,x/3)},a:0}],{lin:[[3,0,3,2,'dash'],[6,0,6,1,'dash'],[9,0,9,0.5,'dash']],pts:[[0,4],[3,2],[6,1],[9,0.5]]}),
  'B19.r7':graf(-1,4.6,-1,10,[{f:function(x){return Math.pow(2,x)}}],{lin:[[-1,8,4.6,8,'dash'],[3,0,4.6,0,'grosso']],pts:[[3,8],[3,0,'ab']]}),
  'B19.p1':graf(-0.5,9,-2.6,3.8,[{f:Math.log,a:0.05},{f:log2,a:0.03,c:'cv2'},{f:Math.log10,a:0.01,c:'fino'}],{lin:[[8,-2.6,8,3.8,'dash']],pts:[[1,0],[8,3],[8,Math.log(8)],[8,Math.log10(8)]]}),
  'B20.r1':'<path d="M32 58H128V30Z" class="cx"/><path d="M120 58v-8h8" class="tr"/>'+rot(80,72,'24')+rot(136,48,'7')+rot(72,38,'25'),
  'B20.r2':'<rect x="22" y="18" width="42" height="42" class="cx"/>'+seg([22,60],[64,18],'dash')+arco(22,60,12,0,PI/4,'tr')+
    '<path d="M90 62H138L114 20.4Z" class="cx"/>'+seg([114,20.4],[114,62],'dash')+'<path d="M114 56h6v6" class="fino"/>',
  'B20.r3':ciclo(80,42,30).replace(/<line[^>]*>/g,'')+seg([80,42],[110,42],'tr')+seg([80,42],pc(80,42,30,1),'tr')+arco(80,42,30,0,1,'cv2')+arco(80,42,9,0,1,'fino')+rot(95,55,'r')+rot(114,27,'r'),
  'B20.p1':'<rect x="48" y="8" width="64" height="64" class="cx"/><path d="M72 8L112 32L88 72L48 48Z" class="ar"/><path d="M72 8L112 32L88 72L48 48Z" class="cv"/>',
  'B20.p2':(function(){var cx=50,cy=68,t=0.3*PI,s=seg([cx,cy],[cx+62,cy],'tr')+seg([cx,cy],pc(cx,cy,62,t),'tr');
    [18,36,54].forEach(function(r,i){s+=arco(cx,cy,r,0,t,i==2?'cv2':'cv')});return s})(),
  'B21.r1':(function(){var s=ciclo(80,40,30),t=PI/3;s+=seg([80,40],pc(80,40,30,t),'cv')+arco(80,40,10,0,t,'tr');
    [0,PI/2,PI,3*PI/2].forEach(function(a){s+=ponto(pc(80,40,30,a),'ab')});return s+ponto(pc(80,40,30,t))})(),
  'B21.r2':(function(){var s=ciclo(80,40,30),x=PI/5,P=[pc(80,40,30,x),pc(80,40,30,PI-x),pc(80,40,30,PI+x),pc(80,40,30,2*PI-x)];
    s+='<path d="M'+P.map(function(p){return f1(p[0])+' '+f1(p[1])}).join('L')+'Z" class="dash"/>'+seg([80,40],P[0],'cv');
    return s+ponto(P[0])+ponto(P[1],'ab')+ponto(P[2],'ab')+ponto(P[3],'ab')})(),
  'B21.r3':(function(){var cx=80,cy=40,T=2*PI+PI/4,d='';
    for(var k=0;k<=90;k++){var t=T*k/90,p=pc(cx,cy,10+22*t/T,t);d+=(k?'L':'M')+f1(p[0])+' '+f1(p[1])}
    var E=pc(cx,cy,32,PI/4);
    return seg([cx-40,cy],[cx+40,cy],'ex')+seg([cx,cy-34],[cx,cy+34],'ex')+seg([cx,cy],E,'tr')+'<path d="'+d+'" class="cv2"/>'+ponto(E)})(),
  'B21.r4':(function(){var O=[56,68],P=pc(56,68,36,1),T=[92,68-36*Math.tan(1)];
    return seg([48,68],[116,68],'ex')+seg([56,72],[56,20],'ex')+arco(56,68,36,0,PI/2,'cv')+seg([92,74],[92,8],'fino')+seg(O,T,'tr')+seg([92,68],T,'cv2')+arco(56,68,9,0,1,'fino')+ponto(P)+ponto(T)})(),
  'B22.r1':(function(){var cx=30,cy=40,r=20,t=PI/3,P=pc(cx,cy,r,t),d='';
    for(var k=0;k<=60;k++){var x=60+90*k/60;d+=(k?'L':'M')+f1(x)+' '+f1(cy-r*Math.sin(2*PI*k/60))}
    var W=[60+90*t/(2*PI),P[1]];
    return '<circle cx="30" cy="40" r="20" class="cx"/>'+seg([6,40],[152,40],'ex')+seg([cx,cy],P,'fino')+'<path d="'+d+'" class="cv"/>'+seg(P,W,'dash')+ponto(P)+ponto(W)})(),
  'B22.r2':graf(-4.8,4.8,-3,3,[{f:Math.tan,a:-PI/2+0.01,b:PI/2-0.01},{f:Math.tan,a:PI/2+0.01,b:3*PI/2-0.01},{f:Math.tan,a:-3*PI/2+0.01,b:-PI/2-0.01}],{lin:[[PI/2,-3,PI/2,3,'dash'],[-PI/2,-3,-PI/2,3,'dash'],[3*PI/2,-3,3*PI/2,3,'dash'],[-3*PI/2,-3,-3*PI/2,3,'dash']]}),
  'B22.r3':graf(-0.3,6.6,-1.5,2.4,[{f:sen,c:'fino'},{f:function(x){return 0.6+1.3*Math.sin(2*x)}}],{lin:[[-0.3,0.6,6.6,0.6,'dash']]}),
  'B22.r4':graf(-1,7,-1.5,1.5,[{f:sen,c:'dash'},{f:function(x){return Math.sin(x-PI/3)}}],{pts:[[0,0,'ab'],[PI/3,0]]}),
  'B23.r1':(function(){var t=-Math.asin(12/37),P=pc(80,40,30,t);
    return ciclo(80,40,30)+seg([80,40],P,'cv')+seg([80,40],[P[0],40],'grosso')+seg([P[0],40],P,'cv2')+'<path d="M'+f1(P[0]-6)+' 40v6h6" class="fino"/>'+ponto(P)+rot(90,58,'1')})(),
  'B23.r2':(function(){var a=0.6,b=0.8;return ciclo(80,40,30)+seg([80,40],pc(80,40,30,a),'cv')+seg([80,40],pc(80,40,30,a+b),'cv')+arco(80,40,10,0,a,'tr')+arco(80,40,16,a,a+b,'tr2')+ponto(pc(80,40,30,a),'ab')+ponto(pc(80,40,30,a+b))})(),
  'B23.r3':graf(-0.3,6.6,-0.3,1.3,[{f:function(x){return Math.pow(Math.sin(x),2)}},{f:function(x){return Math.pow(Math.cos(x),2)},c:'cv2'}],{lin:[[-0.3,0.5,6.6,0.5,'dash']]}),
  'B23.r4':(function(){var th=5*PI/4;return ciclo(80,40,30)+seg([80,40],pc(80,40,30,th),'dash')+seg([80,40],pc(80,40,30,th/2),'cv')+arco(80,40,9,0,th,'fino')+arco(80,40,15,0,th/2,'tr2')+ponto(pc(80,40,30,th),'ab')+ponto(pc(80,40,30,th/2))})(),
  'B23.p1':(function(){var A=pc(80,40,30,0),Q=pc(80,40,30,1.5),P=pc(80,40,30,0.9),R=pc(80,40,30,-0.6);
    return ciclo(80,40,30)+seg([80,40],P,'fino')+seg([80,40],Q,'fino')+seg([80,40],R,'fino')+seg(A,Q,'cv2')+seg(R,P,'cv2')+ponto(A)+ponto(Q)+ponto(P,'ab')+ponto(R,'ab')})(),
  'B23.p2':(function(){var s='',L=['cos','−b','π/2','sen'];
    for(var i=0;i<4;i++){var x=9+i*38;s+='<rect x="'+x+'" y="30" width="28" height="20" rx="3" class="'+(i==3?'cx':'cx')+'"/>'+rot(x+14,44.5,L[i]);
      if(i<3)s+=seg([x+30,40],[x+36,40],'tr')+'<path d="M'+(x+33)+' 37L'+(x+36)+' 40L'+(x+33)+' 43" class="tr"/>'}return s})()
  }})());
// Lote D
Object.assign(F,{
  'B24.r1':'<circle cx="80" cy="40" r="30" class="cx"/><path d="M42 40h76M80 6v68" class="ex"/><path d="M40 14h80" class="dash"/><path d="M80 40L95 14M80 40L65 14" class="fino"/><circle cx="95" cy="14" r="3.2" class="pt"/><circle cx="65" cy="14" r="3.2" class="pt"/>',
  'B24.r2':graf(-0.4,7,-3,3,[{f:Math.tan,a:-1.45,b:1.45},{f:Math.tan,a:Math.PI/2+0.12,b:3*Math.PI/2-0.12},{f:Math.tan,a:3*Math.PI/2+0.12,b:7}],{lin:[[-0.4,-1,7,-1,'dash']],pts:[[3*Math.PI/4,-1],[7*Math.PI/4,-1]]}),
  'B24.r3':graf(-2.6,1.6,-3.6,2.6,[{f:function(t){return 2*t*t+3*t-2}}],{lin:[[-1,-3.6,-1,2.6,'dash'],[1,-3.6,1,2.6,'dash']],pts:[[0.5,0],[-2,0,'ab']]}),
  'B25.r1':'<path d="M25 17L52 64H142Z" class="cx"/><path d="M62 64A10 10 0 0 0 47 55.3" class="cv"/><text x="66" y="61" class="rt">120°</text>',
  'B25.r2':'<path d="M30 64H130" class="cv"/><path d="M30 64L50 29.4" class="cv"/><path d="M50 29.4L130 64" class="cv2"/><path d="M30 64L10 29.4L130 64" class="dash"/><path d="M42 64A12 12 0 0 0 36 53.6" class="tr"/><text x="92" y="40" class="rt">a</text>',
  'B25.r3':'<path d="M20 66H140L60 14Z" class="cx"/><path d="M60 14V66" class="dash"/><path d="M60 58h8v8" class="fino"/><text x="64" y="44" class="rt">h</text>',
  'B25.r4':'<path d="M80 66H140L80 16Z" class="ar"/><path d="M80 66H140L80 16Z" class="cv"/><path d="M80 66L123.3 41L140 66M80 66L36.7 41L140 66" class="fino"/><path d="M80 66v-8h8" class="fino"/>',
  'B25.p1':'<path d="M12 66H148M60 70V12" class="ex"/><path d="M100 66A40 40 0 0 0 20 66" class="dash"/><path d="M60 66L80 31.4" class="cv"/><path d="M80 31.4L140 66" class="cv2"/><path d="M40 31.4L140 66" class="dash"/><circle cx="80" cy="31.4" r="3.2" class="pt"/><circle cx="40" cy="31.4" r="3.2" class="ab"/><circle cx="140" cy="66" r="3.2" class="pt"/>',
  'B25.p2':'<path d="M14 22.4H148" class="dash"/><path d="M56 64H136L80 22.4Z" class="ar"/><path d="M56 64H136L80 22.4Z" class="cv"/><path d="M56 64L32 22.4L136 64" class="cv2"/><circle cx="80" cy="22.4" r="3.2" class="pt"/><circle cx="32" cy="22.4" r="3.2" class="pt"/>',
  'B26.r1':'<circle cx="46" cy="40" r="30" class="cx"/><circle cx="104" cy="40" r="15" class="cx"/><circle cx="136" cy="40" r="15" class="cx"/>',
  'B26.r2':'<circle cx="80" cy="44" r="30" class="fino"/><path d="M80 44L106 29A30 30 0 0 0 54 29Z" class="ar"/><path d="M80 44L106 29M80 44L54 29" class="tr"/><path d="M106 29A30 30 0 0 0 54 29" class="cv2"/><text x="76" y="38" class="rt">θ</text>',
  'B26.r3':'<path d="M14 66H50L26 42Z" class="cx"/><path d="M66 66H138L90 18Z" class="cx"/><path d="M90 18L66 66H138Z" class="cv2"/>',
  'B26.r4':'<rect x="20" y="40" width="24" height="24" class="cx"/><rect x="74" y="16" width="48" height="48" class="cx"/><path d="M98 16V64M74 40H122" class="dash"/>',
  'B26.p1':'<rect x="52" y="12" width="56" height="56" class="cx"/><circle cx="80" cy="40" r="28" class="cv"/><path d="M108 40L94 15.8H66L52 40L66 64.2H94Z" class="tr2"/>',
  'B26.p2':(function(){var w=18,x0=24,yb=58,yt=22,r=36,s='M'+x0+' '+yb,z='';
    for(var i=0;i<6;i++)s+='A'+r+' '+r+' 0 0 0 '+(x0+(i+1)*w)+' '+yb;
    s+='L'+(x0+5*w+w/2)+' '+yt;for(var i=5;i>0;i--)s+='A'+r+' '+r+' 0 0 0 '+(x0+(i-1)*w+w/2)+' '+yt;s+='Z';
    for(var i=0;i<6;i++)z+='M'+(x0+i*w)+' '+yb+'L'+(x0+i*w+w/2)+' '+yt+'L'+(x0+(i+1)*w)+' '+yb;
    return '<path d="'+s+'" class="cx"/><path d="'+z+'" class="fino"/><text x="80" y="76" text-anchor="middle" class="rt">πr</text><text x="12" y="44" class="rt">r</text>'})(),
  'B27.r1':(function(){var u=6.5,x=80-9*u,y=40-5*u,s='';
    function R(a,b,w,h,c){s+='<rect x="'+(x+a*u)+'" y="'+(y+b*u)+'" width="'+(w*u)+'" height="'+(h*u)+'" class="'+(c||'cx')+'"/>'}
    R(0,3,3,4);R(3,3,6,4,'ar');R(3,3,6,4);R(9,3,3,4);R(12,3,6,4);R(3,0,6,3);R(3,7,6,3);return s})(),
  'B27.r2':'<circle cx="80" cy="17" r="10" class="cx"/><rect x="48.6" y="27" width="62.8" height="26.7" class="cx"/><circle cx="80" cy="63.7" r="10" class="cx"/><path d="M48.6 53.7H111.4" class="tr2"/>',
  'B27.r3':'<path d="M24 64H52L60 56M24 64L42 16L52 64M42 16L60 56" class="cv"/><path d="M24 64L32 56H60M42 16L32 56" class="dash"/><ellipse cx="88" cy="62" rx="18" ry="5" class="cx"/><path d="M70 62L88 16L106 62" class="cv"/><circle cx="130" cy="40" r="18" class="cx"/><ellipse cx="130" cy="40" rx="18" ry="5" class="dash"/>',
  'B27.r4':(function(){function cubo(x,y,s){var dx=s/2,dy=s*0.375;return '<path d="M'+x+' '+y+'h'+s+'v'+s+'h'+(-s)+'zM'+x+' '+y+'l'+dx+' '+(-dy)+'h'+s+'l'+(-dx)+' '+dy+'M'+(x+s)+' '+(y+s)+'l'+dx+' '+(-dy)+'v'+(-s)+'" class="cx"/>'}
    return cubo(28,48,18)+cubo(80,30,36)+'<path d="M98 30V66M80 48H116M98 30L116 16.5M89 23.25H125M116 48L134 34.5M125 23.25V59.25" class="dash"/>'})(),
  'B27.p1':'<path d="M12 40H148" class="dash"/><path d="M30 18V64M66 18V64" class="cv"/><ellipse cx="48" cy="18" rx="18" ry="5" class="cx"/><path d="M30 64A18 5 0 0 0 66 64" class="cv"/><path d="M82 64L106 18M118 64L142 18" class="cv"/><ellipse cx="124" cy="18" rx="18" ry="5" class="cx"/><path d="M82 64A18 5 0 0 0 118 64" class="cv"/><ellipse cx="48" cy="40" rx="18" ry="5" class="cv2"/><ellipse cx="112.5" cy="40" rx="18" ry="5" class="cv2"/>',
  'B27.p2':'<path d="M50 26H100V66H50ZM50 26L70 14H120L100 26M100 66L120 54V14M50 66L70 54H120M70 54V14" class="dash"/><path d="M50 66H100L120 54M85 20L50 66M85 20L100 66M85 20L120 54" class="cv"/><path d="M85 20L70 54L50 66M70 54H120" class="fino"/><circle cx="85" cy="20" r="3.2" class="pt"/>',
  'B27.p3':'<circle cx="44" cy="40" r="24" class="cx"/><rect x="92" y="16" width="48" height="48" class="cx"/><path d="M92 16L140 64M140 16L92 64" class="cv"/><path d="M12 28H148" class="dash"/><path d="M23.2 28H64.8M92 28H104M128 28H140" class="tr2"/>',
  'B28.r1':graf(-0.5,5.5,-0.5,7,[],{lin:[[1,2,4,2,'dash'],[4,2,4,6,'dash'],[1,2,4,6,'cv']],pts:[[1,2],[4,6],[2.5,4,'ab']]}),
  'B28.r2':(function(){var x0=-14.5,x1=17,y0=-5.5,y1=8.5;function c(s){return function(x){return 2+s*Math.sqrt(Math.max(0,25-(x-1)*(x-1)))}}
    return graf(x0,x1,y0,y1,[{f:c(1),a:-4,b:6},{f:c(-1),a:-4,b:6}],{lin:[[1,2,4,6,'tr2']],pts:[[1,2,'ab'],[4,6],[6,2],[1,7],[-2,-2]]})})(),
  'B28.r3':'<rect x="51" y="11" width="40" height="40" class="cx"/><rect x="91" y="11" width="18" height="40" class="cx"/><rect x="51" y="51" width="40" height="18" class="cx"/><rect x="91" y="51" width="18" height="18" class="ar"/><path d="M91 51h18v18h-18z" class="dash"/><text x="67" y="35" class="rt">x²</text><text x="96" y="65" class="rt">9</text>',
  'B28.r4':(function(){function c(s){return function(x){return 2+s*Math.sqrt(Math.max(0,25-(x-1)*(x-1)))}}
    return graf(-14.5,17,-5.5,8.5,[{f:c(1),a:-4,b:6},{f:c(-1),a:-4,b:6,c:'cv2'}],{lin:[[4,-5.5,4,8.5,'dash']],pts:[[4,6,'ab'],[4,-2,'ab']]})})(),
  'B28.p1':graf(-0.5,7.5,-0.5,7.5,[],{lin:[[2,2,6,2,'tr2'],[2,2,2,6,'tr2'],[6,2,2,6,'cv']],pts:[[6,2],[2,6],[2,2,'ab']],tx:[[1.0,1.1,'K']]}),
  'B28.p2':graf(-4.5,6.5,-0.5,8,[],{lin:[[-3,-0.5,-3,8,'dash'],[1,-0.5,1,8,'dash'],[5,-0.5,5,8,'dash'],[-3,1,5,7,'cv']],pts:[[-3,1],[5,7],[1,4,'ab']]}),
  'B28.p3':(function(){function c(s){return function(x){return 2+s*Math.sqrt(Math.max(0,25-(x-1)*(x-1)))}}
    return graf(-9.5,22,-5.5,8.5,[{f:c(1),a:-4,b:6,c:'fino'},{f:c(-1),a:-4,b:6,c:'fino'},{f:function(x){return -0.75*x+9},a:-1,b:13,c:'cv2'}],{lin:[[1,2,4,6,'cv'],[1,2,8,3,'dash']],pts:[[1,2,'ab'],[4,6],[8,3]]})})(),
  'C01.r1':'<rect x="60" y="18" width="44" height="44" class="cx"/><path d="M60 62L104 18" class="cv2"/><text x="78" y="76" class="rt">1</text><text x="108" y="44" class="rt">1</text><text x="62" y="36" class="rt">√2</text>',
  'C01.r2':'<path d="M12 52H148" class="ex"/><path d="M30 52H70M90 52H130" class="tr2"/><path d="M30 46Q60 20 90 46M70 46Q100 20 130 46" class="dash"/><circle cx="30" cy="52" r="3.2" class="pt"/><circle cx="70" cy="52" r="3.2" class="pt"/><circle cx="90" cy="52" r="3.2" class="ab"/><circle cx="130" cy="52" r="3.2" class="ab"/><text x="26" y="70" class="rt">a</text><text x="66" y="70" class="rt">b</text>',
  'C01.r3':'<path d="M12 62H148" class="ex"/><path d="M70 56v12" class="tr"/><path d="M70 46H106M100 42L106 46L100 50" class="cv"/><path d="M106 28H46M52 24L46 28L52 32" class="cv2"/><path d="M46 28V62" class="fino"/><circle cx="46" cy="62" r="3.2" class="pt"/><text x="66" y="78" class="rt">0</text>',
  'C01.r4':'<path d="M12 46H148" class="ex"/><path d="M20 40v12M140 40v12" class="tr"/><circle cx="80" cy="46" r="2.6" class="pt"/><circle cx="134" cy="46" r="2.6" class="pt"/><circle cx="139.4" cy="46" r="2.6" class="pt"/><circle cx="140" cy="46" r="4.5" class="ab"/><text x="80" y="34" text-anchor="middle" class="rt">0,9</text><text x="140" y="68" text-anchor="middle" class="rt">1</text>',
  'C06.r1':(function(){function h(s){return function(x){return s*Math.sqrt(Math.max(0,x*x-1))}}function c(s){return function(x){return s*Math.sqrt(Math.max(0,1-x*x))}}
    return graf(-2.2,5,-1.6,1.6,[{f:function(x){return x},c:'dash'},{f:function(x){return -x},c:'dash'},{f:c(1),a:-1,b:1,c:'fino'},{f:c(-1),a:-1,b:1,c:'fino'},{f:h(1),a:1,b:5},{f:h(-1),a:1,b:5}],{pts:[[Math.cosh(1),Math.sinh(1)]]})})(),
  'C06.r2':graf(-1,24,-6,90,[{f:function(t){return 80*Math.exp(-0.1*t)},a:0}],{lin:[[6.931,0,6.931,40,'dash'],[13.863,0,13.863,20,'dash'],[20.794,0,20.794,10,'dash']],pts:[[0,80],[6.931,40],[13.863,20],[20.794,10]]}),
  'C07.r1':graf(-0.3,7,-1.8,1.8,[{f:Math.sin,c:'dash'},{f:function(x){return Math.sin(x)+Math.cos(x)}}],{lin:[[-0.3,Math.SQRT2,7,Math.SQRT2,'fino']],pts:[[Math.PI/4,Math.SQRT2]]}),
  'C07.r2':(function(){function seta(x1,y1,x2,y2,c){var a=Math.atan2(y2-y1,x2-x1),k=7,b=0.45;
      return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'M'+(x2-k*Math.cos(a-b)).toFixed(1)+' '+(y2-k*Math.sin(a-b)).toFixed(1)+'L'+x2+' '+y2+'L'+(x2-k*Math.cos(a+b)).toFixed(1)+' '+(y2-k*Math.sin(a+b)).toFixed(1)+'" class="'+c+'"/>'}
    return '<path d="M110 26L135 69.3M55 69.3H135" class="dash"/>'+seta(30,26,110,26,'cv')+seta(30,26,55,69.3,'cv')+seta(30,26,135,69.3,'cv2')+'<path d="M44 26A14 14 0 0 1 37 38.1" class="tr"/>'})(),
  'C08.r1':tx('∀ε ∃δ',30),
  'C08.r2':graf(-0.3,4.6,-0.5,8.4,[{f:function(x){return 2*x-1}}],{lin:[[2.5,4,3.5,4,'tr2'],[3.5,4,3.5,6,'tr2'],[3.5,6,2.5,6,'tr2'],[2.5,6,2.5,4,'tr2']],pts:[[3,5]]}),
  'C08.r3':graf(-0.5,4.5,-0.5,4.4,[],{faixa:[[0.7,1.7],[2.7,3.7]],lin:[[-0.5,1.2,4.5,1.2,'dash'],[-0.5,3.2,4.5,3.2,'dash'],[2,-0.5,2,4.4,'fino']],pts:[[2,1.2,'ab'],[2,3.2,'ab']]}),
  'C08.r4':'<path d="M14 56H146" class="ex"/><path d="M20 50v12M80 50v12M140 50v12" class="tr"/><path d="M20 38H64" class="cv"/><path d="M64 26H116" class="cv2"/><path d="M64 26V38M116 26V56" class="fino"/><text x="16" y="76" class="rt">0</text><text x="136" y="76" class="rt">ε</text>',
  'C08.r5':graf(-0.5,9.5,-1.2,2.4,[{f:function(x){return 1/x},a:0.4}],{faixa:[[-0.5,0.5]],lin:[[2,-1.2,2,2.4,'dash']],tx:[[2.2,-0.85,'M']]})
});
// Lote E
Object.assign(F,{
  // C11: confronto, sen x / x, e, ln(1+x)/x
  'C11.r1':graf(-1,1,-1.05,1.05,[{f:function(x){return Math.abs(x)},c:'cv2'},{f:function(x){return -Math.abs(x)},c:'cv2'},{f:function(x){return x*Math.sin(1/x)},a:-1,b:-0.04},{f:function(x){return x*Math.sin(1/x)},a:0.04,b:1}],{pts:[[0,0]]}),
  'C11.r2':'<path d="M32 70H122A90 90 0 0 0 108.6 23Z" class="ar"/><path d="M32 70L122 14.8V70" class="fino"/><path d="M32 70L108.6 23" class="cv"/><path d="M122 70A90 90 0 0 0 108.6 23" class="cv"/><path d="M48 70A16 16 0 0 0 45.6 61.6" class="tr"/><circle cx="108.6" cy="23" r="3.2" class="pt"/><text x="52" y="66" class="rt">θ</text>',
  'C11.r3':(function(){var p=[];for(var n=1;n<=12;n++)p.push([n,Math.pow(1+1/n,n)]);
    return graf(0,13.6,1.85,3.08,[],{lin:[[0,Math.E,13.6,Math.E,'dash'],[0,3,13.6,3,'fino']],pts:p,tx:[[12.6,2.79,'e']]})})(),
  'C11.r4':graf(-1.9,1.9,-0.85,0.9,[{f:function(x){return x},c:'dash'},{f:function(x){return Math.log(1+x)},a:-0.57},{f:function(x){return Math.exp(x)-1},b:0.64,c:'cv2'}],{pts:[[0,0]]}),
  // C12: combinações, completude, bisseção, consequências
  'C12.r1':'<path d="M20 64H140M20 40H140M20 16H140" class="ex"/><path d="M72 64H88" class="grosso"/><path d="M64 40H96" class="grosso"/><path d="M54 16H106" class="grosso"/><path d="M80 60V46M76 50l4-4 4 4M80 36V22M76 26l4-4 4 4" class="tr"/><text x="144" y="68" class="rt">δ</text><text x="144" y="44" class="rt">η</text><text x="144" y="20" class="rt">ε</text>',
  'C12.r2':graf(0.8,2.15,-1.3,2.3,[{f:function(x){return x*x-2},a:1,b:2}],{pts:[[1,-1],[2,2],[Math.SQRT2,0,'ab']]}),
  'C12.r3':'<path d="M20 14H140M80 26H140M80 38H110M95 50H110" class="grosso"/><path d="M20 64H140" class="ex"/><path d="M101.9 8V64" class="dash"/><circle cx="101.9" cy="64" r="3.2" class="pt"/>',
  'C12.r4':graf(-0.96,1.96,-0.15,1.15,[{f:function(x){return x},a:0,b:1.1,c:'dash'},{f:function(x){return 1-x*x/2},a:0,b:1}],{lin:[[0,1,1,1,'fino'],[1,1,1,0,'fino']],pts:[[Math.sqrt(3)-1,Math.sqrt(3)-1]]}),
  // C14: regras de derivação
  'C14.r1':graf(-0.4,2.6,-0.3,3.3,[{f:function(x){return x*x*x/4+0.5}}],{lin:[[1,0.75,2,2.5,'tr2'],[1,0.75,2,0.75,'dash'],[2,0.75,2,2.5,'tr']],pts:[[1,0.75],[2,2.5]]}),
  'C14.r2':graf(0,4,-0.3,3.4,[{f:function(x){return 0.35*x+0.3},c:'cv2'},{f:function(x){return 0.6+0.45*Math.sin(2*x)},c:'fino'},{f:function(x){return 0.35*x+0.9+0.45*Math.sin(2*x)}}]),
  'C14.r3':'<rect x="30" y="26" width="64" height="40" class="cx"/><rect x="30" y="12" width="88" height="14" class="ar"/><rect x="94" y="26" width="24" height="40" class="ar"/><path d="M30 26H118M94 26V66" class="tr"/><path d="M30 12H118V66H94" class="fino"/>',
  'C14.r4':graf(-0.5,3,-0.4,3.6,[{f:function(x){return 2-(x-1)*(x-1)/2},a:-0.4,b:2.9}],{faixa:[[1,3]],lin:[[1,0,1,2,'dash']],pts:[[1,2]]}),
  'C14.r5':tx('(xⁿ)′ = nxⁿ⁻¹',24),
  // C15: derivadas das elementares
  'C15.r1':'<ellipse cx="32" cy="40" rx="15" ry="8" class="cx"/><ellipse cx="56" cy="40" rx="15" ry="8" class="cv"/><ellipse cx="80" cy="40" rx="15" ry="8" class="cv"/><ellipse cx="104" cy="40" rx="15" ry="8" class="cv"/><ellipse cx="128" cy="40" rx="15" ry="8" class="cv"/>',
  'C15.r2':graf(-2.5,1.7,-0.4,4.2,[{f:Math.exp},{f:function(x){return 1+x},a:-1.6,b:1.4,c:'cv2'}],{pts:[[0,1]]}),
  'C15.r3':graf(-0.2,4.6,-1.7,1.9,[{f:Math.log,a:0.12}],{lin:[[0.25,Math.log(0.5)-0.5,0.75,Math.log(0.5)+0.5,'tr2'],[0.55,-0.45,1.45,0.45,'tr2'],[1.2,Math.log(2)-0.4,2.8,Math.log(2)+0.4,'tr2']],pts:[[0.5,Math.log(0.5)],[1,0],[2,Math.log(2)]]}),
  'C15.r4':graf(-0.3,6.6,-1.4,1.4,[{f:Math.sin},{f:Math.cos,c:'dash'}],{lin:[[0.2,Math.sin(1)-0.8*Math.cos(1),1.8,Math.sin(1)+0.8*Math.cos(1),'tr2']],pts:[[1,Math.sin(1)],[1,Math.cos(1),'ab']]}),
  'C15.r5':graf(-4.4,4.4,-3,3,[{f:Math.tan,a:-4.4,b:-1.65},{f:Math.tan,a:-1.49,b:1.49},{f:Math.tan,a:1.65,b:4.4}],{lin:[[-Math.PI/2,-3,-Math.PI/2,3,'dash'],[Math.PI/2,-3,Math.PI/2,3,'dash']]}),
  // C16: regra da cadeia
  'C16.r1':(function(){var g=function(x){return x*x*Math.sin(1/x)},p=[];for(var k=1;k<=4;k++){p.push([1/(k*Math.PI),0]);p.push([-1/(k*Math.PI),0])}
    return graf(-0.37,0.37,-0.15,0.15,[{f:function(x){return x*x},c:'dash'},{f:function(x){return -x*x},c:'dash'},{f:g,a:-0.37,b:-0.01},{f:g,a:0.01,b:0.37}],{pts:p})})(),
  'C16.r2':graf(-0.2,2.8,-0.2,2.4,[{f:function(x){return x*x/2},a:0,b:2.15},{f:function(x){return x-0.5},a:0.4,b:2.4,c:'fino'}],{lin:[[1,0.5,2,0.5,'dash'],[2,0.5,2,1.5,'tr'],[2,1.5,2,2,'tr2']],pts:[[1,0.5],[2,2]]}),
  'C16.r3':(function(){var s='<path d="M16 66H72M16 66V16M92 66H148M92 66V16" class="ex"/>',d='M16 66',c='';
    for(var k=0;k<=40;k++){var x=k/40,X=(16+52*x).toFixed(1),Y=(66-24*2*x*x*x).toFixed(1);d+='L'+X+' '+Y;c+=(k?'L':'M')+X+' '+Y}
    s+='<path d="'+d+'L68 66Z" class="ar"/><path d="'+c+'" class="cv"/><path d="M92 66L144 42V66Z" class="ar"/><path d="M92 66L144 42" class="cv2"/><text x="80" y="54" text-anchor="middle" class="rt">=</text>';return s})(),
  // C17: derivada da inversa
  'C17.r1':graf(-2.4,2.4,-1.1,1.1,[{f:function(x){return x},c:'dash'},{f:function(x){return x*x*x},a:-1.04,b:1.04},{f:Math.cbrt,c:'cv2'}],{lin:[[-0.7,0,0.7,0,'tr'],[0,-0.7,0,0.7,'tr2']],pts:[[0,0]]}),
  'C17.r2':graf(-0.4,4.4,-0.5,4.6,[{f:function(x){return 4*x-x*x},a:0,b:4}],{lin:[[-0.4,3,4.4,3,'dash']],pts:[[1,3],[3,3]]}),
  'C17.r3':graf(-0.4,3.2,-0.6,7.2,[{f:function(x){return x*x},a:0,b:2.7}],{lin:[[1.5,0,1.5,2.25,'dash'],[1.5,2.25,0,2.25,'dash'],[2.5,0,2.5,6.25,'dash'],[2.5,6.25,0,6.25,'dash'],[1.5,0,2.5,0,'grosso'],[0,2.25,0,6.25,'grosso']],pts:[[2,4]]}),
  'C17.r4':graf(-0.4,7,-0.3,4.6,[{f:function(x){return x},c:'dash'},{f:function(x){return x*x},a:0,b:2.14},{f:Math.sqrt,a:0,c:'cv2'}],{lin:[[0.8,0.4,2.13,4.39,'tr'],[0.4,0.8,4.39,2.13,'tr2']],pts:[[1,1],[2,4],[4,2]]}),
  'C17.r5':graf(-0.2,2.1,-0.3,2.9,[{f:function(x){return Math.pow(x,x)},a:0.004,b:1.78}],{pts:[[0,1,'ab'],[1/Math.E,Math.exp(-1/Math.E)]]}),
  // C18: linearização e Newton
  'C18.r1':graf(-0.5,17,-0.3,5.4,[{f:Math.sqrt,a:0},{f:function(x){return 2+(x-4)/4},a:0,b:17,c:'cv2'}],{lin:[[16,4,16,5,'tr']],pts:[[4,2]]}),
  'C18.r2':graf(3.6,10.4,-0.45,0.45,[{f:function(x){return (x-4)*(x-4)/64},a:4,c:'dash'},{f:function(x){return -(x-4)*(x-4)/64},a:4,c:'dash'},{f:function(x){return Math.sqrt(x)-2-(x-4)/4},a:4}],{pts:[[4,0]]}),
  'C18.r3':graf(0.75,2.1,-1.25,1.0,[{f:function(x){return x*x-2}}],{lin:[[1,0,1,-1,'dash'],[1,-1,1.5,0,'tr2'],[1.5,0,1.5,0.25,'dash'],[1.5,0.25,17/12,0,'tr2']],pts:[[1,-1],[1.5,0.25],[Math.SQRT2,0,'ab']]}),
  'C18.r4':(function(){var r=0.6823278,nw=[1,0.75,0.686047,0.6823404,0.68232780382],pn=[],pb=[],l=[];
    for(var n=0;n<=4;n++){pn.push([n,Math.log10(Math.max(Math.abs(nw[n]-r),1e-10)),'ab']);pb.push([n,-0.301*n])}
    for(n=0;n<4;n++)l.push([pn[n][0],pn[n][1],pn[n+1][0],pn[n+1][1],'tr2']);
    return graf(-0.3,4.6,-10.8,0.6,[{f:function(x){return -0.301*x},a:0,b:4}],{lin:l,pts:pb.concat(pn)})})(),
  'C18.r5':graf(-2.2,1.8,-1,3.2,[{f:function(x){return x*x*x-2*x+2}}],{lin:[[-0.15,2.3,1.15,-0.3,'tr2'],[-0.15,-0.15,1.15,1.15,'tr2'],[1,0,1,1,'dash']],pts:[[0,2],[1,1],[0,0,'ab'],[1,0,'ab']]}),
  // C19: L'Hospital
  'C19.r1':graf(0.1,2.2,-1.2,3.2,[{f:Math.log,a:0.15},{f:function(x){return x*x-1},c:'cv2'}],{pts:[[1,0]]}),
  'C19.r2':graf(-0.35,2.13,-0.08,1.08,[{f:function(x){return Math.pow(x,1.5)},a:0,b:1}],{lin:[[0,0,1,1,'dash'],[0.1,0.1-4/27,0.85,0.85-4/27,'tr2']],pts:[[1,1],[4/9,8/27]]}),
  'C19.r3':graf(0.4,3.6,-0.4,2.0,[{f:function(x){return (x-1)*(3.4-x)/2},a:1,b:3.4}],{lin:[[1,1.5,1,0.2,'dash']],pts:[[1,1.5],[1,0,'ab']]}),
  'C19.r4':graf(-0.3,6,-1.3,5.5,[{f:Math.exp,c:'cv2'},{f:Math.sqrt,a:0},{f:Math.log,a:0.2,c:'dash'}])
});
// Lote F
Object.assign(F,{
  // C20: Fermat, Rolle, TVM, consequencias
  'C20.r1':graf(-2,2,-0.5,3.6,[{f:function(x){return 3-x*x}}],{lin:[[-1,3,1,3,'tr2']],pts:[[0,3]]}),
  'C20.r2':(function(){var f=function(x){return 1.4+0.9*Math.sin(2*Math.PI*x/3)};
    return graf(-0.3,3.3,-0.2,2.6,[{f:f,a:0,b:3}],{lin:[[0,1.4,3,1.4,'dash'],[0.4,2.3,1.1,2.3,'tr2'],[1.9,0.5,2.6,0.5,'tr2']],pts:[[0,1.4],[3,1.4],[0.75,2.3,'ab'],[2.25,0.5,'ab']]})})(),
  'C20.r3':graf(-0.3,4.3,-0.3,2.4,[{f:Math.sqrt,a:0,b:4}],{lin:[[0,0,4,2,'dash'],[1,0.5,1,1,'tr2']],pts:[[0,0],[4,2],[1,1,'ab']]}),
  'C20.r4':(function(){var f=function(x){return 0.3+0.35*x+0.45*Math.sin(1.5*x)},g=function(x){return f(x)+1.3};
    return graf(-0.3,4.3,-0.3,3.2,[{f:f,a:0,b:4.2},{f:g,a:0,b:4.2,c:'cv2'}],{lin:[[1,f(1),1,g(1),'dash'],[3,f(3),3,g(3),'dash']]})})(),
  // C21: concavidade
  'C21.r1':graf(-0.3,2.3,-0.3,4.4,[{f:function(x){return x*x},a:0,b:2.1}],{lin:[[0.25,0,0.75,0.5,'tr2'],[0.75,0.5,1.25,1.5,'tr2'],[1.25,1.5,1.75,3,'tr2']],pts:[[0.5,0.25],[1,1],[1.5,2.25]]}),
  'C21.r2':graf(-0.3,2.3,-2.9,2.6,[{f:function(x){return x*x*x-3*x},a:0,b:2.25},{f:function(x){return -1.375-2.25*(x-0.5)},a:-0.1,b:1.1,c:'dash'}],{lin:[[0.9,-2.275,0.9,0.729-2.7,'tr2']],pts:[[0.5,-1.375]]}),
  'C21.r3':graf(-1.7,1.7,-2,2,[{f:function(x){return x*x*x-x}},{f:function(x){return -x},a:-1.2,b:1.2,c:'dash'}],{pts:[[0,0]]}),
  'C21.r4':graf(0.2,6,0.1,3,[{f:function(x){return 0.6*(x-1.6)*(x-1.6)+0.6},a:0.4,b:2.8},{f:function(x){return 2.5-0.6*(x-4.6)*(x-4.6)},a:3.4,b:5.8,c:'cv2'}],{lin:[[1.1,0.6,2.1,0.6,'tr2'],[4.1,2.5,5.1,2.5,'tr2']],pts:[[1.6,0.6],[4.6,2.5]]}),
  // C22: otimizacao
  'C22.r1':(function(){var f=function(x){return x*x*x-9*x*x+24*x};
    return graf(-0.6,6.6,-3,39,[{f:f,a:0,b:6}],{lin:[[6,0,6,36,'dash']],pts:[[0,0],[2,20,'ab'],[4,16,'ab'],[6,36]]})})(),
  'C22.r2':graf(-0.5,12.5,-150,1500,[{f:function(x){return 2*Math.PI*x*x+500*Math.PI/x},a:1.15,b:12}],{pts:[[5,150*Math.PI]],tx:[[2.2,200,'−'],[8.5,200,'+']]}),
  'C22.r3':graf(-0.3,4.2,-0.2,1.8,[{f:Math.sqrt,a:0,b:4.2}],{pts:[[2,0],[1.5,Math.sqrt(1.5)]],lin:[[2,0,1.5,Math.sqrt(1.5),'tr2']]})+'<path d="M39.3 65.6A42.3 42.3 0 0 1 123.9 65.6" class="dash"/>',
  'C22.r4':'<path d="M12 66H148" class="grosso"/><path d="M110 66V30" class="dash"/><path d="M20 21L110 66L140 51" class="cv"/><circle cx="20" cy="21" r="3.2" class="pt"/><circle cx="140" cy="51" r="3.2" class="pt"/>',
  // C25: teorema fundamental
  'C25.r1':(function(){var s='<rect x="58" y="12" width="44" height="55" class="dash"/>';
    for(var i=1;i<=4;i++)s+='<rect x="'+(58+11*(i-1))+'" y="'+(67-11*i)+'" width="11" height="'+(11*i)+'" class="cx"/>';return s})(),
  'C25.r2':graf(-0.2,2.2,-0.3,1.3,[],{lin:[[0,1,2,1,'dash']],pts:[[0.2,1],[0.65,1],[1.1,1],[1.55,1],[2,1],[0.42,0,'ab'],[0.88,0,'ab'],[1.32,0,'ab'],[1.78,0,'ab']]}),
  'C25.r3':graf(-0.3,2.3,-0.3,4.3,[{f:function(x){return x*x},a:0,b:2.1}],{area:[0,2],lin:[[0,4/3,2,4/3,'tr2'],[2,0,2,4/3,'dash']],pts:[[2/Math.sqrt(3),4/3]]}),
  'C25.r4':(function(){var x0=-0.2,x1=2.2,y0=-0.3,y1=4.6,X=function(x){return 8+(x-x0)/(x1-x0)*144},Y=function(y){return 72-(y-y0)/(y1-y0)*64},s='',p=[];
    for(var i=0;i<4;i++){var a=i/2,b=a+0.5,h=(b*b*b-a*a*a)/3/0.5,c=Math.sqrt(h);
      s+='<rect x="'+X(a).toFixed(1)+'" y="'+Y(h).toFixed(1)+'" width="'+(X(b)-X(a)).toFixed(1)+'" height="'+(Y(0)-Y(h)).toFixed(1)+'" class="cx"/>';p.push([c,h])}
    return s+graf(x0,x1,y0,y1,[{f:function(x){return x*x},a:0,b:2.15}],{pts:p})})(),
  'C25.r5':(function(){var f=function(x){return 1+x*x/3},x0=-0.2,x1=3,y0=-0.3,y1=3.6,X=function(x){return 8+(x-x0)/(x1-x0)*144},Y=function(y){return 72-(y-y0)/(y1-y0)*64};
    return graf(x0,x1,y0,y1,[{f:f,a:0,b:2.9}],{area:[0.3,1.6],tx:[[0.75,0.6,'A']]})+'<rect x="'+X(1.6).toFixed(1)+'" y="'+Y(f(1.75)).toFixed(1)+'" width="'+(X(1.9)-X(1.6)).toFixed(1)+'" height="'+(Y(0)-Y(f(1.75))).toFixed(1)+'" class="cx"/>'})(),
  // C26: integracao por partes
  'C26.r1':'<path d="M20 8V70M12 70H150" class="ex"/><path d="M40 58C70 56 100 40 130 16V70H40Z" class="ar"/><path d="M40 58C70 56 100 40 130 16H20V58Z" class="cx"/><path d="M40 58C70 56 100 40 130 16" class="cv"/>',
  'C26.r2':tx('I',26)+'<path d="M88.9 17.6A26 26 0 1 0 104.4 33.1" class="cv"/><path d="M110.2 37.4L104.4 33.1L102.7 40.1" class="cv"/>',
  'C26.r3':'<path d="M22 26H56V44H90V62H124" class="cv"/><path d="M56 26V44M90 44V62" class="dash"/><circle cx="56" cy="44" r="3.2" class="pt"/><circle cx="90" cy="62" r="3.2" class="pt"/><text x="30" y="20" class="rt">I₂</text><text x="64" y="38" class="rt">I₁</text><text x="98" y="56" class="rt">I₀</text>',
  'C26.r4':(function(){var p=function(n){return function(x){return Math.pow(Math.sin(x),n)}};
    return graf(-0.1,1.7,-0.1,1.15,[{f:p(1),a:0,b:Math.PI/2},{f:p(2),a:0,b:Math.PI/2,c:'fino'},{f:p(4),a:0,b:Math.PI/2,c:'fino'},{f:p(8),a:0,b:Math.PI/2,c:'cv2'}],{area:[0,Math.PI/2,p(8)],lin:[[Math.PI/2,0,Math.PI/2,1,'dash']]})})(),
  // C27: ortogonalidade e valor eficaz
  'C27.r1':(function(){var f=function(x){return 1.5+Math.sin(x)+0.4*Math.cos(2*x)};
    return graf(-0.3,9.6,-0.3,3.2,[{f:f,a:0,b:9.5}],{area:[1.5,1.5+2*Math.PI,f],lin:[[0,1.5,9.5,1.5,'tr2']]})})(),
  'C27.r2':(function(){var f=function(x){return Math.sin(2*x)*Math.sin(3*x)};
    return graf(-0.3,6.6,-1.2,1.2,[{f:f,a:0,b:2*Math.PI}],{area:[0,2*Math.PI,f]})})(),
  'C27.r3':(function(){var f=function(x){return Math.pow(Math.sin(x),2)};
    return graf(-0.3,6.6,-1.15,1.15,[{f:Math.sin,a:0,b:2*Math.PI,c:'fino'},{f:f,a:0,b:2*Math.PI}],{area:[0,2*Math.PI,f],lin:[[0,0.5,2*Math.PI,0.5,'tr2']]})})(),
  'C27.r4':graf(-3.3,3.3,-3.8,3.8,[{f:function(x){return 3*Math.sin(x)-Math.sin(2*x)+0.5*Math.sin(3*x)},a:-Math.PI,b:Math.PI},{f:function(x){return -Math.sin(2*x)},a:-Math.PI,b:Math.PI,c:'dash'}]),
  // C29: fracoes parciais
  'C29.r1':graf(-2.2,2.6,-1.2,2.6,[{f:function(x){return 0.7*(x+1)*(x-1.5)},a:-2,b:2.5,c:'dash'}],{lin:[[-2,0,2.4,0,'tr2']],pts:[[-1,0],[0.3,0],[1.5,0]]}),
  'C29.r2':graf(-3,3,-3,3,[{f:function(x){return 1/(x*x-1)},a:-3,b:-1.03},{f:function(x){return 1/(x*x-1)},a:-0.97,b:0.97},{f:function(x){return 1/(x*x-1)},a:1.03,b:3}],{lin:[[-1,-3,-1,3,'dash'],[1,-3,1,3,'dash']]}),
  'C29.r3':graf(-1.5,3.5,-0.8,4,[{f:function(x){return 0.6/((x-1)*(x-1))},a:-1.5,b:0.95},{f:function(x){return 0.6/((x-1)*(x-1))},a:1.05,b:3.5}],{lin:[[1,-0.8,1,4,'dash']]}),
  'C29.r4':graf(-2.4,2.4,-2.2,4.2,[{f:function(x){return x*x+1}},{f:function(x){return x},c:'cv2'}],{pts:[[0,0]]}),
  // C31: volumes
  'C31.r1':'<path d="M16 40H146" class="ex"/><path d="M24 40L130 10M24 40L130 70" class="cv"/><ellipse cx="130" cy="40" rx="7" ry="30" class="cx"/><ellipse cx="86" cy="40" rx="5" ry="17.5" class="tr2"/>',
  'C31.r2':'<path d="M14 68A30 30 0 0 1 74 68Z" class="cx"/><rect x="90" y="38" width="60" height="30" class="cx"/><path d="M90 38L120 68L150 38" class="dash"/><path d="M18 53H70M90 53H150" class="tr2"/>',
  'C31.r3':'<path d="M38 18V62A42 9 0 0 0 122 62V18" class="cx"/><ellipse cx="80" cy="18" rx="42" ry="9" class="cx"/><ellipse cx="80" cy="18" rx="32" ry="6.5" class="cv"/><path d="M48 18V58M112 18V58" class="dash"/>',
  'C31.r4':(function(){var x0=-0.3,x1=2.5,y0=-0.3,y1=4.4,X=function(x){return 8+(x-x0)/(x1-x0)*144},Y=function(y){return 72-(y-y0)/(y1-y0)*64};
    var r=function(a,b,c,d,k){return '<rect x="'+X(a).toFixed(1)+'" y="'+Y(d).toFixed(1)+'" width="'+(X(b)-X(a)).toFixed(1)+'" height="'+(Y(c)-Y(d)).toFixed(1)+'" class="'+k+'"/>'};
    return graf(x0,x1,y0,y1,[{f:function(x){return x*x},a:0.8,b:2.1}],{area:[1,2],lin:[[2,0,2,4,'fino']]})+r(1.42,1.52,0,1.42*1.42,'cx')+r(Math.sqrt(3),2,3,3.25,'tr2')})(),
  // C32: comprimento de arco
  'C32.r1':graf(0.1,4,0.1,2.6,[{f:function(x){return 0.4+0.15*x*x},a:0.3,b:3.9}],{lin:[[1,0.55,3,1.75,'tr2'],[1,0.55,3,0.55,'dash'],[3,0.55,3,1.75,'dash']],pts:[[1,0.55],[3,1.75]],tx:[[1.6,0.25,'Δx'],[3.15,1.05,'Δy']]}),
  'C32.r2':(function(){var f=function(x){return 0.4+1.5*Math.sin(Math.PI*x/3.6)+0.15*x};
    return graf(0.1,3.8,0.1,2.4,[{f:f,a:0.3,b:3.5}],{lin:[[0.3,f(0.3),3.5,f(3.5),'tr2']],pts:[[0.3,f(0.3)],[3.5,f(3.5)]]})})(),
  'C32.r3':'<circle cx="80" cy="44" r="28" class="cx"/><path d="M60.2 24.2L80 44L99.8 24.2" class="dash"/><path d="M60.2 24.2A28 28 0 0 1 99.8 24.2" class="cv"/>',
  // C33: integrais improprias
  'C33.r1':graf(-0.2,4.4,-0.2,2.4,[{f:function(x){return 1/Math.sqrt(x)},a:0.15,c:'fino'},{f:function(x){return 1/x},a:0.38},{f:function(x){return 1/(x*x)},a:0.6,c:'cv2'}],{lin:[[1,-0.2,1,2.4,'dash']]}),
  'C33.r2':graf(-0.3,9.2,-0.15,1.3,[{f:function(x){return 1-1/x},a:1,b:9}],{lin:[[-0.3,1,9.2,1,'dash']],pts:[[1,0]]}),
  'C33.r3':graf(-0.2,6.4,-0.1,1.1,[{f:function(x){return Math.exp(-x)},a:0},{f:function(x){return x*Math.exp(-x)},a:0,c:'cv2'}],{area:[0,6.4,function(x){return x*Math.exp(-x)}]})
});
})(window.FIG_AUX);
