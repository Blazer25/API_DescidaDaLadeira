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
    };

    const { fase1, fase2, fase3, fase4 } = corridasSeparadasPorEstagio;

    const ranking = [];

    fase1.forEach(({ temposChegadas }) => {
      const { equipe, tempo } = temposChegadas;
      const { nome, codigo } = equipe;

      const temposEquipe = {};

      if (temposEquipe[codigo]) {
        if (tempo < temposEquipe[codigo]) {
          temposEquipe[codigo] = tempo;
        }
      } else {
        temposEquipe[codigo] = tempo;
      }

      

    });

    return StatusOk({
      data: {
        ranking: ranking,
      },
      status: 200,
      mensagem: "Ranking encontrado.",
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
