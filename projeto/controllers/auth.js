// controllers/usuarioController.js

const Usuario = require("../modelos/Usuario.js");
const validacoesUsuarios = require("../middlewares/validacoes/usuarios.js");
const verificacoesToken = require("../middlewares/token/token.js");

const consultasUsuarios = require("../servicos/mongo/consultas/usuarios.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {};

authController.registrar = async (req, res) => {
  try {
    const { login, senha, confirmarSenha } = req.body;

    const resValidacoes =
      validacoesUsuarios.validarInformacoesRegistrarUsuarios({
        login,
        senha,
        confirmarSenha,
      });

    if (resValidacoes.erro && resValidacoes.mensagem) {
      return res.status(400).json({ mensagem: resValidacoes.mensagem });
    }

    const loginExistente =
      await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({ login });
    if (loginExistente) {
      return res
        .status(400)
        .json({ mensagem: "Login já existente para outro usuário!" });
    }

    const salt = await bcrypt.genSalt(12);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const usuario = new Usuario({
      login,
      senha: senhaCriptografada,
    });

    await usuario.save();
    res.status(201).json({ mensagem: "Usuário criado com sucesso" });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

authController.login = async (req, res) => {
  try {
    const { login, senha } = req.body;

    const resValidacoes = validacoesUsuarios.validarInformacoesLogin({
      login,
      senha,
    });

    if (resValidacoes.erro && resValidacoes.mensagem) {
      return res.status(400).json({ mensagem: resValidacoes.mensagem });
    }

    const usuarioExistente =
      await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({ login });

    if (!usuarioExistente) {
      return res.status(400).json({ mensagem: "Usuário ou senha incorretos!" });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioExistente.senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Usuário ou senha incorretos!" });
    }

    const SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({ id: usuarioExistente._id }, SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token: token,
      usuario: login,
    });
  } catch (error) {
    console.log(error);

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
