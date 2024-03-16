const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const repositorioEquipes = require("../../servicos/mongo/repositorios/equipes");
const consultarEquipe = require("../../servicos/mongo/consultas/equipes");

async function executar({ codigoEquipe }) {
  try {
    validarParametros({ codigoEquipe });
    await buscarEquipe({ codigoEquipe });
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

async function buscarEquipe({ codigoEquipe }) {
  try {
    const equipe = await consultarEquipe.listarEquipePeloCodigo({
      codigo: codigoEquipe,
    });
    if (!equipe) {
      throw new StatusError("Equipe não encontrada para ser inativada!", 404);
    }
  } catch (error) {
    throw new StatusError(error.message, error.status)
  }
}

async function inativar({ codigoEquipe }) {
  try {
    await repositorioEquipes.inativarEquipe({ codigo: codigoEquipe });
  } catch (error) {
    throw new StatusError(error.message, error.status)
  }
}

module.exports = {
  executar,
};
