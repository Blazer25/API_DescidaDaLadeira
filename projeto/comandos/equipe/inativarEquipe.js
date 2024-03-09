const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Equipe = require("../../modelos/Equipe");

async function executar({ codigoEquipe }) {
  try {
    validarParametros({ codigoEquipe });
    await inativar({ codigoEquipe });

    return StatusOk({
      data: null,
      status: 200,
      mensagem: "Equipe inativa com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao inativar equipe.",
    };
  }
}

function validarParametros({ codigoEquipe }) {
  if (typeof codigoEquipe !== "string") {
    throw new StatusError(
      'Código da equipe é obrigatório e deve ser do tipo "texto".',
      400
    );
  }
}

async function inativar({ codigoEquipe }) {
  const equipe = Equipe.findOneAndUpdate(
    { codigo: codigoEquipe },
    { ativa: false }
  );
  if (!equipe) {
    throw new StatusError("Equipe não encontrada para ser editada!", 404);
  }
  return equipe;
}

module.exports = {
  executar,
};
