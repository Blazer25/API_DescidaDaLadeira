const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasEquipe = require("../../servicos/mongo/consultas/equipes");

async function executar({ filtros }) {
  try {
    const resultado = await consultasEquipe.listarTodasEquipesPorFase({
      filtros,
    });

    if (!resultado || !resultado.length) {
      throw new StatusError("Nenhuma equipe por fase encontrada.", 404);
    }

    return StatusOk({
      data: {
        equipesPorFase: resultado,
      },
      status: 200,
      mensagem: "Equipes por fase encontradas!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem:
        error.message || "Erro desconhecido ao listar equipes por fase.",
      dados: null,
    };
  }
}

module.exports = {
  executar,
};
