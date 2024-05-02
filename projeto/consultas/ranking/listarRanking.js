const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasCorrida = require("../../servicos/mongo/consultas/corridas");

async function executar({}) {
  try {
    const corridas = await consultasCorrida.listarTodasCorridas();

    if (!corridas || !corridas.length) {
      throw new StatusError("Não há corridas para serem rankeadas.", 404);
    }

    const corridasSeparadasPorEstagio = {
      fase1: corridas.filter(({ estagio }) => estagio === "fase1"),
      fase2: corridas.filter(({ estagio }) => estagio === "fase2"),
      fase3: corridas.filter(({ estagio }) => estagio === "fase3"),
      fase4: corridas.filter(({ estagio }) => estagio === "fase4"),
      fase5: corridas.filter(({ estagio }) => estagio === "fase5"),
    };

    const { fase1, fase2, fase3, fase4, fase5 } = corridasSeparadasPorEstagio;

    const melhoresTempos = {
      fase1: {},
      fase2: {},
      fase3: {},
      fase4: {},
      fase5: {},
    };

    const fases = [
      { fase: "fase1", faseSelecionada: fase1 },
      {
        fase: "fase2",
        faseSelecionada: fase2,
      },
      {
        fase: "fase3",
        faseSelecionada: fase3,
      },
      {
        fase: "fase4",
        faseSelecionada: fase4,
      },
      {
        fase: "fase5",
        faseSelecionada: fase5,
      },
    ];

    fases.forEach((fase) => {
      const faseAtual = fase.fase;
      fase.faseSelecionada.forEach((corrida) => {
        corrida.temposChegadas.forEach((chegada) => {
          const codigo = chegada.equipe.codigo;
          const tempoAtual = chegada.tempo;

          if (
            !melhoresTempos[faseAtual][codigo] ||
            tempoAtual < melhoresTempos[faseAtual][codigo].tempo
          ) {
            melhoresTempos[faseAtual][codigo] = {
              tempo: tempoAtual,
              equipe: {
                codigo: chegada.equipe.codigo,
                nome: chegada.equipe.nome,
              },
            };
          }
        });
      });
    });

    return StatusOk({
      data: {
        ranking: melhoresTempos,
      },
      status: 200,
      mensagem: "Ranking com os melhores tempos encontrado.",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao listar o ranking.",
      dados: null,
    };
  }
}

module.exports = {
  executar,
};
