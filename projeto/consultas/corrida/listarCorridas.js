const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasCorrida = require("../../servicos/mongo/consultas/corridas");

async function executar({}) {
  try {
    const resultado = await consultasCorrida.listarTodasCorridas();

    if (!resultado || !resultado.length) {
      throw new StatusError("Nenhuma corrida encontrada.", 404);
    }

    const corridas = resultado.map(
      ({
        codigo,
        dataHoraInicio,
        dataHoraFim,
        tempoTotal,
        temposChegadas,
      }) => ({
        codigo,
        dataHoraInicio,
        dataHoraFim,
        tempoTotal,
        temposChegadas,
      })
    );

    return StatusOk({
      data: {
        corridas: corridas,
      },
      status: 200,
      mensagem: "Corridas encontradas!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao listar corridas.",
      dados: null,
    };
  }
}

module.exports = {
  executar,
};
