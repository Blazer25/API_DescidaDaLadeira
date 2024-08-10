const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasCorrida = require("../../servicos/mongo/consultas/corridas");

// Função auxiliar para converter tempo no formato "minuto:segundo:milissegundo" para milissegundos
function converterTempoParaMilissegundos(tempo) {
  const [minuto, segundo, milissegundo] = tempo.split(":").map(Number);
  return minuto * 60 * 1000 + segundo * 1000 + milissegundo;
}

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
      { fase: "fase2", faseSelecionada: fase2 },
      { fase: "fase3", faseSelecionada: fase3 },
      { fase: "fase4", faseSelecionada: fase4 },
      { fase: "fase5", faseSelecionada: fase5 },
    ];

    fases.forEach(({ fase, faseSelecionada }) => {
      faseSelecionada.forEach((corrida) => {
        corrida.temposChegadas.forEach((chegada) => {
          const { codigo } = chegada.equipe;
          const tempoAtualMs = converterTempoParaMilissegundos(chegada.tempo);

          if (
            !melhoresTempos[fase][codigo] ||
            tempoAtualMs < melhoresTempos[fase][codigo].tempo
          ) {
            melhoresTempos[fase][codigo] = {
              tempo: tempoAtualMs,
              tempoFormatado: chegada.tempo,
              equipe: {
                codigo: chegada.equipe.codigo,
                nome: chegada.equipe.nome,
              },
            };
          }
        });
      });
    });

    // Ordenar os tempos para cada fase
    for (const fase in melhoresTempos) {
      const equipes = Object.values(melhoresTempos[fase]);
      equipes.sort((a, b) => a.tempo - b.tempo);
      melhoresTempos[fase] = equipes;
    }

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
