const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Corrida = require("../../modelos/Corrida");

async function executar({ codigoCorrida }) {
  try {
    validarParametros({
      codigoCorrida,
    });
    await remover({ codigoCorrida });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Corrida deletada com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao deletar corrida.",
    };
  }
}

function validarParametros({ codigoCorrida }) {
  if (typeof codigoCorrida !== "string") {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas).",
      400
    );
  }
}

async function remover({ codigoCorrida }) {
  try {
    const resposta = await Corrida.findOneAndDelete({ codigo: codigoCorrida });
    if (!resposta) {
      throw new StatusError(
        "Não foi encontrada nenhuma corrida com o código informado",
        404
      );
    }
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}
module.exports = {
  executar,
};
