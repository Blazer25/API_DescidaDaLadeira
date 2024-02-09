const listaUsuario = require("../consultas/usuario/listaUsuario.js");

const usuarioController = {};

usuarioController.listaUsuario = async (req, res) => {
  try {
    const login = req.params.usuario;
    const { erro, status, mensagem, data } = await listaUsuario.executar({
      login,
    });

    if (erro) return res.status(status).json({ mensagem });

    return res.status(status).json({ mensagem, usuario: data });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde.",
    });
  }
};
module.exports = usuarioController;
