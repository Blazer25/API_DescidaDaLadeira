const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Usuario = require("../../modelos/Usuario");
const consultasUsuarios = require("../../servicos/mongo/consultas/usuarios");
const bcrypt = require("bcrypt");

async function executar({ login, senha, confirmarSenha }) {
  try {
    validarParametros({ login, senha, confirmarSenha });
    await verificaExistenciaUsuarioPeloLogin({ login });
    const senhaCriptografada = await criptografarSenha({ senha });
    const usuario = await criarUsuario({ login, senhaCriptografada });
    await salvarUsuario({ usuario });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Usuário criado com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao criar usuário.",
    };
  }
}

function validarParametros({ login, senha, confirmarSenha }) {
  if (!login || !senha || !confirmarSenha) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (login, senha e confirmarSenha).",
      400
    );
  }

  if (
    typeof login !== "string" ||
    typeof senha !== "string" ||
    typeof confirmarSenha !== "string"
  ) {
    throw new StatusError(
      "Todos os campos devem ser do tipo texto (login, senha e confirmarSenha).",
      400
    );
  }

  if (senha !== confirmarSenha) {
    throw new StatusError("As senhas não conferem.", 400);
  }
}

async function verificaExistenciaUsuarioPeloLogin({ login }) {
  try {
    const loginExistente =
      await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({ login });

    if (loginExistente) {
      throw new StatusError("Login já existente para outro usuário!", 400);
    }
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}

async function criptografarSenha({ senha }) {
  const salt = await bcrypt.genSalt(12);
  const senhaCriptografada = await bcrypt.hash(senha, salt);

  return senhaCriptografada;
}

function criarUsuario({ login, senhaCriptografada }) {
  const usuario = new Usuario({
    login,
    senha: senhaCriptografada,
  });

  return usuario;
}

async function salvarUsuario({ usuario }) {
  try {
    await usuario.save();
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}
module.exports = {
  executar,
};
