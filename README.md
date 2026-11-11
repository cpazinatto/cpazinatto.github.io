# cpazinatto.github.io

Página principal do material didático das disciplinas do Prof. Cássio Pazinatto (Coordenadoria de Matemática, IFSul
Câmpus Pelotas), publicada pelo GitHub Pages em https://cpazinatto.github.io/disciplinas/.

- `index.html`: em branco, sem link nenhum (pedido do professor, 10/11/2026): quem abre só `cpazinatto.github.io` não vê o
  material. Não é proteção, já que o repositório é público; só evita que se chegue ao material sem conhecer o endereço.
- Todas as páginas levam `<meta name="robots" content="noindex">`: não aparecem na busca do Google.
- `disciplinas/index.html`: a página, com um cartão por disciplina. Para abrir uma disciplina, ponha o endereço do material no `href` do
  título e troque a linha de estado (`<span class="estado">`) por `<a class="aula" href="...">Abrir o material</a>`.
  Disciplina nova: um `<article class="disc">` a mais na seção do nível de ensino.
- Preferências de leitura, as mesmas do material das disciplinas: modo (M), cores (T: Padrão, Alto contraste, Papel,
  Vibrante), letra (L: Luciole, Fira Sans, STIX, Fira Code) e tamanho (A). Ficam guardadas no navegador com o prefixo
  `leitura-`, comum a todas as páginas deste site: a escolha feita aqui vale nas disciplinas publicadas em
  `cpazinatto.github.io/...`, e vice-versa. A página usa `../recursos/`.
- Tela de Início do celular: `disciplinas/manifest.webmanifest` e os ícones em `icones/` (∫∑ e "Disciplinas" sobre o azul do tema; fonte em `icones/icone.html`, com o modo de gerar no comentário do topo). Aberta pelo ícone, a página abre sem as barras do navegador, e as disciplinas abertas a partir dela também.
- Cartão do Cálculo I: dois botões, Elétrica e Química, que levam a `calculo-i/?curso=EE` ou `?curso=EQ`; o Cálculo guarda o curso e mostra só as aulas dele.
- Busca em todas as disciplinas: a caixa da página das disciplinas (`data-fontes`) busca no índice de cada disciplina (`recursos/busca-indice-*.js` de cada site); hoje só o Cálculo I. Para uma disciplina nova, acrescentar `{"nome":...,"raiz":...}` à lista. `recursos/busca.js` e `busca.css` são cópias das do Cálculo.
- Aba do navegador: `favicon.ico` na raiz (16, 32 e 48 px), só com ∫∑ sobre o azul, porque em 16 px o texto vira borrão; fonte em `icones/icone-aba.html`. Na raiz, vale também de reserva para as páginas do domínio que não declaram ícone.
- `recursos/`: cópia de `tema.css`, `preferencias.js` e `fontes/` do material de Cálculo I
  (`calculo-i-ifsul-2027`, `saida/recursos/` e `tema/preferencias.js`). Quando o tema mudar lá, copiar de novo para cá.
  As licenças das letras estão em `recursos/fontes/` (Luciole: CC BY 4.0; as demais: SIL Open Font License).
- Logos do IFSul Pelotas e da Coordenadoria de Matemática em SVG, os mesmos do material de Cálculo I; no modo escuro ficam
  monocromáticos.

Versão da página (10/11/2026, como no material de Cálculo I): o rodapé de `disciplinas/index.html` diz "Versão de
dd/mm/aaaa, hh:mm", o momento da última mudança na página. Não há montagem aqui: a cada edição da página, atualizar a
versão à mão, no mesmo commit.
