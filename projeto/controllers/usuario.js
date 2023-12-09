// controllers/usuarioController.js

const Usuario = require("../modelos/Usuario.js");
const validacoesUsuarios = require("../middlewares/validacoes/usuarios.js");
const bcrypt = require("bcrypt");
const consultasUsuarios = require("../servicos/mongo/consultas/usuarios.js");

const usuarioController = {};

usuarioController.getUsuario = async (req, res) => {
  try {
    const login = req.params.usuario;

    const usuario = await consultasUsuarios.verificaExistenciaUsuarioPeloLogin({
      login,
    });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const usuarioFormatado = {
      _id: usuario._id,
      login: usuario.login,
    };

    res
      .status(200)
      .json({ mensagem: "Usuário encontrado", usuario: usuarioFormatado });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

usuarioController.criarUsuario = async (req, res) => {
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

module.exports = usuarioController;
