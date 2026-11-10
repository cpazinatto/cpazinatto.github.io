# cpazinatto.github.io

Página principal do material didático das disciplinas do Prof. Cássio Pazinatto (Coordenadoria de Matemática, IFSul
Câmpus Pelotas), publicada pelo GitHub Pages em https://cpazinatto.github.io/.

- `index.html`: a página, com um cartão por disciplina. Para abrir uma disciplina, ponha o endereço do material no `href` do
  título e troque a linha de estado (`<span class="estado">`) por `<a class="aula" href="...">Abrir o material</a>`.
  Disciplina nova: um `<article class="disc">` a mais na seção do nível de ensino.
- Preferências de leitura, as mesmas do material das disciplinas: modo (M), cores (T: Padrão, Alto contraste, Papel,
  Vibrante), letra (L: Luciole, Fira Sans, STIX, Fira Code) e tamanho (A). Ficam guardadas no navegador com o prefixo
  `leitura-`, comum a todas as páginas deste site: a escolha feita aqui vale nas disciplinas publicadas em
  `cpazinatto.github.io/...`, e vice-versa.
- `recursos/`: cópia de `tema.css`, `preferencias.js` e `fontes/` do material de Cálculo I
  (`calculo-i-ifsul-2027`, `saida/recursos/` e `tema/preferencias.js`). Quando o tema mudar lá, copiar de novo para cá.
  As licenças das letras estão em `recursos/fontes/` (Luciole: CC BY 4.0; as demais: SIL Open Font License).
- Logos do IFSul Pelotas e da Coordenadoria de Matemática em SVG, os mesmos do material de Cálculo I; no modo escuro ficam
  monocromáticos.

O domínio próprio antigo (`cpazinatto.me`, arquivo `CNAME`) saiu em 10/11/2026: o domínio não existia mais, e o endereço
`cpazinatto.github.io` redirecionava para ele. O arquivo está no histórico do git.
