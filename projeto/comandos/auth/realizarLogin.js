const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasUsuarios = require("../../servicos/mongo/consultas/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function executar({ login, senha }) {
  try {
    validarParametros({ login, senha });
    const usuario = await verificaExistenciaUsuarioPeloLogin({ login });
    await compararSenha({ senha, usuario });
    const token = await logarUsuario({ usuario });

    return StatusOk({
      data: {
        token,
        usuario: usuario.login,
      },
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

function validarParametros({ login, senha }) {
  if (!login || !senha) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (login e senha).",
      400
    );
  }

  if (typeof login !== "string" || typeof senha !== "string") {
    throw new StatusError(
      "Todos os campos devem ser do tipo texto (login e senha).",
      400
    );
  }
}

async function verificaExistenciaUsuarioPeloLogin({ login }) {
  try {
    const loginExistente =
      await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({ login });

    if (!loginExistente) {
      throw new StatusError("Usuário ou senha incorretos!", 400);
    }

    return loginExistente;
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}

async function compararSenha({ senha, usuario }) {
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new StatusError("Usuário ou senha incorretos!", 400);
  }
}

function logarUsuario({ usuario }) {
  const SECRET = process.env.JWT_SECRET;

  return jwt.sign({ id: usuario._id }, SECRET, {
    expiresIn: "12h",
  });
}
module.exports = {
  executar,
};
