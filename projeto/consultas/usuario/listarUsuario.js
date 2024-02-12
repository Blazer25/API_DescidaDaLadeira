const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasUsuarios = require("../../servicos/mongo/consultas/usuarios");

async function executar({ login }) {
  try {
    validarParametros({ login });

    const usuario = await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({
      login,
    });

    if (!usuario) {
      throw new StatusError("Usuário não encontrado!", 404);
    }

    return StatusOk({
      data: {
        id: usuario._id,
        login: usuario.login,
      },
      status: 200,
      mensagem: "Usuário encontrado!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao listar usuário.",
      dados: null,
    };
  }
}

function validarParametros(parametros) {
  if (!parametros.login) {
    throw new StatusError("O parâmetro login é obrigatório!", 400);
  }
  if (typeof parametros.login !== "string") {
    throw new StatusError("O parâmetro login deve ser do tipo texto!", 400);
  }
}

module.exports = {
  executar,
};
