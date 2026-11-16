// Service worker do site (uso offline, 16/11/2026, docs/planejamento-offline.md). Fica na raiz do site (sw.js), registrado por
// recursos/offline.js, e vale para a página das disciplinas, recursos/ e todas as disciplinas. Fonte em tema/offline/sw.js,
// copiada pela montagem (tema/montagem/98-offline.py). No corte de compatibilidade: var, funções e Promise, sem async/await.
//
// Como responde (seção 2.4 do planejamento):
//   páginas (.html), .json e .js sem ?v=   rede primeiro, com 3 s de espera; sem resposta, o guardado; sem nada, "Sem conexão"
//   recursos com ?v= (tema, scripts...)   o guardado, se for daquela versão; senão a rede (e guarda)
//   o resto (letras, imagens)              o guardado; senão a rede (e guarda)
// Tudo fica num cache só, pela chave do endereço sem ?... e sem #... ("pasta/" vale "pasta/index.html"). Cada resposta guardada
// leva x-off-v (a versão com que veio). O que a pessoa abre fica guardado de passagem.
//
// Pacotes (seção 2.2): {tipo:'sincronizar', pacote:'recursos/offline.json'} baixa o que mudou no pacote e grava, no fim, o token
// e a data em __offline__/<pacote>; o que já desceu fica marcado, e uma sincronia cortada recomeça de onde parou. Mensagens:
// sincronizar (com cursos, prioridade e a página aberta), prioridade (reordena a fila em curso), pausar e apagar.
var CACHE = 'disciplinas-offline-1';
var RAIZ = self.registration.scope;
var META = RAIZ + '__offline__/';
var ESPERA = 3000, JUNTOS = 2;

function chave(url) {
  var u = new URL(url, RAIZ);
  u.hash = ''; u.search = '';
  if (/\/$/.test(u.pathname)) u.pathname += 'index.html';
  return u.href;
}
function abrir() { return caches.open(CACHE); }
// Cópia guardável: sem o "redirected" (o Safari recusa servir resposta redirecionada a uma navegação) e com a versão.
function guardavel(resp, v) {
  return resp.blob().then(function (b) {
    var h = new Headers();
    h.set('content-type', resp.headers.get('content-type') || 'application/octet-stream');
    h.set('x-off-v', v || '');
    return new Response(b, { status: 200, headers: h });
  });
}
function guardar(url, resp, v) {
  return guardavel(resp, v).then(function (r) { return abrir().then(function (c) { return c.put(chave(url), r); }); });
}
function guardado(url) { return abrir().then(function (c) { return c.match(chave(url)); }); }
function semConexao() { return guardado(RAIZ + 'sem-conexao.html'); }

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('disciplinas-offline-') === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function redePrimeiro(e) {
  var r = e.request, nav = r.mode === 'navigate';
  // Navegação: o próprio pedido (segue o redirecionamento do jeito do navegador), revalidado no servidor (sem o cache HTTP).
  var pedido = nav ? new Request(r, { cache: 'no-cache' }) : new Request(r.url, { cache: 'no-cache', credentials: 'same-origin' });
  var rede = fetch(pedido).then(function (resp) {
    if (resp.ok && resp.type === 'basic') e.waitUntil(guardar(r.url, resp.clone(), ''));
    return resp;
  });
  return new Promise(function (resolve) {
    var feito = false;
    function dar(x) { if (!feito && x) { feito = true; resolve(x); return true; } return false; }
    var t = setTimeout(function () { guardado(r.url).then(dar); }, ESPERA);
    rede.then(function (resp) { clearTimeout(t); dar(resp); }, function () {
      clearTimeout(t);
      guardado(r.url).then(function (g) {
        if (dar(g)) return;
        (nav ? semConexao() : Promise.resolve(null)).then(function (s) { if (!dar(s)) dar(Response.error()); });
      });
    });
  });
}

function guardadoPrimeiro(e, v) {
  var r = e.request;
  return guardado(r.url).then(function (g) {
    if (g && (!v || g.headers.get('x-off-v') === v)) return g;
    return fetch(r).then(function (resp) {
      if (resp.ok && resp.type === 'basic') e.waitUntil(guardar(r.url, resp.clone(), v));
      return resp;
    }, function () { return g || Response.error(); });
  });
}

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || r.url.indexOf(RAIZ) !== 0 || r.headers.get('range')) return;
  var u = new URL(r.url), p = u.pathname;
  if (p.indexOf('/__offline__/') >= 0 || /\/sw\.js$/.test(p) || /\/offline\.json$/.test(p)) return;
  var v = u.searchParams.get('v') || '';
  var pagina = r.mode === 'navigate' || /\/$/.test(p) || /\.(html|json)$/.test(p) || (!v && /\.js$/.test(p));
  e.respondWith(pagina ? redePrimeiro(e) : guardadoPrimeiro(e, v));
});

