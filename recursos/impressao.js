// Impressão sob demanda (docs/planejamento-impressao.md, aprovado em 13/11/2026): o botão "Imprimir" da barra comum, a tecla P e
// Ctrl+P / Cmd+P abrem um painel com as opções da página e a prévia das folhas; "Imprimir…" abre a janela do navegador (papel ou
// "Salvar como PDF"). Nada é gerado na montagem: a folha sai da própria página, na hora. Três tipos de página: lista, aula, módulo
// (base e complementar; o B00, de marcar, fica sem impressão).
// Pelo menu do navegador (Arquivo › Imprimir), sem o painel, sai a última escolha (ou o padrão).
// ?imprimir=1 aplica as opções do endereço ao abrir (por exemplo &o=res&q=todas&esp=0&cor=claro na lista; &o=sec&por=4&sv=junto na aula;
// &partes=rev,ex&resp=fim no módulo), para a conferência no Chrome sem janela (--print-to-pdf); ?imprimir=painel abre o painel.
(function(){
  var raiz=document.documentElement,body=document.body,par=new URLSearchParams(location.search);
  var tipo=document.querySelector('main.aula')?'aula':body.classList.contains('pag-base')&&!document.querySelector('.auto-item')?'modulo':
    body.classList.contains('pag-lista')&&!body.classList.contains('pag-base')?'lista':null;
  function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function txt(s){return ((document.querySelector(s)||{}).textContent||'').replace(/\s+/g,' ').trim()}
  function todos(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  var MM=96/25.4;  // px por milímetro na impressão
  var CORES={nome:'cor',rotulo:'Cores',ops:[['claro','Fundo branco, cores do modo claro'],['cinza','Tons de cinza'],['tela','Como na tela (no escuro, gasta mais tinta)']]};
  function plural(n,um,varios){return n+' '+(n===1?um:varios)}
  function chaveFeitas(){return Memoria.chave('feita')+':'+location.pathname.split('/').slice(-2).join('/').replace(/\.html$/,'')}
  // Folhas da prévia das páginas que rolam (lista e módulo): blocos com altura estimada em px de impressão, postos em A4 de pé
  // (251 mm de texto). Um bloco que não cabe no resto da folha começa na seguinte; o maior que uma folha continua.
  // corrido: o bloco se parte entre as folhas (as partes do módulo); sem ele, começa na folha seguinte (a questão da lista, que não quebra).
  function distribuir(blocos,cab,corrido){var pag=251*MM,folhas=[[]],livre=pag-cab*MM;
    blocos.forEach(function(b){if(!corrido&&b.h>livre&&folhas[folhas.length-1].length&&b.h<=pag){folhas.push([]);livre=pag}
      folhas[folhas.length-1].push(b.rot);livre-=b.h;while(livre<0){folhas.push([b.rot+' (cont.)']);livre+=pag}});return folhas}
  // A altura de um elemento da tela levada à largura da folha (A4 de pé, 180 mm): o texto mais estreito ocupa mais linhas.
  function fatorLargura(){var m=document.querySelector('main'),w=m?m.clientWidth:900;return Math.max(1,w/(180*MM))}
  function abrirDetalhes(sel){return todos(sel).map(function(d){var a=d.open;d.open=true;return [d,a]})}
  function voltarDetalhes(l){(l||[]).forEach(function(x){x[0].open=x[1]})}

  // ── Lista: a própria página, com uma folha de estilos de impressão (impressao.css) e classes no <html>.
  var LISTA={
    titulo:'Lista',retrato:true,
    cabecalho:function(){return txt('.cab-lista .cod')+' · '+txt('.cab-lista h1')},
    padrao:{o:'gab',q:'todas',esp:'0',cor:'claro'},
    campos:[
      {nome:'o',rotulo:'O que sai',ops:[['enun','Só os enunciados'],['gab','Enunciados e gabarito curto'],['res','Com a resolução passo a passo']]},
      {nome:'q',rotulo:'Questões',ops:[['todas','Todas'],['naofeitas','Só as que ainda não marquei como feitas']]},
      {nome:'esp',rotulo:'Espaço para responder',ops:[['0','Nenhum'],['1','Algumas linhas'],['2','Meia folha']]},CORES],
    questoes:function(op){var f=Memoria.lerJSON(chaveFeitas(),{});
      return todos('main .questao').filter(function(q){return op.q!=='naofeitas'||!f[q.id]})},
    estimar:function(op){var qs=this.questoes(op),fator=fatorLargura(),ab=abrirDetalhes('details.gab');
      var blocos=qs.map(function(q){var h=0;todos(':scope>h2,:scope>.enun',q).forEach(function(x){h+=x.offsetHeight});
        if(op.o!=='enun'){var g=q.querySelector('.gab-corpo');if(g)h+=g.offsetHeight+8}
        h=h*fator+7*MM;
        if(op.o==='res')h+=Math.ceil(q.querySelectorAll('.resol .quadro').length/2)*(49.5+4)*MM;
        h+={'0':0,'1':25,'2':130}[op.esp]*MM;return {h:h,rot:q.id.replace('q','Q')}});
      voltarDetalhes(ab);
      var folhas=distribuir(blocos,30),ROT={enun:'só enunciados',gab:'com gabarito curto',res:'com a resolução passo a passo'};
      return {resumo:'<b>'+plural(qs.length,'questão','questões')+'</b> · '+ROT[op.o]+' · cerca de <b>'+plural(folhas.length,'folha','folhas')+'</b>',folhas:folhas}},
    preparar:function(op){var f=Memoria.lerJSON(chaveFeitas(),{});
      todos('main .questao').forEach(function(q){q.classList.toggle('imp-fora',op.q==='naofeitas'&&!!f[q.id])});
      this.abertos=op.o!=='enun'?abrirDetalhes('main details.gab'):[];
      // Questões recolhidas na tela saem inteiras no papel.
      this.recolhidas=todos('main .questao.rq-fechada');this.recolhidas.forEach(function(q){q.classList.remove('rq-fechada')})},
    desfazer:function(){voltarDetalhes(this.abertos);this.abertos=null;
      (this.recolhidas||[]).forEach(function(q){q.classList.add('rq-fechada')});this.recolhidas=null;
      todos('.imp-fora').forEach(function(q){q.classList.remove('imp-fora')})}
  };

  // ── Aula: os quadros escolhidos saem da aula para folhas montadas na hora (uma .imp-f por página, com 1, 2, 3, 4 ou 6 quadros) e
  // voltam ao lugar depois. O número de folhas da prévia é o que sai. O quadro é medido em cqw, então cabe em qualquer largura.
  var LAYOUT={'1':{pais:1,col:1,lin:1},'2':{pais:0,col:1,lin:2},'3a':{pais:0,col:1,lin:3,linhas:1},'4':{pais:1,col:2,lin:2},'6':{pais:1,col:3,lin:2}};
  var AULA={
    titulo:'Aula',
    retrato:function(op){return !LAYOUT[op.por].pais},
    cabecalho:function(){var c=txt('header.topo .caminho [aria-current]').split(' · ');return document.title+(c[1]?' · '+c[1]:'')},
    padrao:{o:'sec',por:'4',sv:'junto',cor:'claro',de:'1',ate:'12'},
    campos:[
      {nome:'o',rotulo:'O que sai',ops:[['tudo','A aula inteira'],['sec','Esta seção'],['faixa','Os quadros']],faixa:true},
      {nome:'por',rotulo:'Quadros por folha',ops:[['1','1, folha deitada'],['2','2'],['3a','3, com linhas para anotar'],['4','4, folha deitada'],['6','6, folha deitada']]},
      {nome:'sv',rotulo:'"Sua vez"',ops:[['junto','Com o gabarito logo depois, como na aula'],['fim','Gabaritos no fim, para tentar antes']]},CORES],
    quadros:function(){var s=0;return todos('main.aula > .quadro, #imp-folhas .quadro').map(function(q){
      if(q.classList.contains('divisor')){var m=((q.querySelector('.ses')||{}).textContent||'').match(/Seção (\d+)/);s=m?+m[1]:s+1}
      return {q:q,n:q.dataset.n||'',sec:s,gab:q.classList.contains('gabarito')}})},
    escolher:function(op){var l=this.quadros(),at=l.filter(function(x){return x.q.classList.contains('ativo')})[0]||l[0],sel;
      if(op.o==='sec')sel=l.filter(function(x){return x.sec===at.sec});
      else if(op.o==='faixa'){var a=Math.min(+op.de||1,+op.ate||1),b=Math.max(+op.de||1,+op.ate||1);
        sel=l.filter(function(x,k){var n=x.n?+x.n:(l.slice(k).filter(function(y){return y.n})[0]||{n:0}).n;return +n>=a&&+n<=b})}
      else sel=l;
      return op.sv==='fim'?[sel.filter(function(x){return !x.gab}),sel.filter(function(x){return x.gab})]:[sel,[]]},
    folhas:function(op){var g=this.escolher(op),L=LAYOUT[op.por],por=L.col*L.lin,f=[];
      g.forEach(function(lista,k){for(var j=0;j<lista.length;j+=por)f.push({gab:k===1,qs:lista.slice(j,j+por)})});return f},
    estimar:function(op){var f=this.folhas(op),n=0,g=0;f.forEach(function(x){n+=x.qs.length;if(x.gab)g+=x.qs.length});
      var a=f.length?f[0].qs[0]:null,rot=function(x){return x.n?String(x.n):'abertura'};
      var nums=[].concat.apply([],f.map(function(x){return x.qs})).filter(function(x){return x.n}).map(function(x){return +x.n});
      var faixa=nums.length?' ('+Math.min.apply(null,nums)+' a '+Math.max.apply(null,nums)+')':'';
      return {resumo:'<b>'+plural(n,'quadro','quadros')+'</b>'+faixa+' · '+(op.por==='3a'?'3 por folha, com linhas':op.por+' por folha')+' · <b>'+
          plural(f.length,'folha','folhas')+'</b>'+(g?' (as últimas com os '+plural(g,'gabarito','gabaritos')+')':''),
        folhas:f.map(function(x){return x.qs.map(rot)})}},
    preparar:function(op){var L=LAYOUT[op.por],cx=document.createElement('div');cx.id='imp-folhas';this.lugares=[];var self=this;
      this.folhas(op).forEach(function(f){var fo=document.createElement('div');fo.className='imp-f';fo.dataset.col=L.col;fo.dataset.lin=L.lin;if(L.linhas)fo.dataset.linhas=1;
        if(L.pais)fo.dataset.pais=1;
        f.qs.forEach(function(x){var c=document.createElement('div');c.className='imp-c';var m=document.createComment('imp');x.q.parentNode.insertBefore(m,x.q);
          self.lugares.push([x.q,m]);c.appendChild(x.q);
          if(x.q.querySelector('.anima'))c.appendChild(el('<span class="imp-anima">Animação no site; aqui, no estado da visão geral.</span>'));
          if(L.linhas)c.appendChild(el('<div class="imp-linhas" aria-hidden="true"></div>'));fo.appendChild(c)});
        cx.appendChild(fo)});
      body.appendChild(cx)},
    desfazer:function(){(this.lugares||[]).forEach(function(x){x[1].parentNode.insertBefore(x[0],x[1]);x[1].remove()});this.lugares=null;
      var cx=document.getElementById('imp-folhas');if(cx)cx.remove()}
  };

  // ── Módulo (base e complementar): a própria página, com as partes escolhidas; a revisão em quadros, dois por linha.
  var comp=body.classList.contains('pag-comp');
  var PARTES=[['intro',comp?'De onde vem':'Onde você vai usar isto e Teste rápido',['#onde','#teste']],['rev',comp?'Demonstrações':'Revisão',['#revisao']],
    ['pq','Por que vale?',['#porquevale']],['erros',comp?'Onde está o erro?':'Erros comuns',['#erros']],['ex',comp?'Desafios':'Exercícios',['#exercicios','#leitura']]]
    .filter(function(p){return p[2].some(function(s){return document.querySelector(s)})});
  var MODULO={
    titulo:'Módulo',retrato:true,
    cabecalho:function(){return txt('.cab-lista .cod')+' · '+txt('.cab-lista h1')},
    padrao:{partes:PARTES.map(function(p){return p[0]}).join(','),resp:'fim',cor:'claro'},
    campos:[
      {nome:'partes',rotulo:'Partes',multi:true,ops:PARTES.map(function(p){return [p[0],p[1]]})},
      {nome:'resp',rotulo:'Respostas dos '+(comp?'desafios':'exercícios'),ops:[['fim','No fim, separadas'],['junto','Logo depois de cada um'],['sem','Sem respostas']]},CORES],
    secoes:function(op){var q=(op.partes||'').split(',');return PARTES.filter(function(p){return q.indexOf(p[0])>=0})},
    estimar:function(op){var fator=fatorLargura(),blocos=[],ab=op.resp!=='sem'?abrirDetalhes('main details.gab'):[];
      this.secoes(op).forEach(function(p){p[2].forEach(function(s){var e=document.querySelector(s);if(!e)return;
        // Questões medidas como na lista (título, enunciado e gabarito): o cartão, os botões e os espaços da tela não vão ao papel.
        var h=0;[].forEach.call(e.children,function(c){if(c.classList.contains('resol'))return;
          if(c.classList.contains('questao')){todos(':scope>h2,:scope>.enun',c).forEach(function(x){h+=x.offsetHeight});
            var g=c.querySelector('.gab-corpo');if(g&&op.resp!=='sem')h+=g.offsetHeight+8;h+=7*MM/fator;return}
          h+=c.offsetHeight});h=h*fator;
        // A revisão sai em quadros, dois por linha, com o título de cada parte.
        if(p[0]==='rev'||p[0]==='pq')h+=todos('.cartoes .cartao',e).length*12*MM+
          todos('.resol',e).reduce(function(a,r){return a+Math.ceil(r.querySelectorAll('.quadro').length/2)*(49.5+4)*MM},0);
        blocos.push({h:h,rot:p[1].split(' e ')[0]})})});
      voltarDetalhes(ab);
      if(op.res==='com'&&this.secoes(op).some(function(p){return p[0]==='ex'}))blocos.push({h:todos('#exercicios .resol').reduce(function(a,r){
        return a+Math.ceil(r.querySelectorAll('.quadro').length/2)*(49.5+4)*MM},0),rot:'Resoluções'});
      if(op.resp==='fim'&&this.secoes(op).some(function(p){return p[0]==='ex'}))blocos.push({h:todos('#exercicios details.gab').length*14*MM,rot:'Respostas'});
      // As partes correm de uma folha para a outra (14/11/2026: começando cada uma numa folha nova, o B15 previa 20 folhas e saíam 15).
      var folhas=distribuir(blocos,30,true),n=this.secoes(op).length;
      return {resumo:n?'<b>'+plural(n,'parte','partes')+'</b> · cerca de <b>'+plural(folhas.length,'folha','folhas')+'</b>':'Escolha ao menos uma parte.',folhas:n?folhas:[]}},
    preparar:function(op){var quer=this.secoes(op).map(function(p){return p[0]});
      PARTES.forEach(function(p){p[2].forEach(function(s){var e=document.querySelector(s);if(e)e.classList.toggle('imp-fora',quer.indexOf(p[0])<0)})});
      this.abertos=op.resp!=='sem'?abrirDetalhes('main details.gab'):[];this.movidos=[];
      this.recolhidas=todos('main .questao.rq-fechada');this.recolhidas.forEach(function(q){q.classList.remove('rq-fechada')});
      if(op.resp==='fim'&&quer.indexOf('ex')>=0){var ap=el('<section class="parte-base" id="imp-respostas"><h2>Respostas</h2></section>'),self=this;
        todos('#exercicios .questao').forEach(function(q){var g=q.querySelector('details.gab');if(!g)return;var m=document.createComment('imp');g.parentNode.insertBefore(m,g);
          self.movidos.push([g,m]);var b=el('<div class="imp-resp"><b></b></div>'),h=q.querySelector('h2'),nome='';
          // O nome ("Exercício 3"): só o texto do título, sem a seta de recolher, o nível e o "Marcar feita".
          if(h)[].forEach.call(h.childNodes,function(n){if(n.nodeType===3)nome+=n.textContent});b.firstChild.textContent=nome.trim();
          b.appendChild(g);ap.appendChild(b)});
        var main=document.querySelector('main'),rod=main.querySelector('footer');main.insertBefore(ap,rod||null)}},
    desfazer:function(){voltarDetalhes(this.abertos);this.abertos=null;
      (this.recolhidas||[]).forEach(function(q){q.classList.add('rq-fechada')});this.recolhidas=null;
      (this.movidos||[]).forEach(function(x){x[1].parentNode.insertBefore(x[0],x[1]);x[1].remove()});this.movidos=null;
      var ap=document.getElementById('imp-respostas');if(ap)ap.remove();todos('.imp-fora').forEach(function(e){e.classList.remove('imp-fora')})}
  };

  // Resolução liberada ou não (publicacao.txt, semresolucao, 13/11/2026): sem os quadros da resolução na página, a opção de
  // imprimi-la não aparece. No computador do professor (saida/), a página tem tudo, e as duas versões saem.
  if(!document.querySelector('main .questao .resol .quadro'))LISTA.campos[0].ops=LISTA.campos[0].ops.filter(function(o){return o[0]!=='res'});
  if(document.querySelector('#exercicios .resol .quadro')){
    MODULO.campos.splice(2,0,{nome:'res',rotulo:'Resolução passo a passo dos '+(comp?'desafios':'exercícios'),ops:[['sem','Não, só o gabarito'],['com','Sim, em quadros, dois por linha']]});
    MODULO.padrao.res='sem'}
  var T={lista:LISTA,aula:AULA,modulo:MODULO}[tipo];
  var botoes=document.querySelectorAll('[data-imprimir]');
  if(!T||!window.Memoria){[].forEach.call(botoes,function(b){b.remove()});return}
  var chave=Memoria.chave('impressao')+':'+tipo;
  function valido(c,v){if(v===null||v===undefined)return false;if(c.multi)return String(v).split(',').every(function(x){return !x||c.ops.some(function(o){return o[0]===x})});
    return c.ops.some(function(o){return o[0]===v})}
  function inicial(){var op={},g=Memoria.lerJSON(chave,{});
    T.campos.forEach(function(c){var v=par.get(c.nome);op[c.nome]=valido(c,v)?v:valido(c,g[c.nome])?g[c.nome]:T.padrao[c.nome]});
    ['de','ate'].forEach(function(k){if(T.padrao[k]!==undefined)op[k]=par.get(k)||g[k]||T.padrao[k]});return op}
  var op=inicial();

  // ── Painel: o mesmo molde do "Ir para" (ir-para.css), com opções à esquerda e a prévia à direita.
  function campoHTML(c){return '<fieldset><legend>'+c.rotulo+'</legend>'+c.ops.map(function(o){
      return '<label><input type="'+(c.multi?'checkbox':'radio')+'" name="'+c.nome+'" value="'+o[0]+'"> '+o[1]+'</label>'+
        (c.faixa&&o[0]==='faixa'?'<span class="imp-faixa">de <input type="number" name="de" min="1" inputmode="numeric" aria-label="Primeiro quadro"> a '+
          '<input type="number" name="ate" min="1" inputmode="numeric" aria-label="Último quadro"></span>':'')}).join('')+'</fieldset>'}
  var veu=el('<div class="ip-veu imp-veu" hidden><div class="ip imp" role="dialog" aria-modal="true" aria-labelledby="imp-tit"><header><h2 id="imp-tit">Imprimir · '+
    esc(T.titulo)+'</h2><kbd>P</kbd><button type="button" class="ip-fechar" aria-label="Fechar (Esc)" title="Fechar (Esc)">✕</button></header>'+
    '<div class="imp-corpo"><form class="imp-opc">'+T.campos.map(campoHTML).join('')+
    '<p class="imp-nota">Animações saem no estado da visão geral; todos os passos de cada quadro aparecem.</p></form>'+
    '<div class="imp-prev" aria-live="polite"><div class="imp-resumo"></div><div class="imp-folhas"></div></div></div>'+
    '<div class="imp-pe"><small>A folha é montada agora, pelo navegador. Na janela de impressão, escolha a impressora ou "Salvar como PDF".</small>'+
    '<button type="button" class="imp-cancelar">Cancelar</button><button type="button" class="imp-ok">Imprimir…</button></div></div></div>');
  body.appendChild(veu);
  var form=veu.querySelector('form'),volta=null;
  // A seção do quadro atual, no rótulo de "Esta seção".
  function rotuloSecao(){if(tipo!=='aula')return;var l=AULA.quadros(),at=l.filter(function(x){return x.q.classList.contains('ativo')})[0]||l[0];
    var nome=((l.filter(function(x){return x.sec===at.sec&&x.q.classList.contains('divisor')})[0]||{q:document}).q.querySelector('.ses')||{}).textContent||'';
    var r=form.querySelector('input[name=o][value=sec]');if(r)r.parentNode.lastChild.textContent=' Esta seção'+(nome?': '+nome.replace(/^Seção \d+ de \d+: /,''):'')}
  function marcar(){T.campos.forEach(function(c){var vs=String(op[c.nome]).split(',');
      todos('input[name="'+c.nome+'"]',form).forEach(function(r){r.checked=c.multi?vs.indexOf(r.value)>=0:r.value===op[c.nome]})});
    ['de','ate'].forEach(function(k){var i=form.querySelector('input[name='+k+']');if(i)i.value=op[k]})}
  function ler(){T.campos.forEach(function(c){if(c.multi){op[c.nome]=todos('input[name="'+c.nome+'"]:checked',form).map(function(r){return r.value}).join(',');return}
      var r=form.querySelector('input[name="'+c.nome+'"]:checked');if(r)op[c.nome]=r.value});
    ['de','ate'].forEach(function(k){var i=form.querySelector('input[name='+k+']');if(i)op[k]=i.value||op[k]})}
  marcar();
  function prever(){ler();var e=T.estimar(op),max=6,cinza=op.cor==='cinza'?' cinza':'',deit=typeof T.retrato==='function'&&!T.retrato(op)?' deitada':'';
    veu.querySelector('.imp-resumo').innerHTML=e.resumo;
    veu.querySelector('.imp-folhas').innerHTML=e.folhas.slice(0,max).map(function(f,k){return '<div class="imp-folha'+cinza+deit+'"><b>'+(k+1)+'</b>'+
      f.map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</div>'}).join('')+(e.folhas.length>max?'<span class="imp-mais">+ '+(e.folhas.length-max)+' folhas</span>':'')}
  form.addEventListener('change',prever);form.addEventListener('input',function(e){if(e.target.type==='number'){var r=form.querySelector('input[name=o][value=faixa]');if(r)r.checked=true;prever()}});
  form.addEventListener('submit',function(e){e.preventDefault()});
  function aberto(){return !veu.hidden}
  function abrir(){if(window.IrPara)IrPara.fechar();volta=document.activeElement;rotuloSecao();veu.hidden=false;body.classList.add('imp-aberto');prever();
    var f=form.querySelector('input:checked');if(f)f.focus({preventScroll:true})}
  function fechar(){if(!aberto())return;veu.hidden=true;body.classList.remove('imp-aberto');if(volta&&volta.focus&&volta!==body)try{volta.focus({preventScroll:true})}catch(e){}}
  veu.addEventListener('click',function(e){if(e.target===veu)fechar()});
  veu.querySelector('.ip-fechar').onclick=fechar;veu.querySelector('.imp-cancelar').onclick=fechar;
  veu.querySelector('.imp-ok').onclick=function(){ler();Memoria.gravarJSON(chave,op);fechar();preparar();window.print()};
  [].forEach.call(botoes,function(b){b.addEventListener('click',function(e){e.stopPropagation();aberto()?fechar():abrir()})});

  // ── Preparar a página para imprimir e desfazer depois. A cor e o tamanho da letra mudam só durante a impressão.
  var antes=null,pagina=null,fixo=false;
  function preparar(){if(antes)return;
    antes={modo:raiz.dataset.modo,cores:raiz.dataset.cores,tamanho:raiz.dataset.tamanho};
    if(op.cor!=='tela'){raiz.dataset.modo='claro';raiz.dataset.cores='padrao'}
    raiz.dataset.tamanho='grande';
    raiz.classList.add('imprimindo','imp-'+tipo);T.campos.forEach(function(c){raiz.dataset['imp'+c.nome.charAt(0).toUpperCase()+c.nome.slice(1)]=op[c.nome]});
    var retrato=typeof T.retrato==='function'?T.retrato(op):T.retrato,marg=tipo==='aula'?'14mm 12mm 14mm':'18mm 15mm 16mm';
    pagina=document.createElement('style');
    pagina.textContent='@page{size:A4 '+(retrato?'portrait':'landscape')+';margin:'+marg+';@top-left{content:"'+T.cabecalho().replace(/["\\]/g,'')+
      '";font:9pt Luciole,sans-serif;color:#555}@bottom-right{content:"folha " counter(page) " de " counter(pages);font:9pt Luciole,sans-serif;color:#555}}';
    document.head.appendChild(pagina);if(window.Quadros)Quadros.repintar();T.preparar(op)}
  function desfazer(){if(!antes||fixo)return;raiz.dataset.modo=antes.modo;raiz.dataset.cores=antes.cores;raiz.dataset.tamanho=antes.tamanho;antes=null;
    raiz.classList.remove('imprimindo','imp-'+tipo);T.campos.forEach(function(c){delete raiz.dataset['imp'+c.nome.charAt(0).toUpperCase()+c.nome.slice(1)]});
    if(pagina)pagina.remove();pagina=null;T.desfazer();if(window.Quadros)Quadros.repintar()}
  addEventListener('beforeprint',preparar);addEventListener('afterprint',desfazer);
  // ?imprimir=painel (o botão de cada tópico em "Aulas e exercícios") abre o painel e sai do endereço, para recarregar não o abrir de novo.
  function aoAbrir(){if(par.get('imprimir')==='painel'){abrir();try{par.delete('imprimir');history.replaceState(null,'',location.pathname+(par.toString()?'?'+par:'')+location.hash)}catch(e){}}
    else if(par.get('imprimir')){fixo=true;preparar()}}
  // Depois do tema.js (que abre o quadro do endereço e pinta as animações), para a seção atual e o estado geral valerem.
  if(document.readyState==='complete')setTimeout(aoAbrir,0);else addEventListener('load',function(){setTimeout(aoAbrir,0)});

  // ── Teclas: P abre e fecha o painel, e Ctrl+P / Cmd+P também o abrem (em vez de imprimir a tela como está); Esc fecha.
  document.addEventListener('keydown',function(e){
    var k=e.key,t=e.target||{},campo=/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName||'')&&!/^(radio|checkbox)$/.test(t.type)||t.isContentEditable;
    if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&(k==='p'||k==='P')){e.preventDefault();if(!aberto())abrir();return}
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(aberto()){if(k==='Escape'){e.preventDefault();e.stopPropagation();fechar();return}
      if(k==='Enter'&&t.tagName==='INPUT'){e.preventDefault();veu.querySelector('.imp-ok').click();return}
      if(k==='Tab'){var fs=todos('input:checked,input[type=checkbox],input[type=number],button',veu).filter(function(x){return x.offsetParent!==null}),p=fs.indexOf(document.activeElement);
        if(e.shiftKey&&p<=0){e.preventDefault();fs[fs.length-1].focus()}else if(!e.shiftKey&&p===fs.length-1){e.preventDefault();fs[0].focus()}}
      // As setas, o espaço e as letras ficam com o painel (o tema.js não troca o quadro enquanto ele está aberto).
      return}
    if((k==='p'||k==='P')&&!campo&&!body.classList.contains('busca-aberta')&&!(window.IrPara&&IrPara.aberto())){e.preventDefault();abrir()}
  },true);
  window.Impressao={abrir:abrir,fechar:fechar,aberto:aberto};
})();
