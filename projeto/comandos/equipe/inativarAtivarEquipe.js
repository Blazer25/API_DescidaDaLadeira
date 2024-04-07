const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const repositorioEquipes = require("../../servicos/mongo/repositorios/equipes");
const consultarEquipe = require("../../servicos/mongo/consultas/equipes");

async function executar({ codigoEquipe }) {
  try {
    validarParametros({ codigoEquipe });
    const equipe = await buscarEquipe({ codigoEquipe });
    await inativarOuAtivar({ codigoEquipe, equipe });

    return StatusOk({
      data: null,
      status: 200,
      mensagem: `Equipe ${equipe.ativa ? "inativada" : "ativada"} com sucesso!`
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao inativar/ativar equipe.",
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
      throw new StatusError("Equipe não encontrada para ser inativada ou ativada!", 404);
    }

    return equipe
  } catch (error) {
    throw new StatusError(error.message, error.status)
  }
}

async function inativarOuAtivar({ codigoEquipe, equipe }) {
  try {
    const statusAlterar = !equipe.ativa
    await repositorioEquipes.inativarAtivarEquipe({ codigo: codigoEquipe, statusAlterar });
  } catch (error) {
    throw new StatusError(error.message, error.status)
  }
}

module.exports = {
  executar,
};
