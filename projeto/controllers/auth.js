const registrarUsuario = require("../comandos/auth/registrarUsuario.js");
const realizarLogin = require("../comandos/auth/realizarLogin.js");

const authController = {};

authController.registrar = async (req, res) => {
  try {
    const { login, senha, confirmarSenha } = req.body;

    const { erro, status, mensagem } = await registrarUsuario.executar({
      login,
      senha,
      confirmarSenha,
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

authController.login = async (req, res) => {
  try {
    const { login, senha } = req.body;

    const { erro, status, mensagem, data } = await realizarLogin.executar({
      login,
      senha,
    });

    if (erro) return res.status(status).json({ mensagem });

    const { token, usuario } = data;
    return res.status(status).json({ mensagem, token, usuario });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

authController.verificarToken = async (req, res) => {
  try {
    verificacoesToken.verificaToken(req, res, () => {
      res.json({ mensagem: "Token válido" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = authController;