// Sincronia de um pacote ---------------------------------------------------------------------------------------------------------
var EM_CURSO = {};
function avisar(msg) {
  return self.clients.matchAll({ includeUncontrolled: true }).then(function (cs) { cs.forEach(function (c) { c.postMessage(msg); }); });
}
function resumo(buf) {
  return crypto.subtle.digest('SHA-1', buf).then(function (d) {
    return Array.prototype.map.call(new Uint8Array(d), function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('').slice(0, 8);
  });
}
function lerMeta(c, rel) {
  return c.match(META + rel).then(function (m) { return m ? m.json() : { token: null, arquivos: {} }; });
}
function gravarMeta(c, rel, meta) {
  return c.put(META + rel, new Response(JSON.stringify(meta), { headers: { 'content-type': 'application/json' } }));
}
// Ordem da fila (etapa 3, seção 2.3 do planejamento): a página aberta; as páginas de entrada e os recursos; os tópicos pedidos pela
// página (o atual, o seguinte, os já vistos, o "continuar"), aula antes da lista; o resto das aulas e listas pela ordem dos
// tópicos (o Three.js com o primeiro tópico que o usa); a Revisão da base; as Demonstrações. Cada arquivo traz no pacote
// [resumo, bytes, rede, tipo, tópico, curso].
function pontuar(p, prio, pagina) {
  var ordem = {};
  (prio || []).forEach(function (t, i) { if (typeof t === 'string' && !(t in ordem)) ordem[t] = i; });
  return function (a) {
    var g = p.arquivos[a] || [], k = g[3] || '', t = g[4] || '', num = parseInt((t.match(/\d+/) || ['99'])[0], 10);
    var sub = k === 'aula' ? 0 : k === 'lista' ? 1 : 2;
    if (a === pagina) return 0;
    if (!k || k === 'entrada' || k === 'recurso') return 1e4;
    if (t in ordem) return 2e4 + ordem[t] * 10 + sub;
    if (k === 'aula' || k === 'lista' || k === 'tres') return 3e4 + num * 10 + sub;
    if (k === 'base') return 4e4 + num;
    if (k === 'comp') return 5e4 + num;
    return 6e4;
  };
}
function mesmos(a, b) { return (a || []).slice().sort().join(' ') === (b || []).slice().sort().join(' '); }
var FILAS = {};
// op: {cursos: ['EE'] (só os arquivos sem curso e os desses cursos; sem cursos, todos), prioridade: ['T14', 'T15', ...],
// pagina: 'calculo-i/aulas/T14-EE.html'}. Com a sincronia já em curso, só reordena a fila (a página aberta passa à frente).
function sincronizar(rel, op) {
  op = op || {};
  if (EM_CURSO[rel]) {
    // Pausada e ainda terminando os arquivos em curso (a aba anterior ficou escondida ao trocar de página): recomeça depois.
    if (FILAS[rel] && FILAS[rel].parado()) return EM_CURSO[rel].then(function () { return sincronizar(rel, op); });
    if (FILAS[rel]) FILAS[rel].ordenar(op.prioridade, op.pagina);
    return EM_CURSO[rel];
  }
  var fim = function () { delete EM_CURSO[rel]; delete FILAS[rel]; };
  EM_CURSO[rel] = Promise.all([
    fetch(RAIZ + rel, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(rel + ': ' + r.status); return r.json(); }),
    abrir()
  ]).then(function (x) {
    var p = x[0], c = x[1];
    return lerMeta(c, rel).then(function (meta) {
      var cursos = op.cursos || meta.cursos || null;
      function vale(a) { var cu = p.arquivos[a] && p.arquivos[a][5]; return !cu || !cursos || cursos.indexOf(cu) >= 0; }
      var lista = Object.keys(p.arquivos).filter(vale);
      // Outros cursos que antes: o token guardado deixa de valer até a nova sincronia terminar.
      if (!mesmos(meta.cursos, cursos)) meta.token = null;
      meta.nome = p.nome; meta.total = lista.length; meta.cursos = cursos;
      var base = { tipo: 'pacote', pacote: rel, token: p.token, data: p.data };
      if (meta.token === p.token) return avisar(Object.assign({ estado: 'sincronizado', feitos: lista.length, total: lista.length }, base));
      var faltam = lista.filter(function (a) { return meta.arquivos[a] !== p.arquivos[a][0]; });
      var sairam = Object.keys(meta.arquivos).filter(function (a) { return !p.arquivos[a] || !vale(a); });
      var total = lista.length, feitos = total - faltam.length, erros = 0, desde = 0, parado = false;
      var fila = faltam.slice();
      FILAS[rel] = {
        ordenar: function (prio, pagina) { var f = pontuar(p, prio, pagina); fila.sort(function (a, b) { return f(a) - f(b); }); },
        parar: function (motivo) { fila.length = 0; parado = motivo; },
        parado: function () { return !!parado; }
      };
      FILAS[rel].ordenar(op.prioridade, op.pagina);
      avisar(Object.assign({ estado: 'baixando', feitos: feitos, total: total }, base));
      function um(a) {
        var rec = /(^|\/)recursos\//.test(a), url = RAIZ + a + (rec ? '?v=' + p.v : '');
        return fetch(url, { cache: 'no-cache' }).then(function (resp) {
          if (!resp.ok) throw new Error(a + ': ' + resp.status);
          return resp.arrayBuffer().then(function (buf) {
            return resumo(buf).then(function (h) {
              var r = new Response(buf, { headers: { 'content-type': resp.headers.get('content-type') || 'application/octet-stream', 'x-off-v': rec ? p.v : '' } });
              return c.put(chave(RAIZ + a), r).then(function () {
                // Resumo diferente do pacote: o servidor ainda mandou a versão velha (o GitHub Pages leva um minuto). Guarda, mas
                // não marca: a próxima sincronia pede de novo.
                if (h === p.arquivos[a][0]) meta.arquivos[a] = h; else erros++;
              });
            });
          });
        }).catch(function () { erros++; }).then(function () {
          feitos++;
          if (parado) return;
          if (++desde >= 5) { desde = 0; gravarMeta(c, rel, meta); avisar(Object.assign({ estado: 'baixando', feitos: feitos, total: total }, base)); }
        });
      }
      // Dois arquivos por vez (seção 2.3): a página que a pessoa abre no meio não espera muito pela rede.
      function trabalhador() { var a = fila.shift(); return a ? um(a).then(trabalhador) : Promise.resolve(); }
      var ts = []; for (var k = 0; k < JUNTOS; k++) ts.push(trabalhador());
      // Recurso que não mudou mas veio com outra versão no endereço (o ?v= é um só para todos): ganha a versão nova sem descer
      // de novo, para a página nova (que pede ?v= novo) achá-lo guardado.
      function retag(a) {
        return c.match(chave(RAIZ + a)).then(function (g) {
          if (!g || g.headers.get('x-off-v') === p.v) return;
          return g.blob().then(function (b) {
            return c.put(chave(RAIZ + a), new Response(b, { headers: { 'content-type': g.headers.get('content-type') || 'application/octet-stream', 'x-off-v': p.v } }));
          });
        });
      }
      return Promise.all(ts).then(function () {
        if (parado === 'apagado') return;  // apagar() tira tudo, inclusive a marca
        if (parado === 'pausado') {
          return gravarMeta(c, rel, meta).then(function () {
            return avisar(Object.assign({ estado: 'pausado', feitos: Object.keys(meta.arquivos).filter(vale).length, total: total }, base));
          });
        }
        return Promise.all(lista.filter(function (a) { return /(^|\/)recursos\//.test(a) && faltam.indexOf(a) < 0; }).map(retag))
          .then(function () { return Promise.all(sairam.map(function (a) { delete meta.arquivos[a]; return c.delete(chave(RAIZ + a)); })); })
          .then(function () {
            if (!erros) { meta.token = p.token; meta.data = p.data; meta.v = p.v; }
            return gravarMeta(c, rel, meta);
          }).then(function () {
            return avisar(Object.assign({ estado: erros ? 'incompleto' : 'sincronizado', feitos: total - erros, total: total, erros: erros }, base));
          });
      });
    });
  }).then(fim, function (err) { fim(); return avisar({ tipo: 'pacote', pacote: rel, estado: 'erro', erro: String(err) }); });
  return EM_CURSO[rel];
}

// Pausar (etapa 3): a fila para depois dos arquivos que já estão descendo; o que desceu fica marcado, e "Continuar" (uma nova
// sincronia) recomeça de onde parou.
function pausar(rel) {
  if (FILAS[rel]) FILAS[rel].parar('pausado');
  return EM_CURSO[rel] || Promise.resolve();
}

// Apagar um pacote (etapa 2, botão "Apagar" do painel): para a sincronia dele, se houver, tira do cache os arquivos que ele
// marcou e a marca. Páginas abertas de passagem, fora do pacote, ficam. "Apagar tudo" (todo o cache) é feito pela própria página.
function apagar(rel) {
  if (FILAS[rel]) FILAS[rel].parar('apagado');
  return (EM_CURSO[rel] || Promise.resolve()).then(abrir).then(function (c) {
    return lerMeta(c, rel).then(function (meta) {
      return Promise.all(Object.keys(meta.arquivos).map(function (a) { return c.delete(chave(RAIZ + a)); }))
        .then(function () { return c.delete(META + rel); });
    });
  }).then(function () { return avisar({ tipo: 'pacote', pacote: rel, estado: 'apagado', feitos: 0 }); });
}

function textos(x) { return Array.isArray(x) ? x.filter(function (t) { return typeof t === 'string'; }).slice(0, 200) : null; }
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (typeof d.pacote !== 'string' || !/^[\w\/-]*offline\.json$/.test(d.pacote)) return;
  var op = { cursos: textos(d.cursos), prioridade: textos(d.prioridade), pagina: typeof d.pagina === 'string' ? d.pagina : '' };
  if (d.tipo === 'sincronizar') e.waitUntil(sincronizar(d.pacote, op));
  else if (d.tipo === 'prioridade') { if (FILAS[d.pacote]) FILAS[d.pacote].ordenar(op.prioridade, op.pagina); }
  else if (d.tipo === 'pausar') e.waitUntil(pausar(d.pacote));
  else if (d.tipo === 'apagar') e.waitUntil(apagar(d.pacote));
});
