/* =====================================================================
   CONFIGURAÇÕES DA PÁGINA  —  este é o arquivo que você edita.

   Abra com o Bloco de Notas (ou VS Code), troque o que está entre
   aspas "assim", salve e atualize a página no navegador (F5).

   Atenção: mantenha as aspas, as vírgulas no fim das linhas e não
   apague as chaves { } e colchetes [ ].
   ===================================================================== */

window.CONFIG = {

  /* ----- Quem e quando ----- */
  noivos: { nome1: "Duda", nome2: "Mateus" },
  data: "18 de novembro de 2026",          // aparece na capa e no título da aba

  /* ----- Textos da página ----- */
  textos: {
    apresenta:      "Duda Cruz Videomaker apresenta",
    botaoAbrir:     "Abrir Album ↗",
    dicaMusica:     "♪ ♫ ♪ ♫",
    capaFrase:      "Uma história para sempre",
    capaRolar:      "Role para ver sua coleção",

    videosSobre:    "Em movimento",
    videosTitulo:   "Os vídeos da sua história",
    videosSub:      "Alguns instantes para reviver esse dia tão especial.",

    galeriaSobre:   "Cada detalhe, uma lembrança",
    galeriaTitulo:  "Sua coleção",
    galeriaSub:     "Uma seleção de momentos felizes.",
    galeriaNota:    "",                      // deixe vazio para não mostrar nada embaixo das fotos
    todos:          "Todos",                 // nome do botão que mostra todas as fotos

    cartaSobre:     "Uma mensagem especial",
    cartaTitulo:    "Com carinho",
    assinatura:     "Duda Cruz | @byduda.cruz",
    rodape:         "feito com carinho"
  },

  /* ----- Mensagem final (cada linha entre aspas é um parágrafo) ----- */
  mensagem: [
    "Que este álbum seja uma lembrança especial de um dos dias mais importantes da história de vocês. Foi uma alegria fazer parte desse momento e registrar cada detalhe com carinho.",
    "Obrigada pela confiança no meu trabalho e por me permitirem eternizar um pedacinho dessa história. Que o amor de vocês seja sempre celebrado! 🤍"
  ],

  /* ----- Nomes dos botões de filtro das fotos -----
     O nome à esquerda é o NOME DA PASTA em assets/fotos.
     O texto à direita é o que aparece no botão.
     Se criar uma pasta nova e não listar aqui, o botão usa o próprio nome da pasta. */
  nomesCategorias: {
    casal:       "O casal",
    celebracao:  "Celebração",
    detalhes:    "Detalhes"
  },

  /* ----- Fotos ----- */
  misturarFotos: true,     // true = alterna as categorias em "Todos"; false = mostra uma categoria por vez

  /* ----- Música ----- */
  musica: {
    volume: 0.55,                 // de 0 (mudo) a 1 (máximo) — vale para a música da pasta assets/musica
    usarTrilhaGerada: true        // se a pasta de música estiver vazia, toca uma trilha suave criada pela página
  },

  /* ----- Demonstração -----
     true  = se uma pasta estiver vazia, a página mostra fotos/vídeos de exemplo da internet.
     false = pasta vazia = seção escondida (use quando for entregar de verdade). */
  mostrarDemo: true
};
