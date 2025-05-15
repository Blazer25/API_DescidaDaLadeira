const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Corrida = require("../../modelos/Corrida");

async function executar({ codigoCorrida, codigoEquipe, tempo }) {
  try {
    if (!codigoCorrida || typeof codigoCorrida !== "string") {
      throw new StatusError("O código da corrida é obrigatório e deve ser do tipo 'texto'.", 400);
    }
    if (!codigoEquipe || typeof codigoEquipe !== "string") {
      throw new StatusError("O código da equipe é obrigatório e deve ser do tipo 'texto'.", 400);
    }
    // Busca a corrida
    const corrida = await Corrida.findOne({ codigo: codigoCorrida });
    if (!corrida) {
      throw new StatusError("Corrida não encontrada!", 404);
    }
    // Busca o tempoChegada da equipe
    const chegadaEquipe = corrida.temposChegadas.find(tc => tc.equipe.codigo === codigoEquipe);
    if (!chegadaEquipe) {
      throw new StatusError("Equipe não encontrada na corrida!", 404);
    }
    // Atualiza o tempo se informado
    if (tempo && typeof tempo === "string") {
      chegadaEquipe.tempo = tempo;
    }
    await corrida.save();
    return StatusOk({
      data: null,
      status: 200,
      mensagem: "Tempo da equipe atualizado com sucesso!"
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao atualizar tempo da equipe na corrida."
    };
  }
}

module.exports = { executar };
